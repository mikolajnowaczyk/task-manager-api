import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditTaskModal: false,
      completed: this.props.task.completed,
      description: this.props.task.description,
      task: this.props.task,
    };
    this.handleShowEditTaskModal = this.handleShowEditTaskModal.bind(this);
    this.handleChangeCompleted = this.handleChangeCompleted.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  handleShowEditTaskModal() {
    this.setState({ showEditTaskModal: true });
  }

  handleChangeCompleted() {
    this.setState({ completed: !this.state.completed });
  }

  handleChangeDescription(event) {
    this.setState({ description: event.target.value });
  }

  handleDeleteTask(){
    this.props.onDeleteTask(this.state.task).then(()=>{
      this.props.getTasks();
    });
  }

  handleUpdateTask(){
    this.props.onUpdateTask(this.state.task, {completed: this.state.completed, description: this.state.description}).then(()=>{
      this.handleCloseModal();
      this.props.getTasks();
    });
  }

  handleCloseModal() {
    this.setState({
      showEditTaskModal: false,
      completed: this.props.task.completed,
      description: this.props.task.description,
    });
  }

  render() {
    return (
      <>
        {/* <Card style={{ width: "30%", margin: "5px 1.5%" }}> */}
        <Card>
          <Card.Body>
            <Card.Title className="my-0" style={{ fontWeight: "bold" }}>
              {"Description: " + this.state.task.description}
            </Card.Title>
            <Card.Subtitle className="my-2">
              {"Completed: " + this.state.task.completed}
            </Card.Subtitle>
            <Card.Footer className="d-flex" style={{justifyContent: 'flex-end'}}>
              <Button variant="warning" onClick={this.handleShowEditTaskModal}>
                Edit
              </Button>
              <Button variant="danger" onClick={this.handleDeleteTask}>
                Delete
              </Button>
            </Card.Footer>
          </Card.Body>
        </Card>
        <Modal
          show={this.state.showEditTaskModal}
          onHide={this.handleCloseModal}
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <Form.Label htmlFor="taskDescription">Description</Form.Label>
            <Form.Control
              type="text"
              id="taskDescription"
              value={this.state.description}
              defaultValue={this.state.description}
              onChange={this.handleChangeDescription}
            />
            <Form.Check
              className="my-3"
              type={"checkbox"}
              id={`default-${"checkbox"}`}
              label={`Completed`}
              checked={this.state.completed}
              onChange={this.handleChangeCompleted}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.handleUpdateTask}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteTask: (task) => dispatch(actions.deleteTask(task)),
    getTasks: () => dispatch(actions.getTasks()),
    onUpdateTask: (task, taskProps) => dispatch(actions.updateTask(task, taskProps))
  };
};

export default connect(null, mapDispatchToProps)(Task);
