const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");
const { Model } = require("sequelize");

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




module.exports = router;