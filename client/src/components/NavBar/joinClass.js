import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function JoinClassPopup(props) {
    const [input, setInput] = useState('');
    const [showError, setShowError] = useState(false);
    const { onJoinClass, onHide, ...restProps } = props;

    const handleJoin = (e) => {
        e.preventDefault();
        // Check if input is empty, longer than 50 characters, or contains spaces
        if (input.length < 1 || input.length > 50 || /\s/.test(input)) {
            setShowError(true);  // Show error if class name is invalid
            setInput('');         // Clear the input after showing error
        } else {
            let joinClassStatus = onJoinClass(input)
            console.log("joinClassStatus",joinClassStatus)
            if(joinClassStatus)  {
                console.log("Did not join")
                setShowError(true);      // Reset error state

            } 
            else {
                console.log("Joined Class")
                setInput('');             // Clear the input on successful join
                onHide();                 // Hide the popup modal

            }
        }
    };

    return (
        <Modal {...restProps} centered onHide={onHide} onEnter={() => {
            setInput('');
            setShowError(false);
        }}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Join a Class
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleJoin}>
                    <Form.Label htmlFor="className">ClassID:</Form.Label>
                    <Form.Control
                        type="text"
                        id="className"
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
                        Contact your teacher for ClassID
                    </Form.Text>
                    <br/><br/>
                    <Button className="joinButton" type="submit">
                        Join Class
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default JoinClassPopup;
