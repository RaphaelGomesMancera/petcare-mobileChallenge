# PetCareIA+ — Mobile Application Development | Sprint 3

Aplicativo mobile desenvolvido com **React Native + Expo** para a **Sprint 3 de Mobile Application Development (FIAP)**, integrado à API Java (`petcare-api`) via HTTP.

O **PetCareIA+** apoia tutores no acompanhamento contínuo da saúde do pet: cadastro de animais, agendamento de consultas, registro de vacinas e visualização do status de cuidados em um dashboard.

---

## Integrantes

| Integrante                      |        RM |
| ------------------------------- | --------: |
| Bruno Vinicius Barbosa          | RM 566366 |
| Guilherme de Andrade Martini    | RM 566087 |
| Nathan Gonçalves Pereira Mendes | RM 564666 |
| Raphael Gomes Mancera           | RM 562279 |

---

## Problema escolhido e solução proposta

### Problema

Tutores e clínicas precisam centralizar o cuidado do pet (cadastro, consultas e vacinas) em um canal digital contínuo. Sem um aplicativo funcional integrado a um backend real, o acompanhamento fica fragmentado (WhatsApp, planilhas, anotações) e não há persistência nem atualização automática das informações.

### Solução

O app **PetCareIA+ Mobile** entrega:

- Autenticação real com JWT da API Java (login, cadastro, sessão persistida e logout)
- Navegação por rotas com Expo Router (mínimo de 6 telas distintas)
- Integração HTTP real com TanStack Query (`useQuery` / `useMutation`), sem dados mockados
- CRUD completo de **Pets** e **Consultas** pela interface
- Fluxo de vacinas com próxima dose calculada pelo backend
- Arquitetura em camadas: UI (`app/`), hooks, services e context

---

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
| --- | --- |
| React Native + Expo SDK 51 | Base do aplicativo mobile |
| Expo Router | Navegação e declaração de rotas |
| TypeScript | Tipagem do código |
| TanStack Query | Cache, loading e sincronização com a API |
| Axios | Cliente HTTP |
| expo-secure-store | Persistência segura do token JWT (localStorage na web) |
| Spring Boot API (`petcare-api`) | Backend HTTP (auth, pets, consultas, vacinas, dashboard) |

---

## Instruções para execução do projeto

### Pré-requisitos

- Node.js 18+  
- npm  
- API Java `petcare-api` rodando em `http://localhost:8080`  
- Expo Go (celular) **ou** navegador (Expo Web) **ou** emulador Android/iOS  

### 1. Subir a API (obrigatório)

No repositório da API:

```bash
cd petcare-api
mvn spring-boot:run
```

Confirme que a API responde em `http://localhost:8080/api`.

### 2. Instalar e iniciar o app mobile

```bash
cd petcare-mobileChallenge-main
npm install
npx expo start
```

Opções no terminal do Expo:

| Tecla / comando | Ambiente |
| --- | --- |
| `w` ou `npx expo start --web` | Navegador (web) |
| `a` | Emulador Android |
| `i` | Simulador iOS |
| QR Code | Expo Go no celular |

### 3. URL da API por ambiente

A URL é resolvida automaticamente em `src/services/api.ts`:

| Ambiente | URL usada |
| --- | --- |
| Web / iOS | `http://localhost:8080/api` |
| Emulador Android | `http://10.0.2.2:8080/api` |
| Celular físico | altere para `http://SEU_IP_NA_WI-FI:8080/api` |

---

## Estrutura do projeto

```text
app/                      # Telas e rotas (Expo Router) — apenas UI
  (auth)/                 # login, cadastro
  (tabs)/                 # dashboard, pets, consultas, vacinas, perfil
src/
  services/               # Acesso HTTP (axios) — camada de dados
  hooks/                  # TanStack Query — lógica de dados isolada da UI
  context/                # Autenticação e sessão
  types/                  # Tipos TypeScript
  theme/                  # Cores do app
```

### Telas implementadas (9)

1. Login  
2. Cadastro  
3. Dashboard  
4. Lista de pets  
5. Novo pet  
6. Detalhe / edição de pet  
7. Consultas  
8. Vacinas do pet  
9. Perfil (logout)  

---

## Requisitos da Sprint 3 — como foram atendidos

| Requisito avaliativo | Pontos | Atendimento |
| --- | ---: | --- |
| Navegação entre telas | 5 | Expo Router com rotas explícitas e 9 telas distintas |
| Integração com API backend (HTTP) | 35 | TanStack Query + axios; dados vindos só da API; loading e atualização automática |
| Sistema de autenticação (Login) | 20 | JWT da API Java; login + cadastro; sessão com SecureStore; rotas protegidas; logout |
| Arquitetura e organização do código | 20 | Separação UI / hooks / services / context |
| Documentação | 5 | Este README com problema, solução, tecnologias e como executar |

### CRUD integrado à interface

**Pets**

| Operação | Onde no app |
| --- | --- |
| Create | Pets → Cadastrar pet |
| Read | Lista e detalhe do pet |
| Update | Detalhe → Salvar alterações |
| Delete | Detalhe → Excluir pet |

**Consultas**

| Operação | Onde no app |
| --- | --- |
| Create | Consultas → Agendar |
| Read | Lista “Minhas consultas” |
| Update | Editar (PUT) ou Marcar como realizada (PATCH) |
| Delete | Cancelar consulta |

Vacinas: registrar aplicação (Create), listar carteira (Read) e excluir registro (Delete), com próxima dose calculada pela API.

---

## Observações da entrega

- Entrega pelo **GitHub Classroom** / repositório do grupo  
- O app não usa dados mockados: tudo depende da API em execução  
