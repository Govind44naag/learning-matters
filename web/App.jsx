//this is basic of react
// import {useState} from 'react'
// //all the js thing shoud have to write in {} brackets
// function App() {
//   const [count,setCount]=useState(0)
// //   console.log("count",count)
// //   console.log('setcount',setCount)
// //   function incre(){
// // setCount(count+1)
// //   }
//   return (
//   <div>
//     {/* <button onClick={()=>setCount(count+1)}>Counter { count}</button> */}
//     {/* <button onClick={incre}>Counter {count}</button> */}
//     <CustomButton count={count} setCount={setCount}></CustomButton>
//    </div>
//   )
// }

// function CustomButton(props){
//   function onClickHandler(){
//     props.setCount(props.count+1)
//   }
//   return <button onclick={onClickHandler}>Counter {props.count}</button>
// }
// export default App
import React from 'react'
import { useState } from 'react'
const App = () => {
  const [todos,setTodos]=useState([{
    title:"Go TO dym",
    description:"doing pushups"
    ,
    complete:false,
  },  
{
  title:"go to library",
  description:"read 8 cheptors",
  complete:true,
}])
function addtodos(){
  setTodos([...todos,{
    title:"new todo",
    description:"desc of new todo",
    complete:false
  }]
  )
}
  return (
    <div  >
      <button onClick={addtodos}>Add more todos</button>
      {todos.map(function(todo){
        return <Todo title={todo.title} description={todo.description} complete={todo.complete}/>
      })}

    </div>
  )
}
function Todo(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <hr />
    </div>
  );
}
export default App
