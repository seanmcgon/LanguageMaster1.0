import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function CreateClassPopup(props) {
  const [input, setInput] = useState('');
  const [showError, setShowError] = useState(false);
  const { onCreateClass, onHide, ...restProps } = props;

  const handleCreate = (e) => {
    e.preventDefault();
    // Check if input is empty, longer than 50 characters, or contains spaces
    if (input.length < 1 || input.length > 50 || /\s/.test(input)) {
      setShowError(true);  // Show error if class name is invalid
      setInput('');         // Clear the input after showing error
    } else {
      onCreateClass(input); // Call the function passed from the parent component
      setInput('');         // Clear the input on successful creation
      setShowError(false);  // Reset error state
      setTimeout(200)
      onHide();             // Hide the popup modal
    }
  };

  return (
    <Modal {...restProps} centered onEnter={() => {
      setInput('');
      setShowError(false);
    }}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title className="popupTitle" id="contained-modal-title-vcenter">
          Create New Class
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCreate}>
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
            <p id="invalidClass" className="text-danger">
              Invalid class name. Please try again.
            </p>
          )}
          <Form.Text id="helpBlock" muted>
            Class names must be 1-50 characters long and cannot contain spaces.
          </Form.Text>
          <br/><br/>
          <Button className="createButton" type="submit">
            Create Class
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
