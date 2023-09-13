const databaseConnection = require('../connection/databaseConnection')
const bcrypt = require('bcrypt'); // to create the hash of password
const jwt = require('jsonwebtoken') // to create a token (assignature) to allow a user do something
const senhajwt = require('../senhajwt.js') // this password is necessary to validation the creation of the token


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({ response: 'voce precisa colocar os campos: nome, email, senha somente' })
    }
    try {

        const foundEmail = await databaseConnection.query('select email from usuarios where email = $1', [email])
        if (foundEmail.rowCount > 0) {
            return res.status(400).json({
                "mensagem": "Já existe usuário cadastrado com o e-mail informado."
            })
        }

        const encryptedPassword = await bcrypt.hash(senha, 10)
        const newUser = await databaseConnection.query('insert into usuarios (nome, email, senha) values ($1, $2, $3)', [nome, email, encryptedPassword])
        const resToRequest = await databaseConnection.query('select id, nome, email from usuarios where email = $1', [email])
        return res.status(201).json(resToRequest.rows[0])
    } catch (error) {
        return res.status(500).json({ response: 'erro inexperado ao tentar cadastrar usuario. tente novamente' })
    }
}


const loginUsuario = async (req, res) => {
    const { email, senha } = req.body
    if (!email || !senha) {
        return res.status(400).json({ response: 'voce precisa colocar os campos: email e senha somente' })
    }
    try {
        const founduser = await databaseConnection.query('select * from usuarios where email = $1', [email])
        if (founduser.rowCount < 1) {
            return res.status(404).json({ response: 'usuario ou senha incorretos. tente novamente' })
        }
        const validPassword = await bcrypt.compare(senha, founduser.rows[0].senha)
        if (!validPassword) {
            return res.status(400).json({ response: "usuario ou senha incorretos. tente novamente " })
        }

        const tokenToUser = jwt.sign({ id: founduser.rows[0].id, nome: founduser.rows[0].email }, senhajwt, { expiresIn: '10h' })
        const { senha: notToUse, ...dataToUse } = founduser.rows[0]
        return res.json({ usuario: dataToUse, token: tokenToUser })
    } catch (error) {
        return res.status(500).json({ response: 'Erro inexperado ao tentar logar' })
    }

}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}