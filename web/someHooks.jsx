import {useState,useEffect,useMemo,useCallback,memo,useRef} from 'react'
//useState->for state management
//useEffect-> for side effect (works when change in dependencies)
//useMemo-> gives constant as an output use to prevent re-render if dependencies not changes
//useCallback-> same as useMemo but applied on function
//memo-> it do not re-render component if props value do not changes
//useRef-> take reference of dom element & use to manupulate  them
function App(){
  const divRef=useRef()//this is used to get ref of div element to manupulate it
  const [count,setCount]=useState(0)
  const [exchange1Data,setExchange1Data]=useState({})
  const [exchange2Data,setExchange2Data]=useState({})
  const [bankData,setBankData]=useState({})

  useEffect(()=>{
    setExchange1Data({
      returns:200,
    })
  },[])

  useEffect(()=>{
    setExchange2Data({

      returns:100,
    })
  },[])

  useEffect(()=>{
    setTimeout(()=>{
      setBankData({
        income:100,
      })
    },5000)
  },[])

  useEffect(()=>{
    setTimeout(()=>{
   console.log(divRef.current)
    divRef.current.innerHTML=10   
    },4000)
    
  },[])
  const calculateCryptoReturns=useCallback(()=>{
    console.log('usecallback fxn')
    return exchange1Data.returns + exchange2Data.returns
  },[exchange1Data,exchange2Data])
  //calculate value with no re-computation on no props change  
  const calculateAmount = useMemo(()=>{
    return exchange1Data.returns + exchange2Data.returns+0.3 

  },[exchange1Data,exchange2Data])
  console.log(`real income generated is ${calculateAmount}`)
  
  return (
    <div>
      <button  onClick={()=>setCount(count+1)}>click me & value = {count}</button>
      <h2 ref={divRef} >{count}</h2>
      <br/>
      <CryptoGainsCalculator calculateAmount={calculateAmount} calculateCryptoReturns={calculateCryptoReturns}/>
     </div>
  )
}
const CryptoGainsCalculator=memo(function({calculateCryptoReturns,calculateAmount}){
  console.log("child component")
  return (
    <div>
      Your crypto returns are {calculateCryptoReturns()} and income tax amount is {calculateAmount}
    </div>
  )
})
export default App
