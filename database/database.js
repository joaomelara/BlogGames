const Sequelize = require("sequelize");
const connection = new Sequelize("bloggames", 'joaop','fbradescod',{
    host: 'localhost',
    dialect: "mysql",
    timezone: "-03:00",
})

module.exports = connection;