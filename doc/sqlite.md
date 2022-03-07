# SQLite 3

## Présentation

La base de donnée utilisé est SQLite. SQLite est directement installé dans le le container **back**. 

SQLite ecrit dans un fichier. Dans le cadre du projet le chemin du fichier est dans la varaible d'environement ``DB_PATH`` du containeur **back**.

## Consulter la base de donnée

Pour consulter vous pouvez lancer la commande.

```
docker-compose exec back sh -c 'sqlite3 ${DB_PATH}'
```

Une fois dans la CLI de **sqlite3** pour pouvez executer des requêtes sql.

```
SELECT * FROM user;
```

Attention à toujours terminé vos requêtes avec un ``;``

Pour quitter la CLI de **sqlite3** il faut executer la commande ``.quit``.



## better-sqlite3

Pour initialisez votre connection à **SQLite** vous avez à disposition la lib [better-sqlite3](https://www.npmjs.com/package/better-sqlite3).

``` js
const db = require('better-sqlite3')(process.env.DB_PATH, {})
```

Il faut aussi activer le **PRAGMA** ``foreign_keys`` pour activer les clé étrangères.

``` js
db.pragma('foreign_keys = ON');
```

Pour faire une requête SQL.

``` js
const stmt = db.prepare('SELECT * FROM users');

const users = [ ...stmt.iterate()].reduce((users, user) => {
    return [...users, user]
}, []);

console.log(users)
```

Pour plus d'info, **[RTFM !](https://github.com/JoshuaWise/better-sqlite3)**