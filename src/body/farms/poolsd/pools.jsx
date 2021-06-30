import { useEffect } from "react";
import config from "../../../pools_config.json";
import Pool from "./pool.jsx";
import getTokenPrice from "../../../utils/aprLib/index";
import Web3 from "web3";
import send from "../../../utils/getTvl";

export default function Pools() {
  useEffect(() => {
    if (window.account) {
      //send().then(()=>{console.log('finished')})
    }
  });
  return (
    <div className="pools">
      {config.map((pool, i) => (
        <Pool
          key={i}
          id={pool.id}
          name={pool.name}
          number_fee={pool.number_fee}
          image_name={pool.image_name}
          pair_image={pool.pair_image}
          pool_multiplier={pool.pool_multiplier}
          decimals={pool.decimals}
          token_address={pool.token_address}
          buy_url={pool.url}
          poolAddress={pool.poolAddress}
          isLp={pool.isLP}
          price={pool.price}
        />
      ))}
    </div>
  );
}
