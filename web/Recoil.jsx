import { useRecoilState, useRecoilValue } from "recoil";
import { CreateAtom } from "./components/recoil";

function App(){

   return (
      <dib>
      {/* <Print/> */}
      <Count/>
      </dib>
   )
}
function Count(){

   return (
      <div>
         <Button/>
         <CountRenderer/>
      </div>
   )
}
function Button(){
   const [count,setCount]=useRecoilState(CreateAtom)
   return (
      <div>
         <button onClick={()=>setCount(count+1)}>Increment</button>
         <button onClick={()=>setCount(count-1)}>Decrement</button>
      </div>
   )
}

function CountRenderer(){
   const count=useRecoilValue(CreateAtom)
   return (
   <div>
      {count}
   </div>
   )
}
// export default App
// import { atom } from "recoil";

// export const CreateAtom=atom({
// 	key:"CreateAtom",
// 	default:0,
// })
