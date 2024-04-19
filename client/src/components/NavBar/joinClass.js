import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function join(className, setInput, submitToServer, hidePopup, showError) {
  if (className.length < 1 || className.length > 50) {
    showError(true);
    setInput("");
    return;
  }
  // const result = submitToServer(className);
  // if (result) {
  //   showError(false);
  //   setInput("");
  //   hidePopup();
  // } else {
  //   showError(true);
  //   setInput("");
  // }
}

export default function JoinClassPopup(props) {
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);
  const { handleSubmission, ...restProps } = props;

  return (
    <Modal {...restProps} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Join a Class
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            join(
              input,
              setInput,
              handleSubmission,
              restProps.onHide,
              setShowError
            );
          }}
        >
          <Form.Group controlId="formClassName">
            <Form.Label>Name of the class:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter class name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Form.Group>
          {showError && (
            <p className="text-danger">
              Class name is invalid or already exists. Please try again.
            </p>
          )}
          <Button variant="primary" type="submit">
            Join Class
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
