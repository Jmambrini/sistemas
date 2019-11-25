import React from "react";
import Button from "antd/es/button";
import { Row, Col, message } from "antd";

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
      map2: [],
      disabled: false,
      called: false,
      menu: [],
      loading: false
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

  componentDidMount() {
    this.setState({ loading: true });

    const aux = [];
    for (let j = 0; j < 56; j++) {
      aux.push(
        Math.floor(Math.random() * 7 + 1) === 1 ? (
          <div tag="livre" className="first">
            {" "}
            {j + 1}{" "}
          </div>
        ) : (
          <div tag="ocupada" className="first">
            {" "}
            {j + 1}{" "}
          </div>
        )
      );
    }

    Firebase.database()
      .ref("/parks/")
      .on("value", snapshot => {
        const messageObject = snapshot.val();
        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));
          this.setState({
            menu: messageList,
            loading: false
          });
        } else {
          this.setState({ menu: null, loading: false });
        }
      });

    this.setState({
      map: aux
    });
  }

  showAlert = e => {
    if (this.state.called === false) {
      message.success(`A vaga ${e.target.id} foi reservada com sucesso!`);

      const aux = this.state.map;

      aux[e.target.id - 1] = (
        <div tag="reservada" className="reserved">
          {" "}
          {e.target.id}{" "}
        </div>
      );

      this.setState({
        map: aux,
        called: true
      });

      this.writeParkData();
    } else {
      message.warning("Você já reservou uma vaga!");
    }
  };

  handleClick() {
    const change = [];
    for (let i = 0; i < 56; i++) {
      change.push(
        this.state.map[i].props.tag === "ocupada" ? (
          <div className="occupied" tag="ocupada" id={i + 1}>
            {i + 1}
          </div>
        ) : (
          <div className="free" id={i + 1} tag="livre" onClick={this.showAlert}>
            {i + 1}
          </div>
        )
      );
    }
    this.setState({
      map: change,
      disabled: true
    });
  }

  render() {
    return (
      <div>
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
