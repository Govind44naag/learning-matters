const express=require('express')
const zod=require('zod')
const mongoose=require('mongoose')
const bodyParse=require('body-parser')
const env=require('dotenv')
env.config()
const app=express()
const port=process.env.PORT
const mongoUrl=process.env.MONGO_URL
app.use(bodyParse.json())
//this first partinclude mongoose connect and their schema of all models
//and i am putting similar section on same side
//connect db
mongoose.connect(mongoUrl)

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
        purchasedCourse:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
        }],
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
//firts zodSchema
const zodSchema=zod.object({
        username:zod.string().email(),
        password:zod.string().min(5),
})
//course schema
const courseZodSchema=zod.object({
        title:zod.string(),
        description:zod.string(),
        price:zod.number(),
        imageLink:zod.string(),
})
//now create middleware
//
function schemaValidity(req,res,next){
        const response=zodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"user input is invalid",
                        success:false,
                })
        }
        req.body=response.data
        return next()
}
//more middleware
function mainCheck(req,res,next){
        const response=zodSchema.safeParse(req.headers)
        if(!response.success){
                return res.json({
                        msg:"user input is invalid",
                        success:false,
                })
        }
        req.validateHeaders=response.data
        return next()
}

//for admin put input and check from db is it exist or not with error handling
async function admin(req,res,next){

        const {username,password}=req.validateHeaders
        //check is user exist or not if exist then pass
        const userExistance =   await Admin.findOne({username,password})
        if(!userExistance){
                return res.json({
                        msg:"Admin does not exist",
                        success:false,
                })
        }
        req.username=username
        return next()
}

//for user put input and check from db is it exist or not with error handling
async function user(req,res,next){
        const {username,password}=req.validateHeaders
        //check for user existance
        const userExist=await User.findOne({username,password})
        if(!userExist){
                return res.json({
                        msg:"User does not exist",
                })
        }
        req.username=username
        return next()

}
//Admin signup
app.post('/admin/signup',schemaValidity,async (req,res)=>{
        const {username,password}=req.body
        //check for user existance if exist then reject
        const userExist=await Admin.findOne({username,password})
        if(userExist){
                return res.json({
                        msg:"User is already exist ",
                        success:false,
                })
        }
        await Admin.create({
                username,
                password,
        })
        return res.status(200).json({
                msg:`Congratulation ${username}! , you have register successfully`,
        })
})

// User signup
app.post('/user/signup',schemaValidity,async (req,res)=>{
        const {username,password}=req.body
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
                success:true,
        })
})

//admin login
app.post('/admin/signin',schemaValidity,async (req,res)=>{
        const {username,password}=req.body
        //check for user existance if exist then reject
        const userExist=await Admin.findOne({username,password})
        if(!userExist){
                return res.json({
                        msg:"admin does not exist with this id",
                        success:false,
                })
        }
        return res.status(200).json({
                msg:`${username} has logged in successfully`,
                success:true,
        })
})
//user login
app.post('/user/signin',schemaValidity,async (req,res)=>{

        const {username,password}=req.body
        //check for user existance if exist then reject
        const userExist=await User.findOne({username,password})
        if(!userExist){
                return res.json({
                        msg:"user does not exist with this id",
                        success:false,
                })
        }
        return res.status(200).json({
                msg:`${username} has logged in successfully`,
                success:true,
        })
})

//write logic for admin to create course
app.post('/admin/course',mainCheck,admin,async (req,res)=>{
        const response=courseZodSchema.safeParse(req.body)
        if(!response.success){
                return res.json({
                        msg:"Course details input is not avlid",
                        success:false,
                })
        }

        const price=response.data.price
        const description=response.data.description
        const imageLink=response.data.imageLink
        const title=response.data.title
        //check is course exist or not
        const courseExist=await Course.findOne({title})
        if(courseExist){
                return res.json({
                        msg:"This title is already exist",
                })
        }
        //now store course info      in db
        const courses=await  Course.create({
        title,
                description,
                price,
                imageLink,
        })

        return res.status(200).json({
                msg:`Congratulation Course ${title} has create successfylly`,
                courseId:courses._id,
        })
})
//write logic for admin to view all course
app.get('/admin/courses',mainCheck,admin,async (req,res)=>{
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
app.get('/user/courses',mainCheck,user,async (req,res)=>{
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
app.post('/user/courses/:courseId',mainCheck,user,async (req,res)=>{
        const courseId=req.params.courseId
        //check is course is already exist?
        const username=req.username
        console.log("user in course",username)
        const exiuser=await User.findOne({username})

        if(exiuser.purchasedCourse.some(course=>course.equals(courseId))){
                return res.json({
                        msg:"Use has already purchased this course",
                })
        }

        await User.updateOne({
                username},
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
app.get('/user/purchasedCourse',mainCheck,user,async (req,res)=>{
        const user=await User.findOne({
                username:req.headers.username
        })
        const courses=await Course.find({
                _id:{
                        "$in":user.purchasedCourse,
                }
        })
        return res.json({
                courses,
        })
})
//global cache
app.use(function(err,req,res,next){
        return res.json({
                msg:"Input body is wrong",
                })
})
app.listen(port,()=>{
        console.log(`Server is running on port number ${portmonger || 3000}`)
})
