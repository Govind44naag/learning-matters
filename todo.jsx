import { useState } from "react";
import React from "react";
let counter=4
export default function App(){

    const [todos,setTodos]=useState([{
        id:1,
        title:"Go to Gym",
        description:"i will go daily",
    },
{
    id:2,
    title:"go to library",
    description:"i will go to library daily",
},
{
    id:3,
    title:"Drink  a lot of water",
    description:"I will drink a lot of water on daily basis",
}])
function handleClick(){
    setTodos([...todos,{
        id:counter++,
    title:Math.random(),
    description:Math.random(),
    }])
}
    return (
      <div>
        <button onClick={handleClick}>update me </button>
        {todos.map(function(todo){
            return <Todo key={todo.id} title={todo.title} description = {todo.description}/>
        })}
      </div>
    )
}
const Todo=React.memo(function Todo({title,description}){

    return (
        <div>
            <h2>
                {title}
            </h2>
            <h2>
                {description}
            </h2>
        </div>
    )
})
