# 📊 Daily Expense Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)

Une application web élégante et intuitive pour suivre vos dépenses quotidiennes. Gardez un œil sur votre budget facilement et prenez le contrôle de vos finances personnelles.

![Aperçu de l'application](./assets/preview.png)

## ✨ Fonctionnalités

![Interface principale](./assets/features.png)

- **Suivi des dépenses en temps réel** - Ajoutez vos dépenses instantanément
- **Catégorisation** - Classifiez vos dépenses (Nourriture, Transport, Crédit, etc.)
- **Statistiques visuelles** - Visualisez vos habitudes de dépenses avec des graphiques intuitifs
- **Mode sombre** - Interface adaptable à vos préférences visuelles
- **Responsive design** - Fonctionne parfaitement sur ordinateurs, tablettes et smartphones
- **Stockage local** - Vos données sont conservées dans le navigateur grâce au localStorage
- **Personnalisation** - Ajoutez vos propres catégories de dépenses
- **Exportation de données** - Sauvegardez vos données au format CSV

## 🚀 Installation

Aucune installation complexe n'est nécessaire ! Cette application fonctionne directement dans votre navigateur.

```bash
# 1. Clonez ce dépôt
git clone https://github.com/votre-nom/daily-expense-tracker.git

# 2. Naviguez vers le dossier du projet
cd daily-expense-tracker

# 3. Ouvrez index.html dans votre navigateur préféré
# (Double-cliquez simplement sur le fichier ou utilisez la commande ci-dessous)
open index.html   # sur macOS
start index.html  # sur Windows
```

## 📱 Utilisation

### Ajouter une nouvelle dépense

![Ajouter une dépense](./assets/add-expense.gif)

1. Cliquez sur le bouton flottant "+" dans le coin inférieur droit
2. Remplissez les détails de votre dépense :
   - Montant
   - Description
   - Catégorie
   - Date
3. Cliquez sur "Ajouter"

### Visualiser vos statistiques

![Page des statistiques](./assets/statistics.png)

1. Accédez à l'onglet "Statistiques" via la barre de navigation
2. Explorez différentes visualisations :
   - Répartition par catégorie
   - Évolution des dépenses dans le temps
   - Comparaison mensuelle
   - Moyenne journalière

### Personnaliser vos paramètres

![Page des paramètres](./assets/settings.png)

1. Accédez à l'onglet "Paramètres"
2. Gérez vos catégories personnalisées
3. Changez votre devise préférée
4. Basculez entre le mode clair et sombre
5. Exportez ou importez vos données

## 🛠️ Technologies utilisées

- **HTML5** - Structure de l'application
- **CSS3** - Styles et animations
- **JavaScript (ES6+)** - Logique de l'application
- **TailwindCSS** - Framework CSS pour le design responsive
- **Chart.js** - Visualisation des données
- **FontAwesome** - Icônes et éléments graphiques
- **LocalStorage API** - Persistance des données côté client

## 📈 Captures d'écran

<table>
  <tr>
    <td><img src="./assets/home.png" alt="Page d'accueil" width="250"/></td>
    <td><img src="./assets/stats.png" alt="Statistiques" width="250"/></td>
    <td><img src="./assets/settings.png" alt="Paramètres" width="250"/></td>
  </tr>
  <tr>
    <td align="center">Page d'accueil</td>
    <td align="center">Statistiques</td>
    <td align="center">Paramètres</td>
  </tr>
</table>

## Mode sombre

<table>
  <tr>
    <td><img src="./assets/light-mode.png" alt="Mode clair" width="250"/></td>
    <td><img src="./assets/dark-mode.png" alt="Mode sombre" width="250"/></td>
  </tr>
  <tr>
    <td align="center">Mode clair</td>
    <td align="center">Mode sombre</td>
  </tr>
</table>

## Version mobile

<table>
  <tr>
    <td><img src="./assets/mobile-home.png" alt="Mobile - Accueil" width="200"/></td>
    <td><img src="./assets/mobile-stats.png" alt="Mobile - Statistiques" width="200"/></td>
    <td><img src="./assets/mobile-settings.png" alt="Mobile - Paramètres" width="200"/></td>
  </tr>
  <tr>
    <td align="center">Accueil</td>
    <td align="center">Statistiques</td>
    <td align="center">Paramètres</td>
  </tr>
</table>

## 🗃️ Structure du projet

```
daily-expense-tracker/
├── index.html          # Structure principale de l'application
├── styles.css          # Styles CSS personnalisés
├── scripts.js          # Logique JavaScript
├── README.md           # Documentation du projet
└── assets/             # Images, icônes et autres ressources
```

## ⚙️ Fonctionnalités à venir

- [ ] Synchronisation cloud pour accéder à vos données sur plusieurs appareils
- [ ] Budget planifié et alertes de dépassement
- [ ] Gestion des revenus pour un suivi financier complet
- [ ] Génération de rapports mensuels téléchargeables
- [ ] Prise en charge de plusieurs devises avec taux de change
- [ ] Version PWA pour installation sur appareil mobile

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à proposer des améliorations.

1. Forkez ce dépôt
2. Créez votre branche de fonctionnalités (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

- Julio - [Développeur d'application](https://github.com/JulNiten)

---

💡 **Conseil Pro**: Utilisez cette application quotidiennement pour développer une bonne habitude de suivi financier. Vos finances futures vous en remercieront!