// Outil de sélection visuelle des éléments

class VisualSelectorPicker {
  constructor() {
    this.isActive = false;
    this.targetField = null; // 'email', 'password', ou 'submit'
    this.overlay = null;
    this.selectedElements = {
      email: null,
      password: null,
      submit: null
    };
  }

  // Activer le mode sélection pour un champ spécifique
  activate(fieldType) {
    this.targetField = fieldType;
    this.isActive = true;
    
    // Créer l'overlay
    this.createOverlay();
    
    // Ajouter les event listeners
    document.addEventListener('mouseover', this.handleMouseOver.bind(this), true);
    document.addEventListener('mouseout', this.handleMouseOut.bind(this), true);
    document.addEventListener('click', this.handleClick.bind(this), true);
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    
    this.showInstructions();
  }

  // Désactiver le mode sélection
  deactivate() {
    this.isActive = false;
    this.removeOverlay();
    
    document.removeEventListener('mouseover', this.handleMouseOver.bind(this), true);
    document.removeEventListener('mouseout', this.handleMouseOut.bind(this), true);
    document.removeEventListener('click', this.handleClick.bind(this), true);
    document.removeEventListener('keydown', this.handleKeyDown.bind(this), true);
    
    this.removeHighlights();
    this.hideInstructions();
  }

  // Créer l'overlay semi-transparent
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'selector-picker-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999998;
      pointer-events: none;
    `;
    document.body.appendChild(this.overlay);
  }

  // Retirer l'overlay
  removeOverlay() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  // Afficher les instructions
  showInstructions() {
    const instructions = document.createElement('div');
    instructions.id = 'selector-picker-instructions';
    instructions.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        text-align: center;
      ">
        <div style="font-weight: 600; margin-bottom: 5px; color: #667eea;">
          🎯 Mode Sélection : ${this.getFieldLabel(this.targetField)}
        </div>
        <div style="color: #666; font-size: 13px;">
          Cliquez sur le champ à sélectionner<br>
          <small>Appuyez sur <strong>Échap</strong> pour annuler</small>
        </div>
      </div>
    `;
    document.body.appendChild(instructions);
  }

  // Masquer les instructions
  hideInstructions() {
    const instructions = document.getElementById('selector-picker-instructions');
    if (instructions) {
      instructions.remove();
    }
  }

  // Obtenir le label du champ
  getFieldLabel(fieldType) {
    const labels = {
      email: 'Champ Email/Username',
      password: 'Champ Mot de passe',
      submit: 'Bouton Connexion'
    };
    return labels[fieldType] || fieldType;
  }

  // Gérer le survol
  handleMouseOver(e) {
    if (!this.isActive) return;
    
    const element = e.target;
    
    // Ne pas highlight l'overlay ou les instructions
    if (element.id === 'selector-picker-overlay' || 
        element.id === 'selector-picker-instructions' ||
        element.closest('#selector-picker-instructions')) {
      return;
    }

    // Highlight l'élément
    element.style.outline = '3px solid #667eea';
    element.style.outlineOffset = '2px';
    element.style.cursor = 'crosshair';
  }

  // Gérer la sortie du survol
  handleMouseOut(e) {
    if (!this.isActive) return;
    
    const element = e.target;
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.style.cursor = '';
  }

  // Gérer le clic
  handleClick(e) {
    if (!this.isActive) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    
    // Ne pas sélectionner l'overlay ou les instructions
    if (element.id === 'selector-picker-overlay' || 
        element.id === 'selector-picker-instructions' ||
        element.closest('#selector-picker-instructions')) {
      return;
    }

    // Générer le sélecteur
    const selector = this.generateSelector(element);
    
    // Sauvegarder
    this.selectedElements[this.targetField] = {
      element: element,
      selector: selector
    };

    // Envoyer le résultat
    chrome.runtime.sendMessage({
      action: 'selectorPicked',
      fieldType: this.targetField,
      selector: selector
    });

    // Désactiver
    this.deactivate();
  }

  // Gérer les touches
  handleKeyDown(e) {
    if (!this.isActive) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      this.deactivate();
      
      chrome.runtime.sendMessage({
        action: 'selectorPickCancelled'
      });
    }
  }

  // Retirer tous les highlights
  removeHighlights() {
    document.querySelectorAll('[style*="outline"]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.cursor = '';
    });
  }

  // Générer un sélecteur CSS pour l'élément
  generateSelector(element) {
    // Préférer l'ID
    if (element.id) {
      return `#${element.id}`;
    }

    // Sinon, utiliser name
    if (element.name) {
      return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
    }

    // Sinon, utiliser type pour les inputs
    if (element.type) {
      const tag = element.tagName.toLowerCase();
      return `${tag}[type="${element.type}"]`;
    }

    // Utiliser la première classe
    if (element.className && typeof element.className === 'string') {
      const firstClass = element.className.trim().split(' ')[0];
      if (firstClass) {
        return `.${firstClass}`;
      }
    }

    // En dernier recours, générer un chemin complet
    return this.getFullPath(element);
  }

  // Générer un chemin CSS complet
  getFullPath(element) {
    if (element.tagName === 'HTML') return 'html';
    if (element.tagName === 'BODY') return 'body';
    
    let path = element.tagName.toLowerCase();
    
    // Ajouter l'index si nécessaire
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === element.tagName
      );
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        path += `:nth-of-type(${index})`;
      }
    }
    
    return path;
  }
}

// Exposer globalement
window.VisualSelectorPicker = VisualSelectorPicker;

// Écouter les messages pour activer le picker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startVisualPicker') {
    if (!window.visualPicker) {
      window.visualPicker = new VisualSelectorPicker();
    }
    window.visualPicker.activate(request.fieldType);
    sendResponse({ success: true });
  }
});

console.log('🎯 Module de sélection visuelle chargé');
