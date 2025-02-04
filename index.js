const express=require("express")
const app=express()
const port=3334
const db=require('./db')
const importedUsers = require("./Schema")
const bcrypt = require('bcryptjs');
const cors = require("cors");
const status = require("statuses")
require("dotenv").config()
const jwt=require("jsonwebtoken")
app.use(cors()); 
app.use(express.json());

app.post('/register', async(req,res)=>{ 
    const {userName,emailId,password,confirmPassword}=req.body
    console.log(req.body)
  if (!userName || !emailId || !password || !confirmPassword){
    res.json({
        ok:false,
        status:400,
        message:"all fields are mandatory to filled"
    })
    }
       
    if(password !== confirmPassword){
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

const hashPassword=await bcrypt.hash(password,10)

const savingUser= new importedUsers({
    userName,
    emailId,
    password:hashPassword
})
 await savingUser.save()
 return res.status(200).json({
    success: true,
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


app.listen(port,(error)=>{
    if(error){
        console.log("server is not connected")
    }else{
      console.log(`server is connected running at ${port} number`)
    }
})