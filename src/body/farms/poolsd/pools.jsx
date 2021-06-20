import config from '../../../pools_config.json'
import Pool from './pool.jsx'
export default function Pools() {
  

return(
  <div className="pools">
    {config.map((pool, i)=>( 
      <Pool key={i} id={i} name={pool.name} image_name={pool.image_name} 
      decimals={pool.decimals}
      token_address={pool.token_address}
      buy_url={pool.url}
      poolAddress={pool.poolAddress}
      isLp={pool.isLP}
      price={pool.price}/>
    ))}
  </div>
)
}