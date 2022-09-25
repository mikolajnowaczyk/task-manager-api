import React from "react";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";

class Profile extends React.Component {
  render() {
      return <Card>
        <Card.Body>
        <Card.Title>{"Name: " + this.props.profile.name}</Card.Title>
        <Card.Subtitle>{"Email: " + this.props.profile.email}</Card.Subtitle>
        <Card.Text>{"Age: " + this.props.profile.age}</Card.Text>
        </Card.Body>
      </Card>;
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.auth.user,
  };
};

export default connect(mapStateToProps)(Profile);
