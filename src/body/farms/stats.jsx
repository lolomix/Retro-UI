
import { useState, useEffect } from "react";

export default function Stats() {
  let [data, setData] = useState({pending: 0, deposit: 0, loaded: false})
  useEffect(()=>{
    if(!data.loaded){
      setData({loaded: true})
      console.log('stats load')
      setInterval(() => {
        setData({pending: window.ts.pending, deposited: window.ts.deposited, loaded: true})
        
      }, 3000);
      
    }  
  })

  function formatNumber(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K";
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "K";
    } else if (num < 999) {
      return num;
    }
  }
  return(
    <div className="stats-stripe">
                <div className="btn show-hide"></div>
                <div className="txt deposit-ttl">My total deposit:</div>
                <div className={'txt total-deposit loading'}>{data.deposited? '$'+ formatNumber((data.deposited).toFixed(2)): '***'}</div>
                <div className="txt qbert-ttl">QBert pending:</div>
                <div className="txt qbert-pending loading">
                    <span className="amount">{data.pending? (data.pending).toFixed(3): '***'}</span>
                </div>
                <div className="btn harvest-all disabled">Harvest All</div>
            </div>
  )
}