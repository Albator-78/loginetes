// Content script pour détecter et auto-remplir les formulaires

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autoLogin') {
    performAutoLogin(request.site);
    sendResponse({ success: true });
  }
});

// Observer pour détecter les déconnexions
let currentSite = null;
let observer = null;

// Vérifier au chargement de la page s'il faut auto-login
window.addEventListener('load', async () => {
  try {
    const result = await chrome.storage.local.get(['sites', 'autoLoginEnabled']);
    const sites = result.sites || [];
    const autoLoginEnabled = result.autoLoginEnabled !== false; // Par défaut activé

    if (!autoLoginEnabled) return;

    // Trouver le site correspondant à l'URL actuelle
    const currentUrl = window.location.href;
    currentSite = sites.find(site => {
      try {
        const siteHostname = new URL(site.url).hostname;
        return currentUrl.includes(siteHostname);
      } catch {
        return false;
      }
    });

    if (currentSite) {
      // Attendre un peu que la page soit complètement chargée
      setTimeout(() => {
        performAutoLogin(currentSite);
        // Démarrer la surveillance des déconnexions
        startDisconnectionMonitoring(currentSite);
      }, 1000);
    }
  } catch (error) {
    console.error('Erreur auto-login:', error);
  }
});

// Surveiller les déconnexions automatiques
function startDisconnectionMonitoring(site) {
  // Vérifier périodiquement si les champs de connexion apparaissent
  setInterval(() => {
    checkForLoginForm(site);
  }, 3000); // Vérifier toutes les 3 secondes

  // Observer les changements dans le DOM pour une détection plus rapide
  observer = new MutationObserver((mutations) => {
    checkForLoginForm(site);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Détecter les redirections vers la page de connexion
  window.addEventListener('popstate', () => {
    setTimeout(() => checkForLoginForm(site), 500);
  });

  // Détecter les clics sur les boutons de déconnexion courants
  document.addEventListener('click', (e) => {
    const element = e.target;
    const text = element.textContent?.toLowerCase() || '';
    const className = element.className?.toLowerCase() || '';
    const id = element.id?.toLowerCase() || '';
    
    // Mots-clés de déconnexion
    if (text.includes('logout') || text.includes('déconnexion') || text.includes('sign out') ||
        text.includes('log out') || className.includes('logout') || id.includes('logout')) {
      console.log('Détection de clic sur déconnexion, surveillance activée');
      // Vérifier après la déconnexion
      setTimeout(() => {
        checkForLoginForm(site);
      }, 2000);
    }
  }, true);
}

// Vérifier si le formulaire de connexion est présent
function checkForLoginForm(site) {
  try {
    const emailField = document.querySelector(site.emailSelector);
    const passwordField = document.querySelector(site.passwordSelector);

    // Si les champs de connexion sont visibles et vides
    if (emailField && passwordField) {
      const emailVisible = isElementVisible(emailField);
      const passwordVisible = isElementVisible(passwordField);
      
      if (emailVisible && passwordVisible && !emailField.value && !passwordField.value) {
        console.log('🔄 Déconnexion détectée - Reconnexion automatique...');
        performAutoLogin(site);
      }
    }
  } catch (error) {
    // Ignorer les erreurs silencieusement
  }
}

// Vérifier si un élément est visible
function isElementVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetParent !== null;
}

function performAutoLogin(site) {
  try {
    // Vérifier si les champs sont déjà remplis
    const emailField = document.querySelector(site.emailSelector);
    const passwordField = document.querySelector(site.passwordSelector);

    if (!emailField || !passwordField) {
      console.log('Champs de connexion non trouvés');
      return;
    }

    // Ne pas remplir si déjà rempli
    if (emailField.value || passwordField.value) {
      console.log('Champs déjà remplis, auto-login annulé');
      return;
    }

    // Afficher une notification visuelle
    showAutoLoginNotification();

    // Remplir le champ email/username
    emailField.value = site.email;
    emailField.dispatchEvent(new Event('input', { bubbles: true }));
    emailField.dispatchEvent(new Event('change', { bubbles: true }));
    emailField.dispatchEvent(new Event('blur', { bubbles: true }));
    emailField.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    // Remplir le champ mot de passe
    passwordField.value = site.password;
    passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    passwordField.dispatchEvent(new Event('change', { bubbles: true }));
    passwordField.dispatchEvent(new Event('blur', { bubbles: true }));
    passwordField.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    console.log('✅ Champs remplis avec succès');

    // Cliquer sur le bouton de connexion si spécifié
    if (site.submitSelector) {
      setTimeout(() => {
        const submitBtn = document.querySelector(site.submitSelector);
        if (submitBtn) {
          submitBtn.click();
          console.log('🚀 Bouton de connexion cliqué');
        }
      }, 800);
    }
  } catch (error) {
    console.error('Erreur lors de l\'auto-login:', error);
  }
}

// Afficher une notification visuelle lors de l'auto-login
function showAutoLoginNotification() {
  // Vérifier si une notification existe déjà
  if (document.getElementById('auto-login-notification')) return;

  const notification = document.createElement('div');
  notification.id = 'auto-login-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <span style="font-size: 20px;">🔐</span>
      <span>Connexion automatique en cours...</span>
    </div>
    <style>
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    </style>
  `;
  
  document.body.appendChild(notification);

  // Retirer la notification après 3 secondes
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
