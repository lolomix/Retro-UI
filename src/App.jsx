import React from "react";
import Nav from "./Nav/nav.jsx";
import Background from "./body/background";
import Farms from "./body/farms/index";
import Footer from "./Footer";
//import Web3 from "web3";
import getWeb3 from "./utils/web3Utils";
//import Util from "./utils/aprLib/index.js";
//import nativeFarmAbi from "./utils/nativeFarmAbi.js";

export default class App extends React.Component {
  componentDidMount = async () => {
    getWeb3()
      .then(() => {
        this.forceUpdate();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <div className="App">
        <main className="app preload">
          <Nav />
          <Background />
          <Farms />
          <Footer />
        </main>
      </div>
    );
  }
}
