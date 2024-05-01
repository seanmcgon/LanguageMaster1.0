//cd into server and run using "npx jest Testing/assignmentTest"
const { MongoClient } = require('mongodb');
const { createAssignment, viewAssignment, addToAssignment, deleteAssignment, deleteFromAssignment, convertAssignmentToDtbForm } = require('../src/assignments.js');

jest.mock('mongoose');
const mongo = require('../src/assignments.js');

describe('Assignment Management Tests', () => {

      const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
      const client = new MongoClient(connectionString);

      describe("addToAssignment", () => {
        it("Inserts flashcard to existing class and existing assignment", async () => {
          const inserted = await addToAssignment("Spanish454_QRAPCC", "war", {text: "asdf", translation: "qwer", audio: "zcxv"});
          expect(inserted).toEqual(true);
          try{
            await client.connect();
            let db = client.db("Spanish454_QRAPCC");
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
            await client.close();
          }
        });
      
        it("Throws an error for a non-existent class", async () => {
          console.log = jest.fn();
          const inserted = await addToAssignment("ABCD", "war", {text: "asdf", translation: "qwer", audio: "zcxv"});
          expect(inserted).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Class does not exist");
        });
      
        it("Throws an error for a non-existent assignment", async () => {
          console.log = jest.fn();
          const inserted = await addToAssignment("Spanish454_QRAPCC", "ASDF", {text: "asdf", translation: "qwer", audio: "zcxv"});
          expect(inserted).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Assignment does not exist");
        });
      })
      
      describe('deleteAssignment',() =>{
        it('deletes an existing assignment', async() => {
          try{
          const class_Name = "Chinese671_JPYVGX";
          const momentum = [{assignment: "momentum", card: 0, text: "mome", translation: "ent", audio: "https://www.adfaf.com"}, {assignment: "momentum", card: 1, text: "ent", translation: "um", audio: "https://www.adfaf.com"}]
          const assignment_name = "momentum";
          await client.connect();
          db = client.db(class_Name);
          col = await db.collection("assignments");
          await col.insertMany(momentum);
          // Test the the presence of assignemnts in the given class
        const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
        expect(presence_of_assignments.length).toBe(2);
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
        it('the assignment to delete does not exist', async() => {

          try{
          const class_Name = "Chinese671_JPYVGX";
          const assignment_name = "adslkjf";
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

      describe('deleteFromAssignment',() =>{
        it('deletes flashcards that match the object specified', async() => {
          try{
            const class_Name = "Chinese671_JPYVGX";
            const assignment_name = "bad";
            await client.connect();
            db = client.db(class_Name);
            col = await db.collection("assignments");
            // Test the the presence of assignemnts in the given class
            col.insertOne({assignment: assignment_name, card: 2, text: "national", translation: "low", audio: "http://www.webster-durham.info/"})
            const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
            expect(presence_of_assignments.length).toEqual(3);
            await deleteFromAssignment(class_Name, assignment_name,{text: "national", translation: "low", audio: "http://www.webster-durham.info/"});
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
            {wordName: 'text0', englishTranslation: 'translation0', audioFile: 'audio0'},
            {wordName: 'text1', englishTranslation: 'translation1', audioFile: 'audio1'},
            {wordName: 'text2', englishTranslation: 'translation2', audioFile: 'audio2'}
          ];
          const convertedAssignment = convertAssignmentToDtbForm(assignmentName, assignmentArray);
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
          const cards = await viewAssignment("Spanish454_QRAPCC", "war");
          expect(cards.length).toEqual(2);
          expect(cards.map(e => e.text)).toContain("right");
          expect(cards.map(e => e.text)).toContain("provide");
        });
      
        // Reacts correctly for class that doesn't exist
        it("Throws an error for a non-existent class", async () => {
          console.log = jest.fn();
          await viewAssignment("ABCD", "war");
          expect(console.log).toHaveBeenCalledWith("Class does not exist");
        });
      
        // Reacts correctly for assignment that doesn't exist
        it("Throws an error for a non-existent assignment", async () => {
          console.log = jest.fn();
          await viewAssignment("Spanish454_QRAPCC", "ABCD");
          expect(console.log).toHaveBeenCalledWith("Assignment does not exist");
        });
      });

      describe("createAssignment", () => {
        it("Creates a new assignment", async () => {
          try {
            const className = "Chinese671_JPYVGX";
            const assignmentName = "assignment1";
            const assignmentArray = [
              { wordName: "text1", englishTranslation: "translation1", audioFile: "audio1"},
              { wordName: "text2", englishTranslation: "translation2", audioFile: "audio2"}
            ];
            const created = await createAssignment(className, assignmentName, assignmentArray);
            expect(created).toEqual(true);

            // Verify that the assignment was created in the database
            await client.connect();
            const db = client.db(className);
            const col = db.collection("assignments");
            const assignments = await col.find({ assignment: assignmentName }).toArray();
            expect(assignments.length).toEqual(2);
            expect(assignments.map(a => a.text)).toContain("text1");
            expect(assignments.map(a => a.text)).toContain("text2");

            // Clean up by deleting the created assignment
            await col.deleteMany({ assignment: assignmentName });
            await db.collection("metrics").deleteMany({ assignment: assignmentName });

          } catch (err) {
            throw (err);
          } finally {
            await client.close();
          }
        });

        it("Inserts only unique objects", async () => {
          try {
            const className = "Chinese671_JPYVGX";
            const assignmentName = "assignment1";
            const assignmentArray = [
              { wordName: "text1", englishTranslation: "translation1", audioFile: "audio1"},
              { wordName: "text2", englishTranslation: "translation2", audioFile: "audio2"},
              { wordName: "text2", englishTranslation: "translation2", audioFile: "audio2"}
            ];
            const created = await createAssignment(className, assignmentName, assignmentArray);
            expect(created).toEqual(true);

            // Verify that the assignment was created in the database
            await client.connect();
            const db = client.db(className);
            const col = db.collection("assignments");
            const assignments = await col.find({ assignment: assignmentName }).toArray();
            expect(assignments.length).toEqual(2);
            expect(assignments.map(a => a.text)).toContain("text1");
            expect(assignments.map(a => a.text)).toContain("text2");

            // Clean up by deleting the created assignment
            await col.deleteMany({ assignment: assignmentName });
            await db.collection("metrics").deleteMany({ assignment: assignmentName });

          } catch (err) {
            throw (err);
          } finally {
            await client.close();
          }
        });

        it("Creates a new assignment with blank grades for every student for every flashcard", async () => {
          try {
              const className = "Chinese671_JPYVGX";
              const assignmentName = "assignment1";
              const assignmentArray = [
                  { wordName: "text1", englishTranslation: "translation1", audioFile: "audio1"},
                  { wordName: "text2", englishTranslation: "translation2", audioFile: "audio2"}
              ];
              const created = await createAssignment(className, assignmentName, assignmentArray);
              expect(created).toEqual(true);
  
              // Verify that the assignment was created in the database
              await client.connect();
              const db = client.db(className);
              const col = db.collection("assignments");
              const assignments = await col.find({ assignment: assignmentName }).toArray();
              expect(assignments.length).toEqual(2);
              expect(assignments.map(a => a.text)).toContain("text1");
              expect(assignments.map(a => a.text)).toContain("text2");
  
              // Verify that blank grades were created for every student for every flashcard
              
              const grades = await db.collection("metrics").find({assignment: assignmentName}).toArray();
              expect(grades.length).toEqual(4);
              expect(grades.map(e => e.studentEmail)).toContain("Michael.Hinton@gmail.com");
              expect(grades.map(e => e.studentEmail)).toContain("Mark.Wilson@yahoo.com");
  
              // Clean up by deleting the created assignment and grades
              await col.deleteMany({ assignment: assignmentName });
              await db.collection("metrics").deleteMany({ assignment: assignmentName });
  
          } catch (err) {
              throw (err);
          } finally {
              await client.close();
          }
        });
  
      });
});
