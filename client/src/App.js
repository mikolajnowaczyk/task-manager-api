import React, { Component } from "react";
import Navbar from "./components/navbar";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";
import LoginPage from "./components/loginPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { connect } from "react-redux";
// import * as actions from "./store/actions/index";

class App extends Component {
  render() {
    const routes = !this.props.isAuthenticated ? (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    ) : (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    );
    return (
      <>
        {this.props.isAuthenticated && <Navbar />}
        {routes}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
