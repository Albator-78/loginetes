# 🔍 Guide du Détecteur de Sélecteurs CSS

## Vue d'ensemble

Le module de détection automatique des sélecteurs CSS vous permet de configurer facilement vos sites sans avoir à chercher manuellement les sélecteurs dans le code HTML.

## 🎯 Trois méthodes de détection

### 1. Détection Automatique Intelligente (Recommandé)

**Comment utiliser :**
1. Ouvrez la page de connexion du site
2. Cliquez sur l'icône de l'extension
3. Cliquez sur "🔍 Détecter automatiquement les sélecteurs"
4. Les champs sont remplis automatiquement !

**Comment ça fonctionne :**
- Scanne tous les champs de la page
- Utilise des patterns prédéfinis (100+ patterns communs)
- Analyse les attributs (id, name, class, placeholder, etc.)
- Calcule un score de confiance pour chaque champ
- Sélectionne automatiquement les meilleurs candidats

**Patterns détectés :**

**Champs Email/Username :**
- IDs : `#email`, `#username`, `#user`, `#login`, `#identifierId` (Gmail)
- Names : `name="email"`, `name="username"`, `name="login"`
- Types : `type="email"`, `type="text"`
- Placeholders : contenant "email", "username", "utilisateur"
- Autocomplete : `autocomplete="username"`, `autocomplete="email"`

**Champs Password :**
- Type : `type="password"` (100% fiable)
- IDs : `#password`, `#pass`, `#passwd`
- Names : `name="password"`, `name="pass"`
- Autocomplete : `autocomplete="current-password"`

**Boutons Submit :**
- Types : `type="submit"`
- IDs : `#login`, `#signin`, `#submitButton`
- Classes : `.login`, `.signin`, `.submit-button`
- Texte : "Login", "Sign in", "Connexion", "Se connecter"

**Taux de réussite :**
- 95%+ sur les sites avec formulaires HTML standards
- 80%+ sur les sites avec formulaires personnalisés
- 60%+ sur les sites avec frameworks JS complexes

---

### 2. Sélection Visuelle Interactive

**Comment utiliser :**
1. Dans le formulaire d'ajout de site, cliquez sur le bouton 🎯 à côté d'un champ
2. La page s'assombrit et le mode sélection s'active
3. Survolez les éléments de la page (ils seront surlignés en bleu)
4. Cliquez sur l'élément que vous voulez sélectionner
5. Le sélecteur est automatiquement rempli dans le champ !

**Avantages :**
✅ Visuel et intuitif
✅ Précis à 100% (vous choisissez exactement l'élément)
✅ Fonctionne sur tous les sites
✅ Pas besoin de connaissances techniques

**Instructions à l'écran :**
- Un panneau en haut de la page vous guide
- Appuyez sur **Échap** pour annuler la sélection
- Le curseur devient une croix pendant la sélection

**Génération intelligente de sélecteurs :**
L'outil génère le sélecteur le plus stable possible :
1. **ID** en priorité : `#email` (le plus fiable)
2. **Name** ensuite : `input[name="username"]`
3. **Type** pour inputs : `input[type="password"]`
4. **Classe** si disponible : `.login-email`
5. **Chemin CSS** en dernier recours

---

### 3. Saisie Manuelle (Pour experts)

**Quand l'utiliser :**
- Sites très complexes avec iframes
- Sites avec shadow DOM
- Besoin de sélecteurs CSS avancés
- Vous connaissez déjà le bon sélecteur

**Comment trouver les sélecteurs manuellement :**

1. **Ouvrir les DevTools :**
   - Clic droit sur la page → "Inspecter"
   - Ou appuyez sur **F12**

2. **Activer le sélecteur d'élément :**
   - Cliquez sur l'icône de flèche 🔍 en haut à gauche des DevTools
   - Ou appuyez sur **Ctrl+Shift+C** (Windows) / **Cmd+Shift+C** (Mac)

3. **Cliquer sur le champ :**
   - Le code HTML de l'élément sera surligné

4. **Copier le sélecteur :**
   - Clic droit sur l'élément dans le code
   - "Copy" → "Copy selector"
   - Collez dans l'extension

**Types de sélecteurs CSS :**

```css
/* Par ID (le plus fiable) */
#email
#username
#loginPassword

/* Par Name */
input[name="email"]
input[name="user"]
button[name="login"]

/* Par Type */
input[type="email"]
input[type="password"]
button[type="submit"]

/* Par Classe */
.email-input
.login-field
.submit-btn

/* Par Attribut */
input[autocomplete="username"]
input[placeholder="Email"]

/* Combinaisons */
form#login input[type="email"]
div.login-form input[name="password"]

/* Pseudo-classes */
input:first-of-type
button:last-child
```

---

## 📊 Tableau comparatif des méthodes

| Méthode | Rapidité | Facilité | Fiabilité | Compatibilité |
|---------|----------|----------|-----------|---------------|
| **Auto-détection** | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 🎯🎯🎯🎯 | 📱📱📱📱 |
| **Sélection visuelle** | ⚡⚡ | ⭐⭐⭐⭐⭐ | 🎯🎯🎯🎯🎯 | 📱📱📱📱📱 |
| **Saisie manuelle** | ⚡ | ⭐⭐ | 🎯🎯🎯🎯🎯 | 📱📱📱📱📱 |

**Recommandation :**
1. Essayez d'abord la **détection automatique** (1 clic)
2. Si ça ne fonctionne pas, utilisez la **sélection visuelle** (intuitive)
3. En dernier recours, utilisez la **saisie manuelle** (technique)

---

## 🔧 Cas d'usage spécifiques

### Sites avec formulaires en plusieurs étapes

**Exemple : Gmail**
1. Page 1 : Email seulement
2. Page 2 : Mot de passe seulement

**Solution :**
- Créez un site pour la page 1 avec le sélecteur email
- Créez un site séparé pour la page 2 avec le sélecteur password
- Ou utilisez des sélecteurs génériques qui fonctionnent sur les deux pages

### Sites avec iframes

**Problème :** Les champs sont dans une iframe

**Solution :**
1. Cliquez dans l'iframe pour la sélectionner
2. Ouvrez les DevTools (F12)
3. Dans l'onglet "Elements", vous verrez un menu déroulant en haut
4. Sélectionnez l'iframe correcte
5. Trouvez vos sélecteurs normalement

### Sites avec Shadow DOM

**Problème :** Les champs sont dans un Shadow DOM (Web Components)

**Solution :**
La détection automatique ne fonctionne pas toujours. Utilisez la saisie manuelle avec des sélecteurs qui traversent le Shadow DOM.

---

## 💡 Astuces et bonnes pratiques

### Choisir le bon sélecteur

**✅ Bon sélecteur (stable) :**
```css
#email
input[name="username"]
input[type="password"]
```

**❌ Mauvais sélecteur (fragile) :**
```css
div > div > div > input:nth-child(3)
.css-1234abcd-Input
input[class*="random-hash"]
```

**Pourquoi ?**
- Les IDs et Names changent rarement
- Les classes générées (CSS-in-JS) changent à chaque build
- Les chemins CSS longs cassent facilement

### Tester les sélecteurs

**Dans la console :**
```javascript
// Tester si le sélecteur fonctionne
document.querySelector('#email')

// Doit retourner l'élément, pas null
```

### Score de confiance

L'auto-détection vous donne un score :
- **90-100%** : Excellent, très fiable
- **70-89%** : Bon, devrait fonctionner
- **50-69%** : Moyen, à vérifier
- **<50%** : Faible, utilisez la sélection visuelle

---

## 🐛 Dépannage

### "Impossible de détecter les champs"

**Causes possibles :**
1. Ce n'est pas une page de connexion
2. Le formulaire est dans une iframe
3. Le site utilise un framework JS qui charge après
4. Les champs ont des noms non-standards

**Solutions :**
1. Assurez-vous d'être sur la bonne page
2. Attendez que la page soit complètement chargée
3. Utilisez la sélection visuelle
4. Saisie manuelle en dernier recours

### Le sélecteur ne fonctionne plus

**Causes :**
- Le site a changé son design
- Mise à jour du site
- Les classes CSS ont été régénérées

**Solutions :**
1. Re-détectez les sélecteurs
2. Mettez à jour manuellement
3. Préférez les sélecteurs par ID/Name plutôt que par classe

### La sélection visuelle ne s'active pas

**Vérifiez :**
1. L'extension a les permissions nécessaires
2. Vous êtes sur une vraie page web (pas sur chrome://)
3. La page n'a pas de Content Security Policy stricte
4. Rechargez la page et réessayez

---

## 🎓 Exemples de sites populaires

### Gmail
```css
Email: #identifierId
Password: input[type="password"]
Submit: #identifierNext, #passwordNext
```

### Facebook
```css
Email: #email
Password: #pass
Submit: button[name="login"]
```

### LinkedIn
```css
Email: #username
Password: #password
Submit: button[type="submit"]
```

### Twitter/X
```css
Email: input[autocomplete="username"]
Password: input[autocomplete="current-password"]
Submit: button[type="submit"]
```

### GitHub
```css
Email: #login_field
Password: #password
Submit: input[type="submit"]
```

---

## 📈 Améliorations futures

Le détecteur est en constante amélioration. Prochaines fonctionnalités :
- [ ] Support des formulaires multi-étapes
- [ ] Détection des captchas
- [ ] Support du 2FA/MFA
- [ ] Base de données de patterns par site
- [ ] Machine learning pour améliorer la détection

---

**Version : 2.0**
**Module : Détecteur de Sélecteurs CSS**
