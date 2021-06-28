
import {Fragment, useState, useEffect} from 'react'


export default function Tvl() {

  var [value, setValue] = useState(0)
  useEffect(()=>{
    if (window.web3) {
      console.log('ye')
    } else{
      console.log('noo')
    }
    setInterval(() => {
      if(window.ts){
        setValue(window.ts.value)
      }
    }, 3000);
  })

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num.toFixed(2); // if value < 1000, nothing to do
    }
  }

  return(
    <Fragment><div className="txt tvl ml-auto">TVL ${numFormatter(value)}</div><br></br>xd</Fragment>
  
    )
}