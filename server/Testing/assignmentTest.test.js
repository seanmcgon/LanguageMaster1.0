//cd into server and run using "npx jest Testing/assignmentTests"
const { MongoClient } = require('mongodb');
const { createAssignment, viewAssignment, addToAssignment, deleteAssignment, deleteFromAssignment } = require('../src/assignments.js');

jest.mock('mongoose');
const mongo = require('../src/assignments.js');

describe('Assignment Management Tests', () => {

      describe("addToAssignment", () => {
        it("Inserts flashcard to existing class and existing assignment", async () => {
          const inserted = await mongo.addToAssignment("Spanish454_QRAPCC", "war", {text: "asdf", translation: "qwer", audio: "zcxv"});
          expect(inserted).toEqual(true);
          try{
            await mongo.client.connect();
            let db = mongo.client.db("Spanish454_QRAPCC");
            let col = db.collection("assignments");
            const card = await col.find({audio: "zcxv"}).toArray();
            expect(card.length).toEqual(1);
            expect(card[0].assignment).toEqual("war");
            expect(card[0].card).toEqual(2);
            expect(card[0].text).toEqual("asdf");
            expect(card[0].translation).toEqual("qwer");
            expect(card[0].audio).toEqual("zcxv");
            await col.deleteOne({audio: "zcxv"});
          }
          finally{
            await mongo.client.close();
          }
        });
      
        it("Throws an error for a non-existent class", async () => {
          console.log = jest.fn();
          const inserted = await mongo.addToAssignment("ABCD", "war", {text: "asdf", translation: "qwer", audio: "zcxv"});
          expect(inserted).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Class does not exist");
        });
      
        it("Throws an error for a non-existent assignment", async () => {
          console.log = jest.fn();
          const inserted = await mongo.addToAssignment("Spanish454_QRAPCC", "ASDF", {text: "asdf", translation: "qwer", audio: "zcxv"});
          expect(inserted).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Assignment does not exist");
        });
      })
      
      describe('this suit will test the function delete Assignment',() =>{
        it('check the presence of the assingment in the class first, then delete, and check the presence again. In this case, the assignments are already there', async() => {
          const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
          const client = new MongoClient(connectionString);
          try{
          const class_Name = "Chinese671_JPYVGX";
          const assignment_name = "momentum";
          await client.connect();
          db = client.db(class_Name);
          col = await db.collection("assignments");
          // Test the the presence of assignemnts in the given class
        const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
        expect(presence_of_assignments.length).toBeGreaterThan(0);
        await deleteAssignment(class_Name, assignment_name);
       // Test the the presence of assignemnts in the given class after deleting
       await client.connect();
       db1 = client.db(class_Name);
       col1 = await db1.collection("assignments");
        const presence_after = await col1.find({assignment: assignment_name}).toArray();
        expect(presence_after.length).toEqual(0);
          }
          catch(error){
            throw (error);
          }
          finally{
            await client.close();
          }
        });
        it('check the presence of the assingment in the class first, then delete, and check the presence again. In this case, the assignments are not there', async() => {
          const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
          const client = new MongoClient(connectionString);
          try{
          const class_Name = "Chinese671_JPYVGX";
          const assignment_name = "momentum";
          await client.connect();
          db = client.db(class_Name);
          col = await db.collection("assignments");
          // Test the the presence of assignemnts in the given class
        const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
        expect(presence_of_assignments.length).toEqual(0);
        await deleteAssignment(class_Name, assignment_name);
       // Test the the presence of assignemnts in the given class after deleting
       await client.connect();
       db1 = client.db(class_Name);
       col1 = await db1.collection("assignments");
        const presence_after = await col1.find({assignment: assignment_name}).toArray();
        expect(presence_after.length).toEqual(0);
          }
          catch(error){
            throw (error);
          }
          finally{
            await client.close();
          }
        });
      });
      describe('this suit will test the function delete object from a given Assignment',() =>{
        it('delete only ones that match the object preference', async() => {
          const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
          const client = new MongoClient(connectionString);
          try{
          const class_Name = "Chinese671_JPYVGX";
          const assignment_name = "bad";
          await client.connect();
          db = client.db(class_Name);
          col = await db.collection("assignments");
          // Test the the presence of assignemnts in the given class
        const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
        expect(presence_of_assignments.length).toEqual(3);
        await deleteFromAssignment(class_Name, assignment_name,{text: "international", translation: "low",audio: "http://www.webster-durham.info/"});
       // Test the the presence of assignemnts in the given class after deleting
       await client.connect();
       db1 = client.db(class_Name);
       col1 = await db1.collection("assignments");
        const presence_after = await col1.find({assignment: assignment_name}).toArray();
        expect(presence_after.length).toEqual(2);
          }
          catch(error){
            throw (error);
          }
          finally{
            await client.close();
          }
        });
      });
      describe('convertAssignmentToDtbForm', () => {
        it ('should convert an assignment array to the correct format', () => {
          const assignmentName = 'Assignment0';
          const assignmentArray = [
            {text: 'text0', translation: 'translation0', audio: 'audio0'},
            {text: 'text1', translation: 'translation1', audio: 'audio1'},
            {text: 'text2', translation: 'translation2', audio: 'audio2'}
          ];
          const convertedAssignment = mongo.convertAssignmentToDtbForm(assignmentName, assignmentArray);
          expect(convertedAssignment).toEqual([
            {assignment: 'Assignment0', card: 0, text: 'text0', translation: 'translation0', audio: 'audio0'},
            {assignment: 'Assignment0', card: 1, text: 'text1', translation: 'translation1', audio: 'audio1'},
            {assignment: 'Assignment0', card: 2, text: 'text2', translation: 'translation2', audio: 'audio2'}
          ]);
        });
      });
          
      describe("viewAssignment", () => {
        // Works in a typical case, where no errors should be thrown and a valid output should be returned
        it("Returns existing assignment in correct form", async () => {
          const cards = await mongo.viewAssignment("Spanish454_QRAPCC", "war");
          expect(cards.length).toEqual(5);
          expect(cards.map(e => e.text)).toEqual(["right", "provide"]);
        });
      
        // Reacts correctly for class that doesn't exist
        it("Throws an error for a non-existent class", async () => {
          console.log = jest.fn();
          await mongo.viewAssignment("ABCD", "war");
          expect(console.log).toHaveBeenCalledWith("Class does not exist");
        });
      
        // Reacts correctly for assignment that doesn't exist
        it("Throws an error for a non-existent assignment", async () => {
          console.log = jest.fn();
          await mongo.viewAssignment("Spanish454_QRAPCC", "ABCD");
          expect(console.log).toHaveBeenCalledWith("Assignment does not exist");
        });
      });
});
