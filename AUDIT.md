# Auditoria: Cookies e Personalização

Resumo rápido
- Implementação didática de cookies com banner de consentimento, modal de preferências e toggle de tema.
- Cookies criados com `SameSite=Lax` e `Secure` quando em HTTPS.
- Consentimento registrado em `cookie_consent`; timestamp gravado em `cookie_consent_date`.

Principais pontos e recomendações

- Segurança
  - Recomendado: definir cookies sensíveis no servidor com `HttpOnly` para prevenir acesso via JS.
  - `SameSite=Lax` é um bom padrão; para maior proteção de CSRF, considere `SameSite=Strict` onde aplicável.
  - `Secure` só tem efeito em HTTPS — garantir que o site em produção use HTTPS.

- Privacidade / Consentimento
  - Implementado consentimento explícito (`Aceitar` / `Recusar` / `Gerenciar`).
  - Recomenda-se registrar também a versão da política de privacidade e o user-agent ao gravar consentimento para auditoria legal.
  - Fornecer rota/UX para revogar consentimento e visualizar preferências salvas.

- Acessibilidade
  - Banner e modal possuem atributos ARIA básicos; deve-se garantir gerenciamento completo de foco e leitura por leitores de tela.
  - Testar navegação por teclado e contraste de cores (WCAG AA).

- Operacional
  - Para preferências que não exigem consentimento estrito (por ex. preferências temporárias de UI), `sessionStorage` é apropriado.
  - Para grandes volumes de preferências ou dados, considerar backend com perfil do usuário.

Checklist de ações recomendadas
- [ ] Mover cookies sensíveis para server-set e marcar `HttpOnly`.
- [ ] Registrar versão da política e user-agent ao aceitar cookies.
- [ ] Implementar tela para exportar/remover preferências do usuário.
- [ ] Testes de acessibilidade (axe, Lighthouse) e correções.
- [ ] Garantir HTTPS em produção para `Secure` funcionar.
