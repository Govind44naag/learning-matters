const express=require('express')
const app=express()
app.get('/',(req,res)=>{
  console.log("get request done")
  res.send("get request")
})
app.post('/',(req,res)=>{
  console.log("port requet done!")
  res.send("port request done")
})
app.listen(3000)
