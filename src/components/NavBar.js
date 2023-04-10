import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "../App.css"

export default function NavBar(props) {
    return (
      <Navbar className="color-nav" variant="dark">
      <Container>
        <Navbar.Brand>
          <img
          src={require("../static/images/logo.jpg")}
          alt="Chatkent logo"
          width="100"
          height="60"
          />{' '}
        ChatKent</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
           Signed in as:&nbsp;
            <span>{(props.signedInUser || {}).name}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
}
