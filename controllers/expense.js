const User=require("../models/user");
const Expense=require("../models/expense")
const Order=require("../models/orders")
const sequelize=require("sequelize");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Razorpay = require("razorpay");



exports.addUser=async(req,res)=>{
    
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
    
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
      }
    }    

exports.loginUser=async(req,res)=>{
  console.log("hello ");
    try {

        const { userName, userPassword } = req.body;
        console.log(req.body);
        const user = await User.findOne({ where: { email:userName } });
        console.log("this is the user after login",user);
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
    
        const isPasswordValid = await bcrypt.compare(userPassword, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
        console.log("the log in user",user.id);
        res.status(200).json({ message: 'Login successful!', token:generateJwtToken(user.id,user.name,user.isPremiumUser) });
      } 
      catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
      }

      
    }


    exports.addExpense=async(req,res)=>{
      console.log(req.body,req.user);
      console.log("this is req.user",req.user);
      const userId=req.user.id
      console.log("the user id is this",userId);
      const{amount,description,category}=req.body
      const newExpense=await Expense.create({amount,description,category,userId})
      return res.json({message:"sucessfully Saved Your Data"})
     

    }
    exports.getExpenses = async (req, res) => {
      try {
        console.log("You are in getExpenses");
        console.log(req.user.id);
        // Assuming req.user contains the authenticated user's details
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        
        if (expenses.length > 0) {
          res.status(200).json(expenses);
        } else {
          res.status(404).json({ message: "No expenses found for this user." });
        }
      } catch (error) {
        console.error("Error fetching expenses: ", error);
        res.status(500).json({ message: "An error occurred while fetching expenses." });
      }
    };
    
    exports.deleteExpense = async (req, res) => {
      try {
        const id = req.params.id;
        let deleteData = await Expense.destroy({ where: { id } });
        if (deleteData) {
          res.status(200).send({ message: `Expense with ID ${id} deleted successfully` });
        } else {
          res.status(400).send({ message: `Expense with ID ${id} not found` });
        }
        console.log(deleteData);
      } catch (err) {
        console.log("Error in delete function:", err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    };
    


    function generateJwtToken(userId, userName ,isPremiumUser){
    
      return jwt.sign({userId:userId,userName:userName,isPremiumUser:isPremiumUser},"Prateek")

    }

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

