// Module de détection automatique des sélecteurs CSS pour les formulaires de connexion

class SelectorDetector {
  constructor() {
    this.commonPatterns = {
      email: [
        // Par ID
        '#email', '#username', '#user', '#login', '#account', '#userid',
        '#user-name', '#user_name', '#login-username', '#login-email',
        '#identifierId', // Gmail
        '#loginEmail', '#userEmail', '#emailAddress',
        
        // Par Name
        'input[name="email"]', 'input[name="username"]', 'input[name="user"]',
        'input[name="login"]', 'input[name="identifier"]', 'input[name="session[username]"]',
        
        // Par Type
        'input[type="email"]', 'input[type="text"][autocomplete*="email"]',
        'input[type="text"][autocomplete*="username"]',
        
        // Par Classe
        '.email', '.username', '.login-email', '.login-username',
        
        // Par Attributs
        'input[autocomplete="username"]', 'input[autocomplete="email"]',
        'input[placeholder*="email" i]', 'input[placeholder*="username" i]',
        'input[aria-label*="email" i]', 'input[aria-label*="username" i]'
      ],
      
      password: [
        // Par ID
        '#password', '#pass', '#passwd', '#user-password', '#user_password',
        '#login-password', '#loginPassword', '#passwordInput',
        
        // Par Name
        'input[name="password"]', 'input[name="pass"]', 'input[name="passwd"]',
        'input[name="user_password"]', 'input[name="session[password]"]',
        
        // Par Type (le plus fiable)
        'input[type="password"]',
        
        // Par Classe
        '.password', '.pass', '.login-password',
        
        // Par Attributs
        'input[autocomplete="current-password"]', 'input[autocomplete="new-password"]',
        'input[placeholder*="password" i]', 'input[placeholder*="mot de passe" i]',
        'input[aria-label*="password" i]'
      ],
      
      submit: [
        // Boutons de type submit
        'button[type="submit"]', 'input[type="submit"]',
        
        // Par ID
        '#submit', '#login', '#signin', '#sign-in', '#log-in', '#loginButton',
        '#submitButton', '#login-button', '#btn-login',
        
        // Par Name
        'button[name="submit"]', 'button[name="login"]', 'button[name="signin"]',
        
        // Par Classe
        '.submit', '.login', '.signin', '.btn-login', '.login-button',
        '.submit-button', '.sign-in-button',
        
        // Par Texte (attention à la langue)
        'button:contains("Login")', 'button:contains("Sign in")', 
        'button:contains("Log in")', 'button:contains("Connexion")',
        'button:contains("Se connecter")', 'button:contains("Entrar")'
      ]
    };
  }

  // Trouver le meilleur sélecteur pour un champ
  detectField(fieldType) {
    const patterns = this.commonPatterns[fieldType];
    if (!patterns) return null;

    for (const selector of patterns) {
      try {
        // Ignorer les sélecteurs :contains qui ne sont pas supportés par querySelector
        if (selector.includes(':contains')) continue;
        
        const element = document.querySelector(selector);
        if (element && this.isVisible(element)) {
          return {
            selector: selector,
            element: element,
            confidence: this.calculateConfidence(element, fieldType)
          };
        }
      } catch (e) {
        // Ignorer les sélecteurs invalides
      }
    }

    // Si aucun pattern ne fonctionne, chercher intelligemment
    return this.smartDetect(fieldType);
  }

  // Détection intelligente basée sur les attributs et le contexte
  smartDetect(fieldType) {
    let candidates = [];

    if (fieldType === 'email') {
      // Tous les inputs text ou email visibles
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
      inputs.forEach(input => {
        if (!this.isVisible(input)) return;
        
        const score = this.scoreElement(input, ['email', 'username', 'user', 'login', 'identifier']);
        if (score > 0) {
          candidates.push({ element: input, score: score });
        }
      });
    } else if (fieldType === 'password') {
      // Tous les inputs password visibles
      const inputs = document.querySelectorAll('input[type="password"]');
      inputs.forEach(input => {
        if (this.isVisible(input)) {
          candidates.push({ element: input, score: 100 }); // Password type est très fiable
        }
      });
    } else if (fieldType === 'submit') {
      // Tous les boutons visibles
      const buttons = document.querySelectorAll('button, input[type="submit"]');
      buttons.forEach(button => {
        if (!this.isVisible(button)) return;
        
        const score = this.scoreElement(button, ['login', 'signin', 'sign-in', 'submit', 'connexion', 'connecter']);
        if (score > 0) {
          candidates.push({ element: button, score: score });
        }
      });
    }

    // Trier par score et retourner le meilleur
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      return {
        selector: this.generateSelector(best.element),
        element: best.element,
        confidence: Math.min(best.score, 100)
      };
    }

    return null;
  }

  // Calculer un score basé sur les attributs de l'élément
  scoreElement(element, keywords) {
    let score = 0;
    const id = (element.id || '').toLowerCase();
    const name = (element.name || '').toLowerCase();
    const className = (element.className || '').toLowerCase();
    const placeholder = (element.placeholder || '').toLowerCase();
    const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
    const text = (element.textContent || '').toLowerCase();

    keywords.forEach(keyword => {
      if (id.includes(keyword)) score += 30;
      if (name.includes(keyword)) score += 25;
      if (className.includes(keyword)) score += 15;
      if (placeholder.includes(keyword)) score += 10;
      if (ariaLabel.includes(keyword)) score += 10;
      if (text.includes(keyword)) score += 5;
    });

    return score;
  }

  // Générer un sélecteur CSS unique pour un élément
  generateSelector(element) {
    // Préférer l'ID s'il existe
    if (element.id) {
      return `#${element.id}`;
    }

    // Sinon, utiliser name
    if (element.name) {
      return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
    }

    // Sinon, utiliser type pour les inputs
    if (element.type) {
      return `input[type="${element.type}"]`;
    }

    // En dernier recours, utiliser la classe principale
    if (element.className) {
      const firstClass = element.className.split(' ')[0];
      return `.${firstClass}`;
    }

    return element.tagName.toLowerCase();
  }

  // Vérifier si un élément est visible
  isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetParent !== null;
  }

  // Calculer la confiance dans le sélecteur trouvé
  calculateConfidence(element, fieldType) {
    let confidence = 50; // Base

    // Augmenter selon les attributs
    if (element.id && element.id.toLowerCase().includes(fieldType)) {
      confidence += 30;
    }
    if (element.name && element.name.toLowerCase().includes(fieldType)) {
      confidence += 20;
    }
    if (fieldType === 'password' && element.type === 'password') {
      confidence = 100; // Type password est 100% fiable
    }

    return Math.min(confidence, 100);
  }

  // Détecter tous les champs d'un formulaire de connexion
  detectLoginForm() {
    const email = this.detectField('email');
    const password = this.detectField('password');
    const submit = this.detectField('submit');

    return {
      email: email,
      password: password,
      submit: submit,
      allFound: email && password,
      confidence: email && password ? 
        Math.round((email.confidence + password.confidence) / 2) : 0
    };
  }

  // Obtenir tous les formulaires possibles sur la page
  getAllForms() {
    const forms = document.querySelectorAll('form');
    const results = [];

    forms.forEach((form, index) => {
      // Chercher dans le contexte du formulaire
      const tempDoc = document;
      const originalQuery = document.querySelector;
      
      // Limiter la recherche au formulaire
      document.querySelector = function(selector) {
        return form.querySelector(selector);
      };

      const detected = this.detectLoginForm();
      
      // Restaurer
      document.querySelector = originalQuery;

      if (detected.allFound) {
        results.push({
          formIndex: index,
          formId: form.id || `form-${index}`,
          ...detected
        });
      }
    });

    return results;
  }
}

// Exposer le détecteur globalement
window.SelectorDetector = SelectorDetector;

// Message pour confirmer le chargement
console.log('🔍 Module de détection de sélecteurs CSS chargé');
