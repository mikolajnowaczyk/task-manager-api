import * as actionTypes from "../actions/actionTypes";

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.REDIRECT:
      return { redirectTo: action.payload };
    default:
      return state;
  }
};

export default reducer;
