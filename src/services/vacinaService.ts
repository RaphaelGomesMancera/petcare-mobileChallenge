import { api } from './api';
import { Vacina } from '@/types';

export interface VacinaPayload {
  petId: number;
  nome: string;
  dataAplicacao: string;
}

export const vacinaService = {
  listarPorPet: async (petId: number): Promise<Vacina[]> => {
    const { data } = await api.get<Vacina[]>(`/vacinas/pet/${petId}`);
    return data;
  },

  aplicar: async (payload: VacinaPayload): Promise<Vacina> => {
    const { data } = await api.post<Vacina>('/vacinas/aplicar', payload);
    return data;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/vacinas/${id}`);
  },
};
