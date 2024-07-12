const express=require("express");
const router=express.Router();
const expenseController=require("../controllers/expense")
router.post("/userSignup",expenseController.addUser)
router.post("/user/login",expenseController.loginUser)
module.exports=router