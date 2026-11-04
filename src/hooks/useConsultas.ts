import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consultaService, ConsultaPayload } from '@/services/consultaService';
import { notificarConsultaAgendada } from '@/services/notificationService';

export function useConsultas() {
  return useQuery({
    queryKey: ['consultas'],
    queryFn: consultaService.listar,
  });
}

/** Horários livres de um dia (AAAA-MM-DD). Só consulta quando há um dia escolhido. */
export function useHorariosDisponiveis(data: string | null) {
  return useQuery({
    queryKey: ['horarios', data],
    queryFn: () => consultaService.horariosDisponiveis(data as string),
    enabled: !!data,
    staleTime: 0, // a disponibilidade muda a todo momento: sempre confirma na API
  });
}

function useInvalidarAgenda() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['consultas'] });
    queryClient.invalidateQueries({ queryKey: ['horarios'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
}

export function useAgendarConsulta() {
  const invalidarAgenda = useInvalidarAgenda();
  return useMutation({
    mutationFn: (payload: ConsultaPayload) => consultaService.agendar(payload),
    onSuccess: (consulta) => {
      invalidarAgenda();
      // O lembrete de 1h antes é agendado pela sincronização; aqui vai a confirmação imediata.
      notificarConsultaAgendada(consulta);
    },
  });
}

export function useAtualizarConsulta() {
  const invalidarAgenda = useInvalidarAgenda();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ConsultaPayload }) =>
      consultaService.atualizar(id, payload),
    onSuccess: invalidarAgenda,
  });
}

export function useMarcarConsultaRealizada() {
  const invalidarAgenda = useInvalidarAgenda();
  return useMutation({
    mutationFn: (id: number) => consultaService.marcarComoRealizada(id),
    onSuccess: invalidarAgenda,
  });
}

export function useCancelarConsulta() {
  const invalidarAgenda = useInvalidarAgenda();
  return useMutation({
    mutationFn: (id: number) => consultaService.cancelar(id),
    onSuccess: invalidarAgenda,
  });
}
