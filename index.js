const express=require("express") //frame work for node.js
const app=express() //calling frame work to access all methods
const port=3334 //port number for server
const db=require('./db') //to know the database connect or not
const importedUsers = require("./Schema") //importing schema model
const bcrypt = require('bcryptjs'); // password bcryptjs and save into the database
const cors = require("cors"); // cross origin resource share
const status = require("statuses")
require("dotenv").config() // calling dotenv file to access variables
const jwt=require("jsonwebtoken") // for generating token
const middleware=require("./middleware") //imported route function by middleware variable
app.use(cors()); //middleware
app.use(express.json());//middleware to send response to user UI



app.post('/register', async(req,res)=>{ 
    const {userName,emailId,password,ConfirmPassword}=req.body
    console.log(req.body)
  if (!userName || !emailId || !password || !ConfirmPassword){
  return  res.json({
        ok:false,
        status:400,
        message:"all fields are mandatory to filled"
    })
    }
       
    if(password !== ConfirmPassword){
return res.json({
    status:400,
    message:"password are not matched"
})
    } 

const existingEmailId= await importedUsers.findOne({emailId})
if(existingEmailId){
   return res.json({
        status:400,
        ok:false,
        message:"This emailId is already registered, try with the new emailId"
    })
}
// return word is mandatory for every response else it will through the error
// deployment will be success but from frontend will not work properly
// so return word is mandatory

const hashPassword=await bcrypt.hash(password,10)

const savingUser= new importedUsers({
    userName,
    emailId,
    password:hashPassword
})
 await savingUser.save()
 return res.status(200).json({
    ok: true,
    message: "User successfully registered.",
  });
})

app.post('/login',async(req,res)=>{
    const {emailId,password}=req.body
if(!emailId || !password){
   return res.json({
        status:400,
        ok:false,
        message:"all fields are mandatory to fill"
    })
}
    const existingEmailId= await importedUsers.findOne({emailId})
    if(!existingEmailId){
      return  res.json({
            status:400,
            ok:false,
           message:"The entered email Id is not registered try with another emailId"
        })
      }

const passwordDecode= await bcrypt.compare(password,existingEmailId.password)
if(!passwordDecode){
   return res.json({
        ok:false,
        status:400,
        message:"password is incorrect"})
}

const payload={
    id:existingEmailId.id
}
const token = jwt.sign(payload, process.env.secret_key, { expiresIn: "10h" });
if(token){
  return  res.json({
        ok:true,
        status:200,
        message:token

    })
}

})

// not protected route
app.get('/about', middleware,(req, res) => {
    return res.json({
      message: "Please be in touch our website is being in finalized you will  notified after the completion                      Regarding: KATKAM VAMSHIKRISNA Thank you visit again 🤝 🤝 🤝"
    });
  });
  //use "middleware" directly because we are not accessing particular function
  //from middleware.js file there is only 1 function so use directly 
  //with imported variable name

app.listen(port,(error)=>{
    if(error){
        console.log("server is not connected")
    }else{
      console.log(`server is connected running at ${port} number`)
    }
})