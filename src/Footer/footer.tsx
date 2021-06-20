import React from "react";
import Social from "./social";

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="content">
          <div className="copyright">
            © 2021 Retro DeFi. All rights reserved.
          </div>
          <Social />
        </div>
      </footer>
    );
  }
}

export default Footer;
