const express = require("express");
const router = express.Router();

router.get("/articles", (req, res,)=>{
    res.send("MT PAIA");
})    

router.get("/articles/new", (req, res,)=>{
    res.send("MT PAIA parte 2");
})    


module.exports = router;