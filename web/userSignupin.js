const express=require('express')
const jwt=require('jsonwebtoken')
const zod=require('zod')
const mongoose=require('mongoose')
const env=require('dotenv')
env.config()
const mongoURI=process.env.MONGO_URI
const jwtPassword=process.env.jwtPassword
const app=express()
const port=process.env.PORT || 3000

const signupSchema=zod.object({
        username:zod.string().email(),
        name:zod.string(),
        password:zod.string().min(5),
})

mongoose.connect(mongoURI)
const User= mongoose.model('User',{
        email:String,
        name:String,
        password:String,
})

app.use(express.json())

app.post('/register',async function(req,res){
        const response=signupSchema.safeParse(req.body)
        if(!response.success){
                return res.status(404).json({
                        msg:"User input is invalid",
                        success:false,
        })
        }

        const username=response.data.username
        const userExistance=await User.findOne({email:username})
        if(userExistance){
                return res.status(404).json({
                        msg:"User already exist",
                        success:false,
                })

        }
        const name=response.data.name
        const password=response.data.password

        const user=new User({
                email:username,
                name,
                password,
        })
        user.save()
        res.status(200).json({
                msg:`Congratulation ${name}! you have signup successfully!`,
        })
})
const signinSchema=zod.object({
        username:zod.string().email(),
        password:zod.string().min(5),
})
app.get('/signin',async function(req,res){
        const response=signinSchema.safeParse(req.body)
        if(!response.success){
                return res.status(400).json({
                        msg:"user input is invalid",
                        success:true,
                })
        }
        const username=response.data.username
        const password=response.data.password
        const userExistance=await User.findOne({email:username,password})
        if(!userExistance){
                return res.status(404).json({
                        msg:"user does not registered,please try again!",
                        success:false,
                })
        }
        //token creation
        const token=jwt.sign({username:username},jwtPassword)
        res.status(200).json({
                token,
        })
})

app.get('/users',async function(req,res){
        try{
                const token=req.headers.authorization
                const decoded=jwt.verify(token,jwtPassword)
                const username=decoded.username
                const allUser = await User.find({}, {email: 1, _id: 0 });

                res.status(200).json({
                        users:allUser.filter(function(value){
                                if(value.email==username){
                                        return false
                                }
                                else{
                                        return true
                                }
                        })
                })
        }
        catch(err){
                return res.status(500).json({
                        msg:"Something is wrong",
                        success:false,
                })
        }

})

app.use(function(err,req,res,next){
        res.json({
                msg:"Input Schema is invalid",
                success:false,
        })
})

app.listen(port,()=>{
        console.log(`Server is running on port number ${port}`)
})
