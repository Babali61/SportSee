# Project 9 - Front-end Dashboard

This repo contains all the source code to run the micro API for the sports analytics dashboard SportSee.

## 1. General information

To start this project, you are free to use Docker or not. In this documentation, we will see several methods to launch the project easily.

## 2. Project (**without Docker**)

### 2.1 Prerequisites

- [NodeJS (**version 12.18**)](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

If you are working with several versions of NodeJS, we recommend you install [nvm](https://github.com/nvm-sh/nvm). This tool will allow you to easily manage your NodeJS versions.

### 2.2 Launching the project

- Fork the repository
- Clone it on your computer.
- The `yarn` command will allow you to install the dependencies.
- The `yarn dev` command will allow you to run the micro API.


## 3. Project (**with Docker**)

### 2.1 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 2.2 Starting the project

- The `docker image build --no-cache -t micro-api .` command will allow you to build your image.
- The `docker container run --name micro-api -p 3000:3000 -dt micro-api yarn` command will allow you to create your Docker container and run your image on port 3000.
- The `docker container stop micro-api` command will allow you to stop your micro-api.
- The `docker container rm micro-api` command will allow you to delete your micro-api container.

### 2.3 Vscode and container remotes

Finally, if you have VsCode, you can easily launch your project in a docker environment.

You will need the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack). Once you have this extension installed, just click on the `Reopen in Container` button.

Once in the container, run the `yarn dev` command.

## 4. Endpoints

### 4.1 Possible endpoints

This project includes four endpoints that you will be able to use: 

- `http://localhost:3000/user/${userId}` - retrieves information from a user. This first endpoint includes the user id, user information (first name, last name and age), the current day's score (todayScore) and key data (calorie, macronutrient, etc.).
- `http://localhost:3000/user/${userId}/activity` - retrieves a user's activity day by day with kilograms and calories.
- `http://localhost:3000/user/${userId}/average-sessions` - retrieves the average sessions of a user per day. The week starts on Monday.
- `http://localhost:3000/user/${userId}/performance` - retrieves a user's performance (energy, endurance, etc.).


**Warning, currently only two users have been mocked. They have userId 12 and 18 respectively.**

### 4.2 Examples of queries

- `http://localhost:3000/user/12/performance` - Retrieves the performance of the user with id 12
- `http://localhost:3000/user/18` - Retrieves user 18's main information.

<!-- Français -->

Projet 9 - Tableau de Bord Front-end
Ce dépôt contient tout le code source nécessaire pour exécuter l'API micro pour le tableau de bord d'analyse sportive SportSee.

1. Informations générales
Pour démarrer ce projet, vous êtes libre d'utiliser Docker ou non. Dans cette documentation, nous verrons plusieurs méthodes pour lancer le projet facilement.

2. Projet (sans Docker)
2.1 Prérequis
NodeJS (version 12.18)
Yarn
Si vous travaillez avec plusieurs versions de NodeJS, nous vous recommandons d'installer nvm. Cet outil vous permettra de gérer facilement vos versions de NodeJS.

2.2 Lancement du projet
Forkez le dépôt.
Clonez-le sur votre ordinateur.
La commande yarn vous permettra d'installer les dépendances.
La commande yarn dev vous permettra de lancer l'API micro.


3. Projet (avec Docker)
3.1 Prérequis
Docker Desktop
3.2 Démarrage du projet
La commande docker image build --no-cache -t micro-api . vous permettra de construire votre image.
La commande docker container run --name micro-api -p 3000:3000 -dt micro-api yarn vous permettra de créer votre conteneur Docker et d'exécuter votre image sur le port 3000.
La commande docker container stop micro-api vous permettra d'arrêter votre micro-API.
La commande docker container rm micro-api vous permettra de supprimer votre conteneur micro-API.
3.3 Vscode et conteneurs distants
Enfin, si vous avez VsCode, vous pouvez facilement lancer votre projet dans un environnement Docker.

Vous aurez besoin de l'extension Remote Development. Une fois cette extension installée, cliquez simplement sur le bouton Reopen in Container.

Une fois dans le conteneur, exécutez la commande yarn dev.

4. Endpoints
4.1 Endpoints disponibles
Ce projet comprend quatre endpoints que vous pourrez utiliser :

http://localhost:3000/user/${userId} - récupère les informations d'un utilisateur. Ce premier endpoint inclut l'ID de l'utilisateur, les informations de l'utilisateur (prénom, nom et âge), le score du jour (todayScore) et les données clés (calories, macronutriments, etc.).
http://localhost:3000/user/${userId}/activity - récupère l'activité quotidienne d'un utilisateur avec les kilogrammes et les calories.
http://localhost:3000/user/${userId}/average-sessions - récupère les sessions moyennes d'un utilisateur par jour. La semaine commence le lundi.
http://localhost:3000/user/${userId}/performance - récupère la performance d'un utilisateur (énergie, endurance, etc.).
Attention, actuellement seuls deux utilisateurs ont été simulés. Ils ont respectivement les userId 12 et 18.

4.2 Exemples de requêtes
http://localhost:3000/user/12/performance - Récupère la performance de l'utilisateur avec l'ID 12.
http://localhost:3000/user/18 - Récupère les informations principales de l'utilisateur 18.