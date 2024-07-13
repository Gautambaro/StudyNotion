const mongoose = require("mongoose");
require("dotenv").config()

exports.databaseConnect=()=>{
    mongoose.connect(process.env.Database_url,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    })
    .then(console.log("database connection is successfull"))
    .catch((erro)=>{
        console.log(erro);
        console.log("issue with database connection")
        process.exit(1)
    })
}
