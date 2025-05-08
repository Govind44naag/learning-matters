const express=require('express')
const jwt=require('jsonwebtoken')
const jwtPassword='1234'
const zod=require('zod')
const env=require('dotenv')
env.config()
const mongoUrl=process.env.MONGO_URL
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const app=express()
const port=process.env.PORT

//connect db to backend
mongoose.connect(`${mongoUrl}/notes-app`)

//define mongoose schema
//user schema
const mSchema=new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    mynotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Notes'
    }]
})
//notes schema
const nschema=new mongoose.Schema({
    title:String,
    description:String,
})
//you can also make it delete
//model
const User=mongoose.model('User',mSchema)
const Notes=mongoose.model('Notes',nschema)

//now define zod schema for user
const userSignupSchema=zod.object({
    name:zod.string(),
    username:zod.string().email(),
    password:zod.string().min(4),
})
const userSigninSchema=zod.object({
    username:zod.string().email(),
    password:zod.string().min(4),
})
//for notes info
const notesSchema=zod.object({
    title:zod.string(),
    description:zod.string(),
})
app.use(express.json())
//user signup
app.post('/user/signup',async (req,res)=>{
    const response=userSignupSchema.safeParse(req.body)
    if(!response.success){
        return res.json({
            msg:"User input is invalid",
        })
    }
    //reject user is exist-before 
    const {username,password,name}=response.data
    const findUsr=await User.findOne({username})
    if(findUsr){
        return res.json({
            msg:"user already exist",
        })
    }
    //now hash password
    const hashPassword=await bcrypt.hash(password,10)
    //save into db
    await User.create({
        name,
        username,
        password:hashPassword,
    })
    return res.json({
        msg:`${name} ,you have registered successfully`,
    })
})
function userAuth(req,res,next){
    try{
    const token=req.headers.authorization
    const decoded=jwt.verify(token , jwtPassword)
    const username=decoded.username
    req.username=username
    return next()
    }
    catch(e){
        return res.json(
            {
                msg:"Token error",
            }
        )
    }
}
//signin

app.post('/user/signin',async (req,res)=>{
    const response=userSigninSchema.safeParse(req.body)
    if(!response.success){
        return res.json({
            msg:"User input is invalid",
        })
    }
    //check if user not exist before
    const username=response.data.username
    const userexist=await User.findOne({username})
    if(!userexist){
        return res.json({
            msg:`user ${username} does not exist`,
        })
    }
    const token=jwt.sign({username},jwtPassword)
    return res.json({
        token,
    })
})

//create notes
app.post('/user/notes/create',userAuth,async (req,res)=>{
    const username=req.username
    const response=notesSchema.safeParse(req.body)
    if(!response.success){
        return res.json(
            {
                msg:"notes input is invalid",
            }
        )
    }
    const {title,description}=response.data
    //save
    await Notes.create({
        title,
        description,
    })
    const findNoteId=await Notes.findOne({title})
    //push id into user
    await User.updateOne({username},{$push:{mynotes:findNoteId._id}})
    return res.json({
        msg:"note has been created successfully",
        notesId:findNoteId._id
    })
})
//view notes
app.get('/user/notes',userAuth,async (req,res)=>{
    const username=req.username
    const user=await User.findOne({username})
    const allNotes=await Notes.find({_id:{$in :user.mynotes}})
    return res.json({
        allNotes,
    })

})
//delete notes
app.get('/user/notes/delete/:noteId',userAuth,async (req,res)=>{
        const username=req.username
        const noteId=req.params.noteId
        try{
            const deleteNote=await Notes.findByIdAndDelete(noteId)
            if(!deleteNote){
                return res.json({msg:"note not found"})
            }
            await User.updateOne({
                username
            },{$pull :{mynotes:noteId}})
            return res.json({
                msg:"Note deleted successfully",

            })
        }
        catch(e){
            return res.json({msg:"Error occur",error:e.message})
        }
})
app.listen(port,()=>{
    console.log("server is running on port number 3000")
})
