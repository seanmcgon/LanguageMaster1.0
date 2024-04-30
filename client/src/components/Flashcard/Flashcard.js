import { useState } from "react";

import "./Flashcard.css";

function Flashcard({ flashcards, setViewCard }) {
  const [flip, setFlip] = useState(false); // Flip card hook
  const [index, setIndex] = useState(0);

  function handleRecord() {}
  function handleSubmit() {}
  function handleListen() {}

  return (
    <div>
      <button onClick={() => setViewCard()}>Return to Assignments</button>
      <div className="d-flex justify-content-center my-4">
        {index > 0 ? (
          <button
            onClick={() => {
              setIndex(index - 1);
              setFlip(false);
            }}
          >
            Left
          </button>
        ) : (
          <></>
        )}
        <div
          className={`card ${flip ? "flip" : ""}`}
          onClick={() => setFlip(!flip)}
        >
          <div className="front">{flashcards[index].wordName}</div>
          <div className="back">{flashcards[index].englishTranslation}</div>
        </div>
        {index < flashcards.length - 2 ? (
          <button
            onClick={() => {
              setIndex(index + 1);
              setFlip(false);
            }}
          >
            Right
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="d-flex justify-content-around">
        <button className="" onClick={handleRecord}>
          Record
        </button>
        <button className="" onClick={handleSubmit}>
          Submit
        </button>
        <button className="" onClick={handleListen}>
          Listen
        </button>
      </div>
    </div>
  );
}

export default Flashcard;
