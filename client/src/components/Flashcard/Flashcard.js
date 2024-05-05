import React, { useState, useRef } from 'react';
import './Flashcard.css';

function Flashcard({ flashcards, onBack, onSubmit }) {
  const [flip, setFlip] = useState(false);
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingId, setRecordingId] = useState(0);
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
      navigator.mediaDevices.getUserMedia({ audio: true })
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
                  handleSubmit();
              });
          });
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = (blob = audioBlob) => {
    const word = flashcards[index].wordName;
    onSubmit(word, blob, recordingId); // Pass recordingId along with other data
    setRecordingId(recordingId + 1); // Increment the recording ID after submission
  };

  const handleStudentListen = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleDebugSubmit = () => {
    handleSubmit(undefined); // Submit with undefined audioBlob for debugging
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
        <button className="actionButtons debugButton" onClick={handleDebugSubmit}>Submit</button> {/* Debugging Button */}
      </div>
    </div>
  );
}

export default Flashcard;
