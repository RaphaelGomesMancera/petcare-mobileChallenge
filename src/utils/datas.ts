const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function doisDigitos(n: number): string {
  return String(n).padStart(2, '0');
}

/** Data local no formato AAAA-MM-DD (toISOString usaria UTC e viraria o dia perto da meia-noite). */
export function paraISO(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function hojeISO(): string {
  return paraISO(new Date());
}

/** Os próximos `quantidade` dias, começando hoje. */
export function proximosDias(quantidade: number): { iso: string; diaSemana: string; dia: string }[] {
  const dias = [];
  for (let i = 0; i < quantidade; i++) {
    const data = new Date();
    data.setDate(data.getDate() + i);
    dias.push({
      iso: paraISO(data),
      diaSemana: i === 0 ? 'hoje' : DIAS_SEMANA[data.getDay()],
      dia: `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`,
    });
  }
  return dias;
}

/**
 * AAAA-MM-DD → DD/MM/AAAA sem passar por `new Date()`:
 * strings só com data são lidas como UTC e apareceriam com um dia a menos no Brasil.
 */
export function formatarDataBR(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

/** AAAA-MM-DDTHH:mm:ss (horário local, sem fuso) → "DD/MM/AAAA às HH:mm". */
export function formatarDataHoraBR(isoLocal: string): string {
  return `${formatarDataBR(isoLocal)} às ${isoLocal.slice(11, 16)}`;
}

/** AAAA-MM-DDTHH:mm:ss → Date no fuso local. */
export function lerDataHoraLocal(isoLocal: string): Date {
  const [data, hora = '00:00'] = isoLocal.split('T');
  const [ano, mes, dia] = data.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  return new Date(ano, mes - 1, dia, h, m, 0, 0);
}

/** AAAA-MM-DD → Date local às `hora`h. */
export function lerDataLocal(iso: string, hora = 0): Date {
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia, hora, 0, 0, 0);
}
