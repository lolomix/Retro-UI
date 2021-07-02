import Web3 from "web3";
const Contract = require("web3-eth-contract");
const axios = require("axios");
const provider = "https://bsc-dataseed1.ninicoin.io/";
const bep20Abi = require("../bep20.js");
const poolAbi = require("./pool");
Contract.setProvider(provider);
const bnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const bnbPool = "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16";
const bnbContract = new Contract(bep20Abi.data, bnb);

async function getTokenPrice(poolAddress, decimals) {
  var pool = new Contract(poolAbi.data, poolAddress);
  let tokenInfo = await getTokensInfo(pool);
  let bnbPrice = await axios.get(
    "https://api.coingecko.com/api/v3/coins/binancecoin"
  );

  let tokenprice0 =
    (tokenInfo._reserve1 / 10 ** 18 / (tokenInfo._reserve0 / 10 ** decimals)) *
    bnbPrice.data.market_data.current_price.usd;
  let tokenprice1 =
    (tokenInfo._reserve0 / 10 ** decimals / (tokenInfo._reserve1 / 10 ** 18)) *
    bnbPrice.data.market_data.current_price.usd;

  return [tokenprice0, tokenprice1];
}

async function getTokensInfo(pool) {
  await Contract.setProvider(provider);
  let token0 = await pool.methods.token0().call();

  let token1 = await pool.methods.token1().call();
  let {
    _reserve0,
    _reserve1,
    _blockTimestampLast
  } = await pool.methods.getReserves().call();
  return { token0, token1, _reserve0, _reserve1 };
}

async function getLpPrice(poolAddress, decimals) {
  let pool = new Contract(poolAbi.data, poolAddress);

  let lpSupply = await pool.methods.totalSupply().call();
  let {
    _reserve0,
    _reserve1,
    _blockTimestampLast
  } = await pool.methods.getReserves().call();
  let amount0 = _reserve0 / 10 ** decimals / (lpSupply / 10 ** 18);
  let amount1 = _reserve1 / 10 ** 18 / (lpSupply / 10 ** 18);

  return [amount0, amount1];
}

export default { getTokenPrice, getLpPrice };
