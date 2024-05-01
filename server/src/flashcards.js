// This was giving me issues (Error: Cannot find module './auth/googleauth')
// const {audioRecognition} = require("./transcription/audioToText.js");

async function getFeedback(curWord, audioFile) {
    // Dummy function for now
    return {};
}

module.exports = {getFeedback};