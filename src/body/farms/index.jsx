
import Stats from './stats'
import Pools from './poolsd/pools'

export default function Farms() {

  

  return(
    <div className="content">
    <div className="title">
        <div className="txt ttl">RetroDEFI <br></br> QBERT Optimized Farms</div>
        <div className="txt tvl ml-auto">TVL $0</div>
    </div>


    <Stats/>   
    <Pools/>
    </div>)
}