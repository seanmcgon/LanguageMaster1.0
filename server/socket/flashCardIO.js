//TODO:-Sean Import necessary functions (all of them don't exist exist for audioRecognition in src/transcription/audioToText)
//You might have to put in dummy functions in flashcards.js
//import { getFeedback } from "../src/flashcards.js";
const {getFeedback} = require("../src/flashcards");

//TODO: write IO functions
function getFeedbackIO(socket) {
    //listen for (audioFile, curVocab) 
    //get transcription 
    //get newAverage
    //get curScore 
    //Return all three 
    socket.on("getFeedback", async (curWord, audioFile) => {
        console.log("curWord", curWord, "audioFile?", audioFile? "yes" : "no");

        let feedback;
        let attemptScore;
        let newAverage;
        let transcription;
        try {
            feedback = await getFeedback(curWord, audioFile); // Assuming this function is implemented in flashcards.js
            attemptScore = feedback.attemptScore;
            newAverage = feedback.newAverage;
            transcription = feedback.transcription;
        } catch (error) {
            console.log("Error getting feedback");
            attemptScore, newAverage, transcription = "";
        }
        socket.emit("feedback", attemptScore, newAverage, transcription);
        console.log("getFeedback called and returned", feedback);

        return feedback;
    })
}





//TODO: export functions
module.exports = {getFeedbackIO};