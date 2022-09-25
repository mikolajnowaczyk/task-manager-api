import * as actionTypes from "./actionTypes";

// GET TASK
export const getTaskStart = () => {
  console.log("getTaskStart DISPATCH");
  return {
    type: actionTypes.GET_TASK_START,
  };
};

export const getTaskFail = (error) => {
  console.log("getTaskFail DISPATCH");
  return {
    type: actionTypes.GET_TASK_FAIL,
    error: error,
  };
};

export const getTaskSuccess = (tasks) => {
  console.log("getTaskSuccess DISPATCH", tasks);
  return {
    type: actionTypes.GET_TASK_SUCCESS,
    tasks,
  };
};

export const getTasks = () => {
  console.log("getTasks DISPATCH");
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
          console.log("getTaskSuccess response", response);
          dispatch(getTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(getTaskFail(err));
        });
  }
}

// ADD TASK
export const addTaskStart = () =>{
  console.log("addTaskStart DISPATCH");
  return {
    type: actionTypes.ADD_TASK_START,
  };
}

export const addTaskFail = (error) => {
  console.log("addTaskFail DISPATCH");
  return {
    type: actionTypes.ADD_TASK_FAIL,
    error: error,
  };
};

export const addTaskSuccess = (task) => {
  console.log("addTaskSuccess DISPATCH");
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
          console.log("addTaskSuccess response", response);
          dispatch(addTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(addTaskFail(err));
        });
  }
}

// UPDATE TASK
export const updateTaskStart = () => {
  console.log("updateTaskStart DISPATCH");
  return {
    type: actionTypes.UPDATE_TASK_START,
  };
};

export const updateTaskFail = (error) => {
  console.log("updateTaskFail DISPATCH");
  return {
    type: actionTypes.UPDATE_TASK_FAIL,
    error: error,
  };
};

export const updateTaskSuccess = (task) => {
  console.log("updateTaskSuccess DISPATCH");
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
          console.log("updateTaskSuccess response", response);
          dispatch(updateTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(updateTaskFail(err));
        });
  }
}

// DELETE TASK
export const deleteTaskStart = () =>{
  console.log("deleteTaskStart DISPATCH");
  return {
    type: actionTypes.DELETE_TASK_START,
  };
}

export const deleteTaskFail = (error) => {
  console.log("deleteTaskFail DISPATCH");
  return {
    type: actionTypes.DELETE_TASK_FAIL,
    error: error,
  };
};

export const deleteTaskSuccess = (task) => {
  console.log("deleteTaskSuccess DISPATCH");
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
          console.log("deleteTaskSuccess response", response);
          dispatch(deleteTaskSuccess(response));
        })
        .catch((err) => {
          dispatch(deleteTaskFail(err));
        });
  }
}