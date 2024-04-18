import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function CreateClassPopup({ show, onHide, handleSubmission }) {
    const [input, setInput] = useState("");
    const [showError, setShowError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();  // This prevents the default form submission behavior
        if (input.length < 1 || input.length > 50) {
            setShowError(true);
            setInput("");
        } else {
            handleSubmission(input);
            setShowError(false);
            setInput("");
            onHide();  // Close the modal
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Class</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Name your class:</Form.Label>
                        <Form.Control
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            isInvalid={showError}
                        />
                        <Form.Control.Feedback type="invalid">
                            Class name must be 1-50 characters long.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Class
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateClassPopup;
