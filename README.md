
## Technologies Utilisées
### Frontend
- React.js
- D3.js pour les visualisations
- PropTypes pour le typage

### Backend
- Node.js
- Express
- Docker (optionnel)

## Installation

### Frontend (src/)
```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm start
```

### Backend (backend/)
```bash
# Installation des dépendances
cd backend
yarn install

# Démarrage du serveur
yarn dev
```

## API Endpoints
- `GET /user/:id` - Informations utilisateur
- `GET /user/:id/activity` - Activités quotidiennes
- `GET /user/:id/average-sessions` - Sessions moyennes
- `GET /user/:id/performance` - Données de performance

## Fonctionnalités
- 📊 Visualisation des données d'entraînement
- 📈 Suivi des activités quotidiennes
- 🎯 Affichage des objectifs et progrès
- 📱 Interface responsive

## Développement
### Ports
- Frontend : http://localhost:3000
- Backend : http://localhost:3001

### Utilisateurs de test
- ID: 12 (Karl Dovineau)
- ID: 18 (Cecilia Ratorez)
