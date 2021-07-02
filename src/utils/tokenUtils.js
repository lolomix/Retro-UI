require("dotenv").config();
const Contract = require("web3-eth-contract");
const bep20Abi = require("./bep20.js");

const provider = "https://bsc-dataseed1.ninicoin.io/";

async function getBalance(tokenAddress, userAddress) {
  await Contract.setProvider(provider);
  var token = new Contract(bep20Abi.data, tokenAddress);
  let data = await token.methods.balanceOf(userAddress).call();
  return data;
}

export default getBalance;
