import { useState } from "react";
import React from "react";
import "./ViewAssignment.css"; // Make sure this points to the correct CSS file
import Flashcard from "../Flashcard/Flashcard";

export default function ViewAssignment({ lessonName, flashcards, onBack }) {
  const [isViewCard, setViewCard] = useState(false);
  return (
    <>
      {isViewCard ? (
        <Flashcard
          flashcards={flashcards}
          setViewCard={() => setViewCard(false)}
        />
      ) : (
        <div className="viewAssignment">
          <button onClick={onBack} className="backButton">
            Back to Assignments
          </button>
          <button className="flashCardButton" onClick={() => setViewCard(true)}>
            Go To Flashcard View
          </button>

          <h1 className="lessonName">{lessonName}</h1>
          <div className="tableContainer">
            <table className="flashcardTable">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Translation</th>
                  <th>Audio</th>
                </tr>
              </thead>
              <tbody>
                {flashcards.map((flashcard, index) => (
                  <tr key={index}>
                    <td>{flashcard.wordName}</td>
                    <td>{flashcard.englishTranslation}</td>
                    <td>
                      <audio src={flashcard.audioFile} controls />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
