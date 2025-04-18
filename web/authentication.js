const express = require('express')
const zod=require('zod')
const bodyParser=require('body-parser')
const jwt=require('jsonwebtoken')
const app=express()
const jwtPassword='1234'
const port=3333

//middleware
app.use(bodyParser.json())

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            msg: "Invalid JSON format!",
            success: false
        });
    }
    next();
});
//user schema
const userSchema=zod.object({
        username:zod.string().email(),
        password:zod.string().min(5)
})

const metaData=[{
                username:"govind@gmail.com",
                password:"govind",
                name:"Govind Naag",
        },
        {
                username:"lavi@gmail.com",
                password:"lalit",
                name:"Lalit Pratap Singh",
        },
        {
                username:"udit@gmail.com",
                password:"uditpratap",
                name:"Udit Pratap Singh",
        },
        ]


//middleware for user existance
function userExistance(req,res,next){
        try{
        const response=userSchema.safeParse(req.body)
        if(!response.success){
                return res.status(404).json({
                        msg:"user does not exist, please register first ! ",
                })
        }
        for(let i=0;i<metaData.length;i++){
                if(response.data.username==metaData[i].username && response.data.password==metaData[i].password){
                        req.i=i
                        req.response=response
                        return next()
                }
        }
        }
        catch(err){
        res.status(404).json({
        msg:"Something is wrong ,please try again!",
        success:false,
})
}

}

app.use(userExistance)

app.post('/signin',(req,res)=>{
        try{
        const username=req.response.data.username
        const token=jwt.sign({username},jwtPassword)
        res.status(200).json({
                token,
        })
        }
        catch(err)
        {
                res.status(404).json({
                        msg:"post request can't be done",

                })
        }

})

app.get('/users',(req,res)=>{
        try{
                const token=req.headers.authorization
                const decoded=jwt.verify(token,jwtPassword)
                const username=decoded.username

                //print all users except  itself
                const users = metaData.filter(user => user.username !== username);
                res.status(200).json({
                users,
                })
        }
        catch(err){
                res.status(401).json({
                        msg:"user is not authonticated for response",
                        success:false
                })
        }
})

app.listen(port,()=>{
        console.log(`Server is running on port number ${port}`)
})
