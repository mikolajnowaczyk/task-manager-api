import React from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// import { isEmpty } from "lodash";
import { connect } from "react-redux";
import * as actions from "../store/actions/index";

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      email: "mikolajnowaczyk95@gmail.com",
      password: "Test123#@!",
      error: null,
      isSignup: false,
    };
    // this.sendRequest = this.sendRequest.bind(this);
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.email,
      this.state.password,
      this.state.isSignup
    );
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return { isSignup: !prevState.isSignup };
    });
  };

  render() {
    if(this.state.isLoading){return(<p>Loading...</p>)};
    return (
      <Card style={{ margin: "3rem auto", width: "18rem" }}>
        {this.props.error && (
          <Alert key={"danger"} variant={"danger"}>
            {this.props.error}
          </Alert>
        )}
        <Card.Body style={{ display: "flex", flexDirection: "column" }}>
          <Card.Title>{this.state.isSignup ? "Sign up" : "Login"}</Card.Title>
          <Form.Group className="mb-3">
            <Form.Label>{"email"}</Form.Label>
            <Form.Control
              type={"text"}
              placeholder={"email"}
              defaultValue="mikolajnowaczyk95@gmail.com"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <Form.Label>{"password"}</Form.Label>
            <Form.Control
              type={"password"}
              placeholder={"****"}
              defaultValue="Test123#@!"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </Form.Group>
          <Button
            style={{ margin: "10px 0" }}
            variant="primary"
            onClick={this.submitHandler}
          >
            {this.state.isLoading ? "Loading" : "Submit"}
          </Button>
          <Button
            style={{ margin: "10px 0" }}
            variant="primary"
            onClick={this.switchAuthModeHandler}
          >
            {`Switch to ${!this.state.isSignup ? "Sign up" : "Login"}`}
          </Button>
          {!!this.state.response?.token && (
            <p>{"Your token: " + JSON.stringify(this.state.response?.token)}</p>
          )}
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);