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

  /** Horários (HH:mm) livres no dia AAAA-MM-DD. */
  horariosDisponiveis: async (data: string): Promise<string[]> => {
    const resposta = await api.get<string[]>('/consultas/horarios-disponiveis', { params: { data } });
    return resposta.data;
  },

  agendar: async (payload: ConsultaPayload): Promise<Consulta> => {
    const { data } = await api.post<Consulta>('/consultas/agendar', payload);
    return data;
  },

  atualizar: async (id: number, payload: ConsultaPayload): Promise<Consulta> => {
    const { data } = await api.put<Consulta>(`/consultas/${id}`, payload);
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
