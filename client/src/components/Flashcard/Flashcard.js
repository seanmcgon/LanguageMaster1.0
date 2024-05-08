import React, { useState, useEffect, useRef } from 'react';
import './Flashcard.css';

function Flashcard({ flashcards, onBack, onSubmit, getSignedUrl }) {
  const [flip, setFlip] = useState(false);
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [averageScore, setAverageScore] = useState(flashcards[0].score);
  const mediaRecorderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state


  useEffect(() => {
    setCurrentScore(0);
    setTranscription("");

    const scoreKey = `averageScore_${flashcards[index].id}`;
    const storedScore = localStorage.getItem(scoreKey);
    if (storedScore) {
      setAverageScore(parseFloat(storedScore));
    } else {
      setAverageScore(flashcards[index].score);
    }

    // Clear localStorage when the component unmounts
    return () => {
      flashcards.forEach(card => localStorage.removeItem(`averageScore_${card.id}`));
    };
  }, [index, flashcards]);

  const handleLeft = () => {
    if (index > 0) {
      setFlip(false);
      setIndex(index - 1)
    }
  };

  const handleRight = () => {
    if (index < flashcards.length - 1) {
      setFlip(false);
      setIndex(index + 1)
    }
  };

  const handleRecord = () => {
    if (!recording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start();
          setRecording(true);
          setSubmitEnabled(false);
          const audioChunks = [];
          mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks);
            setAudioBlob(audioBlob);
            stream.getTracks().forEach(track => track.stop());
            setSubmitEnabled(true);
          };
        })
        .catch(error => console.error('Error accessing media devices:', error));
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
 


  const handlePlayStoredAudio = () => {
      const audio = new Audio(flashcards[index].audioFile);
      audio.play();
  };

  const handleSubmit = (blob = audioBlob) => {
    setIsLoading(true); // Set loading true when starting the request

    const word = flashcards[index].wordName;
    onSubmit(word, blob).then(feedback => {
      console.log("Feedback received:", feedback);
      setCurrentScore(feedback.attemptScore);
      setTranscription(feedback.transcription);
      setAverageScore(feedback.newAverage);
      localStorage.setItem(`averageScore_${flashcards[index].id}`, feedback.newAverage.toString());
      setIsLoading(false); // Set loading false after receiving the response

    }).catch(error => {
      console.error("Failed to get feedback:", error);
      setIsLoading(false); // Set loading false if there is an error
    });
    setSubmitEnabled(false);
  };

  const handleStudentListen = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className='flashcardBody'>
      {isLoading && <div className="loading-overlay"><div className="loader"></div></div>}
      <button className="backButton" onClick={onBack}>Back to Assignment</button>
      <div className="card-container">
        <button className="left" onClick={handleLeft} disabled={index <= 0}>Left</button>
        <div className={`flashcard ${flip ? "flip" : ""}`} onClick={() => setFlip(!flip)}>
          <div className="front">{flashcards[index].wordName}</div>
          <div className="back">
            <p>{flashcards[index].englishTranslation}</p>
          </div>
        </div>
        <button className="right" onClick={handleRight} disabled={index >= flashcards.length - 1}>Right</button>
      </div>
      <div className="d-flex justify-content-center">
      <button className="actionButtons" onClick={handlePlayStoredAudio}>Play Reference</button>

        <button className={`actionButtons ${recording ? "recording" : ""}`} onClick={handleRecord}>
          {recording ? 'Stop Recording' : 'Record'}
        </button>
        <button className="actionButtons" onClick={handleStudentListen} disabled={!audioBlob}>Hear My Attempt</button>
        <button className="actionButtons debugButton" onClick={() => handleSubmit()} disabled={!submitEnabled}>Submit</button>
      </div>
      <div className="scores-container">
        <p>Transcription: {transcription}</p>
        <p>Current Attempt Score: {currentScore.toFixed(2)}</p>
        <p>Average Score: {averageScore.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Flashcard;
