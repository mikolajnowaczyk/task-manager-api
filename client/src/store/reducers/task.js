import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  tasks: null,
  error: null,
  loading: false,
};

const getTaskStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const getTaskSuccess = (state, action) => {
  return updateObject(state, {
    tasks: action.tasks,
    error: null,
    loading: false,
  });
};

const getTaskFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const updateTaskStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
  });
};

const updateTaskSuccess = (state, action) => {
  return updateObject(state, {
    tasks: state.tasks.map((task) => {
      if (task._id === action.task._id) {
        return action.task;
      }
      return task;
    }),
    error: null,
    loading: false,
  });
};

const updateTaskFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TASK_START:
      return getTaskStart(state);
    case actionTypes.GET_TASK_SUCCESS:
      return getTaskSuccess(state, action);
    case actionTypes.GET_TASK_FAIL:
      return getTaskFail(state, action);
    case actionTypes.UPDATE_TASK_START:
      return updateTaskStart(state);
    case actionTypes.UPDATE_TASK_SUCCESS:
      return updateTaskSuccess(state, action);
    case actionTypes.UPDATE_TASK_FAIL:
      return updateTaskFail(state, action);
    default:
      return state;
  }
};
export default reducer;
