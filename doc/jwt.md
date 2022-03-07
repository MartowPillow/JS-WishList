# JWT

## Présentation

Pour l'authentification vous allez utiliser un token JWT. 
Un JWT est un token qui est envoyé par le client pour identifier un utilisateur.

Voici un example de JWT.

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTY0MTU5MjEwOCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.UJw1b6vg0yeJodm-acFcd1oddN0Etq26IQhJQGcq03g
```

Voici le payload du **JWT** decodé.

``` json
{
  "iss": "localhost:10200",
  "iat": 1610056108,
  "exp": 1641592108,
  "aud": "localhost:10200",
  "sub": "0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
}
```

L'attribut ``sub`` correspond à l'ID de l'utilisateur.

Ce jwt est signé par la clé symétrique ``qwertyuiopasdfghjklzxcvbnm123456``. Ce secret est present en variable
d'enviornement ``JWT_SECRET`` dans le container ``back``.

Le client doit envoyer ce JWT dans le header HTTP ``Authorization``.
Voici un exemple avec le JWT :
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTY0MTU5MjEwOCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.UJw1b6vg0yeJodm-acFcd1oddN0Etq26IQhJQGcq03g
```

## express-jwt

La lib  est un middleware express. Vous trouverez la doc d'utilisation [ici](https://github.com/auth0/express-jwt#readme).