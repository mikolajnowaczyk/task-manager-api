import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  user: null,
  error: null,
  loading: false,
  successText: null
};

const authStart = (state) => {
  return updateObject(state, { error: null, loading: true, successText: null});
}

const authSuccess = (state, action) => {
  return updateObject(state, {
    user: action.user,
    loading: false
  });
}

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}

const authLogout = (state) => {
  return updateObject(state, {
    user: null
  });
}

const registerStart = (state) => {
  return updateObject(state, { error: null, loading: true, successText: null});
}

const registerSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successText: action.successText
  });
}

const registerFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.REGISTER_START: return registerStart(state);
    case actionTypes.REGISTER_SUCCESS: return registerSuccess(state, action);
    case actionTypes.REGISTER_FAIL: return registerFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state);
    default:
      return state;
  }
}
export default reducer;