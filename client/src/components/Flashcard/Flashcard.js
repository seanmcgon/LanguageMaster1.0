import React, { useState, useRef } from 'react';
import './Flashcard.css';

function Flashcard({ flashcards, onBack, onSubmit }) {
  const [flip, setFlip] = useState(false);
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [submitEnabled, setSubmitEnabled] = useState(false);  // State to enable/disable submit
  const [currentScore, setCurrentScore] = useState(0);  // State for the current attempt score
  const [averageScore, setAverageScore] = useState(0);  // State for the average score
  const [totalScores, setTotalScores] = useState(0);  // Accumulate scores to calculate average
  const [scoreCount, setScoreCount] = useState(0);  // Count of attempts for average calculation
  const mediaRecorderRef = useRef(null);

  const handleLeft = () => {
    if (index > 0) {
      setFlip(false);
      setTimeout(() => setIndex(index - 1), 250);
    }
  };

  const handleRight = () => {
    if (index < flashcards.length - 1) {
      setFlip(false);
      setTimeout(() => setIndex(index + 1), 250);
    }
  };

  const handleRecord = () => {
    if (!recording) {
      setTimeout(() => {navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
              const options = {
                  mimeType: 'audio/webm',
                  bitsPerSecond: 256000
              };
              const mediaRecorder = new MediaRecorder(stream, options);
              mediaRecorderRef.current = mediaRecorder;
              mediaRecorder.start();
              setRecording(true);
              const audioChunks = [];
              mediaRecorder.addEventListener("dataavailable", event => {
                  audioChunks.push(event.data);
              });
              mediaRecorder.addEventListener("stop", () => {
                  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                  setAudioBlob(audioBlob);
                  stream.getTracks().forEach(track => track.stop());
                  setSubmitEnabled(true);  // Enable the submit button when recording stops
              });
          });
        })
    } else {
      // Adding a 1-second delay to the stop recording process
      setTimeout(() => {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }, 500);
    }
  };

  const handleSubmit = (blob = audioBlob) => {
    const word = flashcards[index].wordName;
    const score = Math.random() * 100;  // Simulate score calculation
    setCurrentScore(score);
    const newTotalScores = totalScores + score;
    setTotalScores(newTotalScores);
    setScoreCount(scoreCount + 1);
    setAverageScore(newTotalScores / (scoreCount + 1));
    onSubmit(word, blob);  // Call onSubmit prop
    setSubmitEnabled(false);  // Disable submit after submitting
  };

  const handleStudentListen = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleDebugSubmit = () => {
    handleSubmit(undefined);  // Submit with undefined audioBlob for debugging
  };

  return (
    <div>
      <button className="backButton" onClick={onBack}>Return to Assignments</button>
      <div className="card-container">
        <button className="left" onClick={handleLeft} disabled={index <= 0}>Left</button>
        <div className={`card ${flip ? "flip" : ""}`} onClick={() => setFlip(!flip)}>
          <div className="front">{flashcards[index].wordName}</div>
          <div className="back">{flashcards[index].englishTranslation}</div>
        </div>
        <button className="right" onClick={handleRight} disabled={index >= flashcards.length - 1}>Right</button>
      </div>
      <div className="d-flex justify-content-center">
        <button className={`actionButtons ${recording ? "recording" : ""}`} onClick={handleRecord}>
          {recording ? 'Stop Recording' : 'Record'}
        </button>
        <button className="actionButtons" onClick={handleStudentListen} disabled={!audioBlob}>Hear My Attempt</button>
        <button className="actionButtons debugButton" onClick={handleDebugSubmit} disabled={!submitEnabled}>Submit</button>
      </div>
      <div className="scores-container">
        <p>Current Attempt Score: {currentScore.toFixed(2)}</p>
        <p>Average Score: {averageScore.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Flashcard;
