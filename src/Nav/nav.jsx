import logo from '../assets/logos/logo.png'
import qbertpxl from '../assets/logos/qbertpxl.png'
import React, {useEffect, useState} from 'react'

export default function Nav() {
  var [menu, setMenu] = useState(false);
  var [account, setAccount] = useState('');
  
  const toggleMenu = ()=> {
      if(!menu){
         setMenu(true)
      }else{
         setMenu(false)
      }
  };

  useEffect(()=>{
      if(window.account){
        setAccount(window.account)
       
      }
  })

  return(
    <header>
            <div className="top-notification hidden">
                <span className="txt"></span>
                <a className="btn-close"></a>
            </div>
            <div className="container">
                <div className="logo">
                    <a href="/">
                        <img src={logo}/> 
                    </a>
                </div>
                <menu>
                    <ul>
                        <li className="selected">
                            <a href="#">Earn</a>
                        </li>
                        <li>
                            <a href="#">
                                Create LP<div className="mini-tag">NEW</div>
                            </a>
                        </li>
                        <li>
                            <a href="#">Tutorials</a>
                        </li>
                        <li>
                            <a href="#" target="_blank">Docs</a>
                        </li>
                        <li>
                            <a href="#">Buy BNB</a>
                        </li>
                        <li>
                            <a href="#">Download Wallet</a>
                        </li>
                    </ul>
                </menu>
                <div className="wallet">
                    <div className="qbert-price">
                        <img src={qbertpxl}/>
                        <div className="txt ml-10 price">$17.02</div>
                    </div>
                    <a className="btn small ml-20 primary buy-qbert hidden">Buy QBERT</a>
                    <a className="btn small ml-10 btn-wallet" id="btn-wallet-unlock">{account? account: 'Unlock Wallet'}</a>
                    <div className="balance ml-10 hidden">
                        <span className="qbert-balance">0.00 QBERT</span>
                        <div className="wallet-info">
                            <span className="wallet-address">...</span>
                            <span className="icon ml-10"></span>
                        </div>
                    </div>
                </div>
                <div onClick={(e)=>{toggleMenu()}} className="hamburger">
                    <svg viewBox="0 0 18 15">
                        <path fill="#3C4E5A" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"/>
                        <path fill="#3C4E5A" d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"/>
                        <path fill="#3C4E5A" d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"/>
                    </svg>
                </div>
            </div>
            <div className={`mobile-menu ${menu? "visible": null}`}>
                <div className="wallet">
                    <a className="btn small ml-10 btn-wallet" id="btn-wallet-unlock">{account? account: 'Unlock Wallet'}</a>
                    <div className="balance ml-10 hidden">
                        <span className="qbert-balance">0 QBERT</span>
                        <div className="wallet-info">
                            <span className="wallet-address">...</span>
                            <span className="icon ml-10"></span>
                        </div>
                    </div>
                    <div className="break"></div>
                    <div className="qbert-price">
                        <img src={qbertpxl}/>
                        <div className="txt ml-10 price">$17.02</div>
                    </div>
                    <a className="btn small ml-20 primary buy-qbert">Buy QBERT</a>
                </div>
                <div className="menu ">
                    <ul>
                        <li className="selected">
                            <a href="#">Earn</a>
                        </li>
                        <li>
                            <a href="#">Create LP</a>
                        </li>
                        <li>
                            <a href="#">Tutorials</a>
                        </li>
                        <li>
                            <a href="#">Docs</a>
                        </li>
                        <li>
                            <a href="#">Buy BNB</a>
                        </li>
                        <li>
                            <a href="#">Download Wallet</a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
  )
}
