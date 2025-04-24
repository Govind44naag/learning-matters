const express=require('express')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const zod=require('zod')
const env=require('dotenv')
env.config()
const jwtPassword=process.env.SECRET_KEY
const mongoUrl=process.env.MONGO_URL
const app=express()
const port=process.env.PORT

//middleware
app.use(express.json())
//connect backend to db
mongoose.connect(url)
//create userschema

const UserSchema=new mongoose.Schema({
        name:String,
        email:String,
        password:String,
})

const User=mongoose.model('User',UserSchema)

//create input structure
const userSchema=zod.object({
        username:zod.string().email(),
        name:zod.string(),
        password:zod.string().min(4),
})

app.post('/register',async function(req,res){
        const response=userSchema.safeParse(req.body)
        //check is schema valid
        if(!response.success){
                return res.status(400).json({
                        msg:"Input is invalid!",
                }
                )
        }
        //find if user existance
        const username=response.data.username
        const userExistance=await User.findOne({email:username})
        if(userExistance){
                return res.status(404).json({
                        msg:"User is already exist, try to login",
                })
        }
        //create password hash
        const password=response.data.password
        const name=response.data.name
        const salt=10
        const hashedPassword=await bcrypt.hash(password,salt)
        const user=new User({
                name,
                email:username,
                password:hashedPassword,
        })
        //save user in database
        user.save()
        return res.status(200).json({
                msg:`Congratulation ${name}! you have register successfully!`,
        })
})

//login request
const user1Schema=zod.object({
        username:zod.string().email(),
        password:zod.string().min(4),
})
app.post('/signin',async function(req,res){
        const response=user1Schema.safeParse(req.body)
        if(!response.success){
                return res.status(400).json({
                        msg:"User input is invalid!",
                })
        }
        //create hash password
        const username=response.data.username
        const password=response.data.password
        const salt=10
        //check password are match or not
        const users=await User.findOne({email:username})
        const isSame=await bcrypt.compare(password,users.password)
        if(!isSame){
                return res.status(400).json({
                        msg:"User Password is not correct ,please try again!",
                })
        }
        //check is user exist or not in db
        const userExistance=await User.findOne({email:username})
        if(!userExistance){
                return res.status(400).json({
                        msg:"User does not exist!",
                })
        }
        //create an authentication token
        const token=jwt.sign({username},jwtPassword)
        return res.json({
                token,
        })
})

//make get request so that all users are get
app.get('/users',async function(req,res){
        try{
                const token=req.headers.authorization
                const decoded=jwt.verify(token,jwtPassword)
                const username=decoded.username

                //print users except this one
                const allUsers=await User.find()
        const exceptOne=allUsers.filter(function(value){
                        if(value.email==username){
                                return false
                        }
                        else{
                                return true
                        }
                })
                return res.status(200).json({
                        exceptOne,
                })


        }
        catch(err){
                return res.status(500).json({
                        msg:"Somethign is missing",
                })
        }
})
//global cache
app.use(function(err,req,res,next){
        res.status(500).json({
                msg:"Input body is invalid!",
                success:false,
        })
})

app.listen(port,()=>{
        console.log(`Server is running on port number ${port || 3000}`)
})
