const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const axios = require('axios');
const client = new SpeechClient({
    projectID: 'languagemaster-418508',
    keyFilename:'./key.json'
});

const english = {  
    languageCode: 'en-US',
    sampleRate: 16600,
    encoding: 'LINEAR16'
};

async function audioRecognition(audioUrl) {
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const [transcriptionResult] = await client.recognize({
        config: english,
        audio: {
            content: Buffer.from(response.data, 'binary').toString('base64')
        }
    });
    return transcriptionResult.results.map(result => result.alternatives[0].transcript).join('\n');
}

// Example Usage
// Example audio file
const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
audioRecognition(audioUrl)
    .then(results => {
        console.log('Transcription:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });

module.exports = { audioRecognition } ;
