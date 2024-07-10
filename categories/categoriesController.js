const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const { where } = require("sequelize");

router.get("/admin/categories/new", (req, res,)=>{
    res.render('admin/categories/new');
});

router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if(title!=undefined){
        Category.create({
            title: title,
            slug: slugify(title),

        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new")
    }
});

router.get("/admin/categories", (req,res) => {
    Category.findAll({raw:true, order:[
        ['id','DESC']
    ]}).then(category=>{
        res.render("admin/categories/index",{
            category:category,
        });
    })
    
    
})

router.post("/categories/delete", (req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id:id,
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
        }else{//NAO FOR NUMERO
            res.redirect("/admin/categories");
        }
    }else{//NAO FOR NULL
        res.redirect("/admin/categories");
    }
});


router.get("/admin/categories/edit/:id", (req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id)
    .then(category=>{
        if(category != undefined){
            res.render("admin/categories/edit",{
                category:category,
            });
        }else{
            res.redirect("/admin/categories")
        }

        
    }).catch(error =>{
        res.redirect("/admin/categories")
        console.log("Deu um erro diferenciado aqui ó: " + error)
    })
});

router.post("/categories/update", (req, res) => {
    var title = req.body.title;
    var id = req.body.id;

    Category.update({title: title}, {where: {id: id}}).then(() => {
        res.redirect("/admin/categories")
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});



module.exports = router;