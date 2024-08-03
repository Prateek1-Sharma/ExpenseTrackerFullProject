const express=require("express");
const app=express();
const bodyParser=require("body-parser")
const cors=require("cors");
const expenseRoutes=require("./routes/expense");
const userRoutes=require("./routes/user")
const purchaseRoutes=require("./routes/purchase")
const premiumRoutes=require("./routes/premium ")
const dbConnect=require("./utils/database")
const user=require("./models/user");
const expense=require('./models/expense')
const order=require("./models/orders")
const Filelink=require("./models/filelink")
const Forgotpassword=require("./models/forgotpassword")
const ForgotpasswordRoutes=require("./routes/forgotpassword")
const helmet=require("helmet")
require('dotenv').config();
app.use(cors());
app.use(helmet())
app.use(bodyParser.json());
app.use("/user",userRoutes);
app.use("/expense",expenseRoutes);
app.use("/purchase",purchaseRoutes);
app.use("/premium",premiumRoutes);
app.use(ForgotpasswordRoutes);
expense.belongsTo(user);
user.hasMany(expense);
user.hasMany(order);
order.belongsTo(user);
user.hasMany(Filelink);
Filelink.belongsTo(user)
Forgotpassword.belongsTo(user);
dbConnect.sync().then(()=>{
    app.listen(4000);
    console.log("Databse Connected");    
})