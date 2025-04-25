const express=require('express')
const zod=require('zod')
const mongoose=require('mongoose')
const bodyParse=require('body-parser')
const app=express()
app.use(bodyParse.json())
//this first partinclude mongoose connect and their schema of all models
//and i am putting similar section on same side
//connect db
mongoose.connect('MONGO_URL')
console.log("mongodb connected")

//create admin schema
const adminSchema=new mongoose.Schema({
        username:String,
        password:String,
})
const Admin=mongoose.model('Admin',adminSchema)

//userschema
const userSchema=new mongoose.Schema({
        username:String,
        password:String,
        purchasedCourse:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
        },
})
const User=mongoose.model('User',userSchema)

//course schema
const courseSchema=new mongoose.Schema({
        title:String,
        description:String,
        price:Number,
        imageLink:String,
})
const Course=mongoose.model('Course',courseSchema)
//first create zodSchema
const zodSchema=zod.object({
        username:zod.string().email(),
        password:zod.string().min(5),
})

//now create middleware
//
//for admin put input and check from db is it exist or not with error handling
async function admin(req,res,next){
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"user input is invalid! , please try again",
                        success:false,
                })
        }

        const username=response.data.username
        const password=response.data.password
        //check is user exist or not if exist then pass
        const userExistance =   await Admin.findOne({usrname,password})
        if(!userExistance){
                return res.json({
                        msg:"Admin does not exist",
                        success:false,
                })
        }
        req.username=username
        req.password=password
        return next()
}

//for user put input and check from db is it exist or not with error handling
function user(req,res,next){
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"user input is invalid",
                        success:false,
                })
        }
        const username=response.data.username
        const password=response.data.password
        //check for user existance
        await User.findOne({username,password})
        .then(function(value){
                req.username=username
                req.password=password
                return next()
        })
        .catch(err){
                return res.json({
                        msg:"User does not exist",
                        success:false,
                })
        }
}

//Admin signup
app.post('/admin/signup',async (req,res)=>{
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"User input is invalid",
                        success:false,
                })
        }
        const {username,password}=response.data
        //check for user existance if exist then reject
        const userExist=await Admin.findOne({username,password})
        if(userexist){
                return res.json({
                        msg:"User is already exist ",
                        success:false,
                })
        }
        await Admin.create({
                username,
                password,
        })
        return res.status.json({
                msg:`Congratulation ${username}! , you have register successfully`,
        })
})

// User signup
app.post('/user/signup',(req,res)=>{
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"user input is invalid!",
                        success:false,
                })
        }
        const {username,password}=response.data
        //check for user existance if exist then reject
        const userExist=await User.findOne({username,password})
        if(userExist){
                return res.json({
                        msg:"user is already exist with this id",
                        success:false,
                })
        }
        //save user into database
        await User.create({
                username,
                password,
        })
        return res.status(200).json({
                msg:`Congratulation ${username}! , you have register successfully`,
                success:false,
        })
})

//admin login
app.post('/admin/signin',admin,(req,res)=>{
        return res.status(200).json({
                msg:`${req.username} has logged in successfully`,
                success:true,
        })
})
//user login
app.post('/user/signin',user,(req,res)=>{
        return res.status(200).json({
                msg:`${req.username} has logged in successfully`,
                success:true,
        })
})

//cousre schema
const courseZodSchema=zod.object({
        title:zod.string(),
        description:zod.string(),
        price:zod.number(),
        imageLink:zod.number(),
})
//write logic for admin to create course

app.post('/admin/course',admin,(req,res)=>{
        const response=courseZodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"Course detail's input are correct",
                        success:false,
                })
        }
        const {title,description,imageLink,price}=response.data
        //check is course exist or not
        const courseExist=await Course.findOne({title})
        if(courseExist){
                return res.json({
                        msg:"This title is already exist",
                })
        }
        //now store course info      in db
        const courses= Course.create({
        title,
                description,
                price,
                imageLink,
        })
        await courses.save()
        return res.status(200).json({
                msg:`Congratulation Course ${title} has create successfylly`,
                courseId:courses._id,
        })
})
//write logic for admin to view all course
app.get('/admin/courses',admin,async (req,res)=>{
        const course=await Course.find({})
        if(!course){
                return res.json({
                        msg:"Course not found",
                })
        }
        return res.status(200).json({
                course,
        })
})

//write logic for user to fetch all course
app.get('/user/courses',user,async (req,res)=>{
        const course=await Course.find({})
        if(!course){
                return res.json({
                        msg:"Course is not available",
                })
        }
        return res.json({
                course,
        })
})

//write logic to purchase course
app.post('/user/courses/:courseId',user,async (req,res)=>{
        const courseId=req.params.courseId
        const username=req.username
        await User.updateOne({
                username,
                {
                "$push":{
                        purchasedCourse:courseId,
                }

        })
        return res.json({
                msg:"Course purchase successfully",
                success:true,
        })
})

//write logic to list all purchase course
app.get('/user/purchasedCourse',user,async (req,res)=>{
        const user=await User.findOne({
                username:req.headers.username
        })
        const courses=await Course.find({
                _id:{
                        "$in":user.purchasedCourse,
                }
        })
        return res.json({
                courses:course,
        })
})

app.listen(port,()=>{
        console.log(`Server is running on port number ${port}`)
})
