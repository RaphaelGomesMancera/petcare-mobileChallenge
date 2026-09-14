import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { petService, PetPayload } from '@/services/petService';

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: petService.listar,
  });
}

export function usePet(id: number) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => petService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarPet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PetPayload) => petService.criar(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });
}

export function useAtualizarPet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PetPayload }) =>
      petService.atualizar(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });
}

export function useExcluirPet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => petService.excluir(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });
}
