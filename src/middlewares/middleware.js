const databaseConnection = require('../connection/databaseConnection')

const fieldsValidation = (req, res, next) => {
    const { nome, email, senha } = req.body
    const requested_keys_array = Object.keys(req.body)
    if (!nome || !email || !senha) {
        return res.status(400).json({ response: 'voce precisa colocar os campos: nome, email, senha somente' })
    }
    const mailFields = ["nome", "email", "senha"]
    for (let check_key of requested_keys_array) {
        if (mailFields.includes(check_key) === false) {
            return res.status(400).json({
                mensagem: 'Voce colocou outros parametros alem dos permitidos. Por favor, tente novamente.'
            })
        }
    }

    next()
}

const fieldsValidationToLogin = (req, res, next) => {
    const { email, senha } = req.body
    const requested_keys_array = Object.keys(req.body)
    const mailFields = ["email", "senha"]
    for (let check_key of requested_keys_array) {
        if (mailFields.includes(check_key) === false) {
            return res.status(400).json({
                mensagem: 'Voce colocou outros parametros alem dos permitidos. Por favor, tente novamente.'
            })
        }
    }

    next()
}

const withoutParamsQuery = (req, res, next) => {
    const queryParametryArray = Object.keys(req.query)
    if (queryParametryArray.length > 0) {
        return res.status(400).json({
            mensagem: 'Voce colocou  parametros query proibidos. Por favor, tente novamente.'
        })
    }
    next()
}

const withoutParamsBody = (req, res, next) => {
    const queryParametryBodyArray = Object.keys(req.body)
    if (queryParametryBodyArray.length > 0) {
        return res.status(400).json({
            mensagem: 'Voce colocou parametros no corpo proibidos. Por favor, tente novamente.'
        })
    }
    next()
}
module.exports = { fieldsValidation, fieldsValidationToLogin, withoutParamsQuery, withoutParamsBody }
