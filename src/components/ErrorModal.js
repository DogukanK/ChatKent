import React from "react";
import Modal from "react-bootstrap/Modal";

export default function ErrorModal(props) {
    return (
      <Modal show={props.show} animation={false} centered>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3 className="text-center">{props.errorMessage}</h3>
        </Modal.Body>
      </Modal>
    );

}
