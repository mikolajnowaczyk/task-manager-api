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
      name: "",
      email: "",
      password: "",
      error: null,
      isSignup: false,
    };
  }

  submitHandler = (event) => {
    event.preventDefault();
    if(this.state.isSignup){
      this.props.onRegister(
        this.state.name,
        this.state.email,
        this.state.password
      );
    }else{
      this.props.onAuth(
        this.state.email,
        this.state.password
      );

    }
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return { isSignup: !prevState.isSignup };
    });
  };

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <Card style={{ margin: "3rem auto", width: "18rem" }}>
        {this.props.error && (
          <Alert key={"danger"} variant={"danger"}>
            {this.props.error}
          </Alert>
        )}
        {this.props.successText && (
          <Alert key={"success"} variant={"success"}>
            {this.props.successText}
          </Alert>
        )}
        <Card.Body style={{ display: "flex", flexDirection: "column" }}>
          <Card.Title>{this.state.isSignup ? "Sign up" : "Login"}</Card.Title>
          <Form.Group className="mb-3">
            {this.state.isSignup && (
              <>
                <Form.Label>{"name"}</Form.Label>
                <Form.Control
                  type={"text"}
                  placeholder={"name"}
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              </>
            )}

            <Form.Label>{"email"}</Form.Label>
            <Form.Control
              type={"text"}
              placeholder={"email"}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <Form.Label>{"password"}</Form.Label>
            <Form.Control
              type={"password"}
              placeholder={"****"}
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
    successText: state.auth.successText
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(actions.auth(email, password)),
    onRegister: (name, email, password) => dispatch(actions.register(name, email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
