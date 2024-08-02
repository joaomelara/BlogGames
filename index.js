const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const userController = require("./user/userController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

//const { Model, where } = require("sequelize");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


connection.authenticate().then(()=>{
    console.log("Conexão feita com sucesso");
}).catch((error)=>{
    console.log("Deu erro na conexão");
    console.log(error);
})

app.use("",categoriesController);
app.use("",articlesController);
app.use("",userController);


app.get("/", (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
        raw: true,
        order: [["id", "DESC"]], // Correcting the order array syntax
        limit: 4
    }).then(articles => {
        Category.findAll({
            raw: true,
        }).then(categories => {
            res.render("index", {
                articles: articles,
                categories: categories
            })
        });
    });
});

app.get("/:slug", (req, res)=>{
    var slug = req.params.slug;

    Article.findOne({
        where: {slug: slug},
    }).then(article =>{
        Category.findOne({})
        if(article != undefined){
            Category.findAll({
                raw: true,
            }).then(categories => {
                res.render("article", {
                    article: article,
                    categories: categories
                })
            });
        }else{
            res.redirect("/");
        }

    }).catch(err =>{
        res.redirect("/");
    });
});

app.get("/category/:slug", (req,res)=>{
    var slug = req.params.slug;

    Category.findOne({
        where:{slug: slug},
        include: [{model: Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{
                    articles: category.articles, categories: categories
                })
            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
});

app.listen(8080, ()=>{
    console.log("O servidor está rodando");
});