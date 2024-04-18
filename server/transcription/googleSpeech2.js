
const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const request = require('request-promise-native');
const fs = require('fs');
const client = new SpeechClient({
    projectID: 'languagemaster-418508',
    keyFilename:'./key.json'
});

const options = {  
    'languageCode': 'en-US',
    'sampleRate': 16600,
    'encoding': 'LINEAR16'
};

async function audioRecognition(audioUrl) {
    const fileName = await downloadAudio(audioUrl);
    const [response] = await client.recognize({
        config: options,
        audio: {
            content: fs.readFileSync(fileName).toString('base64')
        }
    });
    return response.results.map(result => result.alternatives[0].transcript).join('\n');
}

async function downloadAudio(audioUrl) {
    const response = await request.get({
        uri: audioUrl,
        encoding: null
    });
    const fileName = 'preamble10.wav'; // You may need to adjust the file extension based on the actual format of the audio file
    fs.writeFileSync(fileName, response);
    return fileName;
}

// Example audio file
const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';

// Example Usage
audioRecognition(audioUrl)
    .then(results => {
        console.log('Transcription:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
module.exports = audioRecognition;