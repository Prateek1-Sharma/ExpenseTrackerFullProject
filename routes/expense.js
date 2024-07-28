const express=require("express");
const router=express.Router();
const expenseController=require("../controllers/expense")
const auth=require("../middleware/auth");

router.post("/userSignup",expenseController.addUser)
router.post("/user/login",expenseController.loginUser)
router.post("/add/expenses",auth,expenseController.addExpense)
router.get("/get/allExpenses",auth,expenseController.getExpenses)
router.delete(`/:id/deleteExpenses`,expenseController.deleteExpense)
router.get("/buyPremium",auth,expenseController.buyPrime)
router.post("/updateStatus",auth,expenseController.transactionStatus)
module.exports=router