
import {Fragment, useState, useEffect} from 'react'
import Countdown from 'react-countdown';

export default function Tvl() {

  var [value, setValue] = useState(0)
  useEffect(()=>{
    if (window.web3) {
      console.log('ye')
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

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return;
    } else {
      // Render a countdown
      return  <font style={{"color": 'red',"fontSize": 15}}>Pending Locked: {hours}h :{minutes}m :{seconds}s</font>;
    }
  };

  return(
    <Fragment><div style={{"fontSize": 20}} className="txt tvl ml-auto">TVL ${numFormatter(value)} <br></br> 
    <Countdown
    date={Date.now() + 10000000}
    renderer={renderer}
  />,
   </div></Fragment>
  
    )
}