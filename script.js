// ===== UTILITÁRIOS DE COOKIE =====

// Função para definir um cookie com nome, valor, duração e segurança
function setCookie(name, value, days) {
  // Calcula a data de expiração em segundos (dias * 86400 segundos por dia)
  const expires = days ? '; Max-Age=' + (days*86400) : '';
  // Constrói a string do cookie com nome, valor codificado, expiração e caminho
  let cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
  // Se o protocolo for HTTPS, adiciona a flag Secure para maior segurança
  if (location.protocol === 'https:') cookie += '; Secure';
  // Atribui o cookie ao documento
  document.cookie = cookie;
}

// Função para recuperar o valor de um cookie pelo nome
function getCookie(name) {
  // Divide todos os cookies por '; ' e procura pelo nome específico
  return document.cookie.split('; ').reduce((r, v) => {
    // Separa nome e valor em cada cookie
    const parts = v.split('=');
    // Se encontrou o cookie com o nome procurado, decodifica e retorna o valor
    return parts[0] === name ? decodeURIComponent(parts.slice(1).join('=')) : r;
  }, '');
}

// Função para deletar um cookie definindo sua data de expiração para o passado
function deleteCookie(name) {
  // Define Max-Age=0 para expirar o cookie imediatamente
  document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
}

// ===== FUNÇÕES DE TEMA =====

// Atualiza a interface do botão de toggle (ícone e label) conforme o tema selecionado
function updateThemeToggleUI(theme) {
  // Obtém o elemento do botão de toggle
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  // Obtém o elemento do ícone dentro do botão
  const icon = btn.querySelector('.theme-icon');
  // Obtém o elemento do label dentro do botão
  const label = btn.querySelector('.theme-label');
  // Muda o ícone para lua (🌙) se tema escuro, ou sol (☀️) se tema claro
  if (icon) icon.textContent = (theme === 'dark') ? '🌙' : '☀️';
  // Muda o texto do label para "Escuro" ou "Claro"
  if (label) label.textContent = (theme === 'dark') ? 'Escuro' : 'Claro';
  // Atualiza o atributo aria-pressed para acessibilidade
  btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

// Aplica o tema selecionado ao documento
function applyTheme(theme) {
  // Se tema é escuro, adiciona atributo data-theme="dark" ao elemento raiz (ativa CSS dark)
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  // Caso contrário, remove o atributo para voltar ao tema claro
  else document.documentElement.removeAttribute('data-theme');
  // Atualiza a interface do botão de toggle
  updateThemeToggleUI(theme);
}

// ===== FUNÇÕES DE PREFERÊNCIAS =====

// Carrega as preferências salvas do navegador (cookies ou sessionStorage) e aplica
function loadPreferences() {
  // Obtém o consentimento de cookies (pode ser 'all', 'necessary', ou vazio)
  const consent = getCookie('cookie_consent');
  // Obtém o nome do usuário do cookie ou sessionStorage (padrão vazio)
  const name = getCookie('pref_name') || (sessionStorage.getItem && sessionStorage.getItem('pref_name')) || '';
  // Obtém o tema do cookie ou sessionStorage (padrão 'light')
  const theme = getCookie('pref_theme') || (sessionStorage.getItem && sessionStorage.getItem('pref_theme')) || 'light';
  // Obtém a cor de destaque do cookie ou sessionStorage (padrão azul #2563eb)
  const accent = getCookie('pref_accent') || (sessionStorage.getItem && sessionStorage.getItem('pref_accent')) || '#2563eb';
  // Obtém o tamanho de fonte do cookie ou sessionStorage (padrão 16px)
  const fontsize = getCookie('pref_fontsize') || (sessionStorage.getItem && sessionStorage.getItem('pref_fontsize')) || '16';

  // Atualiza o nome do usuário exibido (ou "Visitante" se vazio)
  document.getElementById('username').textContent = name || 'Visitante';
  // Aplica o tema selecionado
  applyTheme(theme);
  // Define a cor de destaque como variável CSS
  document.documentElement.style.setProperty('--accent', accent);
  // Define o tamanho de fonte em pixels
  document.documentElement.style.fontSize = fontsize + 'px';
  // Atualiza o texto mostrando se preferências são salvas ou temporárias
  document.getElementById('prefs-summary').textContent = (consent === 'all') ? 'salvas' : (name || theme || fontsize) ? 'temporárias (sessão)' : 'nenhuma';
}

// Mostra o banner de consentimento se o usuário ainda não consentiu com cookies
function showBannerIfNeeded() {
  // Obtém o elemento do banner
  const banner = document.getElementById('cookie-banner');
  // Se não existe cookie de consentimento, mostra o banner (remove classe hidden)
  if (!getCookie('cookie_consent')) banner.classList.remove('hidden');
  // Caso contrário, oculta o banner
  else banner.classList.add('hidden');
}

// Atualiza a seção de debug exibindo os cookies atuais do navegador
function updateDebug() {
  // Obtém o elemento pré-formatado que exibe os cookies
  const out = document.getElementById('cookie-output');
  // Se o elemento existe, exibe todos os cookies ou "(nenhum)" se vazio
  if (out) out.textContent = document.cookie || '(nenhum)';
}

// ===== INICIALIZAÇÃO - Executa quando o DOM está completamente carregado =====
document.addEventListener('DOMContentLoaded', () => {
  // Obtém referências para todos os elementos DOM que serão manipulados
  const themeToggle = document.getElementById('themeToggle');
  const openPrefs = document.getElementById('openPrefs');
  const closePrefs = document.getElementById('closePrefs');
  const prefsModal = document.getElementById('prefs-modal');
  const manageBtn = document.getElementById('manageCookies');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  const saveBtn = document.getElementById('savePrefs');
  const saveAndAccept = document.getElementById('saveAndAccept');
  const clearBtn = document.getElementById('clearCookies');
  const firstInput = document.getElementById('pref-name');

  // Carrega as preferências salvas e aplica no carregamento da página
  loadPreferences();
  // Mostra o banner de consentimento se necessário
  showBannerIfNeeded();
  // Atualiza a seção de debug com os cookies atuais
  updateDebug();

  // ===== EVENT LISTENER: Botão de toggle de tema =====
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Obtém o tema atual (dark ou light)
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      // Define o próximo tema (oposto do atual)
      const next = current === 'dark' ? 'light' : 'dark';
      // Aplica o novo tema
      applyTheme(next);
      // Se o usuário consentiu com cookies, salva a preferência de tema por 365 dias
      if (getCookie('cookie_consent') === 'all') setCookie('pref_theme', next, 365);
      // Caso contrário, salva apenas na sessão (desaparece ao fechar o navegador)
      else if (sessionStorage.setItem) sessionStorage.setItem('pref_theme', next);
    });
  }

  // ===== GERENCIAMENTO DE MODAL (focus accessibility) =====
  // Armazena qual elemento tinha foco antes de abrir a modal
  let lastFocused = null;
  // Função para abrir a modal: salva foco anterior, mostra modal e foca no primeiro input
  function openModal() { lastFocused = document.activeElement; prefsModal.classList.remove('hidden'); if (firstInput) firstInput.focus(); }
  // Função para fechar a modal: oculta modal e restaura foco anterior
  function closeModal() { prefsModal.classList.add('hidden'); if (lastFocused && lastFocused.focus) lastFocused.focus(); }

  // Event listener para abrir modal ao clicar em "Preferências"
  if (openPrefs) openPrefs.addEventListener('click', openModal);
  // Event listener para fechar modal ao clicar no botão ✕
  if (closePrefs) closePrefs.addEventListener('click', closeModal);
  // Event listener para "Gerenciar" (abre modal e oculta banner)
  if (manageBtn) manageBtn.addEventListener('click', () => { openModal(); document.getElementById('cookie-banner').classList.add('hidden'); });

  // ===== ACEITAÇÃO DE COOKIES =====
  if (acceptBtn) acceptBtn.addEventListener('click', () => {
    // Define consentimento como 'all' (aceita todos os cookies) válido por 365 dias
    setCookie('cookie_consent', 'all', 365);
    // Salva a data/hora de aceição do consentimento
    setCookie('cookie_consent_date', new Date().toISOString(), 365);
    // Migra as preferências da sessão (sessionStorage) para cookies persistentes
    if (sessionStorage.getItem) {
      // Itera sobre cada tipo de preferência
      ['pref_name','pref_theme','pref_accent','pref_fontsize'].forEach(k => {
        // Obtém o valor do sessionStorage
        const v = sessionStorage.getItem(k);
        // Se existe, salva no cookie por 365 dias
        if (v) setCookie(k, v, 365);
      });
    }
    // Recarrega as preferências para aplicar mudanças
    loadPreferences();
    // Oculta o banner se todas as preferências foram aceitas
    showBannerIfNeeded();
    // Atualiza o debug
    updateDebug();
  });

  // ===== RECUSA DE COOKIES =====
  if (declineBtn) declineBtn.addEventListener('click', () => {
    // Define consentimento como 'necessary' (apenas cookies necessários)
    setCookie('cookie_consent', 'necessary', 365);
    // Deleta todas as preferências salvas em cookies
    ['pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent_date'].forEach(deleteCookie);
    // Recarrega preferências (volta aos padrões)
    loadPreferences();
    // Mostra banner novamente se necessário
    showBannerIfNeeded();
    // Atualiza debug
    updateDebug();
  });

  // ===== SALVAR PREFERÊNCIAS =====
  if (saveBtn) saveBtn.addEventListener('click', () => {
    // Obtém os valores dos campos do formulário
    const name = document.getElementById('pref-name').value || '';
    const theme = document.getElementById('pref-theme').value;
    const accent = document.getElementById('pref-accent').value;
    const fontsize = document.getElementById('pref-fontsize').value;
    // Se o usuário consentiu com cookies, salva as preferências em cookies por 365 dias
    if (getCookie('cookie_consent') === 'all') {
      setCookie('pref_name', name, 365);
      setCookie('pref_theme', theme, 365);
      setCookie('pref_accent', accent, 365);
      setCookie('pref_fontsize', fontsize, 365);
    } 
    // Caso contrário, salva apenas no sessionStorage (dados temporários da sessão)
    else if (sessionStorage.setItem) {
      sessionStorage.setItem('pref_name', name);
      sessionStorage.setItem('pref_theme', theme);
      sessionStorage.setItem('pref_accent', accent);
      sessionStorage.setItem('pref_fontsize', fontsize);
    }
    // Carrega as preferências para aplicar visualmente
    loadPreferences();
    // Atualiza debug
    updateDebug();
    // Fecha a modal
    closeModal();
  });

  // ===== SALVAR E ACEITAR COOKIES =====
  // Simula clique no botão de aceitar e depois salvar preferências
  if (saveAndAccept) saveAndAccept.addEventListener('click', () => { if (acceptBtn) acceptBtn.click(); if (saveBtn) saveBtn.click(); });

  // ===== EXPORTAR PREFERÊNCIAS =====
  const exportBtn = document.getElementById('exportPrefs');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    // Cria um objeto vazio para armazenar as preferências
    const prefs = {};
    // Coleta todas as preferências de cookies ou sessionStorage
    ['pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent','cookie_consent_date'].forEach(k => {
      // Tenta obter do cookie, se não existir tenta do sessionStorage
      const v = getCookie(k) || (sessionStorage.getItem && sessionStorage.getItem(k));
      // Se encontrou um valor, adiciona ao objeto
      if (v) prefs[k] = v;
    });
    // Converte o objeto para JSON formatado e cria um Blob
    const blob = new Blob([JSON.stringify(prefs, null, 2)], {type: 'application/json'});
    // Cria uma URL temporária para o Blob
    const url = URL.createObjectURL(blob);
    // Cria um elemento <a> invisível para download
    const a = document.createElement('a');
    a.href = url;
    // Gera um nome de arquivo com data/hora atual
    const now = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    a.download = `preferences-${now}.json`;
    // Adiciona o link ao body, clica nele e depois remove
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Libera a URL temporária para economizar memória
    URL.revokeObjectURL(url);
  });

  // ===== REMOVER PREFERÊNCIAS =====
  const removeBtn = document.getElementById('removePrefs');
  if (removeBtn) removeBtn.addEventListener('click', () => {
    // Pede confirmação do usuário antes de remover
    if (!confirm('Remover todas as preferências salvas (cookies e sessão)?')) return;
    // Deleta todos os cookies de preferência
    ['pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent_date'].forEach(deleteCookie);
    // Limpa todo o sessionStorage se disponível
    if (sessionStorage.clear) sessionStorage.clear();
    // Nota: não remove cookie_consent para não reexibir o banner automaticamente
    // Recarrega preferências (volta aos padrões)
    loadPreferences();
    // Mostra banner se necessário
    showBannerIfNeeded();
    // Atualiza debug
    updateDebug();
  });

  // ===== LIMPAR TUDO =====
  if (clearBtn) clearBtn.addEventListener('click', () => {
    // Deleta TODOS os cookies incluindo consentimento e data
    ['cookie_consent','pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent_date'].forEach(deleteCookie);
    // Limpa o sessionStorage
    if (sessionStorage.clear) sessionStorage.clear();
    // Recarrega preferências
    loadPreferences();
    // Mostra o banner novamente
    showBannerIfNeeded();
    // Atualiza debug
    updateDebug();
  });
});
