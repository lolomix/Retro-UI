import Pools from './poolsd/pools'
import Stats from './stats'
import Tvl from './tvl'

export default function Farms() {
  

  

  return(
    <div className="content">
    <div className="title">
        <div className="txt ttl">RetroDEFI <br></br> QBERT OPTIMIZED FARMS</div>
        <Tvl></Tvl>
    </div>
    <Stats/>   
    <Pools/>
    </div>)
}
