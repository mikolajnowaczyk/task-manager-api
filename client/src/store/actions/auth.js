// import axios from 'axios';
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
    error: error
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

// export const checkAuthTimeout = (expirationTime) => {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(logout());
//     }, expirationTime * 1000);
//   }
// }

export const auth = (email, password, isSignup) => {
  console.log("auth DISPATCH");
  return async dispatch => {
    dispatch(authStart());
    // dispatch(authSuccess("FAKE TOKEN", "FAKE USER ID"));
      // if (this.props.isLoading) return;
      // this.setState({ isLoading: true, error: null });
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
          // dispatch(setAuthRedirectPath("/dashboard"))
          // dispatch(checkAuthTimeout(response.data.expiresIn))
        })
        .catch((err) => {
          dispatch(authFail(err));
        });
  }
}

// export const setAuthRedirectPath = (path) => {
//   return {
//     type: actionTypes.SET_AUTH_REDIRECT_PATH,
//     path: path
//   }
// }

// export const authCheckState = () => {
//   return dispatch => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       dispatch(logout());
//     } else {
//       const expirationDate = new Date(localStorage.getItem('expirationDate'));
//       if (expirationDate <= new Date()) {
//         dispatch(logout());
//       }
//       else {
//         const userId = localStorage.getItem('userId');
//         dispatch(authSuccess(token, userId))
//         dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
//       }
//     }
//   };
// }