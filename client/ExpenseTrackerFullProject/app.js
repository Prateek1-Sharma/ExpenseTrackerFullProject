const express=require("express");
const app=express();
const bodyParser=require("body-parser")
const cors=require("cors");
const expenseRoutes=require("./routes/expense");
const dbConnect=require("./utils/database")
const user=require("./models/user");
app.use(cors());
app.use(bodyParser.json());
app.use(expenseRoutes);
dbConnect.sync().then(()=>{
    app.listen(4000);
    console.log("Databse Connected");    
})