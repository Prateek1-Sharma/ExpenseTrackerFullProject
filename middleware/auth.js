const jwt=require("jsonwebtoken");
const User=require("../models/user");

const auth=async(req,res,next)=>{ 
    const token=req.header("Authorization");
    const user=jwt.verify(token,"Prateek");
    // console.log("hello this is JWT Token",user);
    console.log("TOKEN USER ID",user.userId);

    User.findByPk(user.userId).then((res)=>{
        console.log("response",res);
        req.user=res;
        next();
    })

}

module.exports=auth;
