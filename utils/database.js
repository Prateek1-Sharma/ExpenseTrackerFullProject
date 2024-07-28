const sequelize=require("sequelize");
const db=new sequelize("fullexpenses","root","Prateek@my2000",{
    dialect:"mysql",
    host:"localhost"
})
module.exports=db;