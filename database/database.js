const Sequelize = require("sequelize");
const connection = new Sequelize("bloggames", 'root','fbradesco',{
    host: 'localhost',
    dialect: "mysql",
})

module.exports = connection;