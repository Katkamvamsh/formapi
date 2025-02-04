const mongoose = require('mongoose');
require("dotenv").config()
const uri= process.env.URI

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);  // Log the error
  });
   module.exports=mongoose