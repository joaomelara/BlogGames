const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define("articles", {
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    body:{
        type: Sequelize.TEXT,
        allowNull:false,
    }
});
Category.hasMany(Article); //relacionamento 1 para muitos
Article.belongsTo(Category); //relacionamente 1p1

// Article.sync({force:true});



module.exports = Article;