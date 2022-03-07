# Windows


Pour lancer le projet vous avez besoin de : 
* **Docker Desktop**
* **Windows Subsystem for Linux** (WSL)

## Configuration de Docker Desktop

La configuration nécessaire de **Docker Desktop** :
 * Il faut que ``Use the WSL 2 based engind`` soit coché dans ``General``
 * Il faut que ``Enable integration with my default WSL distro`` soit coché dans ``Resources -> WSL INTEGRATION``
 * Il faut que que votre distribution soit activé toujous dans ``Resources -> WSL INTEGRATION``


## Verification que docker est opérationnel

Une fois votre **Docker Desktop** configuré vous pouvez lancer votre distribution dans **WSL**. 

Pour verifier que docker repond dnas votre **WSL** lancer les commandes suivantes

```
echo $DOCKER_HOST
```
Le résultat doit être vide
```
docker ps
```
Le résultat doit être
```
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

## Installation de docker-compose

Si docker-compose n'est pas installé dans votre **WSL**. il faut l'installer.

Lancer les commandes.
```
curl -L 'https://github.com/docker/compose/releases/download/1.27.4/docker-compose-Linux-x86_64' -o /usr/local/bin/docker-compose
```
```
chmod +x /usr/local/bin/docker-compose
```

## Clone du projet

Vous devez cloner le projet depuis votre **WSL**. Si vous ne le cloner pas depuis le **WSL** vous allez avoir d'encodage de fin de ligne *[plus d'info](https://fr.wikipedia.org/wiki/Carriage_Return_Line_Feed).
