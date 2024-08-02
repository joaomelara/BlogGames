const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");
const { Model, where, or } = require("sequelize");

router.get("/admin/articles", (req, res,)=>{
    // Article.findAll({raw:true, order:[
    //     ['id','DESC']
    // ]}).then(article =>{
    //     Category.findAll({raw:true, order:[
    //         ['id','DESC']
    //     ]}).then(category =>{
    //         res.render("admin/articles/index",{
    //             article:article,
    //             category:category
    //         })
    //     })
    // })

    Article.findAll({ include:[{model:Category}]},
        {raw:true, order:[
        ['id','DESC']
    ]}).then(article =>{
        res.render("admin/articles/index",{
            article:article,    
        })
    })
  
});   

router.get("/admin/articles/new", (req, res,)=>{
    Category.findAll({raw:true, order:[
        ['id','DESC']
    ]}).then(category=>{
        res.render("admin/articles/new",{
            category:category,
        });
    })
    
});

router.post("/articles/save", (req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

  
            Article.create({
                title:title,
                slug: slugify(title),
                body:body,
                categoryId: category,
            }).then(()=>{
                res.redirect("/admin/articles");
            });
        
    
    
});

router.post("/articles/delete", (req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id:id,
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })
        }else{//NAO FOR NUMERO
            res.redirect("/admin/articles");
        }
    }else{//NAO FOR NULL
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req,res)=>{
    var id = req.params.id;

    Article.findByPk(id, {include: [{model: Category}]})
    .then(article =>{
        if(article != undefined){
            Category.findAll({raw:true, order:[['id','DESC']]}).then(category => {
                res.render("admin/articles/edit", {
                    article:article,
                    category:category,
                })
            })
        
        }else{
            res.redirect("/admin/articles");
        };
    }).catch(error =>{
        res.redirect("/admin/articles")
        console.log("Deu um erro diferenciado aqui ó: " + error)
    });
});

router.post("/articles/update", (req, res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;
    var slug = slugify(title);

    Article.update({title: title, body:body, categoryId: categoryId, slug:slug}, {where: {id: id}}).then(() => {
        res.redirect("/admin/articles")
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num;

    if(isNaN(page)|| page==1 ) {
        offset = 0;
    }
    else{
        offset = parseInt(page- 1) * 4;
    }

    Article.findAndCountAll({ //rows indica a lista de artigos
        limit: 4,
        offset: offset,
        order:[
            ['id','DESC']
        ]
    }).then(articles =>{

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result ={
            page: parseInt(page),
            next: next,
            articles:articles,
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result:result, categories:categories})
        })
        
    })
})


module.exports = router;