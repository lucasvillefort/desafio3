const express = require('express')
const { cadastrarUsuario, loginUsuario } = require('../controllers/usersController.js')
const { detalharUsuario, atualizarUsuario, listarCategorias } = require('../controllers/requestControllers.js')
const { listartransacoesDoUsuarioLogado, detalharUmaTransacaoPorId, cadastrarTransaçãoDoUsuarioLogado, atualizarTransacaoDoUsuario, excluirTransacaoDoUsuario, obterExtratoDeTransacoes } = require('../controllers/transacoesControllers.js')
const { fieldsValidation, fieldsValidationToLogin, withoutParamsQuery, withoutParamsBody } = require('../middlewares/middleware.js')
const tokenValidation = require('../validation/tokenValidation.js')

const routes = express()

routes.post('/usuario', fieldsValidation, cadastrarUsuario)
routes.post('/login', fieldsValidationToLogin, withoutParamsQuery, loginUsuario) // need to be logged to create a token that will be used for verify other request

routes.use(tokenValidation) // it is here to verify every request made the following:

routes.get('/usuario', withoutParamsQuery, withoutParamsBody, detalharUsuario)
routes.put('/usuario', withoutParamsQuery, fieldsValidation, atualizarUsuario)

routes.get('/categoria', withoutParamsQuery, withoutParamsBody, listarCategorias)

routes.get('/transacao', withoutParamsBody, listartransacoesDoUsuarioLogado)
routes.get('/transacao/extrato', withoutParamsQuery, withoutParamsBody, obterExtratoDeTransacoes)
routes.get('/transacao/:id', withoutParamsQuery, withoutParamsBody, detalharUmaTransacaoPorId)
routes.post('/transacao', withoutParamsQuery, cadastrarTransaçãoDoUsuarioLogado)
routes.put('/transacao/:id', withoutParamsQuery, atualizarTransacaoDoUsuario)
routes.delete('/transacao/:id', withoutParamsQuery, withoutParamsBody, excluirTransacaoDoUsuario)


module.exports = routes