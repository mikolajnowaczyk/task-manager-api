import React from "react";
import Button from "react-bootstrap/esm/Button";
import { connect } from "react-redux";
import * as actions from "../store/actions/index";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Task from "./bacic/task";
import Col from "react-bootstrap/Col";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddTaskModal: false,
      newTaskComplete: false,
      newTaskDescription: "",
    };
    this.handleShowAddTaskModal = this.handleShowAddTaskModal.bind(this);
    this.handleChangeCompleted = this.handleChangeCompleted.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleAddNewTask = this.handleAddNewTask.bind(this);
    this.handleHideAddNewTaskModal = this.handleHideAddNewTaskModal.bind(this);
  }

  handleChangeCompleted() {
    this.setState({ newTaskComplete: !this.state.newTaskComplete });
  }

  handleChangeDescription(event) {
    this.setState({ newTaskDescription: event.target.value });
  }

  handleShowAddTaskModal() {
    this.setState({ showAddTaskModal: !this.state.showAddTaskModal });
  }

  handleHideAddNewTaskModal() {
    this.setState({
      showAddTaskModal: false,
      newTaskComplete: false,
      newTaskDescription: "",
    });
  }

  handleAddNewTask() {
    const task = {
      completed: this.state.newTaskComplete,
      description: this.state.newTaskDescription,
    };
    this.props.onAddTask(task).then(() => {
      this.handleHideAddNewTaskModal();
      this.props.getTasks();
    });
  }

  componentDidMount() {
    this.props.getTasks();
  }

  prepareTasks = (tasks) => {
    if (tasks) {
      return tasks.map((task) => {
        return (
          <Col xs={{offset: 1, span: 10 }} md={{span: 6, offset: 0}} xl={{span: 4}} className="p-2">
            <Task task={task} />
          </Col>
        );
      });
    }
  };

  render() {
    if (this.props.loading) {
      return <p>Loading tasks...</p>;
    }
    return (
      <>
        <div id="dashboard" style={{ flexWrap: "wrap" }} className="d-flex m-2">
          {this.prepareTasks(this.props.tasks)}
        </div>
        <Button
          variant="success"
          style={{ bottom: "20px", right: "20px", position: "fixed" }}
          onClick={this.handleShowAddTaskModal}
        >
          Add new task
        </Button>
        <Modal
          show={this.state.showAddTaskModal}
          onHide={this.handleHideAddNewTaskModal}
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <Form.Label htmlFor="taskDescription">Description</Form.Label>
            <Form.Control
              type="text"
              id="taskDescription"
              value={this.state.newTaskDescription}
              onChange={this.handleChangeDescription}
            />
            <Form.Check
              className="my-3"
              type={"checkbox"}
              id={`default-${"checkbox"}`}
              label={`Completed`}
              checked={this.state.newTaskComplete}
              onChange={this.handleChangeCompleted}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.handleAddNewTask}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
    // !this.props.tasks ? (
    //   <p>- No tasks to display -</p>
    // ) : (
    //
    // );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.task.loading,
    // userID: state.auth.user._id,
    tasks: state.task.tasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTasks: () => dispatch(actions.getTasks()),
    onAddTask: (task) => dispatch(actions.addTask(task)),
    onUpdateTask: (task, taskProps) =>
      dispatch(actions.updateTask(task, taskProps)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
