// Written by Maya Kandeshwarath 4/29/24
const keys = require("./keys.js")
const AWS = require('aws-sdk');
const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;

// Connection to s3 bucket
// access key is stored in an untracked file
const s3 = new AWS.S3({
  accessKeyId: keys.ACCESS_KEY_ID,
  secretAccessKey: keys.SECRET_ACCESS_KEY
});

// function to upload a file to s3 bucket
// takes file name on machine, name file is uploaded under, name of bucket
// uploads the file
const uploadFile = (fileName, uploadName) => {
    const fileContent = fs.readFileSync(fileName);
  
    const params = {
      Bucket: "language-master",
      Key: uploadName,
      Body: fileContent,
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        console.log(data);
      }
    });
  };
  
// Upload file from my machine into amazon aws s3 bucket
// Commented out so it doesn't get uploaded everytime
// uploadFile('/Users/mayakandeshwarath/Desktop/Youtube Music Music/IGOR/06 - Tyler, the Creator - NEW MAGIC WAND.mp3', 'newMagicWand.mp3');

// Retrieve the file
// s3.getObject(
//     { Bucket: "language-master", Key: "wilshire.mp3" },
//     function (error, data) {
//       if (error != null) {
//         console.log("Failed to retrieve an object: " + error);
//       } else {
//         // I don't really know what to do with it, so I don't know how to use it here
//         // I'm thinking I can create a user for the transcription code, or use the same user
//         // and then I could use the url I get from uploading and run it through Shuto's transcription code
//         // Tried it and doesn't work, need to figure out the format it's retrieved in
//         // console.log("Loaded " + data.ContentLength + " bytes");
//         console.log(data);
//       }
//     }
//   );

const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
const axios = require('axios');
const client = new SpeechClient({
    projectID: 'languagemaster-418508',
    keyFilename:'./src/transcription/key.json'
});

// Function to perform audio transcription
async function audioRecognition(audioUrl, languageCode) {
    const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    console.log(response.data);
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
    console.log(transcriptionResult);
    return transcriptionResult.results.map(result => result.alternatives[0].transcript).join('\n');
}


const url = "https://language-master.s3.us-east-2.amazonaws.com/bowed_bout32.mp3?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDcaCXVzLWVhc3QtMiJGMEQCIHVtAvqqteBy148VszjLpoAoUMRSkgrimgcZlCthCwSYAiA3gUY%2BIegDDPvFouPJrMoNZGhTghOydqI8TGurr36u1yrxAgiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDIxMTEyNTYwODE5NiIMsVICN0Z9Q2ulzWs0KsUCRrATIUqenyyMO4xZk0%2BQ%2FilTCMyEpPDwoYB6kGUwNmJ5CewYUCvqbfFjWZdtPFnV6zZsm6VfN6IOBz%2FGM34lvTHKEtFe8m%2BAXjZxQVFxATblH6PlKPHx9ziQjihndRAssDv4Fm8U1KhJXCBjnluatDxSg5H0ONEczcG0M%2Bz1BCoFWXnNo6KTO2pqPwXiCXC%2BNdXMcY7QX8vmBGQZuO1lpyc74aa3ZxXTa56x6NMDxIw1TDExuifW7Dad%2FDxQORMD%2FNEmA09cMotJMiyaYWo98uz9OA0l3lSBHyf2TJuxlRP%2BjqUfP3s%2BXqGDg7oOwse7Hm9f7hLSwky57G4V9H%2BOEL7bQpLHrl69VWV83sVhaePWTat4Jpl75T%2BtqCi158CFliG9O0W2s6MjosZlxVsmXSHuK%2BCiHMUur4cFwDh1BCxBVZfNbDDroNmxBjq0Aj6rV1W55ls4bmdsV1UgOtD5ONKIt62DAVI3K3NO9Gc3c7oBYX4Q%2FS5QESS1%2BrlxXe0gg%2Fq9mFv9dAJ5gEabQkScVcI550T8wUOzWxc2gzQHFuVR5YCSFHEbGV%2Fqh8o85gQkzPiYoR0s6rLO6SCP5iRhHrbuJdXlJEyWc7BJB3QqlqObwhsfNCKCmQanZjSwcXZ1ox2zFcWnX3rnOyRzRng8lOoAei4JPAz0vlP4tqS6uWwSy6I0nsNKXaxcf7OqXOD0EIW62K8PeM4bz1EhfmyeY%2BSOHuBPFZ02z15AJExJBmkmojibVq6Qp77%2F9RDpbHbfC9Fb3LJONO7RxnCfSyvkQBtyi0VM%2FkXnf8Xq3t4fFiGSlW0OG111Tx%2FEkpWYO4MlIfpXNTTmndYJMsKxAEfu7Qzd&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240504T154550Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1800&X-Amz-Credential=ASIATCKARD4CMR2MEC6M%2F20240504%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=075be928669192a37db96d6f311465e3cf68099d049454ae67da930b6865735c";
async function print(){await audioRecognition(url, "en-US");};

print();