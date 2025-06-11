import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
function App(){
 const [state,setState]=useState([])
 
  return (
    <div>

<button onClick={function(){
  setState(1)
}}>1</button>
<button onClick={function (){
  setState(2)
}}>2</button>
<button onClick={function(){
  setState(3)
}}>3</button>
<button onClick={function (){
  setState(4)
}}>4</button>
  <Todo id={state}/>

      </div>
  )
}

export default App

 
function Todo({id}){

  const [todo,setTodo]=useState({})

  useEffect(()=>{
    setTimeout(()=>{
      axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(function(res){
        setTodo(res.data)
      })
    },5000)}
     ,[id])

  return (
    <div>
      <h2>{todo.title}</h2>
    <h3>{todo.completed}</h3>
    </div>
  )
}
