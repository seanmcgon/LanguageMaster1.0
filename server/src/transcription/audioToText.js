const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const axios = require('axios');
const client = new SpeechClient({
    projectID: 'languagemaster-418508',
    keyFilename:'./key.json'
});

// Function to perform audio transcription
async function audioRecognition(audioUrl, languageCode) {
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const [transcriptionResult] = await client.recognize({
        config: {
            languageCode,
            sampleRateHertz: 16000,
            encoding: 'LINEAR16'
        },
        audio: {
            content: Buffer.from(response.data, 'binary').toString('base64')
        }
    });
    return transcriptionResult.results.map(result => result.alternatives[0].transcript).join('\n');
}

module.exports = { audioRecognition };
