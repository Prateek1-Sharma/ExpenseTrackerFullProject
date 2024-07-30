const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Filelink = sequelize.define('filelink',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    fileURl:{
        type:Sequelize.STRING,
        allowNull:false
    }
    
})
module.exports=Filelink;