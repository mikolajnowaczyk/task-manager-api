import * as actionTypes from "./actionTypes";

// GET TASK
export const getTaskStart = () => {
  return {
    type: actionTypes.GET_TASK_START,
  };
};

export const getTaskFail = (error) => {
  return {
    type: actionTypes.GET_TASK_FAIL,
    error: error,
  };
};

export const getTaskSuccess = (tasks) => {
  return {
    type: actionTypes.GET_TASK_SUCCESS,
    tasks,
  };
};

export const getTasks = () => {
  return async dispatch => {
    dispatch(getTaskStart());
      await fetch("/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`}
      })
        .then((response) => response.json())
        .then((response) => {
          dispatch(getTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(getTaskFail(err));
        });
  }
}

// ADD TASK
export const addTaskStart = () =>{
  return {
    type: actionTypes.ADD_TASK_START,
  };
}

export const addTaskFail = (error) => {
  return {
    type: actionTypes.ADD_TASK_FAIL,
    error: error,
  };
};

export const addTaskSuccess = (task) => {
  return {
    type: actionTypes.ADD_TASK_SUCCESS,
    task,
  };
};

export const addTask = (task) => {
  return async dispatch => {
      await fetch(`/tasks`, {
        method: "POST",
        body: JSON.stringify({
            ...task
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`}
      })
        .then((response) => response.json())
        .then((response) => {
          dispatch(addTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(addTaskFail(err));
        });
  }
}

// UPDATE TASK
export const updateTaskStart = () => {
  return {
    type: actionTypes.UPDATE_TASK_START,
  };
};

export const updateTaskFail = (error) => {
  return {
    type: actionTypes.UPDATE_TASK_FAIL,
    error: error,
  };
};

export const updateTaskSuccess = (task) => {
  return {
    type: actionTypes.UPDATE_TASK_SUCCESS,
    task,
  };
};

export const updateTask = (task, taskProps) => {
  return async dispatch => {
      await fetch(`/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({
            ...taskProps
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`}
      })
        .then((response) => response.json())
        .then((response) => {
          dispatch(updateTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(updateTaskFail(err));
        });
  }
}

// DELETE TASK
export const deleteTaskStart = () =>{
  return {
    type: actionTypes.DELETE_TASK_START,
  };
}

export const deleteTaskFail = (error) => {
  return {
    type: actionTypes.DELETE_TASK_FAIL,
    error: error,
  };
};

export const deleteTaskSuccess = (task) => {
  return {
    type: actionTypes.DELETE_TASK_SUCCESS,
    task,
  };
};

export const deleteTask = (task) => {
  return async dispatch => {
      await fetch(`/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`}
      })
        .then((response) => response.json())
        .then((response) => {
          dispatch(deleteTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(deleteTaskFail(err));
        });
  }
}