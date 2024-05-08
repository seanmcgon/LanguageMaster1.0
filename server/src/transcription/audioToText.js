const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const axios = require('axios');
const client = new SpeechClient({
    projectID: 'languagemaster-418508',
    keyFilename:'./key.json'
});

const languageConfigs = {
    'Arabic': { languageCode: 'ar-SA', sampleRate: 16000, encoding: 'LINEAR16' },
    'Chinese (Simplified)': { languageCode: 'zh-CN', sampleRate: 16000, encoding: 'LINEAR16' },
    'Chinese (Traditional)': { languageCode: 'zh-TW', sampleRate: 16000, encoding: 'LINEAR16' },
    'Danish': { languageCode: 'da-DK', sampleRate: 16000, encoding: 'LINEAR16' },
    'Dutch': { languageCode: 'nl-NL', sampleRate: 16000, encoding: 'LINEAR16' },
    'English (Australia)': { languageCode: 'en-AU', sampleRate: 16000, encoding: 'LINEAR16' },
    'English (United Kingdom)': { languageCode: 'en-GB', sampleRate: 16000, encoding: 'LINEAR16' },
    'English (India)': { languageCode: 'en-IN', sampleRate: 16000, encoding: 'LINEAR16' },
    'English (United States)': { languageCode: 'en-US', sampleRate: 25050, encoding: 'LINEAR16' },
    'Finnish': { languageCode: 'fi-FI', sampleRate: 16000, encoding: 'LINEAR16' },
    'French': { languageCode: 'fr-FR', sampleRate: 16000, encoding: 'LINEAR16' },
    'German': { languageCode: 'de-DE', sampleRate: 16000, encoding: 'LINEAR16' },
    'Greek': { languageCode: 'el-GR', sampleRate: 16000, encoding: 'LINEAR16' },
    'Hebrew': { languageCode: 'he-IL', sampleRate: 16000, encoding: 'LINEAR16' },
    'Hindi': { languageCode: 'hi-IN', sampleRate: 16000, encoding: 'LINEAR16' },
    'Hungarian': { languageCode: 'hu-HU', sampleRate: 16000, encoding: 'LINEAR16' },
    'Indonesian': { languageCode: 'id-ID', sampleRate: 16000, encoding: 'LINEAR16' },
    'Italian': { languageCode: 'it-IT', sampleRate: 16000, encoding: 'LINEAR16' },
    'Japanese': { languageCode: 'ja-JP', sampleRate: 16000, encoding: 'LINEAR16' },
    'Korean': { languageCode: 'ko-KR', sampleRate: 16000, encoding: 'LINEAR16' },
    'Norwegian': { languageCode: 'no-NO', sampleRate: 16000, encoding: 'LINEAR16' },
    'Polish': { languageCode: 'pl-PL', sampleRate: 16000, encoding: 'LINEAR16' },
    'Portuguese (Brazil)': { languageCode: 'pt-BR', sampleRate: 16000, encoding: 'LINEAR16' },
    'Portuguese (Portugal)': { languageCode: 'pt-PT', sampleRate: 16000, encoding: 'LINEAR16' },
    'Russian': { languageCode: 'ru-RU', sampleRate: 16000, encoding: 'LINEAR16' },
    'Spanish (Spain)': { languageCode: 'es-ES', sampleRate: 16000, encoding: 'LINEAR16' },
    'Spanish (Mexico)': { languageCode: 'es-MX', sampleRate: 16000, encoding: 'LINEAR16' },
    'Swedish': { languageCode: 'sv-SE', sampleRate: 16000, encoding: 'LINEAR16' },
    'Thai': { languageCode: 'th-TH', sampleRate: 16000, encoding: 'LINEAR16' },
    'Turkish': { languageCode: 'tr-TR', sampleRate: 16000, encoding: 'LINEAR16' },
    'Vietnamese': { languageCode: 'vi-VN', sampleRate: 16000, encoding: 'LINEAR16' },
    'Romanian': { languageCode: 'ro-RO', sampleRate: 16000, encoding: 'LINEAR16' }

};



async function audioRecognition(audioUrl, languageName, sampleRateHertz = null, encoding = null) {
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });

    // Get configuration from languageConfigs or use the default if not specified
    const defaultConfig = languageConfigs[languageName] || languageConfigs['English (United States)'];
    const config = {
        languageCode: defaultConfig.languageCode,
        sampleRateHertz: sampleRateHertz || defaultConfig.sampleRate,
        encoding: encoding || defaultConfig.encoding,
    };

    try {
        const [transcriptionResult] = await client.recognize({
            config,
            audio: {
                content: Buffer.from(response.data, 'binary').toString('base64')
            }
        });
        return transcriptionResult.results.map(result => result.alternatives[0].transcript).join('\n');
    } catch (error) {
        console.error('Failed to transcribe audio:', error);
        return "Transcription failed";
    }
}

// Example Usage
// Example audio file
// const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
// audioRecognition(audioUrl)
//     .then(results => {
//         console.log('Transcription:', results);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

module.exports = { audioRecognition } ;