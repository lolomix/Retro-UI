import React, { useEffect, useState } from "react";
import logo from "../assets/logos/logo.png";
import qbertpxl from "../assets/logos/qbertpxl.png";
import qbertdice from "../assets/logos/QBERTSWAG.png";
import Popup from "reactjs-popup";
import utils from "../utils/aprLib/index";
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
const qbertAddress = "0x6ED390Befbb50f4b492f08Ea0965735906034F81";

export default function Nav() {
  var [menu, setMenu] = useState(false);
  var [account, setAccount] = useState("");
  var [data, setData] = useState({ balance: 0, totalSupply: 0, price: 0 });

  const toggleMenu = () => {
    if (!menu) {
      setMenu(true);
    } else {
      setMenu(false);
    }
  };

  useEffect(async () => {
    if (window.account) {
      setAccount(window.account);
      setInterval(async () => {
        if (!data.loaded) {
          try {
            let qbert = new web3.eth.Contract(tokenAbi, qbertAddress);
            let balance = await qbert.methods.balanceOf(window.account).call();
            let totalSupply = await qbert.methods.totalSupply().call();
            let price = await utils.getTokenPrice(
              "0x6D45A9C8f812DcBb800b7Ac186F1eD0C055e218f",
              18
            );
            setData({
              balance: balance / 10 ** 18,
              totalSupply: totalSupply / 10 ** 18,
              price: price[0],
              loaded: true
            });
          } catch (error) {}
        }
      }, 1500);
    }
  });

  return (
    <header>
      <div className="top-notification hidden">
        <span className="txt"></span>
        <a className="btn-close"></a>
      </div>
      <div className="container">
        <div className="logo">
          <a href="/">
            <img src={logo} />
          </a>
        </div>
        <menu>
          <ul>
            <li className="selected">
              <a href="#">Earn</a>
            </li>
            <li>
              <a
                href="https://exchange.pancakeswap.finance/#/pool"
                target="_blank"
              >
                Create LP<div className="mini-tag">SWAP</div>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=3zsoLuEvTz8"
                target="_blank"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                href="https://retrodefi.gitbook.io/retro-defi/"
                target="_blank"
              >
                Docs
              </a>
            </li>
            <li>
              <a href="https://luckyqbert.retrofarms.net/" target="_blank">
                Lucky QBERT<div className="mini-tag">PLAY</div>
              </a>
            </li>
          </ul>
        </menu>
        <div className="wallet">
          <div className="qbert-price">
            <img src={qbertpxl} />
            <div className="txt ml-10 price">${data.price.toFixed(2)}</div>
          </div>
          <Popup
            trigger={
              <a className="btn small ml-20 primary buy-qbert hidden">
                {" "}
                QBERT Stats{" "}
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <div className="popup-container visible">
                <div
                  id="popup-buy-qbert"
                  className="popup"
                  style={{ display: "block" }}
                >
                  <div className="header">
                    <div className="ttl">Your Qbert</div>
                    <img
                      className="btn close"
                      src="static/frontend/img/popup-close.svg"
                      onClick={close}
                    />
                  </div>
                  <div className="content">
                    <img src="images/qbert.png" />
                    <div className="balance">{data.balance.toFixed(2)}</div>
                    <div className="key-value">
                      <div className="key">Price</div>
                      <div className="value qbert-price">
                        ${data.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Current Supply</div>
                      <div className="value qbert-supply">
                        {data.totalSupply.toFixed(3)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Market Cap</div>
                      <div className="value market-cap">-</div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Contract Address</div>
                      <div className="value qbert-contract">
                        <span />
                        <img
                          className="copy"
                          src="static/frontend/img/copy.svg"
                        />
                      </div>
                    </div>
                    <a
                      className="chart"
                      target="_blank"
                      href="https://dex.guru/token/0x6ed390befbb50f4b492f08ea0965735906034f81-bsc"
                    >
                      View chart
                    </a>
                    <a
                      className="btn primary buy"
                      target="_blank"
                      href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x6ED390Befbb50f4b492f08Ea0965735906034F81"
                    >
                      Buy QBERT
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Popup>
          <a
            style={{
              textOverflow: "ellipsis",
              maxWidth: 150,
              whiteSpace: "nowrap",
              overflow: "hidden",
              display: "none"
            }}
            className="btn small ml-10 "
            id="btn-wallet-unlock"
          >
            {account ? account : "Unlock Wallet"}
          </a>
          <div className="balance ml-10">
            <span className="qbert-balance">
              {data.balance.toFixed(1)} QBERT
            </span>
            <div className="wallet-info">
              <span
                className="wallet-address"
                style={{
                  textOverflow: "ellipsis",
                  maxWidth: 160,
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }}
              >
                {account ? account : "Unlock Wallet"}
              </span>
              <span className="icon ml-10"></span>
            </div>
          </div>
        </div>
        <div
          onClick={(e) => {
            toggleMenu();
          }}
          className="hamburger"
        >
          <svg viewBox="0 0 18 15">
            <path
              fill="#3C4E5A"
              d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"
            />
            <path
              fill="#3C4E5A"
              d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"
            />
            <path
              fill="#3C4E5A"
              d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"
            />
          </svg>
        </div>
      </div>
      <div className={`mobile-menu ${menu ? "visible" : null}`}>
        <div className="wallet">
          <a
            className="btn small ml-10 btn-wallet"
            id="btn-wallet-unlock"
            style={{ display: "none" }}
          >
            {account ? account : "Unlock Wallet"}
          </a>
          <div className="balance ml-10">
            <span className="qbert-balance">
              {data.balance.toFixed(1)} QBERT
            </span>
            <div className="wallet-info">
              <span
                className="wallet-address"
                style={{
                  textOverflow: "ellipsis",
                  maxWidth: 130,
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }}
              >
                {account ? account : "Unlock Wallet"}
              </span>
              <span className="icon ml-10"></span>
            </div>
          </div>
          <div className="break"></div>
          <div className="qbert-price">
            <img src={qbertpxl} />
            <div className="txt ml-10 price">${data.price.toFixed(2)}</div>
          </div>
          <Popup
            trigger={
              <a className="btn small ml-20 primary buy-qbert"> QBERT Stats </a>
            }
            modal
            nested
          >
            {(close) => (
              <div className="popup-container visible">
                <div
                  id="popup-buy-qbert"
                  className="popup"
                  style={{ display: "block" }}
                >
                  <div className="header">
                    <div className="ttl">Your Qbert</div>
                    <img
                      className="btn close"
                      src="static/frontend/img/popup-close.svg"
                      onClick={close}
                    />
                  </div>
                  <div className="content">
                    <img src="images/qbert.png" />
                    <div className="balance">{data.balance.toFixed(2)}</div>

                    <div className="key-value">
                      <div className="key">Price</div>
                      <div className="value qbert-price">
                        ${data.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Current Supply</div>
                      <div className="value qbert-supply">
                        {data.totalSupply.toFixed(2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Market Cap</div>
                      <div className="value market-cap">-</div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Contract Address</div>
                      <div className="value qbert-contract">
                        <span />
                        <img
                          className="copy"
                          src="static/frontend/img/copy.svg"
                        />
                      </div>
                    </div>
                    <a
                      className="chart"
                      target="_blank"
                      href="https://dex.guru/token/0x6ed390befbb50f4b492f08ea0965735906034f81-bsc"
                    >
                      View chart
                    </a>
                    <a
                      className="btn primary buy"
                      target="_blank"
                      href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x6ED390Befbb50f4b492f08Ea0965735906034F81"
                    >
                      Buy QBERT
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Popup>
        </div>
        <div className="menu ">
          <ul>
            <li>
              <a href="#">Earn</a>
            </li>
            <li>
              <a href="https://exchange.pancakeswap.finance/#/pool">
                Create LP
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/watch?v=3zsoLuEvTz8">
                Tutorials
              </a>
            </li>
            <li>
              <a href="https://retrodefi.gitbook.io/retro-defi/">Docs</a>
            </li>
            <li>
              <a href="https://luckyqbert.retrofarms.net/">
                <img
                  src={qbertdice}
                  style={{
                    height: 35,
                    width: 35,
                    marginBottom: -10,
                    marginRight: 10
                  }}
                />
                Lucky QBERT
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
