import React, { Component } from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";

import "./public/css/login.css";

import FormCadastro from "./componentes/FormCadastro";
import PrivateRoute from "./componentes/PrivateRoute";

import Home from "./routes/Home";

import Auth from "./utilitarios/autenticador.js";

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import { content } from "./reducers/content";

const store = createStore(content, applyMiddleware(thunkMiddleware));

// const apiBaseUrl =
//   process.env.NODE_ENV === "development" ? "http://localhost:3001/" : "/";

const apiBaseUrl = "/";

export default class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={FormLogin} />
          <Route path="/cadastro" component={FormCadastro} />
          <PrivateRoute Auth={Auth} path="/home" component={Home} />
        </Switch>
      </main>
    );
  }
}

class FormLogin extends Component {
  constructor() {
    super();
    this.state = { msg: "", redirectToReferrer: false };
  }

  componentWillMount() {
    Auth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  }

  envia(event) {
    event.preventDefault();

    const requestInfo = {
      method: "POST",
      body: JSON.stringify({
        email: this.email.value,
        senha: this.senha.value
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    };

    fetch(`${apiBaseUrl}api/autentica`, requestInfo)
      .then(res => {
        return res.json();
      })
      .then(mid => {
        if (mid.success === false) {
          const temp = mid.message;
          throw new Error(temp);
        } else if (mid.success === true) {
          this.setState({
            msg: mid.message,
            nome: "",
            email: ""
          });
          localStorage.setItem("auth-token", mid.token);

          Auth.authenticate(() => {
            this.setState({ redirectToReferrer: true });
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ msg: error.message });
      });
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/home" }
    };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div className="log-form">
        <div>
          <h2>Login</h2>
          <span>{this.state.msg}</span>
          <form onSubmit={this.envia.bind(this)} method="post">
            <label>E-mail</label>

            <input
              id="email"
              type="email"
              name="email"
              ref={input => (this.email = input)}
            />
            <label>Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              ref={input => (this.senha = input)}
            />

            <button type="submit" className="btn">
              Login
            </button>
            <Link className="forgot" href="#" to="/cadastro">
              Criar nova conta
            </Link>
          </form>
        </div>
      </div>
    );
  }
}
