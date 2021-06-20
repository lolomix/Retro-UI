import React from "react";

class Social extends React.Component {
  render() {
    return (
      <div className="social">
        <a
          href="https://github.com/RetroDefi"
          target="_blank"
          aria-label="github"
        >
          <img src="static/frontend/img/social/github.svg" />
        </a>
        <a
          href="https://twitter.com/retrodefi"
          target="_blank"
          aria-label="twitter"
        >
          <img src="static/frontend/img/social/twitter.svg" />
        </a>
        <a
          href="https://t.me/retrodefibsc"
          target="_blank"
          aria-label="telegram"
        >
          <img src="static/frontend/img/social/telegram.svg" />
        </a>
      </div>
    );
  }
}

export default Social;
