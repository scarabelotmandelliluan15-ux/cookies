# cookies
# Exemplo de Cookies e Personalização

Este pequeno projeto demonstra como usar cookies para:

- Obter consentimento do usuário (banner)
- Salvar preferências de personalização (nome, tema, cor e tamanho da fonte)

Arquivos principais:

- [index.html](index.html) — interface e modal de preferências
- [style.css](style.css) — estilos e tema
- [script.js](script.js) — lógica de cookies e aplicação de preferências

Como testar localmente:

1. Abra um terminal no diretório do projeto.
2. Rode um servidor estático simples, por exemplo:

```bash
python3 -m http.server 8000
```

3. Abra http://localhost:8000 no navegador.

Observações:

- As preferências só são aplicadas e salvas quando o usuário aceita cookies (opção "Aceitar" ou "Salvar e aceitar").
- O botão "Recusar" mantém apenas cookies necessários e remove preferências de personalização.

Detalhes do exemplo:

- Banner de consentimento com opções: Aceitar / Recusar / Gerenciar.
- Modal de preferências que permite definir `Nome`, `Tema` (claro/escuro), `Cor de destaque` e `Tamanho da fonte`.
- Se o usuário aceitar cookies, as preferências são salvas em cookies (`pref_*`) com `SameSite=Lax` e `Secure` quando aplicável.
- Se o usuário não aceitar, as preferências são mantidas apenas em `sessionStorage` (úteis durante a sessão).

Testes rápidos:

- Sem aceitar cookies: abrir preferências, mudar tema, recarregar — a escolha deve permanecer apenas na sessão.
- Aceitar cookies: mudar tema e recarregar — a escolha deve persistir.

Exportar e remover preferências

- Abra "Preferências" e clique em "Exportar preferências" para baixar um arquivo JSON com as preferências atuais (cookies + sessão).
- Clique em "Remover preferências" para apagar cookies e limpar `sessionStorage` (confirmação requerida). Isso remove preferências salvas, mantendo o banner de consentimento até o usuário interagir.

