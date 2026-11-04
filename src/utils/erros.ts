import { isAxiosError } from 'axios';

/** Mensagem amigável a partir de um erro de chamada à API (usa o campo "mensagem" devolvido pelo backend). */
export function mensagemDeErro(erro: unknown, padrao: string): string {
  if (isAxiosError(erro)) {
    if (!erro.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';
    }
    const corpo = erro.response.data as { mensagem?: string; campos?: Record<string, string> } | undefined;
    const primeiroCampo = corpo?.campos ? Object.values(corpo.campos)[0] : undefined;
    // Erros de validação trazem a mensagem de cada campo; senão usa a mensagem geral da API
    const mensagem = primeiroCampo ?? corpo?.mensagem;
    if (mensagem) {
      return mensagem;
    }
  }
  return padrao;
}
