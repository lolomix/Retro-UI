import Web3 from "web3";
import Countdown from "react-countdown";
import { load } from "dotenv";
import { Fragment, useState, useEffect } from "react";
import nativeFarmAbi from "../../utils/nativeFarmAbi";
import config from "../../pools_config.json";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
export default function Tvl() {
  var [value, setValue] = useState(0);
  var [timeLeft, setTimeLeft] = useState(5);
  var [loaded, setLoaded] = useState(false);
  var [text, setText] = useState("...");

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num.toFixed(2); // if value < 1000, nothing to do
    }
  }

  function renderer({ hours, minutes, seconds, completed, api }) {
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
  }

  return (
    <Fragment>
      <div style={{ fontSize: 20 }} className="txt tvl ml-auto">
        TVL ${numFormatter(value)} <br></br>
        <Countdown date={Date.now() + timeLeft * 1000} renderer={renderer} />,
      </div>
    </Fragment>
  );
}
