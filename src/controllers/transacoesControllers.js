const databaseConnection = require('../connection/databaseConnection.js')
const { returnIdToken, withoutOtherParamsBody } = require('../middlewares/functions.js')


const listartransacoesDoUsuarioLogado = async (req, res) => {
    const { filtro } = req.query
    if (!filtro) {
        return res.status(400).json({ Response: "parametro query errado ou nao foi colocado. Por favor, tente novamente" })

    }
    try {
        const { id } = req.usuario
        if (isNaN(id)) {
            return res.status(404).json({ Response: "<id> nao identificado no banco de dados ao tentar listar as transacoes do usuario" })
        }
        // ------------------------------------------------------------------------------------------------------------


        if (typeof (filtro) === "string") {
            const foundCategory = await databaseConnection.query(
                `select * from categorias
                 where descricao = $1;`, [filtro])
            if (foundCategory.rowCount < 1) {
                return res.status(400).json({ Response: "Categoria nao encontrada em nosso banco de dados." })
            } else {
                const foundTrasacoes = await databaseConnection.query(
                    `select t.id,t.tipo,t.descricao,t.valor,t.data,t.usuario_id,t.categoria_id, c.descricao as categoria_nome from transacoes t
                     join categorias c
                     on  t.categoria_id = c.id
                     where t.usuario_id = $1 and c.descricao = $2;`, [id, filtro])
                if (foundTrasacoes.rowCount < 1) {
                    return res.status(200).json({ Response: "Nenhuma transacao dessa categoria foi encontrada para esse usuario logado" })

                }
                return res.status(200).json(foundTrasacoes.rows)
            }
        } else {
            for (let categoria of filtro) {
                const foundCategory = await databaseConnection.query(
                    `select * from categorias
                     where descricao = $1;`, [categoria])
                if (foundCategory.rowCount < 1) {
                    return res.status(400).json({ Response: "Uma das categorias colocadas nao foi localizada em nosso banco de dados." })
                }
            }

            const ArrayFiltro = []
            for (let filter of filtro) {
                const foundTrasacoes = await databaseConnection.query(
                    `select t.id,t.tipo,t.descricao,t.valor,t.data,t.usuario_id,t.categoria_id, c.descricao as categoria_nome from transacoes t
                     join categorias c
                     on  t.categoria_id = c.id
                     where t.usuario_id = $1 and c.descricao = $2;`, [id, filter])

                if (foundTrasacoes.rowCount < 1) {
                    return res.status(200).json({ Response: "Nenhuma transacao dessas categorias foi encontrada para esse usuario logado" })
                }
                for (let foundTransation of foundTrasacoes.rows) {
                    ArrayFiltro.push(foundTransation)
                }
            }

            return res.status(200).json(ArrayFiltro)
        }
        //--------------------------------------------------------------------------------------------------------------------
    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar listar as transacoes dos usuarios logado. Entre em contato mais tarde" })
    }
}

const detalharUmaTransacaoPorId = async (req, res) => {
    const idTransacao = req.params.id

    try {
        const { id } = req.usuario
        if (isNaN(id)) {
            return res.status(404).json({ Response: "<id> nao identificado no banco de dados ao tentar listar as transacoes do usuario" })
        }
        const foundTrasacoes = await databaseConnection.query('select * from transacoes where usuario_id = $1 and categoria_id = $2', [id, Number(idTransacao)])
        if (foundTrasacoes.rowCount < 1) {
            return res.status(404).json({ Response: "A transacoes requerida dessa categoria nao consta em nosso banco de dados para esse usuario logado ou nao faz parte do sistema" })
        }
        return res.status(200).json(foundTrasacoes.rows)
    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar listar a transacao. Entre em contato mais tarde" })
    }
}

const cadastrarTransaçãoDoUsuarioLogado = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ Response: "E necessario colocar os campos obrigatorios: descricao, valor, data, categoria_id e tipo " })

    }
    const requested_keys_array = Object.keys(req.body)
    const mailFields = ["descricao", "valor", "data", "categoria_id", "tipo"]

    try {
        const resultedParams = await withoutOtherParamsBody(requested_keys_array, mailFields)
        if (resultedParams === false) {
            return res.status(400).json({
                mensagem: 'Voce colocou outros parametros alem dos permitidos. Por favor, tente novamente.'
            })
        }
        const { id } = req.usuario
        const trasacoes = await databaseConnection.query('insert into transacoes (tipo,descricao,valor,data,categoria_id, usuario_id) values ($1,$2,$3,$4, $5, $6) RETURNING *', [tipo, descricao, valor, data, categoria_id, id])
        return res.status(200).json(trasacoes.rows)
    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar cadastrar a transacao. Entre em contato mais tarde" })
    }

}

const atualizarTransacaoDoUsuario = async (req, res) => {
    const idDaTransacao = req.params.id
    const requested_keys_array = Object.keys(req.body)
    const mailFields = ["descricao", "valor", "data", "categoria_id", "tipo"]

    const { descricao, valor, data, categoria_id, tipo } = (req.body)

    try {
        const resultedParams = await withoutOtherParamsBody(requested_keys_array, mailFields)
        if (resultedParams === false) {
            return res.status(400).json({
                mensagem: 'Voce colocou outros parametros alem dos permitidos. Por favor, tente novamente.'
            })
        }
        const { id } = req.usuario
        const trasacoes = await databaseConnection.query('select * from transacoes where usuario_id = $1 and id=$2', [id, Number(idDaTransacao)])
        if (trasacoes.rowCount === 0) {
            return res.status(400).json({ Response: "Nenhuma transacao com esse id foi encontrada para ser atualizada do usuario" })
        }
        if (descricao) {
            let AtualizacaoTransacao = await databaseConnection.query('UPDATE transacoes set descricao = $1 where usuario_id = $2 and  id = $3', [descricao, id, Number(idDaTransacao)])
        }
        if (valor) {
            let AtualizacaoTransacao = await databaseConnection.query('UPDATE transacoes set valor = $1 where usuario_id = $2 and  id = $3', [valor, id, Number(idDaTransacao)])

        }
        if (data) {
            let AtualizacaoTransacao = await databaseConnection.query('UPDATE transacoes set data = $1 where usuario_id = $2 and  id = $3', [data, id, Number(idDaTransacao)])

        }
        const idCategoria = await databaseConnection.query('select * from categorias where "id" = $1', [categoria_id])
        console.log(idCategoria)

        if (idCategoria.rowCount < 1) {
            return res.status(400).json({ Response: "O id da categoria nao foi identificado. por favor coloque outro" })
        }
        let AtualizacaoTransacao = await databaseConnection.query('UPDATE transacoes set categoria_id = $1 where usuario_id = $2 and  id = $3 RETURNING *', [categoria_id, id, Number(idDaTransacao)])

        if (tipo) {
            let tipos = tipo.toLowerCase()
            if (["entrada", "saida"].includes(String(tipos)) == false) {
                console.log(tipo.toLowerCase())

                return res.status(400).json({ Response: "O tipo so pode ser entrada ou saida." })
            }
            let AtualizacaoTransacao = await databaseConnection.query('UPDATE transacoes set tipo = $1 where usuario_id = $2 and  id = $3', [tipo.toLowerCase(), id, Number(idDaTransacao)])

        }

        const updateTrasacoes = await databaseConnection.query('select * from transacoes where usuario_id = $1 and id=$2', [id, Number(idDaTransacao)])
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar atualizar a transacao. Entre em contato mais tarde" })
    }
}

const excluirTransacaoDoUsuario = async (req, res) => {
    const idDaTransacao = req.params.id
    const { authorization } = req.headers
    const splitedToken = authorization.split(' ')[1]
    const id = await returnIdToken(splitedToken)

    try {
        const trasacoes = await databaseConnection.query('select * from transacoes where  id=$1', [Number(idDaTransacao)])
        if (trasacoes.rowCount < 1) {
            return res.status(400).json({ Response: "Tal transacao  nao existe em nosso  banco de dado" })
        }
        if (trasacoes.rows[0].usuario_id !== id) {
            return res.status(400).json({ Response: "Tal transacao nao pertence ao usuario logado." })
        }
        const excluindoTransacao = await databaseConnection.query('delete from transacoes where  id=$1 RETURNING *', [Number(idDaTransacao)])
        return res.status(200).json()

    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar excluir a transacao." })
    }
}


const obterExtratoDeTransacoes = async (req, res) => {

    const { id } = req.usuario
    try {
        const sumTodasEntradasSaidas = await databaseConnection.query('SELECT tipo, sum(valor) FROM transacoes where usuario_id = $1 GROUP BY tipo', [id])
        if (sumTodasEntradasSaidas.rows[0].tipo === "entrada") {
            return res.status(200).json({
                "entrada": sumTodasEntradasSaidas.rows[0].sum,
                "saida": sumTodasEntradasSaidas.rows[1].sum
            })
        } else {
            return res.status(200).json({
                "entrada": sumTodasEntradasSaidas.rows[1].sum,
                "saida": sumTodasEntradasSaidas.rows[0].sum
            })
        }

    } catch (error) {
        return res.status(500).json({ Response: "Erro sistemico ao tentar ter o extratos das transacoes. Entre em contato mais tarde" })
    }
}


module.exports = {
    listartransacoesDoUsuarioLogado,
    detalharUmaTransacaoPorId,
    cadastrarTransaçãoDoUsuarioLogado,
    atualizarTransacaoDoUsuario,
    excluirTransacaoDoUsuario,
    obterExtratoDeTransacoes
}