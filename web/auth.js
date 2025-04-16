const express=require('express')
const jwt=require('jsonwebtoken')
const jwtPassword='1345'
const app=express()
const port=3000

const metaData=[
	{
		username:"govindpratap@gmail.com",
		password:"2256",
		name:"Govind Pratap",
	},
	{
		username:"lalitpratap@gmail.com",
		password:"2342",
		name:"Lalit Pratap",
	},
	{
		username:"uditpratap@gmail.com",
		password:"4353",
		name:"Udit Pratap",
	},
]

//middleware
app.use(express.json())
//check for user existance
function isUserExist(username,password){
	for(let i=0;i<metaData.length;i++){
		if(username==metaData[i].username && password == metaData[i].password){
			return true
		}
	}
	return false
}

//post for user login
app.post('/signin',(req,res)=>{
	const username=req.body.username
	const password=req.body.password
	if(!isUserExist(username,password)){
		return res.status(403).json({
			msg:"User not found,try to sign up",
			success:false
		})
	}
	const token=jwt.sign({username:username},jwtPassword)
	res.status(200).json({
		token,
	})
})

//for user request
app.get('/users',(req,res)=>{
	try{
	const token=req.headers.authorization
	const decoded=jwt.verify(token,jwtPassword)
	const username=decoded.username
	res.status(200).json({
			users:metaData.filter(function(value){
                                if(value.username==username){
                                        return false
                                }
                                else{
                                        return true
                                }
                        })
	})
	}

	catch(err){
		res.status(401).json({
			error:err,
			success:false,
		})
	}
})

//global catch
app.use(function(err,req,res,next){
	res.json({
		error:err,
		success:false,
	})
})

app.listen(port,()=>{
	console.log(`Server is running on port number ${port}`)
})
