import { api } from './api';
import { Consulta } from '@/types';

export interface ConsultaPayload {
  petId: number;
  dataHora: string;
  motivo: string;
  observacoes: string | null;
}

export const consultaService = {
  listar: async (): Promise<Consulta[]> => {
    const { data } = await api.get<Consulta[]>('/consultas');
    return data;
  },

  agendar: async (payload: ConsultaPayload): Promise<Consulta> => {
    const { data } = await api.post<Consulta>('/consultas/agendar', payload);
    return data;
  },

  marcarComoRealizada: async (id: number): Promise<Consulta> => {
    const { data } = await api.patch<Consulta>(`/consultas/${id}/realizar`);
    return data;
  },

  cancelar: async (id: number): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },
};
