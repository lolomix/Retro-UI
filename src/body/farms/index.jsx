import Pools from "./poolsd/pools";
import Stats from "./stats";
import Pool from "./poolsd/pools";
import Tvl from "./tvl";
export default function Farms() {
  return (
    <div className="content">
      <div className="title">
        <div className="txt ttl">
          RetroDEFI <br></br> QBERT Optimized Farms
        </div>
        <Tvl></Tvl>
      </div>

      <Stats />
      <Pool />
    </div>
  );
}
