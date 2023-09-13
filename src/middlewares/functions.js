const databaseConnection = require('../connection/databaseConnection.js')
const jwt = require('jsonwebtoken')
const senhajwt = require('../senhajwt.js')

const returnIdToken = async (splitedToken) => {
    try {
        const { id } = await jwt.verify(splitedToken, senhajwt)
        if (!id) {
            const resultado = 'Nao foi possivel verificar o id do token informado'
            return resultado
        }
        return id
    } catch (error) {
        const resultado = "Erro sistemico ao tentar excluir a transacao. Entre em contato mais tarde"
        return resultado
    }
}

const withoutOtherParamsBody = async (requested_keys_array, mailFields) => {
    for (let check_key of requested_keys_array) {
        if (mailFields.includes(check_key) === false) {
            return false
        }
    }
}

module.exports = { returnIdToken, withoutOtherParamsBody }