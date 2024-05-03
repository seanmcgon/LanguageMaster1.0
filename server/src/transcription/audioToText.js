const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const axios = require('axios');
const client = new SpeechClient({
    projectID: 'languagemaster-418508',
    keyFilename: './key.json'
});
async function audioRecognition(audioBuffer, languageCode = 'en-US') {
    const config = {
        languageCode: languageCode,
        sampleRate: 16000,
        encoding: 'LINEAR16'
    };
    const [transcriptionResult] = await client.recognize({
        config,
        audio: {
            content: audioBuffer.toString('base64')
        }
    });
    return transcriptionResult.results.map(result => result.alternatives[0].transcript).join('\n');
}
// Function to perform audio transcription
async function audioRecognition1(audioUrl, languageCode = 'en-US') {
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const config = {
        languageCode: languageCode,
        sampleRate: 16000,
        encoding: 'LINEAR16'
    };
    const [transcriptionResult] = await client.recognize({
        config,
        audio: {
            content: Buffer.from(response.data, 'binary').toString('base64')
        }
    });
    return transcriptionResult.results.map(result => result.alternatives[0].transcript).join('\n');
}


// Example Usage
const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
audioRecognition(audioUrl, 'en-US') // Pass the language code directly
    .then(results => {
        console.log('Transcription:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });

module.exports = { audioRecognition };
