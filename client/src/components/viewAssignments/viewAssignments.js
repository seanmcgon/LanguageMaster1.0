import React from 'react';
import './ViewAssignment.css'; // Make sure this points to the correct CSS file

export default function ViewAssignment({ lessonName, flashcards, onBack }) {
    return (
        <div className="viewAssignment">
            <button onClick={onBack} className="backButton">Back to Assignments</button>
            {/* Removed flashcard view for teachers */}
            {/* <button className="flashCardButton">Go To Flashcard View</button> */}

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
    );
}
