import React from "react";
import Modal from "react-bootstrap/Modal";

export default function LoadingModal(props) {
    return (
      <Modal show={props.show} animation={false} centered>
        <Modal.Body>
          <h4 className="text-center">Loading...</h4>
        </Modal.Body>
      </Modal>
    );
}
