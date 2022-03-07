const express = require('express')
const app = express()

const jwt = require('express-jwt');
const require_jwt = true;
app.use(jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: require_jwt
  }));

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const routers = require('./index')
app.use(`/${process.env.SUBJECT}`, routers)

const PORT = process.env.BACKEND_PORT
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})