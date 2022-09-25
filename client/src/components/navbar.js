import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../store/actions/index";

function NavbarComponent() {
  const dispatch = useDispatch();
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-0 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <ButtonGroup size="lg" className="mb-2">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/dashboard"
              >
                <Button variant="primary">Dashboard</Button>
              </Link>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/profile"
              >
                <Button>Profile</Button>
              </Link>
            </ButtonGroup>
          </Nav>
          <Form className="d-flex">
            <Button
              variant="outline-danger"
              onClick={() => dispatch(actions.logout())}
            >
              Logout
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
