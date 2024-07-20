const User=require("../models/user");
const sequelize=require("sequelize");
const bcrypt=require("bcrypt");


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
        console.log(user);
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
    
        const isPasswordValid = await bcrypt.compare(userPassword, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
    
        res.status(200).json({ message: 'Login successful!', user });
      } 
      catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
      }
    }