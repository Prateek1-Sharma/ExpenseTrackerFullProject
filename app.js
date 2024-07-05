const express=require("express");
const app=express();
const bodyParser=require("body-parser")
const cors=require("cors");
const { log } = require("console");
app.use(cors());
app.use(bodyParser.json());
app.post("/userSignup",async(req,res)=>{
console.log(req.body);
console.log(res.statusCode);
res.send("posted sucessfully")
})

app.listen(4000,()=>{
    console.log("server running on port 4000 ");
})