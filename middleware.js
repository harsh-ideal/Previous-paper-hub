module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('login_plzz',"You are not loggedin, Plzz Login First");
        return res.redirect('/pph/vip-login');
    }
    next();
}