import { useState, useEffect } from "react";
import Web3 from "web3";
import util from "../../../utils/aprLib/index";
import BigNumber from "bignumber.js";
import info from "../../../assets/svg/info-primary.svg";
import $ from "jquery";
import getBalance from "../../../utils/tokenUtils";
import poolAbi from "../../../utils/nativeFarmAbi";
import strategyAbi from "../../../utils/strategyAbi";
import { constants, utils } from "ethers";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
const BLOCKS_PER_DAY = new BigNumber((60 * 60 * 24) / 3);
const BLOCKS_PER_YEAR = new BigNumber(BLOCKS_PER_DAY * 365);
var QBERT_PERBLOCK;

const tokenAbi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "guy",
        type: "address"
      },
      {
        name: "wad",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "src",
        type: "address"
      },
      {
        name: "dst",
        type: "address"
      },
      {
        name: "wad",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "wad",
        type: "uint256"
      }
    ],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "dst",
        type: "address"
      },
      {
        name: "wad",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      },
      {
        name: "",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "src",
        type: "address"
      },
      {
        indexed: true,
        name: "guy",
        type: "address"
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "src",
        type: "address"
      },
      {
        indexed: true,
        name: "dst",
        type: "address"
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "dst",
        type: "address"
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256"
      }
    ],
    name: "Deposit",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "src",
        type: "address"
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256"
      }
    ],
    name: "Withdrawal",
    type: "event"
  }
];

const rcubeAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "destination",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256"
      },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "TransactionFailed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "_getBurnLevy",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "_getBurnRotations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "_getRotations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "_getTradedRotations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" }
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "qAmount", type: "uint256" }],
    name: "deliver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "excludeAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "includeAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" }
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isExcluded",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "qAmount", type: "uint256" },
      { internalType: "bool", name: "deductTransfebLevy", type: "bool" }
    ],
    name: "reflectionFromToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "burnLevy", type: "uint256" }],
    name: "setLevy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "bAmount", type: "uint256" }],
    name: "tokenFromReflection",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalBurn",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalLevies",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "transactions",
    outputs: [
      { internalType: "bool", name: "enabled", type: "bool" },
      { internalType: "address", name: "destination", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
export default function Pool(props) {
  var [balance, setBalance] = useState(0);
  var [depositState, setDepositState] = useState(0);
  var [withdrawState, setWithdrawState] = useState(0);
  var [poolInfo, setPoolInfo] = useState({
    pool: "",
    deposited: 0,
    allowonce: 0,
    pending: 0,
    price: 0,
    balance: 0,
    apr: 0,
    qbertPrice: 0,
    locked: true
  });
  var [loaded, setLoaded] = useState(false);
  const loadall = async () => {
    if (window.web3.eth) {
      try {
        window.ts.times = 1;
        await loadPool();
      } catch (error) {}
    }
  };

  const loadPool = async () => {
    try {
      let token = new web3.eth.Contract(tokenAbi, props.token_address);
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let strategy = new web3.eth.Contract(strategyAbi, props.poolAddress);
      let balanced = await getBalance(props.token_address, window.account);
      setBalance(balanced);
      var QBERT_PERBLOCK = await pool.methods.NATIVEPerBlock().call();
      let deposited = await pool.methods
        .stakedWantTokens(props.id, window.account)
        .call();
      let allowance = await token.methods
        .allowance(window.account, farmAddress)
        .call();
      let pendingBefore = poolInfo.pending;
      //console.log(pending);
      let pending = await pool.methods
        .pendingNATIVE(props.id, window.account)
        .call();
      let price;
      if (!poolInfo.price) {
        price = await tokenPrice();
      }
      let qbertPrice = await util.getTokenPrice(
        "0x6D45A9C8f812DcBb800b7Ac186F1eD0C055e218f",
        18
      );
      let locked;
      if (props.token_address == "0xa6e53f07bD410df069e20Ced725bdC9135146Fe9") {
        let rcube = new web3.eth.Contract(rcubeAbi, props.token_address);
        let burnAmount = await rcube.methods._getBurnLevy.call().call();
        console.log(burnAmount);
        if (burnAmount > 1) {
          locked = true;
        } else {
          locked = false;
        }
      }

      let balance;
      if (!props.isLp || props.isLpCompund) {
        balance = await strategy.methods.wantLockedTotal().call();
      } else {
        balance = await token.methods.balanceOf(props.poolAddress).call();
      }
      if (props.poolAddress == "0xB9468Ee4bEf2979615855aB1Eb6718505b1BB756") {
        //console.log(price);
      }

      let total = (balance / 10 ** props.decimals) * price;
      let apr = await calculateApr(pool, balance, price);
      if (!window.ts.added.includes(props.token_address)) {
        window.ts.value =
          window.ts.value + (balance / 10 ** props.decimals) * price;
        window.ts.deposited =
          window.ts.deposited + (deposited / 10 ** props.decimals) * price;
        window.ts.added.push(props.token_address);
      }

      await setPoolInfo({
        pool,
        deposited,
        allowance,
        pending,
        price,
        balance,
        apr,
        userBalance: balanced,
        qbertPrice: qbertPrice[0],
        locked
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function calculateApr(pool, balance, price) {
    let info = await pool.methods.poolInfo(props.id).call();
    let totalAlloc = await pool.methods.totalAllocPoint().call();
    let perBlock = await pool.methods.NATIVEPerBlock().call();
    var QBERT_PERBLOCK = perBlock / 10 ** 18;
    let poolAlloc = (perBlock * (info.allocPoint / totalAlloc)) / 10 ** 18;
    let perUint =
      (poolAlloc / ((balance / 10 ** props.decimals) * price)) * 1.9;
    let tvl = (balance / 10 ** props.decimals) * price;

    const yearlyQbertRewardAllocation = new BigNumber(QBERT_PERBLOCK)
      .times(BLOCKS_PER_YEAR)
      .times(info.allocPoint / totalAlloc);
    const apr = yearlyQbertRewardAllocation.times(0.6).div(tvl).times(100);

    //let apr = (BLOCKS_PER_DAY * (poolAlloc * 0.5)) / tvl;
    //let dd = 1.9 * (poolAlloc/3)  * 604800  * 52  / price / (balance / 10 ** props.decimals)

    const totalStaked = (balance / 10 ** props.decimals) * price;
    const totalRewardPricePerYear = new BigNumber(2)
      .times(poolAlloc)
      .times(BLOCKS_PER_YEAR);
    const aprr = totalRewardPricePerYear.div(totalStaked);
    //return apr * 365 * 50;
    return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber();
  }

  const maxButton = async (param) => {
    if (param == "deposit") {
      setDepositState(balance);
      let elem = document.getElementsByClassName("depositInput" + props.id);
      elem[0].value = balance / 10 ** props.decimals;
    } else if (param == "withdraw") {
      setWithdrawState(poolInfo.deposited);
      let elem = document.getElementsByClassName("withdrawInput" + props.id);
      elem[0].value = poolInfo.deposited / 10 ** props.decimals;
    }
  };

  const handdleInput = async (param, event) => {
    event.preventDefault();
    if (param == "withdraw" && event.target.value) {
      if (event.target.value) {
        setWithdrawState(parseFloat(event.target.value) * 10 ** props.decimals);
      } else {
        setWithdrawState(0);
      }
    } else if (event.target.value) {
      if (event.target.value) {
        setDepositState(parseFloat(event.target.value) * 10 ** props.decimals);
      } else {
        setDepositState(0);
      }
    }
  };

  async function tokenPrice() {
    if (!props.isLp) {
      if (!props.isBNB) {
        let tokenPrice = await util.getTokenPrice(
          props.price.lpaddress,
          props.decimals
        );
        tokenPrice = tokenPrice[props.price.reserve];
        return tokenPrice;
      } else {
        return 300;
      }
    } else {
      let value = await util.getLpPrice(
        props.price.lpaddress,
        props.tokenDecimals
      );
      value = value[props.price.reserve] * 2;

      let tokenPrice = await util.getTokenPrice(
        props.price.bnnlpaddress,
        props.tokenDecimals
      );

      tokenPrice = tokenPrice[props.price.reserve];
      return value * tokenPrice;
    }
  }

  async function approve() {
    let token = new web3.eth.Contract(tokenAbi, props.token_address);
    await token.methods
      .approve(farmAddress, constants.MaxUint256)
      .send({ from: window.account });
    let allowance = await token.methods
      .allowance(window.account, farmAddress)
      .call();
  }

  async function deposit() {
    if (balance >= depositState) {
      let depod = depositState.toLocaleString("fullwide", {
        useGrouping: false
      });
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let amount = new Web3.utils.toBN(depod).toString();
      await pool.methods
        .deposit(props.id, amount)
        .send({ from: window.account });

      setTimeout(async () => {
        let tokenStakeds = await pool.methods
          .stakedWantTokens(props.id, window.account)
          .call();
        window.ts.deposited =
          window.ts.deposited +
          (tokenStakeds / 10 ** props.decimals) * poolInfo.price;
      }, 4000);
    }
  }

  async function whitdraw() {
    if (poolInfo.deposited >= withdrawState) {
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let withs = withdrawState.toLocaleString("fullwide", {
        useGrouping: false
      });
      let amount = new Web3.utils.toBN(withs).toString();
      await pool.methods
        .withdraw(props.id, amount)
        .send({ from: window.account });

      setTimeout(async () => {
        let tokenStakeds = await pool.methods
          .stakedWantTokens(props.id, window.account)
          .call();
        window.ts.deposited =
          window.ts.deposited -
          (tokenStakeds / 10 ** props.decimals) * poolInfo.price;
      }, 4000);
    }
  }

  async function harvest() {
    let pool = new web3.eth.Contract(poolAbi, farmAddress);
    if (poolInfo.pending > 1e8) {
      await pool.methods.withdraw(props.id, 0).send({ from: window.account });
      let pendingQbert = await pool.methods
        .pendingNATIVE(props.id, window.account)
        .call();
    }
  }

  useEffect(async () => {
    if (!loaded) {
      setLoaded(true);
      setInterval(async () => {
        await loadall();
      }, 1000);
    }
  });

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
    } else if (num <= 999) {
      return num.toFixed(2); // if value < 1000, nothing to do
    }
  }

  let sd = () => {
    $(`div.details.id${props.id}`).slideToggle(500);
    $(`div.pool-card.id${props.id}`).toggleClass("expanded", true);
  };

  return (
    <div
      className={`pool-card  highlighted radioactive  ${props.special} id${props.id}`}
    >
      <div className="tag-container">
        {poolInfo.locked ? (
          <font
            style={{
              color: "red",
              fontSize: 15,
              backgroundColor: "var(--c-background-2)",
              borderRadius: "var(--r-border-2)",
              border: "#d40000 2px solid",
              padding: "2px 4px",
              boxShadow: "var(--t-shadow-3)"
            }}
          >
            Locked
          </font>
        ) : (
          <div className="mini-tag">
            {poolInfo.locked ? "Locked" : props.number_fee}
          </div>
        )}
      </div>
      <div className="info">
        <div className="symbols">
          <img src={"../images/" + props.image_name} />
          <img src={"../images/" + props.pair_image} />
        </div>
        <div className="pool">
          <div className="ttl">
            {props.name}
            <div className="sub-ttl"></div>
          </div>
          <div className="bottom">
            <div className="tag multiplier">{props.pool_multiplier}</div>
            <div className="provider ml-10">QBert</div>
          </div>
        </div>
        <div className="key-value apy shorter">
          <div className="val primary">{numFormatter(poolInfo.apr)}%</div>
          <div className="key">APR</div>
        </div>
        <div className="key-value balance">
          <div className="val">
            {poolInfo.userBalance
              ? (poolInfo.userBalance / 10 ** props.decimals).toFixed(2)
              : "***"}
          </div>
          <div className="key">Balance</div>
        </div>
        <div className="key-value deposited">
          <div className="val">
            {poolInfo.deposited
              ? (poolInfo.deposited / 10 ** props.decimals).toFixed(2)
              : "***"}
          </div>
          <div className="key">Deposited</div>
        </div>

        <div className="key-value daily shorter">
          <div className="val">
            {poolInfo.apr ? numFormatter(poolInfo.apr / 366) + "%" : "***"}
          </div>
          <div className="key">Daily</div>
        </div>
        <div className="key-value tvl shorter">
          <div className="val">
            {poolInfo.price
              ? "$" +
                numFormatter(
                  (poolInfo.balance / 10 ** props.decimals) * poolInfo.price
                )
              : "***"}
          </div>
          <div className="key">TVL</div>
        </div>
        <div>
          <a
            className="btn outlined ml-auto get"
            href={props.buy_url}
            target="_blank"
          >
            Get {props.name}
          </a>
        </div>
        <div
          onClick={() => {
            sd();
          }}
          className="btn expand ml-10"
        ></div>
      </div>
      <div className={`details id${props.id}`}>
        <div className="line"></div>
        <div className="transactions">
          <div className="transaction deposit no-bg">
            <div className="amount">
              <span className="ttl">Wallet:</span>
              <span className="val" data-display-decimals="6">
                {(poolInfo.userBalance / 10 ** props.decimals).toFixed(3)}{" "}
                <span className="estimate"></span>
              </span>
            </div>
            <div className="swap">
              <a href={props.buy_url}>Get {props.name}</a>
            </div>
            <div className="input-container number with-max">
              <input
                className={"depositInput" + props.id}
                onChange={(e) => handdleInput("deposit", e)}
                type="number"
                data-humanize="false"
                data-decimal-places="18"
              />
              <div
                onClick={() => {
                  maxButton("deposit");
                }}
                className="max"
              >
                MAX
              </div>
            </div>
            {parseInt(poolInfo.allowance) < parseInt(depositState) ? (
              <div
                className="btn secondary mt-20 deposit"
                onClick={() => {
                  approve();
                }}
              >
                Approve
              </div>
            ) : (
              <div
                className="btn mt-20 deposit"
                onClick={() => {
                  deposit();
                }}
                data-currency-contract="0x0000000000000000000000000000000000000000"
              >
                Deposit
              </div>
            )}
          </div>
          <div className="transaction withdraw">
            <div className="amount">
              <span className="ttl">Vault:</span>
              <span className="val" data-display-decimals="6">
                {poolInfo.deposited > 1e8
                  ? (poolInfo.deposited / 10 ** props.decimals).toFixed(3)
                  : 0}
                <span className="estimate"></span>
              </span>
            </div>
            <div className="input-container number with-max">
              <input
                className={"withdrawInput" + props.id}
                onChange={(e) => handdleInput("withdraw", e)}
                type="number"
                data-humanize="false"
                data-decimal-places="18"
              />
              <div
                onClick={() => {
                  maxButton("withdraw");
                }}
                className="max"
              >
                MAX
              </div>
            </div>
            <div
              onClick={() => {
                whitdraw();
              }}
              className="btn secondary mt-20 withdraw"
            >
              Withdraw to Wallet
            </div>
          </div>
          <div className="transaction harvest">
            <div className="ttl">Pending :</div>
            <div className="val">
              <span className="amount">
                {(poolInfo.pending / 10 ** 18).toFixed(2)}
              </span>
              <span style={{ fontSize: 13 }} className="value">
                {" "}
                ($
                {((poolInfo.pending / 10 ** 18) * poolInfo.qbertPrice).toFixed(
                  2
                )}
                )
              </span>
            </div>
            <div
              onClick={() => {
                harvest();
              }}
              className="btn primary harvest"
            >
              Harvest
            </div>
          </div>
        </div>
        <div className="farm-info">
          <div className="information">
            <div className="info">
              <div className="itm head">
                <span className="ttl">APR</span>
              </div>
              <div className="itm qbert-apy">
                <span className="ttl">{props.name} APR:&nbsp;</span>
                <span className="val">{numFormatter(poolInfo.apr)} %</span>
                <img className="tooltip" src={info}></img>
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
            </div>
            <div className="info">
              <div className="itm head">
                <span className="ttl">Farm</span>
              </div>

              <div className="itm qbert-daily-apy">
                <span className="ttl">{props.name} TVL:&nbsp;</span>
                <span className="val">
                  $
                  {numFormatter(
                    (poolInfo.balance / 10 ** props.decimals) * poolInfo.price
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
