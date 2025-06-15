//Prop drilling 
//this is the problem of prop drilling where Count component did not use neither count nor setCount props still passing it  for Button and CountRenderer 
	//component so it's not problem of re -rendering but problem of view messy information only to get rid of it we use  CONTEXT API come's 
function App(){
const [count,setCount]=useState(0)

	return (
		<div>
			<Count count={count} setCount={setCount} />

 		</div>
	)
}

function Count({count,setCount}){
	    
	return (
		<div>
			<CountRenderer count={count}/>
			<Button count={count} setCount={setCount} />
		</div>
	)
}
function CountRenderer({count}){
	return (
		<div>
			{count}
		</div>
	)
}
function Button({count,setCount}){
	 
	return (
		<div>
			<button onClick={()=>{
				setCount(count+1)
			}}>Increment</button>
			<button onClick={()=>{
				setCount(count-1)
			}}> Decrement</button>
		</div>
	)
}

export default App
