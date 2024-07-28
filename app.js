const express=require("express");
const app=express();
const bodyParser=require("body-parser")
const cors=require("cors");
const expenseRoutes=require("./routes/expense");
const dbConnect=require("./utils/database")
const user=require("./models/user");
const expense=require('./models/expense')
const order=require("./models/orders")
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(expenseRoutes);
expense.belongsTo(user);
user.hasMany(expense);
user.hasMany(order);
order.belongsTo(user);
dbConnect.sync().then(()=>{
    app.listen(4000);
    console.log("Databse Connected");    
})