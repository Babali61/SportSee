FROM node:lts-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install --production

# Copier le code source
COPY . .

EXPOSE 3001

# Démarrer l'application
CMD ["npm", "start"]
