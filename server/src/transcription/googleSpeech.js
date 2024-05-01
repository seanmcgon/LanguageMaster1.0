/*
Use following commands:

<1. Initializing the gcloud CLI>

    ### 'gcloud init'                                                                       --- initialize and set the configuration.
    ### 'gcloud auth application-default login'                                             --- login the account.

    For more info: https://cloud.google.com/sdk/docs/initializing

<2. Authenticate API requests>

    ### 'export GOOGLE_CLOUD_PROJECT=$(gcloud config get-value core/project)'               --- set an environment variable with your PROJECT_ID which you will use throughout this codelab.
    ### 'gcloud iam service-accounts create my-speech-to-text-sa \
      --display-name "my speech-to-text codelab service account"'                           --- create a new service account to access the Speech-to-Text API.
    ### 'gcloud iam service-accounts keys create ~/key.json \
      --iam-account  my-speech-to-text-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com'  --- create credentials that your Node.js code will use to login as your new service account. Create these credentials and save it as a JSON file ~/key.json.
    ### 'export GOOGLE_APPLICATION_CREDENTIALS="/home/${USER}/key.json"'                    --- set the GOOGLE_APPLICATION_CREDENTIALS environment variable, which is used by the Speech-to-Text API Node.js library, covered in the next step, to find your credentials. The environment variable should be set to the full path of the credentials JSON file you created.

    For more info: https://codelabs.developers.google.com/codelabs/cloud-speech-text-node#3

<3. Run the program>
    ### 'npm install --save @google-cloud/speech'                                           --- install the Google Cloud Speech library to the project.
    ### 'npm install axios'                                                                 --- install axios library to the project.
    ### 'node googleSpeech.js'                                                              --- run the program.

    For more info: https://codelabs.developers.google.com/codelabs/cloud-speech-text-node#4
*/

const fs = require('fs');
const axios = require('axios');
const speech = require('@google-cloud/speech').v1p1beta1;

async function getGoogleTranscription(audioUrl) {
    const client = new speech.SpeechClient();
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const audioBytes = Buffer.from(response.data, 'binary').toString('base64');
    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'LINEAR16',
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };
    const [result] = await client.recognize(request);
    const transcription = result.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    return transcription;
}

/*
// Example usage
const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
getGoogleTranscription(audioUrl)
    .then(transcription => console.log(transcription))
    .catch(err => console.error('ERROR:', err));
*/