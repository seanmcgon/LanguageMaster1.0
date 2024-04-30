import React, { useState } from 'react';
import './Flashcard.css'; // Ensure this points to the correct CSS file

function Flashcard({ flashcards, onBack }) {
  const [flip, setFlip] = useState(false);
  const [index, setIndex] = useState(0);

  function handleRecord() {}
  function handleSubmit() {}
  function handleListen() {}

  const handleLeft = () => {
    if (index > 0) {
      setFlip(false);
      setTimeout(() => setIndex(index - 1), 250); // Delay index update for animation
    }
  };

  const handleRight = () => {
    if (index < flashcards.length - 1) {
      setFlip(false);
      setTimeout(() => setIndex(index + 1), 250); // Delay index update for animation
    }
  };

  return (
    <div>
      <button class= "backButton"onClick={onBack}>Return to Assignments</button>
      <div className="card-container">
        <button
          className="left"
          onClick={handleLeft}
          disabled={index <= 0}
        >
          Left
        </button>
        <div
          className={`card ${flip ? "flip" : ""}`}
          onClick={() => setFlip(!flip)}
        >
          <div className="front">{flashcards[index].wordName}</div>
          <div className="back">{flashcards[index].englishTranslation}</div>
        </div>
        <button
          className="right"
          onClick={handleRight}
          disabled={index >= flashcards.length - 1}
        >
          Right
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <button className="actionButtons" onClick={handleRecord}>Record</button>
        <button className="actionButtons" onClick={handleSubmit}>Submit</button>
        <button className="actionButtons" onClick={handleListen}>Listen</button>
      </div>
    </div>
  );
}

export default Flashcard;
