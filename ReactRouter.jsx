//after this we will reach lazy loading (only page will render where the user is i.e. if user on / path page then only landing page will load not /dashboard until it click on it)
//the below is  laxy loading curent it is full loading 
//Note replace components to default like export function not ,export default function yes
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { lazy } from "react";
const Landing=lazy(()=>import("./components/Landing"))
const DashBoard= lazy(()=>import('./components/DashBoard'))


function App(){

	const routes=[{
		path:'/',
		element:<Landing/>,
	},
{
	path:'/dashboard',
	element:<DashBoard/>
}]

return (
	<div>
		<BrowserRouter>
		<Appbar/>
		<Routes>
			{routes.map(route=><Route path={route.path} element = {route.element}/>)}
		</Routes>
		</BrowserRouter>
	</div>
)

}

function Appbar(){
	//useNavigate can only describe inside browserrouter component only and also can use in it !! 
	//react main motive is client side rendering (no refresh on change path or prevent re-rendering of html page from server)
	const navigate=useNavigate()

	return (
		<div>
			<button onClick={()=>{
				navigate('/')
			}}> Landing Page </button>
			<button onClick={()=>{
				navigate('/dashboard')
			}}>DashBoard</button>
		</div>
	)
}
export default App
