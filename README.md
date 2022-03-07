# Projet Javascript

## Structure du projet

Le fichier ``docker-compose.yml`` permet de lancer un un certain nombre de containers docker.

* Le conteneur ``proxy`` est un proxy http. La solution utilisé est [nginx](https://www.nginx.com/)

## Lancer le projet

Pour lancer le projet vous devez copier coller le fichier ``.env.sample`` en ``.env`` et le complèter avec les bonnes valeurs. 

Pour lancer le projet vous allez devoir executer la commande ``docker-compose up --build``