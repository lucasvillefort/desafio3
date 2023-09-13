// 1 - npm init -y
// 2 - npm install express pg (express + pg) create a server and use it to connected to database
// 3 - npm install -D nodemon => to let the server always on
// 4 - npm install axios => to connection an API with another
//                       => to use it in the controllers to access a database
// 5 - npm install qs =>
// 6 - npm install bcrypt => to create a hash to a password and to Authentication an users
// 7 - npm install jsonwebtoken => to allow that an Authentic user can to do something within the database


const express = require('express')
const routes = require('./routes/routes.js')


const app = express()
app.use(express.json())
app.use(routes)
app.listen(3000)