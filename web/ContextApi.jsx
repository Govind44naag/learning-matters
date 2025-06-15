

import { useContext, useState } from "react"
import { CreateContext } from "./components/context"
function App(){

	const [count,setCount] = useState(0)

	return (
		<div>
			<CreateContext.Provider value={{count,setCount}} >
			<Count   />
			</CreateContext.Provider>
		</div>
	)
}
function Count(){

	return (
		<div>
			<CountRender />
			<Button />
		</div>
	)
}

function CountRender(){
const {count}=useContext(CreateContext)//count is object so use object destructuring  
	return (
		<div>
			{count}
		</div>
	)
}
function Button( ){
	const {count,setCount}=useContext(CreateContext)
 	return (
		<div>
			<button onClick={()=>{
				setCount(count+1)
			}}>Increment</button>
			<button onClick={()=>{
				setCount(count-1)
			}}>Decrement</button>
		</div>
	)
}

export default App

// import { createContext } from "react";
// export const CreateContext = createContext({
//     count:0,
//     setCount:()=>{},
// }) 
