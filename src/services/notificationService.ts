import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Consulta, Vacina } from '@/types';
import { formatarDataBR, formatarDataHoraBR, lerDataHoraLocal, lerDataLocal } from '@/utils/datas';
import { storage } from './storage';

/**
 * Notificações LOCAIS do PetCareIA+ (funcionam sem servidor de push):
 *  - confirmação imediata quando o usuário agenda uma consulta ou registra uma vacina;
 *  - lembrete 1 hora antes de cada consulta agendada;
 *  - lembrete 7 dias antes da próxima dose de cada vacina.
 * Os lembretes são sempre derivados dos dados da API (ver sincronizarLembretes).
 */

const CANAL_ID = 'lembretes';
const MAPA_KEY = 'petcare_lembretes';
const ANTECEDENCIA_CONSULTA_MS = 60 * 60 * 1000;
const ANTECEDENCIA_VACINA_DIAS = 7;
const HORA_LEMBRETE_VACINA = 9;

export interface DadosNotificacao {
  tipo: 'consulta' | 'vacina';
  petId: number;
}

// Mostra o aviso mesmo com o app aberto (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const suportado = Platform.OS !== 'web';

/** Cria o canal (Android) e pede permissão. Devolve se as notificações podem ser exibidas. */
export async function prepararNotificacoes(): Promise<boolean> {
  if (!suportado) {
    return false;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_ID, {
      name: 'Lembretes de consultas e vacinas',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) {
    return true;
  }
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

/** Aviso imediato, disparado por um evento real do usuário (agendar consulta, registrar vacina). */
export async function notificarAgora(titulo: string, corpo: string, dados: DadosNotificacao): Promise<void> {
  if (!suportado || !(await Notifications.getPermissionsAsync()).granted) {
    return;
  }
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo, data: { ...dados }, sound: true },
    trigger: { channelId: CANAL_ID },
  });
}

export function notificarConsultaAgendada(consulta: Consulta): Promise<void> {
  return notificarAgora(
    '✅ Consulta confirmada',
    `${consulta.petNome} — ${formatarDataHoraBR(consulta.dataHora)}`,
    { tipo: 'consulta', petId: consulta.petId },
  );
}

export function notificarVacinaRegistrada(vacina: Vacina): Promise<void> {
  const proxima = vacina.dataProximaDose
    ? `Próxima dose em ${formatarDataBR(vacina.dataProximaDose)}`
    : 'Registro salvo na carteira de vacinação';
  return notificarAgora(`💉 ${vacina.nome} registrada`, `${vacina.petNome}: ${proxima}`, {
    tipo: 'vacina',
    petId: vacina.petId,
  });
}

// ---------- lembretes agendados ----------

interface LembreteSalvo {
  notificacaoId: string;
  quandoISO: string;
}

type MapaLembretes = Record<string, LembreteSalvo>;

interface LembreteDesejado {
  quando: Date;
  titulo: string;
  corpo: string;
  dados: DadosNotificacao;
}

async function lerMapa(): Promise<MapaLembretes> {
  const bruto = await storage.getItem(MAPA_KEY);
  return bruto ? (JSON.parse(bruto) as MapaLembretes) : {};
}

async function salvarMapa(mapa: MapaLembretes): Promise<void> {
  await storage.setItem(MAPA_KEY, JSON.stringify(mapa));
}

function lembretesDeConsultas(consultas: Consulta[], agora: Date): Record<string, LembreteDesejado> {
  const desejados: Record<string, LembreteDesejado> = {};
  for (const consulta of consultas) {
    if (consulta.status !== 'AGENDADA') {
      continue;
    }
    const quando = new Date(lerDataHoraLocal(consulta.dataHora).getTime() - ANTECEDENCIA_CONSULTA_MS);
    if (quando > agora) {
      desejados[`consulta:${consulta.id}`] = {
        quando,
        titulo: '📅 Consulta em 1 hora',
        corpo: `${consulta.petNome} — ${consulta.motivo}`,
        dados: { tipo: 'consulta', petId: consulta.petId },
      };
    }
  }
  return desejados;
}

function lembretesDeVacinas(vacinas: Vacina[], agora: Date): Record<string, LembreteDesejado> {
  const desejados: Record<string, LembreteDesejado> = {};
  for (const vacina of vacinas) {
    if (!vacina.dataProximaDose) {
      continue;
    }
    const quando = lerDataLocal(vacina.dataProximaDose, HORA_LEMBRETE_VACINA);
    quando.setDate(quando.getDate() - ANTECEDENCIA_VACINA_DIAS);
    if (quando > agora) {
      desejados[`vacina:${vacina.id}`] = {
        quando,
        titulo: '💉 Reforço de vacina chegando',
        corpo: `${vacina.petNome}: ${vacina.nome} em ${formatarDataBR(vacina.dataProximaDose)}`,
        dados: { tipo: 'vacina', petId: vacina.petId },
      };
    }
  }
  return desejados;
}

/**
 * Alinha os lembretes agendados no aparelho com o que existe na API:
 * agenda os que faltam, reagenda os que mudaram de horário e cancela os de consultas/vacinas
 * que foram canceladas, realizadas ou excluídas (inclusive pelo site).
 */
export async function sincronizarLembretes(consultas: Consulta[], vacinas: Vacina[]): Promise<void> {
  if (!suportado || !(await Notifications.getPermissionsAsync()).granted) {
    return;
  }

  const agora = new Date();
  const desejados = { ...lembretesDeConsultas(consultas, agora), ...lembretesDeVacinas(vacinas, agora) };
  const mapa = await lerMapa();

  for (const chave of Object.keys(mapa)) {
    const aindaDesejado = desejados[chave];
    if (!aindaDesejado || aindaDesejado.quando.toISOString() !== mapa[chave].quandoISO) {
      await Notifications.cancelScheduledNotificationAsync(mapa[chave].notificacaoId);
      delete mapa[chave];
    }
  }

  for (const [chave, lembrete] of Object.entries(desejados)) {
    if (mapa[chave]) {
      continue;
    }
    const notificacaoId = await Notifications.scheduleNotificationAsync({
      content: { title: lembrete.titulo, body: lembrete.corpo, data: { ...lembrete.dados }, sound: true },
      trigger: { date: lembrete.quando, channelId: CANAL_ID },
    });
    mapa[chave] = { notificacaoId, quandoISO: lembrete.quando.toISOString() };
  }

  await salvarMapa(mapa);
}

export async function cancelarTodosLembretes(): Promise<void> {
  if (!suportado) {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  await storage.removeItem(MAPA_KEY);
}
