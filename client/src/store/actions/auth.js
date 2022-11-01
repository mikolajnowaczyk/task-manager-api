import * as actionTypes from './actionTypes'
import {isEmpty} from "lodash";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error
  }
};

export const authSuccess = (tokenId, user) => {
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
  return {
    type: actionTypes.REGISTER_START
  }
};

export const registerFail = (error) => {
  return {
    type: actionTypes.REGISTER_FAIL,
    error
  }
};

export const registerSuccess = (successText) => {
  return {
    type: actionTypes.REGISTER_SUCCESS,
    successText    
  }
};

export const auth = (email, password) => {
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
          dispatch(registerFail(err.errmsg));
        });
  }
}