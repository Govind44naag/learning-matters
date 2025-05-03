//i have write all things in single todo-app.js file you can create other files
//like db.js & zodValidator.js where you can put you db info & input schema validation respectively
// this is simple todo application where you can create task & view all todos 
// and finally on completing's task you can mark as completed

const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const zod=require('zod')
const app=express()
const env=require('dotenv')
env.config()
const mongoUrl=process.env.MONGO_URL
const port=process.env.PORT

app.use(express.json())
app.use(cors())


const mongoose=require('mongoose')

mongoose.connect(mongoUrl)
console.log('mongo db connect')

//schema
const mongooseSchema=new mongoose.Schema({
    title:String,
    description:String,
    complete:Boolean,
})

const Todo=mongoose.model('Todo',mongooseSchema)


const zod=require('zod')

//validation schema
const updateSchema=zod.object({
    title:zod.string(),
    description:zod.string(),
})

//id schema
const getSchema=zod.object({id:zod.string()})
 



app.post('/todos',async (req,res)=>{
    const response=updateSchema.safeParse(req.body)
    if(!response.success){
        return res.status(411).json({
            msg:"Something is wrong in input",
        })
    }
    //create todo
    const {title,description}=response.data
    await Todo.create({
        title,
        description,
        completed:false,
    })
    return res.status(200).json({
        msg:"Todo created successfully!",
    })
})


app.get('/todo',async  (req,res)=>{
    const todos=await Todo.find({})
    return res.json({
        todos , 
    })
})

app.put('/completed',async (req,res)=>{
const response=getSchema.safeParse(req.body)
if(!response.success){
    return res.status(411).json({
        msg:"Somethin went wrong in input!",
    })
}
await Todo.updateOne({
    _id:response.id
},{
    completed:true,
})
return res.status(200).json({
    msg:"todo updated successfully!",
})
})

app.listen(port,()=>{
console.log(`Server is running on port number ${port}`)
})
