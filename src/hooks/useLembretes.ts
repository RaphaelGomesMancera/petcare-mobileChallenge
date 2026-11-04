import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DadosNotificacao, prepararNotificacoes, sincronizarLembretes } from '@/services/notificationService';
import { useConsultas } from './useConsultas';
import { useTodasVacinas } from './useVacinas';

/**
 * Mantém os lembretes do aparelho alinhados com os dados da API.
 * Roda sempre que a lista de consultas ou de vacinas muda (inclusive após agendar/cancelar/aplicar).
 */
export function useLembretesAutomaticos() {
  const { data: consultas } = useConsultas();
  const { data: vacinas } = useTodasVacinas();

  useEffect(() => {
    prepararNotificacoes();
  }, []);

  useEffect(() => {
    if (!consultas || !vacinas) {
      return;
    }
    sincronizarLembretes(consultas, vacinas).catch(() => {
      // lembretes são um extra: falha ao agendar não pode atrapalhar o uso do app
    });
  }, [consultas, vacinas]);
}

// Evita reabrir a mesma tela se o layout for montado de novo
let ultimaRespostaTratada: string | null = null;

/** Ao tocar numa notificação (app aberto, em segundo plano ou fechado), abre a tela relacionada. */
export function useAbrirTelaPelaNotificacao() {
  const { usuario } = useAuth();
  const resposta = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!resposta || !usuario) {
      return;
    }
    const identificador = `${resposta.notification.request.identifier}:${resposta.notification.date}`;
    if (identificador === ultimaRespostaTratada) {
      return;
    }
    ultimaRespostaTratada = identificador;

    const dados = resposta.notification.request.content.data as Partial<DadosNotificacao>;
    if (dados.tipo === 'consulta') {
      router.push('/(tabs)/consultas');
    } else if (dados.tipo === 'vacina' && dados.petId) {
      router.push(`/(tabs)/vacinas/${dados.petId}`);
    }
  }, [resposta, usuario]);
}
