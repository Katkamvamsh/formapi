const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  userName: {
    required: true,
    type: String,  // Use String instead of stringify
        // Use unique: true for uniqueness
  },
  
  emailId: {
    required: true,
    type: String,  // Use String instead of stringify
    unique: true    // Use unique: true for uniqueness
  }, 
  
  password: {
    required: true,
    type: String,  // Use String instead of stringify
       // Use unique: true for uniqueness
  }
});

const exportedUsers = mongoose.model("User", userSchema);  // Create a model from the schema

module.exports = exportedUsers
