require('dotenv').config()
const Contract = require('web3-eth-contract');
const bep20Abi = require('./bep20.js')

const provider = 'https://data-seed-prebsc-1-s1.binance.org:8545'

async function getBalance(tokenAddress, userAddress) {
  await Contract.setProvider(provider);
  var token = new Contract(bep20Abi.data, tokenAddress);
  let data = await token.methods.balanceOf(userAddress).call()
  return data;
}

export default getBalance