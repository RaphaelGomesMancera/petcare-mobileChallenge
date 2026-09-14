export type Perfil = 'TUTOR' | 'CLINICA';

export interface Usuario {
  nome: string;
  email: string;
  perfil: Perfil;
}

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
  perfil: Perfil;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  dataNascimento: string | null;
  peso: number | null;
  fotoUrl: string | null;
  tutorId: number;
  tutorNome: string;
}

export type StatusConsulta = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

export interface Consulta {
  id: number;
  petId: number;
  petNome: string;
  dataHora: string;
  motivo: string;
  observacoes: string | null;
  status: StatusConsulta;
}

export interface Vacina {
  id: number;
  petId: number;
  petNome: string;
  nome: string;
  dataAplicacao: string;
  dataProximaDose: string | null;
  pendente: boolean;
}

export interface Dashboard {
  quantidadePets: number;
  proximasConsultas: number;
  vacinasPendentes: number;
  ultimaConsulta: string | null;
  agendaProximosSete: Consulta[];
}
