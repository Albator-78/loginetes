# 🔐 Auto Login - Extension de Navigateur

Extension Chrome/Edge pour se connecter automatiquement en un clic sur vos sites favoris.

## 🚀 Fonctionnalités

- **Connexion en 1 clic** : Cliquez sur l'icône de l'extension et connectez-vous instantanément
- **Auto-login au chargement** : Connexion automatique quand vous visitez vos sites sauvegardés
- **Reconnexion automatique** : Se reconnecter automatiquement après une déconnexion (NEW!)
- **Détection automatique des sélecteurs** : Trouve automatiquement les champs de connexion (NEW!)
- **Sélection visuelle** : Cliquez sur les champs pour capturer leurs sélecteurs (NEW!)
- **Détection de déconnexion** : Surveille les déconnexions et reconnecte automatiquement
- **Multi-sites** : Gérez plusieurs sites avec leurs identifiants
- **Notification visuelle** : Alerte élégante lors de la reconnexion
- **Sécurisé** : Les données sont stockées localement dans votre navigateur
- **Interface moderne** : Design élégant et facile à utiliser

## 📦 Installation

### Chrome / Edge / Brave

1. Téléchargez tous les fichiers de l'extension
2. Ouvrez Chrome et allez à `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant les fichiers de l'extension

### Firefox

1. Allez à `about:debugging#/runtime/this-firefox`
2. Cliquez sur "Charger un module complémentaire temporaire"
3. Sélectionnez le fichier `manifest.json`

## 🎯 Utilisation

### Ajouter un nouveau site

#### Méthode 1 : Détection automatique (Recommandé) 🔍

1. Allez sur la page de connexion du site
2. Cliquez sur l'icône de l'extension
3. Cliquez sur "🔍 Détecter automatiquement les sélecteurs"
4. Les champs sont remplis automatiquement !
5. Entrez vos identifiants (email et mot de passe)
6. Cliquez sur "💾 Sauvegarder"

**Avantages :**
- ⚡ Super rapide (1 clic)
- 🎯 Taux de réussite de 90%+
- 🤖 Aucune connaissance technique requise

#### Méthode 2 : Sélection visuelle 🎯

1. Cliquez sur l'icône de l'extension
2. Cliquez sur "+ Ajouter un nouveau site"
3. À côté de chaque champ de sélecteur, cliquez sur le bouton 🎯
4. La page s'assombrit et vous passez en mode sélection
5. Cliquez sur le champ correspondant dans la page
6. Le sélecteur est capturé automatiquement !
7. Répétez pour chaque champ (email, password, submit)
8. Entrez vos identifiants
9. Cliquez sur "💾 Sauvegarder"

**Avantages :**
- 👁️ Visuel et intuitif
- ✅ Précis à 100%
- 🎨 Fonctionne sur tous les sites

#### Méthode 3 : Saisie manuelle (Pour experts)

1. Cliquez sur l'icône de l'extension
2. Cliquez sur "+ Ajouter un nouveau site"
3. Remplissez les informations :
   - **Nom du site** : Ex: Gmail, Facebook, etc.
   - **URL du site** : L'adresse complète du site
   - **Sélecteur champ email** : Ex: `#email`, `input[name="username"]`
   - **Email/Username** : Votre identifiant
   - **Sélecteur champ password** : Ex: `#password`, `input[type="password"]`
   - **Mot de passe** : Votre mot de passe
   - **Sélecteur bouton connexion** (optionnel) : Ex: `button[type="submit"]`

4. Cliquez sur "💾 Sauvegarder"

### Comment trouver les sélecteurs ?

1. Allez sur la page de connexion du site
2. Faites clic droit sur le champ email → "Inspecter"
3. Notez l'attribut `id` ou `name` du champ
4. Le sélecteur sera : `#id` ou `input[name="nom"]`

**Exemples courants :**
- Gmail : `#identifierId`, `input[type="password"]`
- Facebook : `#email`, `#pass`, `button[name="login"]`
- LinkedIn : `#username`, `#password`, `button[type="submit"]`

### Se connecter

**Méthode 1 - Manuel :**
1. Allez sur le site de connexion
2. Cliquez sur l'icône de l'extension
3. Cliquez sur "🚀 Se connecter maintenant"

**Méthode 2 - Automatique :**
- Visitez simplement le site, l'extension remplira automatiquement les champs

**Méthode 3 - Reconnexion automatique (NEW!) :**
- Si vous êtes déconnecté automatiquement (session expirée, etc.)
- L'extension détecte la déconnexion et se reconnecte automatiquement
- Une notification apparaît en haut à droite
- Activez/désactivez cette fonction dans le popup de l'extension

## 🔄 Comment fonctionne la reconnexion automatique ?

L'extension surveille en permanence :
1. **Les formulaires de connexion** : Détecte quand ils apparaissent
2. **Les clics sur "Déconnexion"** : Anticipe les déconnexions volontaires
3. **Les changements de page** : Détecte les redirections vers la page de login
4. **Les sessions expirées** : Reconnecte automatiquement

Lorsqu'une déconnexion est détectée :
- ✅ Les champs sont remplis automatiquement
- ✅ Le bouton de connexion est cliqué
- ✅ Une notification visuelle apparaît
- ✅ Vous êtes reconnecté en quelques secondes

## ⚠️ Sécurité

- Les identifiants sont stockés **localement** dans votre navigateur (pas de serveur externe)
- Utilisez cette extension uniquement sur **votre ordinateur personnel**
- Ne partagez jamais vos fichiers d'extension avec d'autres personnes
- Pour plus de sécurité, utilisez un gestionnaire de mots de passe professionnel

## 🛠️ Fichiers inclus

- `manifest.json` - Configuration de l'extension
- `popup.html` - Interface utilisateur
- `popup.js` - Logique de l'interface
- `content.js` - Script injecté dans les pages web + surveillance des déconnexions
- `background.js` - Service worker pour la gestion globale
- `selector-detector.js` - Module de détection automatique des sélecteurs CSS
- `visual-picker.js` - Module de sélection visuelle interactive
- `icon16.png`, `icon48.png`, `icon128.png` - Icônes
- `README.md` - Documentation principale
- `GUIDE-RECONNEXION.md` - Guide détaillé de la reconnexion automatique
- `GUIDE-SELECTEURS.md` - Guide complet du détecteur de sélecteurs

## 📝 Notes

- Si le bouton de connexion n'est pas cliqué automatiquement, vous pouvez le cliquer manuellement après que les champs soient remplis
- Certains sites ont des protections anti-bot qui peuvent bloquer l'auto-login
- Les sélecteurs peuvent changer si le site met à jour son design

## 🆘 Dépannage

**L'extension ne remplit pas les champs :**
- Vérifiez que les sélecteurs sont corrects
- Certains sites utilisent des iframes, essayez de trouver les sélecteurs dans l'iframe
- Ouvrez la console (F12) pour voir les erreurs éventuelles

**L'extension ne se connecte pas automatiquement :**
- Vérifiez que le sélecteur du bouton est correct
- Augmentez le délai dans le code si nécessaire

## 📄 Licence

Usage personnel uniquement. Utilisez à vos propres risques.
