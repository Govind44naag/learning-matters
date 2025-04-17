const express=require('express')
const mongoose=require('mongoose')
const zod=require('zod')
const app=express()
const port=3000
app.use(express.json())
mongoose.connect('mongodb+srv://adminid:<password>@cluster0.axtzb.mongodb.net/test')

const User=mongoose.model('User',{name:String,email:String,password:String})
const userSchema=zod.object({
        name:zod.string(),
        username:zod.string().email(),
        password:zod.string().min(5),
})

app.post('/signup',async function(req,res){
        const response=userSchema.safeParse(req.body)
        //check for response
        if(!response.success){
                return res.status(400).json({
                        err:response.error.errors,
                })
        }
        //check user exist in database or not
        const existance=await User.findOne({email:response.data.username})
        if(existance){
                return res.status(409).json({
                        msg:"User is already exist ,please try again!",
                        success:false,
                })
                }
        const user=new User({
                name:response.data.name,
                email:response.data.username,
                password:response.data.password,
        })
        await user.save()
        res.status(201).json({
                message:"signup has done yet!",
        })
})
//global cache
app.use(function(err,req,res,next){
        console.log(err)
        res.status(400).json({
                msg:"Invalid Input Structure",
                success:false,
        })
})
app.listen(port,()=>{
        console.log(`Server is running on port number ${port}`)
})
