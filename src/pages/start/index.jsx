import React from "react";
import Button from "antd/es/button";
import { Row, Col, Menu, Dropdown, Icon } from "antd";

import Firebase from "firebase";
import config from "../../components/config";
import moment from "moment";
import "./index.css";

moment.locale("pt-BR");

class Start extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);

    this.state = {
      map: [],
      disabled: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  writeParkData = () => {
    const aux = [];
    for (let j = 0; j < 56; j++) {
      aux.push(this.state.map[j].props.tag);
    }
    Firebase.database()
      .ref(`/parks/${moment().format("MMMM Do YYYY, h:mm:ss a")}`)
      .set(aux);
  };

  getParkData = () => {
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState({ map: state });
    });
    console.log("DATA RETRIEVED");
  };

  componentDidMount() {
    const aux = [];
    for (let j = 0; j < 56; j++) {
      aux.push(
        Math.floor(Math.random() * 7 + 1) === 1 ? (
          <div tag="ocupada" className="first">
            {" "}
            {j + 1}{" "}
          </div>
        ) : (
          <div tag="livre" className="first">
            {" "}
            {j + 1}{" "}
          </div>
        )
      );
    }
    this.setState({
      map: aux
    });
  }

  handleClick() {
    const change = [];
    for (let i = 0; i < 56; i++) {
      change.push(
        this.state.map[i].props.tag === "ocupada" ? (
          <div className="occupied" onClick={this.showModal}>
            {i + 1}
          </div>
        ) : (
          <div className="free">{i + 1}</div>
        )
      );
    }
    this.setState({
      map: change,
      disabled: true
    });

    this.writeParkData();
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button href="#">
            Selecionar dia <Icon type="down" />
          </Button>
        </Dropdown>
        <Button onClick={this.handleClick} disabled={this.state.disabled}>
          Procurar Vaga
        </Button>
        <div className="maps">
          <div className="title">Vagas disponíveis</div>
          <Row type="flex" justify="center" className="rowstyle">
            <Col>{this.state.map}</Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Start;
