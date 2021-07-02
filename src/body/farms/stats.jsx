import { useState, useEffect } from "react";
import poolAbi from "../../utils/nativeFarmAbi";
import config from "../../pools_config.json";
//import Web3 from "web3";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
export default function Stats() {
  let [data, setData] = useState({ pending: 0, deposit: 0, loaded: false });
  useEffect(async () => {
    if (!data.loaded) {
      setData({ loaded: true });
      setInterval(async () => {
        if (web3.eth) {
          await loadPending();
          if (window.ts) {
            setData({
              pending: window.ts.pending,
              deposited: window.ts.deposited,
              loaded: true
            });
          }
        }
      }, 1000);
    }
  });

  async function loadPending(params) {
    let pool = new web3.eth.Contract(poolAbi, farmAddress);
    let num = 0;
    for (let i = 0; i < config.length; i++) {
      try {
        let pending = await pool.methods
          .pendingNATIVE(config[i].id, window.account)
          .call();

        num = num + Number(pending);
      } catch (error) {}
    }
    window.ts.pending = num / 10 ** 18;
  }

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
    for (let i = 0; i < config.length; i++) {
      try {
        let balance = await pool.methods
          .pendingNATIVE(config[i].id, window.account)
          .call();
        if (balance > 1e8) {
          pool.methods.withdraw(config[i].id, 0).send({ from: window.account });
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log("finished");
  }
  return (
    <div className="stats-stripe">
      <div className="txt deposit-ttl">My total deposit:</div>
      <div className={"txt total-deposit loading"}>
        {data.deposited
          ? "$" + formatNumber(data.deposited.toFixed(2))
          : "0.00"}
      </div>
      <div className="txt qbert-ttl">QBert pending:</div>
      <div className="txt qbert-pending loading">
        <span className="amount">
          {data.pending ? data.pending.toFixed(3) : "0.000"}
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
