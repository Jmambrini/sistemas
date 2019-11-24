import React from "react";
import Logo from "../../images/header.png";
import "./index.css";

class HeaderLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: []
    };
  }

  render() {
    return <img src={Logo} alt="logo" className="headerimage" />;
  }
}

export default HeaderLogo;
