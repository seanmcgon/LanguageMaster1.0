import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const languages = [
  'Arabic', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Danish', 'Dutch',
  'English (Australia)', 'English (United Kingdom)', 'English (India)', 'English (United States)',
  'Finnish', 'French', 'German', 'Greek', 'Hebrew', 'Hindi', 'Hungarian',
  'Indonesian', 'Italian', 'Japanese', 'Korean', 'Norwegian', 'Polish',
  'Portuguese (Brazil)', 'Portuguese (Portugal)', 'Romanian', 'Russian', 'Spanish (Spain)',
  'Spanish (Mexico)', 'Swedish', 'Thai', 'Turkish', 'Vietnamese',
];

export default function CreateClassPopup(props) {
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showError, setShowError] = useState(false);
  const { onCreateClass, onHide, ...restProps } = props;

  const handleCreate = (e) => {
    e.preventDefault();
    if (input.length < 1 || input.length > 31 || /\s/.test(input)) {
      setShowError(true);  // Show error if class name is invalid
      setInput('');         // Clear the input after showing error
    } else if (!selectedLanguage) {
      setShowError(true);  // Show error if language is not selected
    } else {
      onCreateClass(input, selectedLanguage); // Call the function passed from the parent component
      setInput('');         // Clear the input on successful creation
      setSelectedLanguage(''); // Clear selected language
      setShowError(false);  // Reset error state
      onHide();             // Hide the popup modal
    }
  };

  return (
    <Modal {...restProps} centered onEnter={() => {
      setInput('');
      setSelectedLanguage('');
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
          <Form.Label htmlFor="languageSelect">Select language:</Form.Label>
          <Form.Select
            id="languageSelect"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">Choose...</option>
            {languages.map((langName) => (
              <option key={langName} value={langName}>
                {langName}
              </option>
            ))}
          </Form.Select>
          {showError && (
            <p id="invalidClass" className="text-danger">
              Invalid class name or language not selected. Please try again.
            </p>
          )}
          <Form.Text id="helpBlock" muted>
            Class names must be 1-31 characters long and cannot contain spaces.
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
