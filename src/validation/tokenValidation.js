// pathway to validation the token created when somone try to enter with login for can to use a route 
const databaseConnection = require('../connection/databaseConnection')
const jwt = require('jsonwebtoken')
const senhajwt = require('../senhajwt.js')

const tokenValidation = async (req, res, next) => {
    const { authorization } = req.headers
    const splitedToken = authorization.split(' ')[1]
    if (!splitedToken) {
        return res.status(401).json({ Response: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
    try {
        const { id } = await jwt.verify(splitedToken, senhajwt)
        if (!id) {
            return res.status(401).json({ Response: "acesso nao autorizado. token invalido" })
        }
        const { rowCount, rows } = await databaseConnection.query('select * from usuarios where id = $1', [id])
        if (rowCount < 1) {
            return res.status(401).json({ Response: "acesso nao autorizado. Usuario nao identificado" })
        }
        req.usuario = rows[0]
        next()
    } catch (error) {
        return res.status(500).json({ Response: "acesso nao autorizado. Erro sistemico na validacao do token" })
    }


}
module.exports = tokenValidation