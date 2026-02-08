# 🎓 Configuration pour Studi (app.studi.fr)

## Comment obtenir les sélecteurs pour Studi

### Étape 1 : Ouvrir la page de connexion
1. Allez sur https://app.studi.fr/v3/login
2. Attendez que la page soit complètement chargée

### Étape 2 : Ouvrir les outils de développement
- **Windows/Linux** : Appuyez sur `F12` ou `Ctrl + Shift + I`
- **Mac** : Appuyez sur `Cmd + Option + I`

### Étape 3 : Activer le sélecteur d'élément
1. Dans les DevTools, cliquez sur l'icône de flèche 🔍 (en haut à gauche)
2. Ou appuyez sur `Ctrl + Shift + C` (Windows) ou `Cmd + Shift + C` (Mac)

### Étape 4 : Inspecter les champs

#### A. Champ Email/Identifiant
1. Survolez le champ email avec le curseur
2. Cliquez dessus
3. Dans le code HTML surligné, notez les attributs suivants :
   - `id="..."` → Utilisez `#id_value`
   - `name="..."` → Utilisez `input[name="name_value"]`
   - `autocomplete="..."` → Notez la valeur (ex: "username" ou "email")
   - `type="..."` → Notez le type (probablement "text" ou "email")

**Sélecteurs possibles pour Studi :**
```css
/* Exemples courants pour les plateformes éducatives */
#email
#username
#identifier
input[name="email"]
input[name="username"]
input[autocomplete="username"]
input[type="email"]
.email-input
.login-email
```

#### B. Champ Mot de passe
1. Survolez le champ mot de passe
2. Cliquez dessus
3. Notez les attributs :
   - `id="..."` → Utilisez `#id_value`
   - `name="..."` → Utilisez `input[name="name_value"]`
   - `type="password"` → Utilisez `input[type="password"]`
   - `autocomplete="..."` → Devrait être "current-password"

**Sélecteurs possibles :**
```css
#password
#passwd
input[name="password"]
input[type="password"]
input[autocomplete="current-password"]
.password-input
.login-password
```

#### C. Bouton de connexion
1. Survolez le bouton "Se connecter" ou "Connexion"
2. Cliquez dessus
3. Notez :
   - `id="..."` → Utilisez `#id_value`
   - `type="submit"` → Utilisez `button[type="submit"]`
   - `class="..."` → Utilisez `.class-name`

**Sélecteurs possibles :**
```css
button[type="submit"]
input[type="submit"]
#login
#submit
#signin
button.login-button
button.submit-button
.btn-primary
.btn-login
```

### Étape 5 : Copier les sélecteurs automatiquement

**Méthode rapide :**
1. Clic droit sur l'élément surligné dans les DevTools
2. "Copy" → "Copy selector"
3. Collez dans l'extension Auto Login

**Exemple de ce que vous devriez obtenir :**
```
#studi-email-input
input[name="user[email]"]
button[data-testid="login-submit"]
```

---

## 📋 Template de configuration Studi

Utilisez ce template et remplacez avec vos valeurs réelles :

### Dans l'extension Auto Login :

**Nom du site :** Studi

**URL du site :** https://app.studi.fr/v3/login

**Sélecteur champ email :**
```
[À COMPLÉTER - voir instructions ci-dessus]
Exemples : #email, input[name="email"], input[type="email"]
```

**Email/Username :** votre.email@exemple.fr

**Sélecteur champ mot de passe :**
```
input[type="password"]
```

**Mot de passe :** VotreMotDePasse

**Sélecteur bouton connexion :**
```
button[type="submit"]
```

---

## 🔍 Méthode alternative : Utiliser l'extension Auto Login

### Option 1 : Détection automatique
1. Installez l'extension Auto Login
2. Allez sur https://app.studi.fr/v3/login
3. Cliquez sur l'icône de l'extension
4. Cliquez sur "🔍 Détecter automatiquement les sélecteurs"
5. L'extension devrait trouver automatiquement les champs !

### Option 2 : Sélection visuelle
1. Cliquez sur l'icône de l'extension
2. Cliquez sur "+ Ajouter un nouveau site"
3. Cliquez sur les boutons 🎯 à côté de chaque champ
4. Cliquez sur les éléments correspondants dans la page Studi
5. Les sélecteurs sont capturés automatiquement !

---

## 📝 Attributs autocomplete standards

Les sites modernes utilisent ces attributs autocomplete :

### Pour le champ email/username :
```html
autocomplete="username"
autocomplete="email"
```

### Pour le champ mot de passe :
```html
autocomplete="current-password"  <!-- Pour la connexion -->
autocomplete="new-password"      <!-- Pour l'inscription -->
```

### Pourquoi c'est important ?
- Permet aux gestionnaires de mots de passe de fonctionner
- Améliore l'accessibilité
- Suit les standards web (W3C)

---

## ⚠️ Notes importantes pour Studi

### Si les sélecteurs changent fréquemment :
Studi pourrait utiliser des classes CSS générées (CSS-in-JS) qui changent à chaque mise à jour. Dans ce cas :

**Privilégiez :**
1. Les sélecteurs par `type` : `input[type="password"]`
2. Les sélecteurs par `autocomplete` : `input[autocomplete="username"]`
3. Les sélecteurs par `name` : `input[name="email"]`

**Évitez :**
- Les classes avec des hashs : `.css-1234abc-Input`
- Les chemins CSS longs et fragiles

### Si le formulaire est en plusieurs étapes :
Certaines plateformes séparent l'email et le mot de passe en 2 pages :

**Solution :**
1. Créez deux configurations séparées dans l'extension
2. Ou utilisez un seul sélecteur qui fonctionne sur les deux pages

### Si le site utilise une iframe :
1. Dans les DevTools, sélectionnez l'iframe dans le menu déroulant
2. Trouvez les sélecteurs à l'intérieur de l'iframe
3. Les sélecteurs fonctionneront normalement

---

## 🧪 Tester la configuration

Une fois configuré :

1. **Test manuel :**
   - Allez sur la page de login
   - Cliquez sur l'extension
   - Cliquez sur "🚀 Se connecter maintenant"
   - Vérifiez que les champs se remplissent

2. **Test automatique :**
   - Déconnectez-vous de Studi
   - Fermez l'onglet
   - Rouvrez https://app.studi.fr/v3/login
   - L'extension devrait se connecter automatiquement !

3. **Test de reconnexion :**
   - Une fois connecté, déconnectez-vous
   - L'extension devrait détecter et se reconnecter automatiquement

---

## 💡 Exemple de configuration réussie

Voici à quoi devrait ressembler votre configuration finale (avec vos vraies valeurs) :

```json
{
  "name": "Studi",
  "url": "https://app.studi.fr/v3/login",
  "emailSelector": "input[type='email']",
  "email": "votre.email@exemple.fr",
  "passwordSelector": "input[type='password']",
  "password": "VotreMotDePasse123",
  "submitSelector": "button[type='submit']"
}
```

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des difficultés :

1. **Vérifiez la console** (F12 → Console)
   - Recherchez les messages de l'extension
   - Notez les erreurs éventuelles

2. **Testez les sélecteurs dans la console :**
   ```javascript
   document.querySelector('input[type="email"]')
   document.querySelector('input[type="password"]')
   document.querySelector('button[type="submit"]')
   ```
   Chacun devrait retourner un élément, pas `null`

3. **Utilisez la détection automatique**
   C'est la méthode la plus simple !

4. **Capturez une vidéo** de la page de login
   Cela peut aider à identifier les bons sélecteurs

---

**Bonne chance avec votre configuration Studi ! 🎓**
