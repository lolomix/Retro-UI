import Web3 from "web3";
import farmAbi from "./nativeFarmAbi";
import config from "../pools_config.json";
const Contract = require("web3-eth-contract");
const provider = "https://bsc-dataseed1.ninicoin.io/";

const poolAbi = require("./aprLib/pool");
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
const axios = require("axios");

function send(results, status) {
  return new Promise(async (resolve, reject) => {
    for (var i = 0; i < config.length; i++) {
      let poolConfig = config[i];
      const pool = new window.web3.eth.Contract(farmAbi, farmAddress);
      let deposited = await pool.methods
        .stakedWantTokens(poolConfig.id, window.account)
        .call();
      let price = await tokenPrice(poolConfig);
      console.log("xd");
    }
    resolve();
  });
}

async function tokenPrice(poolConfig) {
  if (!poolConfig.isLp) {
    let tokenPrice = await getTokenPrice(
      poolConfig.price.lpaddress,
      poolConfig.decimals
    );
    tokenPrice = tokenPrice[poolConfig.price.reserve];
    return tokenPrice;
  } else {
    let value = await getLpPrice(
      poolConfig.price.lpaddress,
      poolConfig.decimals
    );
    value = value[poolConfig.price.reserve] * 2;
    let tokenPrice = await getTokenPrice(
      poolConfig.price.bnnlpaddress,
      poolConfig.decimals
    );

    tokenPrice = tokenPrice[poolConfig.price.reserve];
    return value * tokenPrice;
  }
}

// Prices steels
async function getTokenPrice(poolAddress, decimals) {
  var pool = new Contract(poolAbi.data, poolAddress);

  let tokenInfo = await getTokensInfo(pool);
  let bnbPrice = await axios.get(
    "https://api.coingecko.com/api/v3/coins/binancecoin"
  );

  let tokenprice0 =
    (tokenInfo._reserve1 / 10 ** 18 / (tokenInfo._reserve0 / 10 ** 8)) *
    bnbPrice.data.market_data.current_price.usd;
  let tokenprice1 =
    (tokenInfo._reserve0 / 10 ** 8 / (tokenInfo._reserve1 / 10 ** 18)) *
    bnbPrice.data.market_data.current_price.usd;
  return [tokenprice0, tokenprice1];
}

async function getTokensInfo(pool) {
  let token0 = await pool.methods.token0().call();
  let token1 = await pool.methods.token1().call();
  let {
    _reserve0,
    _reserve1,
    _blockTimestampLast
  } = await pool.methods.getReserves().call();
  return { _reserve0, _reserve1, _blockTimestampLast };
}

async function getLpPrice(poolAddress, decimals) {
  let pool = Contract(poolAbi.data, poolAddress);

  let lpSupply = await pool.methods.totalSupply().call();
  let { _reserve0, _reserve1, _blockTimestampLast } = await getTokensInfo();
  let amount0 = _reserve0 / 10 ** decimals / (lpSupply / 10 ** 18);
  let amount1 = _reserve1 / 10 ** decimals / (lpSupply / 10 ** 18);

  return [amount0, amount1];
}

export default send;
