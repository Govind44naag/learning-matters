//we use authentication & throw token into headers instead of direct sending username & password into headers
const express=require('express')
const jwt=require('jsonwebtoken')
const env=require('dotenv')
env.config()
const jwtPassword=process.env.SECRET_KEY
const zod=require('zod')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const app=express()
const mongoUrl=process.env.MONGO_URL
const port=process.env.PORT
app.use(bodyParser.json())
//connect mongodb
mongoose.connect(mongoUrl)
//create mongose schema

const userSchema=new mongoose.Schema({
        username:String,
        password:String,
        purchasedCourses:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
        }],
})

const adminSchema=new mongoose.Schema({
        username:String,
        password:String,
        })

const courseSchema=new mongoose.Schema({
        title:String,
        description:String,
        price:Number,
        imageLink:String,
})
//create model
const User=mongoose.model('User',userSchema)
const Admin=mongoose.model('Admin',adminSchema)
const Course=mongoose.model('Course',courseSchema)


//create zod schema
const zodSchema=zod.object({
        username:zod.string().email(),
        password:zod.string().min(5),
})
const zodCourse=zod.object({
        title:zod.string(),
        description:zod.string(),
        price:zod.number(),
        imageLink:zod.string(),
})
//admin middleware
async function adminSignin(req,res,next){
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"Admin input is invalid",
})
}
const {username,password}=response.data
const userE=await Admin.findOne({username})
if(!userE){
        return res.json({
                msg:"Admin does not exist",
        })
}
req.username=username
req.password=password
return next()
}
async function adminMiddleware(req,res,next){
        const token = req.headers.authorization
        const decoded=jwt.verify(token,jwtPassword)
        const username=decoded.username
        const password=decoded.password
        const userExist=await Admin.findOne({username,password})
        if(!userExist){
                return res.json({
                        msg:"admin  does not exist",
                })
        }
        //create a jwt auth for admin
        req.username=username
        req.password=password
        return next()
}
//user middleware
async function userSignin(req,res,next){
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"User input is  invalid",
                })
        }
        const username=response.data.username
        const password=response.data.password
        const userExist=await User.findOne({username,password})
        if(!userExist){
                return res.json({
                        msg:"User does not exist",
                })
        }
        req.username=username
        req.password=password
        return next()
}

async function userMiddleware(req,res,next){
        const token=req.headers.authorization
        const decoded=jwt.verify(token,jwtPassword)
        const {username,password}=decoded
        const userE=await User.findOne({username})
        if(!userE){
                return res.json({
                        msg:"User does not exist",
                })
        }
        req.username=username
        req.password=password
        return next()
}

//create admin pannel

//create admin signup
//
app.post('/admin/signup',async (req,res)=>{
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.status(400).json(
                        {
                                msg:"user input is invalid",
                        })
        }
        //check user existance
        const {username,password}=response.data
        const userExistance=await Admin.findOne({username,password})
        if(userExistance){
                return res.status(400).json({
                        msg:"Admin is already exist!",
                })
        }
        await Admin.create({
                username,
                password,
        })
        return res.status(200).json({
                msg:`Congratulation ${username}! you have successfully registered!`,
        })
})

app.post('/admin/signin',adminSignin,async(req,res)=>{
        const username=req.username
        const password=req.password
        const token=jwt.sign({username,password},jwtPassword)
        return res.json({
                token,
        })
})
//admin->create course
app.post('/admin/courses',adminMiddleware,async(req,res)=>{
        const response=zodCourse.safeParse(req.body)
        const {title,description,price,imageLink}=response.data
        if(!response.success){
                return res.json({
                        msg:"Course detail input is incorrect",
                })
        }
        //check for course existance
        const courseExist=await Course.findOne({title})
        if(courseExist){
                return res.json({
                        msg:"Course is already exist",
                })
        }
        await Course.create({
                title,
                description,
                price,
                imageLink,
        })

        return res.status(200).json({
                msg:`Congratulation course ${title} created successfully`,
        })
})
//admin->view all courses
app.get('/admin/courses',adminMiddleware,async (req,res)=>{
        const allCourses=await Course.find({})
        return res.json({
                allCourses,
        })
})

//USER*************************
app.post('/user/signup',async(req,res)=>{
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"user input is invalid",
                })
        }
        //check user existance
        const username=response.data.username
        const password=response.data.password
        const userExist=await User.findOne({username,password})
        if(userExist){
                return res.json({
                        msg:"User is already exist ",
                })
        }
        await User.create({
                username,
                password,
        })
        return res.status(200).json({
                msg:`Congratulation ${username} you have register successfully`,
        })
})
//User->signin
app.post('/user/signin',userSignin, (req,res)=>{
        const username=req.username
        const password=req.password
        const token=jwt.sign({username,password},jwtPassword)
        return res.json({
                token,
        })
})
//user->get courses
app.get('/user/courses',userMiddleware,async (req,res)=>{
        const allCourses=await   Course.find({})
        return res.status(200).json({
        allCourses,
        })
})
//user->purchase course by course id
app.post('/user/:courseId',userMiddleware,async (req,res)=>{
        const username=req.username
        const user=await User.findOne({username})
        const courseId=req.params.courseId
        if(user){
                await User.updateOne({username},{"$push":{purchasedCourses:courseId}})
                return res.json({
                        msg:`Congratulation course purchased successfully`,
                })
        }
        else{
                return res.json({
                        msg:"something is missing inparameter",
                })
        }

})
//user -> see all purchased courses
app.get('/user/purchasedCourses',userMiddleware,async (req,res)=>{
        const username=req.username
        const user=await User.findOne({username})
        const course=await Course.find({_id:{"$in":user.purchasedCourses}})
        return res.status(200).json({
                purchasedCourses:course,
        })
})
app.use(function(err,req,res,next){
        return res.json({
                msg:"Input body structure is invalid",
        })
})

app.listen(port,()=>{
        console.log(`Server is running on port ${port || 3000}`)
})
