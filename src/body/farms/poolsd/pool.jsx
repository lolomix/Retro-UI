
import info from '../../../assets/svg/info-primary.svg'
import $ from 'jquery'
import getBalance from '../../../utils/tokenUtils'
import poolAbi from '../../../utils/nativeFarmAbi'
import { constants } from "ethers";
const farmAddress = '0x38f8595f7fc49c43D058224d7ce79730afEEe730'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import getTokenPrice from '../../../utils/aprLib/index'
const tokenAbi = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "guy",
        "type": "address"
    }, {
        "name": "wad",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "src",
        "type": "address"
    }, {
        "name": "dst",
        "type": "address"
    }, {
        "name": "wad",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "wad",
        "type": "uint256"
    }],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "dst",
        "type": "address"
    }, {
        "name": "wad",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }, {
        "name": "",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "src",
        "type": "address"
    }, {
        "indexed": true,
        "name": "guy",
        "type": "address"
    }, {
        "indexed": false,
        "name": "wad",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "src",
        "type": "address"
    }, {
        "indexed": true,
        "name": "dst",
        "type": "address"
    }, {
        "indexed": false,
        "name": "wad",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "dst",
        "type": "address"
    }, {
        "indexed": false,
        "name": "wad",
        "type": "uint256"
    }],
    "name": "Deposit",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "src",
        "type": "address"
    }, {
        "indexed": false,
        "name": "wad",
        "type": "uint256"
    }],
    "name": "Withdrawal",
    "type": "event"
}];


export default function Pool(props) {
    var [balance, setBalance] = useState(0)
    var [depositState, setDepositState] = useState(0)
    var [withdrawState, setWithdrawState] = useState(0)
    var [poolInfo, setPoolInfo] = useState(
        {pool:'',deposited: 0, allowonce:0, pending:0, price:0, balance:0, apr:0})
    var [loaded, setLoaded] = useState(false)
    const loadall = async ()=>{
        if(window.web3){
            try {
                let balanced = await getBalance(props.token_address,window.account)
                setBalance(balanced)
                await loadPool()
              
            } catch (error) {console.log(error)}    
        }
    }

    const loadPool = async ()=>{
        try {
            
            let token = new web3.eth.Contract(tokenAbi, props.token_address)
            let pool = new web3.eth.Contract(poolAbi, farmAddress)
            let deposited = await pool.methods.stakedWantTokens(props.id, window.account).call()
            let allowance = await token.methods.allowance(window.account, farmAddress).call()
            let pending = await pool.methods.pendingNATIVE(props.id, window.account).call()
            let price = await tokenPrice()
            let balance = await token.methods.balanceOf(props.poolAddress).call()
            let apr = await calculateApr(pool, balance);
            setLoaded(true)
            await setPoolInfo({pool, deposited, allowance, pending, price, balance,apr})
            
            
        } catch (error) {}
        
    }

    async function calculateApr(pool, balance) {
        let info = await pool.methods.poolInfo(props.id).call()
        let totalAlloc = await pool.methods.totalAllocPoint().call()
        let perBlock = await pool.methods.NATIVEPerBlock().call()
        let poolAlloc = perBlock * (info.allocPoint/totalAlloc) / 10 **18
        let perUint = poolAlloc / (balance / 10 ** props.decimals) * 1.5 // Cambiar 1.5 por el precio de qubert
        let apr = perUint * ((60 * 60 * 24 * 366 )/ 3)
        return apr;
    }

    const maxButton = async (param)=>{
        if(param == 'deposit'){
            setDepositState(balance)
            let elem = document.getElementsByClassName('depositInput')
            elem[0].value = (balance / 10**props.decimals)
        } else if(param == 'withdraw') {
            setWithdrawState(poolInfo.deposited)
            let elem = document.getElementsByClassName('withdrawInput')
            elem[0].value = (poolInfo.deposited / 10**props.decimals)
        }
        
    }

    const handdleInput = async (param, event)=>{
        event.preventDefault()
        if(param == 'withdraw' && event.target.value){
            if(event.target.value){
               
                setWithdrawState(parseFloat(event.target.value) * (10**props.decimals))
            } else {
                setWithdrawState(0)
            }
        } else if(event.target.value) {
            if(event.target.value){
                setDepositState(parseFloat(event.target.value) * (10**props.decimals))
            } else {
                setDepositState(0)
            }
        }
    }

    

    async function tokenPrice() {
        if(!props.isLp){
            let tokenPrice = await getTokenPrice(props.price.lpaddress , props.decimals)
            tokenPrice = tokenPrice[props.price.reserve]
            return tokenPrice;
        }
    }

   async function approve() {
    let token = new web3.eth.Contract(tokenAbi, props.token_address)
    await token.methods.approve(farmAddress, constants.MaxUint256).send({from: window.account})
    let allowance = await token.methods.allowance(window.account, farmAddress).call()
    await loadall()
   }

   function formatNumber(num) {
    if(num>999 && num < 1000000){
        return (num/1000).toFixed(1)+ 'K'
    } else if (num > 1000000){
        return(num/1000000).toFixed(1) + 'K'
    } else if (num < 999) {
        return num
    }
}

   const deposit = async ()=> {
       if(balance >= depositState){
          
          let depod = (depositState).toLocaleString('fullwide', {useGrouping:false})
          let pool = new web3.eth.Contract(poolAbi, farmAddress)
          let amount = new Web3.utils.toBN(depod).toString()
          await pool.methods.deposit(props.id, amount).send({from: window.account})
          await loadall()
       }  
   }

   const whitdraw = async ()=> {
    if(poolInfo.deposited >= withdrawState){
       let pool = new web3.eth.Contract(poolAbi, farmAddress)
       let withs = (withdrawState).toLocaleString('fullwide', {useGrouping:false})
       let amount = new Web3.utils.toBN(withs).toString()
       await pool.methods.withdraw(props.id, amount).send({from: window.account})
       await loadall()
    }  
}
    
    useEffect( async ()=>{
        if(!loaded){
            await loadall()
            setInterval(async () => {
                await loadall()
            }, 1000);
        }
        
    })
    
    function numFormatter(num) {
        if(num > 999 && num < 1000000){
            return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
        }else if(num > 1000000){
            return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
        }else if(num < 900){
            return (num).toFixed(2); // if value < 1000, nothing to do
        }
    }
    
    let sd = ()=>{
        $(`div.details.id${props.id}`).slideToggle(1500)
        $(`div.pool-card.id${props.id}`).toggleClass('expanded', true)    
    }
    
  return(<div className={`pool-card  highlighted id${props.id}`} data-pid="1" data-pool-type="1" data-platform="2" data-platform-swap-single-url="https://exchange.pancakeswap.finance/#/swap?outputCurrency=" data-platform-swap-lp-url="https://exchange.pancakeswap.finance/#/add/" data-platform-swap-lp-with-gas-url="https://exchange.pancakeswap.finance/#/add/BNB/" data-platform-zap-enabled="true" data-currencies="[3, -1, 3]" data-pool-title="RCUBE" data-pool-subtitle="" data-currency-id="3" data-currency-name="RCube" data-currency-ticker="RCUBE" data-currency-contract="0x0000000000000000000000000000000000000000" data-strategy-contract-address="0x0000000000000000000000000000000000000000" data-custom-swap-url="false" data-is-lp="false" data-token0-ticker="qbert" data-token0-contract="0x0000000000000000000000000000000000000000" data-token0-is-gas="false" data-updated="false" data-deposited="0" data-pending="0" data-balance="0" data-apy="284.29231967" data-daily="0.7788830675890410958904109589" data-tvl="4746112.42832821" data-gas-limit-tx="1">
  <div className="tag-container"></div>
  <div className="info">
      <div className="symbols">
          <img src={window.location.href + '/images/' + props.image_name}/>
      </div>
      <div className="pool">
          <div className="ttl">
              {props.name}
<div className="sub-ttl"></div>
          </div>
          <div className="bottom">
              <div className="tag multiplier">50x</div>
              <div className="provider ml-10">QBert</div>
          </div>
      </div>
      <div className="key-value apy shorter">
          <div className="val primary">{numFormatter(poolInfo.apr)}%
</div>
          <div className="key">Yearly</div>
      </div>
      <div className="key-value balance">
          <div className="val">{(balance / 10**18).toFixed(2)}</div>
          <div className="key">Balance</div>
      </div>
      <div className="key-value deposited">
          <div className="val">{(poolInfo.deposited / 10**props.decimals).toFixed(2)}</div>
          <div className="key">Deposited</div>
      </div>
      
      <div className="key-value daily shorter">
          <div className="val">{numFormatter(poolInfo.apr / 366)}%
</div>
          <div className="key">Daily</div>
      </div>
      <div className="key-value tvl shorter">
          <div className="val">${numFormatter((poolInfo.balance / 10 ** props.decimals) * poolInfo.price)}
</div>
          <div className="key">TVL</div>
      </div>
      <div className="btn outlined loading ml-auto get">Get {name}</div>
      <div onClick={()=>{sd()}} className="btn expand ml-10"></div>
  </div>
  <div className={`details id${props.id}`}>
      <div className="line"></div>
      <div className="transactions">
          <div className="transaction deposit no-bg">
              <div className="amount">
                  <span className="ttl">Wallet:</span>
                  <span className="val" data-display-decimals="6">
                      {(balance / 10 ** props.decimals).toFixed(3)} <span className="estimate"></span>
                  </span>
              </div>
              <div className="swap">
                  <a href={props.buy_url}>Get {props.name}</a>
              </div>
              <div className="input-container number with-max">
                  <input className="depositInput" onChange={(e) => handdleInput("deposit", e)} type="number" data-humanize="false" data-decimal-places="18" />
                  <div onClick={()=>{maxButton('deposit')}} className="max">MAX</div>
                  
              </div>
              {parseInt(poolInfo.allowance )< parseInt(depositState)? 
               <div className="btn secondary mt-20 deposit"  onClick={()=>{approve()}}>Approve</div>:
               <div className="btn mt-20 deposit" onClick={()=>{deposit()}}  data-currency-contract="0x0000000000000000000000000000000000000000">Deposit</div>}
             
          </div>
          <div className="transaction withdraw">
              <div className="amount">
                  <span className="ttl">Vault:</span>
                  <span className="val" data-display-decimals="6">
                  { poolInfo.deposited > 1e8? (poolInfo.deposited / 10 ** props.decimals).toFixed(3): 0}<span className="estimate"></span>
                  </span>
              </div>
              <div className="input-container number with-max">
                  <input className="withdrawInput" onChange={(e) => handdleInput('withdraw', e)} type="number" data-humanize="false" data-decimal-places="18"/>
                  <div onClick={()=>{maxButton('withdraw')}} className="max">MAX</div>
              </div>
              <div onClick={()=>{whitdraw()}} className="btn secondary mt-20 withdraw">Withdraw to Wallet
</div>
          </div>
          <div className="transaction harvest">
              <div className="ttl">Pending :</div>
              <div className="val">
                  <span className="amount">{(poolInfo.pending / 10**props.decimals).toFixed(2) }</span>
                  <span style={{fontSize: 13}} className="value"> (${((poolInfo.pending / 10**props.decimals) * poolInfo.price).toFixed(2)})</span>
              </div>
              <div className="btn primary harvest">Harvest</div>
          </div>
      </div>
      <div className="farm-info">
          <div className="information">
              <div className="info">
                  <div className="itm head">
                      <span className="ttl">Annual</span>
                  </div>
                  <div className="itm qbert-apy">
                      <span className="ttl">{props.name} APR:&nbsp;</span>
                      <span className="val">{numFormatter(poolInfo.apr)} %</span>
                      <img className="tooltip" src={info}></img>
                      
                  </div>
                  <div className="itm total-apy">
                      <span className="ttl">Total Returns:&nbsp;</span>
                      <span className="val highlight">{numFormatter(poolInfo.apr)}%</span>
                  </div>
              </div>
              <div className="info">
                  <div className="itm head">
                      <span className="ttl">Daily</span>
                  </div>
                  <div className="itm qbert-daily-apy">
                      <span className="ttl">{props.name} Daily:&nbsp;</span>
                      <span className="val">{numFormatter(poolInfo.apr / 366)}%</span>
                  </div>
                  <div className="itm total-daily-apy">
                      <span className="ttl">Total Daily:&nbsp;</span>
                      <span className="val highlight">0.78%</span>
                  </div>
              </div>
              <div className="info">
                  <div className="itm head">
                      <span className="ttl">Farm</span>
                  </div>
                  <div className="itm pond-daily-apy">
                      <span className="ttl">Weight:&nbsp;</span>
                      <span className="val">50x</span>
                  </div>
                  <div className="itm qbert-daily-apy">
                      <span className="ttl">{props.name} TVL:&nbsp;</span>
                      <span className="val">${numFormatter((poolInfo.balance / 10 ** props.decimals) * poolInfo.price)}</span>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>
)
}