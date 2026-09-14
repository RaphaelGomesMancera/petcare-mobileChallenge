import { api } from './api';
import { Pet } from '@/types';

export interface PetPayload {
  nome: string;
  raca: string;
  dataNascimento: string | null;
  peso: number | null;
  fotoUrl: string | null;
}

export const petService = {
  listar: async (): Promise<Pet[]> => {
    const { data } = await api.get<Pet[]>('/pets');
    return data;
  },

  buscarPorId: async (id: number): Promise<Pet> => {
    const { data } = await api.get<Pet>(`/pets/${id}`);
    return data;
  },

  criar: async (payload: PetPayload): Promise<Pet> => {
    const { data } = await api.post<Pet>('/pets', payload);
    return data;
  },

  atualizar: async (id: number, payload: PetPayload): Promise<Pet> => {
    const { data } = await api.put<Pet>(`/pets/${id}`, payload);
    return data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}`);
  },
};
