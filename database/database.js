const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'root', {
	host: 'localhost',
	port: 3309,
	dialect: 'mariadb'
})

module.exports = connection