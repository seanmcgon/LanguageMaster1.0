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
    let i = 0
  
    socket.on("getFeedback", async (curWord, audioFile, currentAssignment, currentClass, studentEmail) => {
        console.log(i++, "rd Request")
        console.log("curWord", curWord, "audioFile", audioFile, "currentAssignment",currentAssignment, "currentClass", currentClass, "studentEmail", studentEmail);

        let feedback;
        let attemptScore;
        let newAverage;
        let transcription;
        try {
            feedback = await getFeedback(curWord, audioFile, currentAssignment, currentClass, studentEmail); // Assuming this function is implemented in flashcards.js

            attemptScore = feedback.attemptScore;
            newAverage = feedback.newAverage;
            transcription = feedback.transcription;
            socket.emit("feedback", attemptScore, newAverage, transcription);
            console.log("getFeedback called and returned", feedback);
        } catch (error) {
            console.log("Error getting feedback");
            attemptScore, newAverage, transcription = "";
        }


        return feedback;
    })
}

function adderIO(socket) {
    socket.on("adder", async(number1, number2) => {
        console.log("adderIO called in the backend with", number1, number2)
        let result = function adder (number1, number2) {
            return number1 * number2;
        }(number1, number2)
        console.log(result)
        socket.emit("adderResult", result)
    })
}



//TODO: export functions
module.exports = {getFeedbackIO, adderIO};