// This was giving me issues (Error: Cannot find module './auth/googleauth')
const {audioRecognition} = require("./transcription/audioToText.js");

async function getFeedback(curWord, audioFile) {
   // Example audio file
//    const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg.wav'
   const audioUrl = 'https://storage.googleapis.com/languagemaster/gettysburg.wav?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=languagemasterkeys%40py-server-jh-01.iam.gserviceaccount.com%2F20240503%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240503T214510Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=65a25122ba449370f98934af1ca06907dfec192492f7dd4ea7f6176ac415f5580968819af328eb16139bdd18d31cfc26a9e0969f0fb5db60bd08d0f223073a2b2164d375d70a8f9a7366ece65c48e3e9427960810f96eee4ba17c224364c2bacfffebaa0caa538de739f672856a61b569ba91ed0b1068db4bf50c9dc28c39c4f18a982557c416c982fc8d3ca669de2300941a5e8e7680a0f7f4ca65b8785f46b723a7caa613187c403392134c4d981dca6a00c9cb4d43f73b0e2b2242b14ad9dcb6c9bd8f53a6274e10f91c5afbe1e95d21cd6a5ff47526b27610cdb3d17de655288877ee4ec07fdb00594929d1eee01dcc7c35495df82f88e1c583ecabc11e6'
    audioRecognition(audioUrl)
    .then(results => {
        console.log('Transcription:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    return {};
}

const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Path to your key.json file
const keyFilename = path.join(__dirname, 'key.json');

// Create a Google Cloud Storage client
const storage = new Storage({ keyFilename });

/**
 * Generates a signed URL for accessing a file in a Google Cloud Storage bucket.
 * @param {string} bucketName - The name of the bucket containing the file.
 * @param {string} fileName - The name of the file to access.
 * @returns {Promise<string>} A promise that resolves to the signed URL.
 */
async function generateSignedUrl(bucketName, fileName) {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    };

    try {
        const [url] = await storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl(options);
        
        console.log('Generated signed URL:', url);
        return url;
    } catch (error) {
        console.error('Error generating signed URL', error);
        throw error; // Rethrow the error for further handling if necessary
    }
}

// Example usage
const bucketName = 'languagemaster'; // Replace with your bucket name
const fileName = 'gettysburg.wav'; // Replace with your file name
generateSignedUrl(bucketName, fileName).then(url => {
    console.log('Signed URL:', url);
}).catch(error => {
    console.error('Failed to generate signed URL:', error);
});

module.exports = {getFeedback};