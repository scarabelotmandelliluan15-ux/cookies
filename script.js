// Utilitários de cookie
function setCookie(name, value, days) {
  const expires = days ? '; Max-Age=' + (days*86400) : '';
  let cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
  if (location.protocol === 'https:') cookie += '; Secure';
  document.cookie = cookie;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts.slice(1).join('=')) : r;
  }, '');
}

function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
}

// Atualiza UI do toggle (ícone/label) conforme tema
function updateThemeToggleUI(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const icon = btn.querySelector('.theme-icon');
  const label = btn.querySelector('.theme-label');
  if (icon) icon.textContent = (theme === 'dark') ? '🌙' : '☀️';
  if (label) label.textContent = (theme === 'dark') ? 'Escuro' : 'Claro';
  btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  updateThemeToggleUI(theme);
}

function loadPreferences() {
  const consent = getCookie('cookie_consent');
  const name = getCookie('pref_name') || (sessionStorage.getItem && sessionStorage.getItem('pref_name')) || '';
  const theme = getCookie('pref_theme') || (sessionStorage.getItem && sessionStorage.getItem('pref_theme')) || 'light';
  const accent = getCookie('pref_accent') || (sessionStorage.getItem && sessionStorage.getItem('pref_accent')) || '#2563eb';
  const fontsize = getCookie('pref_fontsize') || (sessionStorage.getItem && sessionStorage.getItem('pref_fontsize')) || '16';

  document.getElementById('username').textContent = name || 'Visitante';
  applyTheme(theme);
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.fontSize = fontsize + 'px';
  document.getElementById('prefs-summary').textContent = (consent === 'all') ? 'salvas' : (name || theme || fontsize) ? 'temporárias (sessão)' : 'nenhuma';
}

function showBannerIfNeeded() {
  const banner = document.getElementById('cookie-banner');
  if (!getCookie('cookie_consent')) banner.classList.remove('hidden');
  else banner.classList.add('hidden');
}

function updateDebug() {
  const out = document.getElementById('cookie-output');
  if (out) out.textContent = document.cookie || '(nenhum)';
}

document.addEventListener('DOMContentLoaded', () => {
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

  loadPreferences();
  showBannerIfNeeded();
  updateDebug();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      if (getCookie('cookie_consent') === 'all') setCookie('pref_theme', next, 365);
      else if (sessionStorage.setItem) sessionStorage.setItem('pref_theme', next);
    });
  }

  // Modal focus handling
  let lastFocused = null;
  function openModal() { lastFocused = document.activeElement; prefsModal.classList.remove('hidden'); if (firstInput) firstInput.focus(); }
  function closeModal() { prefsModal.classList.add('hidden'); if (lastFocused && lastFocused.focus) lastFocused.focus(); }

  if (openPrefs) openPrefs.addEventListener('click', openModal);
  if (closePrefs) closePrefs.addEventListener('click', closeModal);
  if (manageBtn) manageBtn.addEventListener('click', () => { openModal(); document.getElementById('cookie-banner').classList.add('hidden'); });

  if (acceptBtn) acceptBtn.addEventListener('click', () => {
    setCookie('cookie_consent', 'all', 365);
    setCookie('cookie_consent_date', new Date().toISOString(), 365);
    // migrar prefs da sessão para cookie
    if (sessionStorage.getItem) {
      ['pref_name','pref_theme','pref_accent','pref_fontsize'].forEach(k => {
        const v = sessionStorage.getItem(k);
        if (v) setCookie(k, v, 365);
      });
    }
    loadPreferences();
    showBannerIfNeeded();
    updateDebug();
  });

  if (declineBtn) declineBtn.addEventListener('click', () => {
    setCookie('cookie_consent', 'necessary', 365);
    ['pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent_date'].forEach(deleteCookie);
    loadPreferences();
    showBannerIfNeeded();
    updateDebug();
  });

  if (saveBtn) saveBtn.addEventListener('click', () => {
    const name = document.getElementById('pref-name').value || '';
    const theme = document.getElementById('pref-theme').value;
    const accent = document.getElementById('pref-accent').value;
    const fontsize = document.getElementById('pref-fontsize').value;
    if (getCookie('cookie_consent') === 'all') {
      setCookie('pref_name', name, 365);
      setCookie('pref_theme', theme, 365);
      setCookie('pref_accent', accent, 365);
      setCookie('pref_fontsize', fontsize, 365);
    } else if (sessionStorage.setItem) {
      sessionStorage.setItem('pref_name', name);
      sessionStorage.setItem('pref_theme', theme);
      sessionStorage.setItem('pref_accent', accent);
      sessionStorage.setItem('pref_fontsize', fontsize);
    }
    loadPreferences();
    updateDebug();
    closeModal();
  });

  if (saveAndAccept) saveAndAccept.addEventListener('click', () => { if (acceptBtn) acceptBtn.click(); if (saveBtn) saveBtn.click(); });

  // Exportar preferências
  const exportBtn = document.getElementById('exportPrefs');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    const prefs = {};
    ['pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent','cookie_consent_date'].forEach(k => {
      const v = getCookie(k) || (sessionStorage.getItem && sessionStorage.getItem(k));
      if (v) prefs[k] = v;
    });
    const blob = new Blob([JSON.stringify(prefs, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    a.download = `preferences-${now}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Remover preferências (apagar cookies e sessionStorage)
  const removeBtn = document.getElementById('removePrefs');
  if (removeBtn) removeBtn.addEventListener('click', () => {
    if (!confirm('Remover todas as preferências salvas (cookies e sessão)?')) return;
    ['pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent_date'].forEach(deleteCookie);
    if (sessionStorage.clear) sessionStorage.clear();
    // não remove cookie_consent para não reexibir banner automaticamente; se quiser, remover também
    loadPreferences();
    showBannerIfNeeded();
    updateDebug();
  });

  if (clearBtn) clearBtn.addEventListener('click', () => {
    ['cookie_consent','pref_name','pref_theme','pref_accent','pref_fontsize','cookie_consent_date'].forEach(deleteCookie);
    if (sessionStorage.clear) sessionStorage.clear();
    loadPreferences();
    showBannerIfNeeded();
    updateDebug();
  });
});
