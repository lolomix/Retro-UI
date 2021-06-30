import { Fragment, useState, useEffect } from "react";
import Countdown from "react-countdown";
import nativeFarmAbi from "../../utils/nativeFarmAbi";
import Web3 from "web3";
import { load } from "dotenv";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
export default function Tvl() {
  var [value, setValue] = useState(0);
  var [timeLeft, setTimeLeft] = useState(0);
  var [loaded, setLoaded] = useState(false);
  var [text, setText] = useState("");
  useEffect(async () => {
    if (web3.eth && !loaded) {
      let pool = new web3.eth.Contract(nativeFarmAbi, farmAddress);
      setLoaded(true);
      let currentBlock = await web3.eth.getBlockNumber();
      let startBlockHarvest = await pool.methods.startBlockHarvest().call();
      let startBlock = await pool.methods.startBlock().call();
      let startBlockTime = startBlock - currentBlock;
      let startBlockHarvestTime = startBlockHarvest - currentBlock;
      if (startBlockTime > 0) {
        setTimeLeft(time * 3);
        setText("Farms Start");
      } else if (startBlockHarvestTime > 0) {
        setTimeLeft(startBlockHarvestTime * 3);
        setText("Pending Locked");
      } else {
        setTimeLeft(0);
      }
    }
    setInterval(() => {
      if (window.ts) {
        setValue(window.ts.value);
      }
    }, 1500);
  });

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
    console.log(seconds);
    if (completed) {
      // Render a completed state
      return <div></div>;
    } else {
      // Render a countdown
      return (
        <font style={{ color: "red", fontSize: 15 }}>
          {text}: {hours}h :{minutes}m :{seconds}s
        </font>
      );
    }
  };

  return (
    <Fragment>
      <div style={{ fontSize: 20 }} className="txt tvl ml-auto">
        TVL ${numFormatter(value)} <br></br>
        <Countdown date={Date.now() + timeLeft * 1000} renderer={renderer} />,
      </div>
    </Fragment>
  );
}
