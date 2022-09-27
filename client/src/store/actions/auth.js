import * as actionTypes from './actionTypes'
import {isEmpty} from "lodash";

export const authStart = () => {
  console.log("authStart DISPATCH");
  return {
    type: actionTypes.AUTH_START
  }
};

export const authFail = (error) => {
  console.log("authFail DISPATCH");
  console.log("erorr", error);
  return {
    type: actionTypes.AUTH_FAIL,
    error
  }
};

export const authSuccess = (tokenId, user) => {
  console.log("authSuccess DISPATCH");
  return {
    type: actionTypes.AUTH_SUCCESS,
    tokenId,
    user
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const registerStart = () => {
  console.log("registerStart DISPATCH");
  return {
    type: actionTypes.REGISTER_START
  }
};

export const registerFail = (error) => {
  console.log("registerFail DISPATCH");
  console.log("erorr", error);
  return {
    type: actionTypes.REGISTER_FAIL,
    error
  }
};

export const registerSuccess = (successText) => {
  console.log("registerSuccess DISPATCH");
  return {
    type: actionTypes.REGISTER_SUCCESS,
    successText    
  }
};

export const auth = (email, password) => {
  console.log("auth DISPATCH");
  return async dispatch => {
    dispatch(authStart());
      await fetch("/users/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (isEmpty(response)) {
            dispatch(authFail("Email or password is incorrect"));
            return;
          }
          localStorage.setItem("user", response.user)
          localStorage.setItem("token", response.token)
          dispatch(authSuccess(response.token, response.user));
        })
        .catch((err) => {
          dispatch(authFail(err));
        });
  }
}

export const register = (name, email, password) => {
  console.log("register DISPATCH");
  return async dispatch => {
    dispatch(registerStart());
      await fetch("/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((resp) => {
          console.log("resp", resp)
          if(resp.errors){
            dispatch(registerFail(resp.message))
          }
          else if(resp.errmsg?.includes("duplicate key error")){
            dispatch(registerFail("Provided email is already used!"));
          }
          else{
            dispatch(registerSuccess("Account successfully created! Now you can log in."));
          }
        })
        .catch((err) => {
          console.log("err", err)
          dispatch(registerFail(err.errmsg));
        });
  }
}