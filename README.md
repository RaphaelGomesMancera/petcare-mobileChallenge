# PetCareIA+ Mobile (React Native + Expo) - Sprint 3

App mobile do PetCareIA+, consumindo a API Java (`petcare-api`) já pronta.

## Requisitos da Sprint 3 - onde cada um foi atendido

| Requisito | Pontos | Onde está |
|---|---|---|
| Navegação entre telas (mín. 6) | 5 | 9 telas com Expo Router: login, cadastro, dashboard, lista de pets, novo pet, detalhe/edição de pet, consultas, vacinas, perfil |
| Integração com API (TanStack Query, CRUD real) | 35 | `src/hooks/*` (TanStack Query) + `src/services/*` (axios). Sem dados mockados — tudo vem da API |
| Autenticação (Login) | 20 | `src/context/AuthContext.tsx` — JWT da própria API Java, sessão persistida com `expo-secure-store`, rotas protegidas em `app/(tabs)/_layout.tsx` |
| Arquitetura e organização do código | 20 | Camadas separadas: `services/` (API), `hooks/` (TanStack Query), `context/` (estado global), `app/` (só UI) |
| Documentação e vídeo | 20 | Este README + gravar o vídeo seguindo o roteiro abaixo |

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. **Importante**: abra `src/services/api.ts` e ajuste `API_BASE_URL` para o endereço
   da sua API Java rodando (`petcare-api`):
   - Emulador Android → `http://10.0.2.2:8080/api`
   - Simulador iOS → `http://localhost:8080/api`
   - Celular físico → `http://SEU_IP_NA_REDE:8080/api` (ex: `http://192.168.0.10:8080/api`)
3. Suba a API Java primeiro (`mvn spring-boot:run` no projeto `petcare-api`).
4. Rode o app:
   ```bash
   npx expo start
   ```

## Estrutura

```
app/                    -> Rotas (Expo Router) - só UI, sem lógica de negócio
  (auth)/               -> login, cadastro (não autenticado)
  (tabs)/               -> dashboard, pets, consultas, vacinas, perfil (autenticado)
src/
  services/             -> Chamadas HTTP puras (axios) - uma função por endpoint
  hooks/                -> TanStack Query (useQuery/useMutation) isolado da UI
  context/AuthContext   -> Sessão, login, logout, persistência do token
  types/                -> Tipos TypeScript espelhando os DTOs da API Java
  theme/                -> Cores da marca PetCareIA+
```

## Fluxos reais implementados (não são apenas telas bonitas)

- **Login/Cadastro**: token JWT salvo com `expo-secure-store`; ao reabrir o app, a
  sessão é restaurada automaticamente (não pede login de novo).
- **CRUD de Pets**: criar, listar, editar, excluir — tudo via API.
- **Agendamento de consulta**: se a API recusar por conflito de horário (regra que
  fizemos no back-end), o app mostra o erro retornado pela API para o usuário.
- **Aplicação de vacina**: a data da próxima dose que aparece na tela vem calculada
  pelo back-end (não é calculada no app).

## Limitações conhecidas (para melhorar se sobrar tempo)

- Os campos de data (`dataHora`, `dataAplicacao`) são digitados como texto no formato
  ISO (ex: `2026-09-20T14:30:00`). Para produção/nota mais alta, vale trocar por um
  seletor de data nativo (`@react-native-community/datetimepicker`).
- Não há upload real de foto do pet (`fotoUrl` fica nulo).

## Roteiro sugerido para o vídeo de apresentação (máx. 5 min)

1. Mostrar o cadastro de um tutor novo e o login.
2. Cadastrar um pet.
3. Agendar uma consulta para esse pet (mostrar o dashboard atualizando).
4. Tentar agendar uma segunda consulta no mesmo horário e mostrar o erro de conflito.
5. Aplicar uma vacina e mostrar a data da próxima dose calculada automaticamente.
6. Fechar e reabrir o app mostrando que a sessão continua logada.
7. Fazer logout.
