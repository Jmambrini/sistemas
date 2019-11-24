import React from "react";
import Component from "./pages/component/index";
import HeaderLogo from "./components/header/index";
import "./App.css";

function App() {
  return (
    <div className="App">
      <HeaderLogo />
      <Component />
    </div>
  );
}

export default App;
