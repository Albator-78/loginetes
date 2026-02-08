// Afficher les sites sauvegardés au chargement
document.addEventListener('DOMContentLoaded', () => {
  loadSites();
  loadSettings();
});

// Toggle du formulaire d'ajout
document.getElementById('toggleAdd').addEventListener('click', () => {
  const form = document.getElementById('addForm');
  form.classList.toggle('hidden');
});

// Gérer le toggle de reconnexion automatique
document.getElementById('autoReconnect').addEventListener('change', async (e) => {
  await chrome.storage.local.set({ autoReconnect: e.target.checked });
  showMessage(e.target.checked ? 
    'Reconnexion automatique activée' : 
    'Reconnexion automatique désactivée'
  );
});

// Charger les paramètres
async function loadSettings() {
  const result = await chrome.storage.local.get(['autoReconnect']);
  const autoReconnect = result.autoReconnect !== false; // Par défaut activé
  document.getElementById('autoReconnect').checked = autoReconnect;
}

// Sauvegarder un nouveau site
document.getElementById('saveBtn').addEventListener('click', saveSite);

// Se connecter sur le site actuel
document.getElementById('loginBtn').addEventListener('click', loginNow);

// Détecter automatiquement les sélecteurs
document.getElementById('autoDetectBtn').addEventListener('click', autoDetectSelectors);

// Boutons de sélection visuelle
document.getElementById('pickEmail').addEventListener('click', () => startVisualPicker('email'));
document.getElementById('pickPassword').addEventListener('click', () => startVisualPicker('password'));
document.getElementById('pickSubmit').addEventListener('click', () => startVisualPicker('submit'));

// Écouter les messages des content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'selectorPicked') {
    // Remplir le champ correspondant
    const fieldMap = {
      email: 'emailSelector',
      password: 'passwordSelector',
      submit: 'submitSelector'
    };
    
    const inputId = fieldMap[request.fieldType];
    if (inputId) {
      document.getElementById(inputId).value = request.selector;
      showMessage(`✅ Sélecteur ${request.fieldType} capturé !`, 'success');
    }
    sendResponse({ received: true });
  } else if (request.action === 'selectorPickCancelled') {
    showMessage('Sélection annulée', 'error');
    sendResponse({ received: true });
  }
});

function showMessage(text, type = 'success') {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message message-${type}`;
  messageDiv.classList.remove('hidden');
  
  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, 3000);
}

async function saveSite() {
  const siteName = document.getElementById('siteName').value;
  const siteUrl = document.getElementById('siteUrl').value;
  const emailSelector = document.getElementById('emailSelector').value;
  const email = document.getElementById('email').value;
  const passwordSelector = document.getElementById('passwordSelector').value;
  const password = document.getElementById('password').value;
  const submitSelector = document.getElementById('submitSelector').value;

  if (!siteName || !siteUrl || !emailSelector || !email || !passwordSelector || !password) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }

  const site = {
    id: Date.now(),
    name: siteName,
    url: siteUrl,
    emailSelector,
    email,
    passwordSelector,
    password,
    submitSelector
  };

  // Récupérer les sites existants
  const result = await chrome.storage.local.get(['sites']);
  const sites = result.sites || [];
  sites.push(site);

  // Sauvegarder
  await chrome.storage.local.set({ sites });

  showMessage('Site sauvegardé avec succès !');
  
  // Réinitialiser le formulaire
  document.getElementById('siteName').value = '';
  document.getElementById('siteUrl').value = '';
  document.getElementById('emailSelector').value = '';
  document.getElementById('email').value = '';
  document.getElementById('passwordSelector').value = '';
  document.getElementById('password').value = '';
  document.getElementById('submitSelector').value = '';

  // Recharger la liste
  loadSites();
}

async function loadSites() {
  const result = await chrome.storage.local.get(['sites']);
  const sites = result.sites || [];
  const sitesList = document.getElementById('sitesList');

  if (sites.length === 0) {
    sitesList.innerHTML = '<p style="color: #9ca3af; font-size: 13px;">Aucun site sauvegardé</p>';
    return;
  }

  sitesList.innerHTML = sites.map(site => `
    <div class="site-item">
      <div class="site-info">
        <div class="site-name">${site.name}</div>
        <div class="site-url">${site.url}</div>
      </div>
      <button class="btn btn-danger" onclick="deleteSite(${site.id})">🗑️</button>
    </div>
  `).join('');
}

async function deleteSite(id) {
  const result = await chrome.storage.local.get(['sites']);
  const sites = result.sites || [];
  const filteredSites = sites.filter(site => site.id !== id);
  
  await chrome.storage.local.set({ sites: filteredSites });
  showMessage('Site supprimé');
  loadSites();
}

// Fonction exposée globalement pour la suppression
window.deleteSite = deleteSite;

async function autoDetectSelectors() {
  try {
    showMessage('🔍 Détection en cours...', 'success');
    
    // Obtenir l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showMessage('Impossible de trouver l\'onglet actif', 'error');
      return;
    }

    // Injecter et exécuter le détecteur
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: runDetection
    });

    if (!results || !results[0]) {
      showMessage('Erreur lors de la détection', 'error');
      return;
    }

    const detected = results[0].result;

    if (!detected || !detected.allFound) {
      showMessage('❌ Impossible de détecter les champs de connexion sur cette page', 'error');
      return;
    }

    // Remplir automatiquement les champs du formulaire
    const addForm = document.getElementById('addForm');
    if (addForm.classList.contains('hidden')) {
      addForm.classList.remove('hidden');
    }

    // Extraire le nom du site depuis l'URL
    const url = new URL(tab.url);
    const siteName = url.hostname.replace('www.', '').split('.')[0];
    document.getElementById('siteName').value = siteName.charAt(0).toUpperCase() + siteName.slice(1);
    
    document.getElementById('siteUrl').value = tab.url;
    document.getElementById('emailSelector').value = detected.email.selector;
    document.getElementById('passwordSelector').value = detected.password.selector;
    
    if (detected.submit) {
      document.getElementById('submitSelector').value = detected.submit.selector;
    }

    showMessage(`✅ Sélecteurs détectés avec ${detected.confidence}% de confiance !`, 'success');
    
    // Scroller vers le formulaire
    addForm.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de la détection: ' + error.message, 'error');
  }
}

// Fonction à injecter dans la page pour la détection
function runDetection() {
  if (typeof SelectorDetector === 'undefined') {
    return { error: 'Détecteur non chargé' };
  }
  
  const detector = new SelectorDetector();
  return detector.detectLoginForm();
}

async function startVisualPicker(fieldType) {
  try {
    // Obtenir l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showMessage('Impossible de trouver l\'onglet actif', 'error');
      return;
    }

    // Fermer le popup (optionnel, pour voir la page)
    // window.close();

    // Envoyer le message pour démarrer le picker
    await chrome.tabs.sendMessage(tab.id, {
      action: 'startVisualPicker',
      fieldType: fieldType
    });

    showMessage(`🎯 Cliquez sur le champ ${fieldType} dans la page`, 'success');

  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur: ' + error.message, 'error');
  }
}

async function loginNow() {
  try {
    // Obtenir l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showMessage('Impossible de trouver l\'onglet actif', 'error');
      return;
    }

    // Récupérer les sites sauvegardés
    const result = await chrome.storage.local.get(['sites']);
    const sites = result.sites || [];

    // Trouver le site correspondant à l'URL actuelle
    const currentSite = sites.find(site => tab.url.includes(new URL(site.url).hostname));

    if (!currentSite) {
      showMessage('Aucun identifiant sauvegardé pour ce site', 'error');
      return;
    }

    // Injecter le script de connexion
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: autoFillAndLogin,
      args: [currentSite]
    });

    showMessage('Connexion en cours...', 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de la connexion: ' + error.message, 'error');
  }
}

// Fonction qui sera injectée dans la page
function autoFillAndLogin(site) {
  try {
    // Remplir le champ email/username
    const emailField = document.querySelector(site.emailSelector);
    if (emailField) {
      emailField.value = site.email;
      emailField.dispatchEvent(new Event('input', { bubbles: true }));
      emailField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Remplir le champ mot de passe
    const passwordField = document.querySelector(site.passwordSelector);
    if (passwordField) {
      passwordField.value = site.password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Cliquer sur le bouton de connexion si spécifié
    if (site.submitSelector) {
      setTimeout(() => {
        const submitBtn = document.querySelector(site.submitSelector);
        if (submitBtn) {
          submitBtn.click();
        }
      }, 500);
    }
  } catch (error) {
    console.error('Erreur auto-login:', error);
  }
}
