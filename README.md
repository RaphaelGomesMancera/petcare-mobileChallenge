# 🐾 PetCareIA+ Mobile — Mobile Application Development | Sprint 4

App **React Native + Expo** do PetCareIA+: tutores acompanham pets, agendam consultas e controlam vacinas;
a clínica conduz a agenda. Consome a API Java do projeto ([petcare-api](https://github.com/RaphaelGomesMancera/petcare-api)).

> **App publicado (APK/link):** https://expo.dev/artifacts/eas/PsSY0L0M2iDZf5GvVpnA0Z2GOQ2og5jXiWARsI_vLgI.apk
> **API em produção:** https://petcare-api-aod8.onrender.com
> **Vídeo de demonstração:** https://youtu.be/d-sfwy6yKCw

## 👥 Integrantes

| Integrante                      |        RM |
| ------------------------------- | --------: |
| Bruno Vinicius Barbosa          | RM 566366 |
| Guilherme de Andrade Martini    | RM 566087 |
| Nathan Gonçalves Pereira Mendes | RM 564666 |
| Raphael Gomes Mancera           | RM 562279 |

## ✅ O que o app faz

- **Autenticação:** login, cadastro (sempre como tutor), sessão persistida no `expo-secure-store`,
  **renovação automática do token** (refresh) e logout automático quando a sessão não pode ser renovada.
- **Pets:** listar, cadastrar, editar e excluir (a exclusão remove também consultas e vacinas do pet).
- **Consultas:** agendamento escolhendo **dia + horário livre** (a API informa só os horários disponíveis),
  edição, cancelamento e — somente para a clínica — marcar como realizada.
- **Vacinas:** registro com a **próxima dose calculada pela API** e carteira de vacinação por pet.
- **Dashboard:** pets, próximas consultas, vacinas pendentes e agenda.
- **Tema claro/escuro:** segue o sistema e pode ser fixado em *Perfil → Aparência*.

## 🔔 Notificações (locais)

Sem servidor de push: as notificações são **locais** e nascem de eventos reais do sistema.

| Evento | Notificação |
|--------|-------------|
| Usuário agenda uma consulta | Imediata: “✅ Consulta confirmada — Pet, data e hora” |
| Consulta agendada (vinda da API, inclusive criada pelo site) | Lembrete **1 hora antes** |
| Usuário registra uma vacina | Imediata: “💉 Vacina registrada — próxima dose em …” |
| Vacina com próxima dose futura | Lembrete **7 dias antes**, às 09:00 |
| Consulta cancelada/realizada ou vacina removida | O lembrete agendado é cancelado automaticamente |

Ao tocar na notificação, o app abre a tela relacionada (consultas ou carteira de vacinas do pet),
com o app aberto, em segundo plano ou fechado. A sincronização está em `src/services/notificationService.ts`
e é acionada por `src/hooks/useLembretes.ts`.

## 🏗️ Arquitetura

```
app/                  Telas e rotas (Expo Router) — só interface
src/components/       Botao, CampoTexto, Cartao, Chip, TextoErro (UI reutilizável, sem estilo repetido nas telas)
src/context/          AuthContext (sessão) e ThemeContext (tema)
src/hooks/            TanStack Query (useConsultas, usePets, useVacinas, useLembretes...) isolados da UI
src/services/         Acesso à API (axios + interceptors), sessão, storage, notificações
src/theme/            Paletas clara e escura
src/utils/            Datas (sem armadilhas de fuso horário) e mensagens de erro da API
src/types/            Tipos TypeScript
```

Nenhuma tela chama HTTP diretamente: tela → hook (TanStack Query) → service → API.

## ⚙️ Configuração e execução

Pré-requisitos: Node.js 18+, npm, API rodando (local ou publicada).

```bash
git clone https://github.com/RaphaelGomesMancera/petcare-mobileChallenge.git
cd petcare-mobileChallenge
npm install
cp .env.example .env     # defina EXPO_PUBLIC_API_URL
npx expo start
```

- Emulador Android: sem `.env` já funciona com `http://10.0.2.2:8080/api`.
- Celular físico: use o IP do seu PC em `EXPO_PUBLIC_API_URL` (mesma rede Wi-Fi).
- Conferir tipos: `npm run typecheck`.

## 📦 Publicação

Pré-requisito: conta Expo (`npm i -g eas-cli`, `eas login`, `eas init`).

1. O `eas.json` já aponta para `https://petcare-api-aod8.onrender.com/api`.
2. Gere o APK instalável: `eas build --platform android --profile preview`
   — ao terminar, o EAS mostra o link de download/QR code. Esse é o link do app publicado.
3. Atualizações sem novo build: `eas update --branch preview --message "descrição"`.

## 🔐 Segurança

- Tokens guardados no `expo-secure-store` (Keychain/Keystore), nunca em `AsyncStorage`.
- Access token curto (1 h) + refresh token (7 dias); chamadas que recebem 401 tentam renovar **uma vez** e repetem a requisição.
- Ao sair (ou se a sessão expirar), credenciais, cache de dados e lembretes agendados são apagados.
- Nenhum segredo no repositório; o endereço da API vem de variável de ambiente.

## 🎬 Roteiro sugerido do vídeo

1. Login → mostrar tema claro/escuro em *Perfil*.
2. Cadastrar pet → agendar consulta escolhendo dia/horário → **mostrar a notificação de confirmação** na tela.
3. Registrar vacina → mostrar notificação e a próxima dose calculada.
4. Tocar na notificação para abrir a tela relacionada.
5. Entrar com a conta da clínica e marcar a consulta como realizada.
6. Mostrar o app instalado (APK) apontando para a API publicada — **a mesma versão que está no repositório**.
