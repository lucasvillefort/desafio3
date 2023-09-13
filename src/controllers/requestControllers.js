const databaseConnection = require('../connection/databaseConnection.js')
const jwt = require('jsonwebtoken')
const senhajwt = require('../senhajwt.js')
const bcrypt = require('bcrypt'); // to create the hash of password

const detalharUsuario = async (req, res) => {
    const { senha: notToShow, ...userToShow } = req.usuario
    return res.status(200).json(userToShow)
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const { id } = req.usuario
        const foundUserWithNewEmail = await databaseConnection.query('select * from usuarios where email = $1', [email])
        if (foundUserWithNewEmail.rowCount > 0) {
            return res.status(400).json({ Response: "O e-mail informado já está sendo utilizado por um usuário." })
        }
        const newCryptPassword = await bcrypt.hash(senha, 10)
        const alteredUser = await databaseConnection.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 returning *', [nome, email, newCryptPassword, id])
        const { senha: NotShow, ...update } = alteredUser.rows[0]
        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar atualizar o cadastro. Entre em contato mais tarde" })
    }
}

const listarCategorias = async (req, res) => {
    try {
        const allCategory = await databaseConnection.query('select * from categorias')
        if (allCategory.rowCount < 1) {
            return res.status(404).json({ Response: "Nao ha categorias listadas" })
        }
        return res.status(200).json(allCategory.rows)
    } catch (error) {
        return res.status(500).json({ Response: "Houve algum erro sistemico ao tentar listar as categorias" })
    }



}



module.exports = {
    detalharUsuario,
    atualizarUsuario,
    listarCategorias,

}