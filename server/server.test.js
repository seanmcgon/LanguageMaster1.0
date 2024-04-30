const request = require('supertest');
const app = require('./index.js'); 

jest.mock('mongoose')

describe('the function should add new teacher',() =>{
  it('Test create teacher', async() => {
    mongo = require('./function.js');
    const fisrName = "huy";
    const lastName = "Gu";
    const email = "hugy@gmaki.sut";
  const password = "uhkjhku";
  
  await mongo.createTeacher(fisrName, lastName, email, password);
  let re = await mongo.verifyTeacher(email, password);
  expect(re).toEqual(true);
  });
});
 describe('the function should verify teacher',() =>{
   it('Test existing teacher with wrong password', async() => {
     mongo = require('./function.js');
     const email = "James.Moore@gmail.com";
   const password = "wemKmh";
   let re = await mongo.verifyTeacher(email, password);
   expect(re).toEqual(false);
   });
   it('Test existing teacher with wrong email', async() => {
    mongo = require('./function.js');
    const email = "JamesMoore@gmail.com";
  const password = "wemKmhTh"
  let re = await mongo.verifyTeacher(email, password);
  expect(re).toEqual(false);
  });
  it('Test existing teacher with wrong email and password', async() => {
    mongo = require('./function.js');
    const email = "JamesMoore@gmail.com";
  const password = "wemKmh"
  let re = await mongo.verifyTeacher(email, password);
  expect(re).toEqual(false);
  });
  it('Test existing teacher', async() => {
    mongo = require('./function.js');
    const email = "James.Moore@gmail.com";
  const password = "wemKmhTh";
  let re = await mongo.verifyTeacher(email, password);
  expect(re).toEqual(true);
  });
 });

 const { getGoogleTranscription } = require('./googleSpeech.js');
 const fs = require('fs');
const { describe } = require('node:test');
   
 describe('getGoogleTranscription function should return the string correctly', () => {
   it('transcribes audio file from URL', async () => {
     const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
     const expectedTranscription = 'we the people of the United States in order to form a more perfect union establish justice insure domestic tranquility provide for the common defense';   
     const transcription = await getGoogleTranscription(audioUrl);
     expect(transcription).toEqual(expectedTranscription);
   });
 });

 describe('getClassesTeacher', () => {
  it('should return an array of classes for a teacher', async () => {
    const classes = await getClassesTeacher('johndoe@gmail.com');
    expect(Array.isArray(classes)).toBe(true);
  });

  it('should return an empty array if teacher does not exist', async () => {
    const classes = await getClassesTeacher('nonexistentteacher');
    expect(classes).toEqual([]);
  });
});

describe('getClassesStudent', () => {
  it('should return an array of classes for a student', async () => {
    const classes = await getClassesStudent('Stephen.Calderon@gmail.com');
    expect(Array.isArray(classes)).toBe(true);
  });

  it('should return an empty array if student does not exist', async () => {
    const classes = await getClassesStudent('nonexistentstudent');
    expect(classes).toEqual([]);
  });
});

describe('createAssignment', () => {
  it('should create a new assignment if it does not exist', async () => {
    const className = "English235_JHBWXD";
    const assignmentName = "Assignment0";
    const assignmentArray = [
      {text: 'text0', translation: 'translation0', audio: 'audio0'},
      {text: 'text1', translation: 'translation1', audio: 'audio1'},
      {text: 'text2', translation: 'translation2', audio: 'audio2'}
    ];
    const result = await mongo.createAssignment(className, assignmentName, assignmentArray);
    expect(result).toBe(true);
    try {
      await client.connect();
      const ret = await mongo.client.db(className).collection('assignments').find({assignment: assignmentName }).toArray();
      expect(ret.length).toEqual(3);
      expect(ret[0].assignment).toEqual(assignmentName);
      expect(ret[0].card).toEqual(0);
      expect(ret[0].text).toEqual('text0');
      expect(ret[0].translation).toEqual('translation0');
      expect(ret[0].audio).toEqual('audio0');

      expect(ret[1].assignment).toEqual(assignmentName);
      expect(ret[1].card).toEqual(1);
      expect(ret[1].text).toEqual('text1');
      expect(ret[1].translation).toEqual('translation1');
      expect(ret[1].audio).toEqual('audio1');

      expect(ret[2].assignment).toEqual(assignmentName);
      expect(ret[2].card).toEqual(2);
      expect(ret[2].text).toEqual('text2');
      expect(ret[2].translation).toEqual('translation2');
      expect(ret[2].audio).toEqual('audio2');

      // Remove the document form the DB
      await mongo.client.db(className).collection('assignments').deleteOne({
        text: 'text0', translation: 'translation0', audio: 'audio0'
      });
      await mongo.client.db(className).collection('assignments').deleteOne({
        text: 'text1', translation: 'translation1', audio: 'audio1'
      });
      await mongo.client.db(className).collection('assignments').deleteOne({
        text: 'text2', translation: 'translation2', audio: 'audio2'
      });
    } finally {
      await mongo.client.close();
    }
  });

  it ('should not create a new assignment if it already exists', async () => {
    const className = "English235_JHBWXD";
    const assignmentName = "arma";
    const assignmentArray = [
      {text: 'text0', translation: 'translation0', audio: 'audio0'},
      {text: 'text1', translation: 'translation1', audio: 'audio1'},
      {text: 'text2', translation: 'translation2', audio: 'audio2'}
    ];
    const result = await mongo.createAssignment(className, assignmentName, assignmentArray);
    expect(result).toEqual(false);
  });

  it ('should not create a new assignment if assignmentArray is empty', async () => {
    const className = "English235_JHBWXD";
    const assignmentName = "Assignment0";
    const assignmentArray = [];
    const result = await mongo.createAssignment(className, assignmentName, assignmentArray);
    expect(result).toEqual(false);
  });
});

descrive('convertAssignmentToDtbForm', () => {
  it ('should convert an assignment array to the correct format', () => {
    const assignmentName = 'Assignment0';
    const assignmentArray = [
      {text: 'text0', translation: 'translation0', audio: 'audio0'},
      {text: 'text1', translation: 'translation1', audio: 'audio1'},
      {text: 'text2', translation: 'translation2', audio: 'audio2'}
    ];
    const convertedAssignment = mongo.convertAssignmentToDtbForm(assignmentName, assignmentArray);
    expect(convertedAssignment).toEqual([
      {assignment: 'Assignment1', card: 0, text: 'text0', translation: 'translation0', audio: 'audio0'},
      {assignment: 'Assignment1', card: 1, text: 'text1', translation: 'translation1', audio: 'audio1'},
      {assignment: 'Assignment1', card: 2, text: 'text2', translation: 'translation2', audio: 'audio2'}
    ]);
  });
});


