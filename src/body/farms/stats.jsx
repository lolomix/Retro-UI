import { useState, useEffect } from "react";
import poolAbi from "../../utils/nativeFarmAbi";
import config from "../../pools_config.json";

const farmAddress = "0x967d62a4652b87c7cc2dC6154d3369ff2A6b1AD2";

export default function Stats() {
  var [data, setData] = useState({ pending: 0, deposit: 0, loaded: false });
  useEffect(() => {
    if (!data.loaded) {
      setData({ loaded: true });
      console.log("stats load");
      setInterval(() => {
        setData({
          pending: window.ts.pending,
          deposited: window.ts.deposited,
          loaded: true
        });
      }, 1000);
    }
  });

  function formatNumber(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K";
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "K";
    } else if (num < 999) {
      return num;
    }
  }

  async function harvestall() {
    let pool = new web3.eth.Contract(poolAbi, farmAddress);
    for (let i = 0; i < 1000; i++) {
      try {
        let balance = await pool.methods
          .pendingNATIVE(config[i].id, window.account)
          .call();
        console.log(balance);
        if (balance > 1e8) {
          pool.methods.withdraw(config[i].id, 0).send({ from: window.account });
        }
      } catch (error) {}
    }
    console.log("finished");
  }
  return (
    <div className="stats-stripe">
      <div className="txt deposit-ttl">My Total Deposit:</div>
      <div className={"txt total-deposit loading"}>
        {data.deposited ? "$" + formatNumber(data.deposited.toFixed(2)) : "***"}
      </div>
      <div className="txt qbert-ttl">QBert Pending:</div>
      <div className="txt qbert-pending loading">
        <span className="amount">
          {data.pending ? data.pending.toFixed(3) : "***"}
        </span>
      </div>
      <div
        onClick={() => {
          harvestall();
        }}
        className="btn outlined harvest-all"
      >
        Harvest All
      </div>
    </div>
  );
}
