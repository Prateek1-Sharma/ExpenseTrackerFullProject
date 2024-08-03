const User=require("../models/user");
const Expense=require("../models/expense")
const Order=require("../models/orders")
const sequelize=require("sequelize");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Razorpay = require("razorpay");
const AWS=require('aws-sdk')
const Filelink=require("../models/filelink")

exports.buyPrime=async (req, res) => {
    try {
        const rzp = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        const order = await rzp.orders.create({ amount, currency: "INR" });
        await Order.create({orderid: order.id, status: "PENDING",userId:req.user.id})
        // await req.user.createOrder({ orderid: order.id, status: "PENDING" });
        return res.status(201).json({ order, key_id: rzp.key_id });

    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
}

exports.transactionStatus=async(req,res)=>{
    try{
    console.log(req.body);
    const userId=req.user.id
    const transactionData=await Order.update({paymentid:req.body.payment_id ,status:"SUCCESSFULL"} ,{where:{ orderid: req.body.order_id }});
    const premiumUpdate=req.user.update({isPremiumUser:true},{where:{orderid: req.body.order_id}})
    res.status(202).json({message:"transaction Sucessfull",token:generateJwtToken(userId,undefined,true)})
    }
    catch(err){
      console.log(err);
    }
  }


  function generateJwtToken(userId, userName ,isPremiumUser){
    
    return jwt.sign({userId:userId,userName:userName,isPremiumUser:isPremiumUser},"Prateek")

  }