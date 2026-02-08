// Background service worker pour gérer les événements globaux

// Écouter les changements d'onglets
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Quand la page est complètement chargée
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const result = await chrome.storage.local.get(['sites', 'autoReconnect']);
      const sites = result.sites || [];
      const autoReconnect = result.autoReconnect !== false; // Par défaut activé

      if (!autoReconnect) return;

      // Vérifier si l'URL correspond à un site sauvegardé
      const matchingSite = sites.find(site => {
        try {
          const siteHostname = new URL(site.url).hostname;
          return tab.url.includes(siteHostname);
        } catch {
          return false;
        }
      });

      if (matchingSite) {
        console.log(`Site détecté: ${matchingSite.name}`);
        // Le content script s'occupera de l'auto-login
      }
    } catch (error) {
      console.error('Erreur dans le background script:', error);
    }
  }
});

// Écouter les messages des content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'logDisconnection') {
    console.log('Déconnexion détectée sur:', sender.tab?.url);
    // Vous pouvez ajouter des statistiques ou des logs ici
  }
  sendResponse({ received: true });
});

// Installation de l'extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Auto Login Extension installée');
  
  // Définir les paramètres par défaut
  chrome.storage.local.set({
    autoLoginEnabled: true,
    autoReconnect: true
  });
});
