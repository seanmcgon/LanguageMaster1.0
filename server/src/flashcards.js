// This was giving me issues (Error: Cannot find module './auth/googleauth')
const {audioRecognition} = require("./transcription/audioToText.js");

async function getFeedback(curWord, audioFile) {
   // Example audio file
    const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
    audioRecognition(audioUrl)
    .then(results => {
        console.log('Transcription:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    return {};
}

module.exports = {getFeedback};