import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consultaService, ConsultaPayload } from '@/services/consultaService';

export function useConsultas() {
  return useQuery({
    queryKey: ['consultas'],
    queryFn: consultaService.listar,
  });
}

export function useAgendarConsulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConsultaPayload) => consultaService.agendar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useAtualizarConsulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ConsultaPayload }) =>
      consultaService.atualizar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useMarcarConsultaRealizada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => consultaService.marcarComoRealizada(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCancelarConsulta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => consultaService.cancelar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
