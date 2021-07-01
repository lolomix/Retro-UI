import { useState, useEffect } from "react";
import Web3 from "web3";
import util from "../../../utils/aprLib/index";
import BigNumber from "bignumber.js";
import info from "../../../assets/svg/info-primary.svg";
import $ from "jquery";
import getBalance from "../../../utils/tokenUtils";
import poolAbi from "../../../utils/nativeFarmAbi";
import strategyAbi from "../../../utils/strategyAbi";
import { constants } from "ethers";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
const BLOCKS_PER_YEAR = new BigNumber(((60 * 60 * 24) / 3) * 365);
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
    apr: 0
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
      let deposited = await pool.methods
        .stakedWantTokens(props.id, window.account)
        .call();
      let allowance = await token.methods
        .allowance(window.account, farmAddress)
        .call();
      let pendingBefore = poolInfo.pending;
      console.log(pending);
      let pending = await pool.methods
        .pendingNATIVE(props.id, window.account)
        .call();
      let price;
      if (!poolInfo.price) {
        price = await tokenPrice();
      }

      let balance;
      if (!props.isLp || props.isLpCompund) {
        balance = await strategy.methods.wantLockedTotal().call();
      } else {
        balance = await token.methods.balanceOf(props.poolAddress).call();
      }
      if (props.poolAddress == "0xB9468Ee4bEf2979615855aB1Eb6718505b1BB756") {
        console.log(price);
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
        userBalance: balanced
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function calculateApr(pool, balance, price) {
    let info = await pool.methods.poolInfo(props.id).call();
    let totalAlloc = await pool.methods.totalAllocPoint().call();
    let perBlock = await pool.methods.NATIVEPerBlock().call();
    let poolAlloc = (perBlock * (info.allocPoint / totalAlloc)) / 10 ** 18;
    let perUint =
      (poolAlloc / ((balance / 10 ** props.decimals) * price)) * 1.9;
    let tvl = (balance / 10 ** props.decimals) * price;

    let apr = (28800 * (poolAlloc * 1.66)) / tvl;
    //let dd = 1.9 * (poolAlloc/3)  * 604800  * 52  / price / (balance / 10 ** props.decimals)

    const totalStaked = (balance / 10 ** props.decimals) * price;
    const totalRewardPricePerYear = new BigNumber(2)
      .times(poolAlloc)
      .times(BLOCKS_PER_YEAR);
    const aprr = totalRewardPricePerYear.div(totalStaked);
    return apr * 356 * 100;
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

  function formatNumber(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K";
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "K";
    } else if (num < 999) {
      return num;
    }
  }

  const deposit = async () => {
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
  };

  const whitdraw = async () => {
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
  };

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
      }, 1500);
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
    <div className={`pool-card  highlighted radioactive id${props.id}`}>
      <div className="tag-container">
        <div className="mini-tag">{props.number_fee}</div>
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
          <div className="key">Yearly</div>
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
                {((poolInfo.pending / 10 ** 18) * 1.5).toFixed(2)})
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
                <span className="ttl">Annual</span>
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
