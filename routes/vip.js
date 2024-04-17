const express=require("express");
const router=express.Router();
const Paper = require('../models/papers.js');
const Course=require('../models/course.js');
const wrapasync=require("../utils/asyncWrap.js");


router.use((req,res,next)=>{
    res.locals.current=req.user;
    next();
});

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("logout","You are logged Out");
        res.redirect("/pph");
    });
});

module.exports=router;