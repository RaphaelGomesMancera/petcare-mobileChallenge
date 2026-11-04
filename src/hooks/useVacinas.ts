import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vacinaService, VacinaPayload } from '@/services/vacinaService';
import { notificarVacinaRegistrada } from '@/services/notificationService';

/** Todas as vacinas do usuário (alimenta os lembretes de reforço). */
export function useTodasVacinas() {
  return useQuery({
    queryKey: ['vacinas', 'todas'],
    queryFn: vacinaService.listarTodas,
  });
}

export function useVacinasPorPet(petId: number) {
  return useQuery({
    queryKey: ['vacinas', petId],
    queryFn: () => vacinaService.listarPorPet(petId),
    enabled: !!petId,
  });
}

export function useAplicarVacina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VacinaPayload) => vacinaService.aplicar(payload),
    onSuccess: (vacina) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      notificarVacinaRegistrada(vacina);
    },
  });
}

export function useExcluirVacina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; petId: number }) => vacinaService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacinas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
