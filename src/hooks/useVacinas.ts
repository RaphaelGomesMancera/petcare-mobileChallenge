import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vacinaService, VacinaPayload } from '@/services/vacinaService';

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useExcluirVacina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; petId: number }) => vacinaService.excluir(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
