# Frontend

## Webpack

Le bunlder qui est utilisé est Webpack.

## Babel

La transpilation est effectué par Babel. Nous utilisons un ensemble de de preset. 
Le [preset-env](https://babeljs.io/docs/en/babel-preset-env) qui permet de transpiler du javascript vers un niveau de support des navigateurs.

## Debug dans la console

### Source Map

Un source map est une relation entre le code source ecrit et le code source transpilé ce qui permet d'avoir dans la devtool la ligne de code ecrite et non celle transpilé. 

Pour plus d'information et l'activer [webpack#devtool](https://webpack.js.org/configuration/devtool/#devtool).