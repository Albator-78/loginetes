# 🔄 Guide Reconnexion Automatique

## Fonctionnement

L'extension **Auto Login v2.0** inclut maintenant une fonctionnalité de **reconnexion automatique** qui vous reconnecte instantanément après une déconnexion.

## Cas d'usage

### 1. Session expirée
Vous travaillez sur un site et votre session expire automatiquement après X minutes d'inactivité.
→ L'extension détecte le formulaire de connexion et vous reconnecte automatiquement

### 2. Déconnexion accidentelle
Vous cliquez par erreur sur "Déconnexion" ou un bouton similaire.
→ L'extension anticipe et vous reconnecte immédiatement

### 3. Mise à jour de page
Le site vous redirige vers la page de connexion après une mise à jour.
→ Reconnexion automatique instantanée

### 4. Multi-onglets
Vous vous déconnectez dans un onglet, mais continuez à travailler dans un autre.
→ L'extension vous reconnecte dans tous les onglets concernés

## Mécanismes de détection

L'extension utilise plusieurs méthodes pour détecter les déconnexions :

### 🔍 Surveillance DOM
- Observe les changements dans la page
- Détecte l'apparition de formulaires de connexion
- Vérification toutes les 3 secondes

### 🖱️ Détection des clics
Surveille les clics sur les boutons contenant :
- "logout", "déconnexion", "sign out", "log out"
- Classes ou IDs contenant "logout"

### 🌐 Navigation
- Détecte les redirections vers la page de login
- Surveille les changements d'URL
- Réagit aux événements de navigation

### 👁️ Visibilité des champs
Vérifie que les champs de connexion sont :
- Visibles (pas en `display: none`)
- Vides (pas déjà remplis)
- Accessibles (offsetParent non null)

## Activation/Désactivation

### Dans le popup de l'extension :
1. Cliquez sur l'icône de l'extension
2. Cochez/décochez "Reconnexion automatique"
3. Le paramètre est sauvegardé instantanément

### Par défaut :
✅ La reconnexion automatique est **activée** par défaut

## Notification visuelle

Lors d'une reconnexion automatique, vous verrez :
- 🔐 Une notification en haut à droite
- Message : "Connexion automatique en cours..."
- Animation de glissement élégante
- Disparition automatique après 3 secondes

## Sécurité

- ✅ Aucune donnée n'est envoyée à un serveur externe
- ✅ Les identifiants restent stockés localement
- ✅ La surveillance ne fonctionne que sur vos sites sauvegardés
- ✅ Aucun impact sur les autres sites web

## Performance

- ⚡ Impact minimal sur les performances
- ⚡ Vérifications optimisées toutes les 3 secondes
- ⚡ Observer DOM intelligent (seulement sur les sites sauvegardés)
- ⚡ Pas de requêtes réseau supplémentaires

## Exemples d'utilisation

### Gmail
Si votre session Gmail expire après 30 min d'inactivité :
1. La page se recharge vers la connexion
2. L'extension détecte le formulaire
3. Remplissage automatique des champs
4. Clic automatique sur "Suivant"
5. Vous êtes reconnecté en 2 secondes

### Site bancaire
Déconnexion automatique après 5 min pour sécurité :
1. Redirection vers la page de login
2. Reconnexion automatique
3. Vous continuez votre opération

### Application web
Vous cliquez accidentellement sur "Déconnexion" :
1. L'extension détecte le clic
2. Attend 2 secondes
3. Vérifie si le formulaire apparaît
4. Reconnexion automatique

## Compatibilité

✅ **Sites compatibles :**
- Sites avec formulaires HTML classiques
- Sites avec sélecteurs CSS standards
- La plupart des applications web modernes

⚠️ **Limitations possibles :**
- Sites avec protection anti-bot avancée
- Sites utilisant des iframes complexes
- Sites avec authentification multi-facteurs (MFA)
- Captchas

## Dépannage

### La reconnexion ne fonctionne pas ?

1. **Vérifier les sélecteurs**
   - Les sélecteurs sont-ils toujours corrects ?
   - Le site a-t-il changé son design ?

2. **Vérifier le bouton submit**
   - Le sélecteur du bouton est-il correct ?
   - Essayez de laisser ce champ vide pour remplir manuellement

3. **Console navigateur**
   - Appuyez sur F12
   - Onglet Console
   - Recherchez les messages de l'extension

4. **Délai trop court**
   - Certains sites ont besoin de plus de temps
   - Vous pouvez modifier le délai dans content.js

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que la reconnexion auto est activée
2. Vérifiez les sélecteurs CSS dans vos paramètres
3. Consultez la console pour les erreurs
4. Testez d'abord avec le bouton manuel "Se connecter"

---

**Version : 2.0**
**Dernière mise à jour : Février 2026**
