import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function create(className, setInput, submitToServer, hidePopup, showError) {
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

export default function CreateClassPopup(props) {
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);
  const { handleSubmission, ...restProps } = props;

  return (
    <Modal
      {...restProps}
      centered
      onEnter={() => {
        setInput("");
        setShowError(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="popupTitle" id="contained-modal-title-vcenter">
          Create New Class
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create(
              input,
              setInput,
              handleSubmission,
              restProps.onHide,
              setShowError
            );
          }}
        >
          <Form.Label htmlFor="className">Name your class:</Form.Label>
          <Form.Control
            type="text"
            id="className"
            aria-describedby="helpBlock"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          {showError && (
            <p id="invalidClass">
              Class name is invalid or already exists. Please try again
            </p>
          )}
          <Form.Text id="helpBlock" muted>
            {/* Must be 1-50 characters */}
          </Form.Text>
          <br/> <br/>
          <Button className = "createButton" type="submit">
            Create Class
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
