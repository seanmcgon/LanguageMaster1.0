// Written by Maya Kandeshwarath 4/29/24
const keys = require("./keys.js")
const AWS = require('aws-sdk');
const fs = require('fs');

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
        // console.log(`File uploaded successfully. ${data.Location}`);
        return("${data.Location}");
      }
    });
  };
  
// Upload file from my machine into amazon aws s3 bucket
// Commented out so it doesn't get uploaded everytime
// uploadFile('/Users/mayakandeshwarath/Desktop/Youtube Music Music/CALL ME IF YOU GET LOST/MP3s/Tyler, The Creator - CALL ME IF YOU GET LOST/15 - Tyler, The Creator - WILSHIRE.mp3', 'wilshire.mp3');

// Retrieve the file
s3.getObject(
    { Bucket: "language-master", Key: "wilshire.mp3" },
    function (error, data) {
      if (error != null) {
        console.log("Failed to retrieve an object: " + error);
      } else {
        // I don't really know what to do with it, so I don't know how to use it here
        // I'm thinking I can create a user for the transcription code, or use the same user
        // and then I could use the url I get from uploading and run it through Shuto's transcription code
        // Tried it and doesn't work, need to figure out the format it's retrieved in
        // console.log("Loaded " + data.ContentLength + " bytes");
        console.log(data);
      }
    }
  );
