const bodyParser = require('body-parser')
const express = require('express')
const connection = require('./database/database')


// Models
const PerguntaModel = require('./database/Pergunta')
const RespostaModel = require('./database/Resposta')


// Database Connection
connection.authenticate().then(() => {
	console.log('Conexão com banco de dados realizada com sucesso');
}).catch(err => {
	console.log(err);
})


const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())


// Routes
app.get('/', (req, res) => {
	PerguntaModel.findAll({
		raw: true,
		order: [
			['id', 'DESC']
		]
	}).then(perguntas => {
		res.render('index', {
			perguntas
		})
	})
})

app.get('/perguntar', (req, res) => {
	res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
	let titulo = req.body.titulo
	let descricao = req.body.descricao
	PerguntaModel.create({
		titulo,
		descricao
	}).then(() => res.redirect('/'))
})

app.get('/pergunta/:id', (req, res) => {
	let idPergunta = req.params.id
	PerguntaModel.findOne({
		where: {
			id: idPergunta
		},
		raw: true
	}).then(pergunta => {
		if (pergunta != undefined) {
			RespostaModel.findAll({
				where: {
					perguntaId: pergunta.id
				},
				order: [
					['id', 'DESC']
				],
				raw: true
			}).then(respostas => {
				res.render('pergunta', {
					pergunta,
					respostas
				})
			})
		} else {
			res.redirect('/')
		}
	})
})

app.post('/responder', (req, res) => {
	let corpo = req.body.corpo
	let perguntaId = req.body.pergunta
	RespostaModel.create({
		corpo,
		perguntaId
	}).then(() => {
		res.redirect('/pergunta/' + perguntaId)
	}).catch(() => {
		res.redirect('/')
	})
})

app.listen(80, () => {
	console.log('Servidor rodando')
})