const { audioRecognition } = require("./transcription/audioToText.js");
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const keyFilename = path.join(__dirname, 'key.json');
const storage = new Storage({ keyFilename });

/**
 * Uploads an audio buffer to Google Cloud Storage and returns the file name.
 * @param {Buffer} audioBuffer - The audio buffer to upload.
 * @param {string} bucketName - The name of the bucket where the file should be uploaded.
 * @returns {Promise<string>} A promise that resolves to the file name.
 */
async function uploadAudioToBucket(audioBuffer, bucketName) {
    const fileName = `audio-${Date.now()}.wav`; // Generate a unique file name
    const file = storage.bucket(bucketName).file(fileName);

    try {
        await file.save(audioBuffer);
        console.log('File uploaded successfully:', fileName);
        return fileName;
    } catch (error) {
        console.error('Failed to upload file:', error);
        throw error;
    }
}

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
        throw error;
    }
}

async function getFeedback(audioBuffer) {
    try {
        const fileName = await uploadAudioToBucket(audioBuffer, 'languagemaster');
        console.log(fileName)
        const signedUrl = await generateSignedUrl('languagemaster', "gettysburg.wav");
        console.log('Signed URL:', signedUrl);
        audioRecognition(signedUrl,'en-US' )
        .then(results => {
            console.log('Transcription:', results);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } catch (error) {
        console.error('Error in getting feedback:', error);
    }

    return {};
}

module.exports = { getFeedback };
