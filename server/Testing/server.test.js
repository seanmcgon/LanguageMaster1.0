//Old file where all tests for backend were put in the same file, 
//reorganized for clarity and scalability into smaller files under server/Testing


// const { MongoClient } = require('mongodb');
// const request = require('supertest');
// const app = require('../index.js');
// const { createTeacher, createStudent, verifyTeacher, verifyStudent, 
//   createClass, getClassesTeacher, getClassesStudent,
//   convertAssignmentToDtbForm, addToAssignment, createAssignment,
//   getStudentsInClass, getTeachersInClass, viewAssignment,
//   enrollClass,deleteAssignment,deleteFromAssignment} = require('../databaseUsers.js');

// jest.mock('mongoose');
// const mongo = require('../databaseUsers.js')
// const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
// const client = new MongoClient(connectionString);
// describe('the function should add new teacher', () => {
//     it('Test existing teacher by his email and different password', async () => {
//         const firstName = "huy";
//         const lastName = "Gu";
//         const email = "huyGu@gmail.com";
//         const password = "password";
    
//         await createTeacher(firstName, lastName, email, password);
//         let result = await verifyTeacher(email, 'notThePassword');
//         expect(result).toEqual(false);
//     }, 100000);
// });

// describe('the function should verify teacher', () => {
//     let mongo;
//     beforeAll(() => {
//         mongo = require('../databaseUsers.js');
//     });

//     it('Test existing teacher ', async () => {
//         const email = "jyhuang@umass.edu";
//         const password = "Test";
//         let result = await mongo.verifyTeacher(email, password);
//         expect(result).toEqual(true);
//     });

//     it('Test existing teacher with wrong email', async () => {
//         const email = "JamesMoore@gmail.com";
//         const password = "wemKmhTh";
//         let result = await mongo.verifyTeacher(email, password);
//         expect(result).toEqual(false);
//     });

//     it('Test existing teacher with wrong email and password', async () => {
//         const email = "JamesMoore@gmail.com";
//         const password = "wemKmh";
//         let result = await mongo.verifyTeacher(email, password);
//         expect(result).toEqual(false);
//     });
// });


// describe('getClassesTeacher', () => {
//   it('should return an array of classes for a teacher', async () => {
//     const classes = await getClassesTeacher('johndoe@gmail.com');
//     expect(Array.isArray(classes)).toBe(true);
//   });

//   it('should return an empty array if teacher does not exist', async () => {
//     const classes = await getClassesTeacher('nonexistentteacher');
//     expect(classes).toEqual([]);
//   });
// });

// describe('getClassesStudent', () => {
//   it('should return an array of classes for a student', async () => {
//     const classes = await getClassesStudent('Stephen.Calderon@gmail.com');
//     expect(Array.isArray(classes)).toBe(true);
//   });

//   it('should return an empty array if student does not exist', async () => {
//     const classes = await getClassesStudent('nonexistentstudent');
//     expect(classes).toEqual([]);
//   });
// });


// describe('createStudent', () => {
//   it('Inserts student if student is not in db', async () => {
//     // Check that if the insertion was successful, which it should be here, then the return value is correct
//     expect(await mongo.createStudent("Maya", "Kandeshwarath", "mkandeshwarath@umass.edu", "1324")).toEqual(true);
//     try{
//       // connect to the db, get the inserted document and check that all the fields are correct
//       await mongo.client.connect();
//       const ret = await mongo.client.db("UserData").collection("students").find({email: "mkandeshwarath@umass.edu"}).toArray();
//       expect(ret.length).toEqual(1);
//       expect(ret[0].name).toEqual("Maya Kandeshwarath");
//       expect(ret[0].email).toEqual("mkandeshwarath@umass.edu");
//       expect(ret[0].password).toEqual("1324");
//       expect(ret[0].courseList).toEqual([]);
//       // Remove the document from the db
//       await mongo.client.db("UserData").collection("students").deleteOne({email: "mkandeshwarath@umass.edu"});
//     }
//     finally{
//        await mongo.client.close();
//     }

//   });

//   it("Doesn't insert if the email is already in the db", async () => {
//     console.log = jest.fn();
//     expect(await mongo.createStudent("Dua", "Aegah", "Antonio.Greene@yahoo.com", "weaghwha")).toEqual(false);
//     expect(console.log).toHaveBeenCalledWith("Student already exists!");
//   });

//   it("Doesn't insert if the email format is incorrect", async () => {
//     console.log = jest.fn();
//     expect(await mongo.createStudent("Dua", "Aegah", "relwargg", "weaghwha")).toEqual(false);
//     expect(console.log).toHaveBeenCalledWith("Email is invalid");
//   });

//   it("Doesn't insert if the password format is incorrect", async () => {
//     console.log = jest.fn();
//     expect(await mongo.createStudent("Dua", "Aegah", "lawdla@dalkf.com", "aaaaaaaaaaaaaaaaaaaa")).toEqual(false);
//     expect(console.log).toHaveBeenCalledWith("Password is invalid");
//   });

//   it("Doesn't insert if the email and password format are incorrect", async () => {
//     console.log = jest.fn();
//     expect(await mongo.createStudent("Dua", "Aegah", "lawdladalkf", "aaaaaaaaaaaaaaaaaaaa")).toEqual(false);
//     expect(console.log).toHaveBeenCalledWith("Both email and password are invalid");
//   });
// });

// describe("getStudentsInClass", () => {
//   it("Gets students from existing class", async () => {
//     const students = await mongo.getStudentsInClass("Chinese671_JPYVGX");
//     expect(students.length).toEqual(2);
//     expect(students.map(e => e.email)).toEqual(["Michael.Hinton@gmail.com", "Mark.Wilson@yahoo.com"]);
//   });

//   it("Throws an error with a non-existent class", async () => {
//     console.log = jest.fn();
//     await mongo.getStudentsInClass("ABCD");
//     expect(console.log).toHaveBeenCalledWith("Class does not exist");
//   });

//   it("Returns an empty list for an empty class", async () => {
//     expect(await mongo.getStudentsInClass("English235_JHBWXD")).toEqual([]);
//   });
// });

// describe("getTeachersInClass", () => {
//   it("Gets teachers from existing class", async () => {
//     const teachers = await mongo.getTeachersInClass("Chinese671_JPYVGX");
//     expect(teachers.length).toEqual(1);
//     expect(teachers[0].email).toEqual("Stephen.Calderon@gmail.com");
//   });

//   it("Throws an error with a non-existent class", async () => {
//     console.log = jest.fn();
//     await mongo.getTeachersInClass("ABCD");
//     expect(console.log).toHaveBeenCalledWith("Class does not exist");
//   })
// })

// describe('createAssignment', () => {
//   it('should create a new assignment if it does not exist', async () => {
//     const className = "English2350";
//     const assignmentName = "Assignment0";
//     const assignmentArray = [
//       {text: 'text0', translation: 'translation0', audio: 'audio0'},
//       {text: 'text1', translation: 'translation1', audio: 'audio1'},
//       {text: 'text2', translation: 'translation2', audio: 'audio2'}
//     ];
//     const result = await mongo.createAssignment(className, assignmentName, assignmentArray);
//     expect(result).toBe(true);
//     try {
//       await client.connect();
//       const ret = await client.db(className).collection('assignments').find({assignment: assignmentName }).toArray();
//       expect(ret.length).toEqual(15);
//       expect(ret[0].assignment).toEqual(assignmentName);
//       expect(ret[0].card).toEqual(0);
//       expect(ret[0].text).toEqual('text0');
//       expect(ret[0].translation).toEqual('translation0');
//       expect(ret[0].audio).toEqual('audio0');

//       expect(ret[1].assignment).toEqual(assignmentName);
//       expect(ret[1].card).toEqual(1);
//       expect(ret[1].text).toEqual('text1');
//       expect(ret[1].translation).toEqual('translation1');
//       expect(ret[1].audio).toEqual('audio1');

//       expect(ret[2].assignment).toEqual(assignmentName);
//       expect(ret[2].card).toEqual(2);
//       expect(ret[2].text).toEqual('text2');
//       expect(ret[2].translation).toEqual('translation2');
//       expect(ret[2].audio).toEqual('audio2');

//       // Remove the document form the DB
//       await client.db(className).collection('assignments').deleteOne({
//         text: 'text0', translation: 'translation0', audio: 'audio0'
//       });
//       await client.db(className).collection('assignments').deleteOne({
//         text: 'text1', translation: 'translation1', audio: 'audio1'
//       });
//       await client.db(className).collection('assignments').deleteOne({
//         text: 'text2', translation: 'translation2', audio: 'audio2'
//       });
//     } finally {
//       client.close();
//     }
//   });

//   it ('should not create a new assignment if it already exists', async () => {
//     const className = "English235_JHBWXD";
//     const assignmentName = "arma";
//     const assignmentArray = [
//       {text: 'text0', translation: 'translation0', audio: 'audio0'},
//       {text: 'text1', translation: 'translation1', audio: 'audio1'},
//       {text: 'text2', translation: 'translation2', audio: 'audio2'}
//     ];
//     const result = await mongo.createAssignment(className, assignmentName, assignmentArray);
//     expect(result).toEqual(false);
//   });

//   it ('should not create a new assignment if assignmentArray is empty', async () => {
//     const className = "English235_JHBWXD";
//     const assignmentName = "Assignment0";
//     const assignmentArray = [];
//     const result = await mongo.createAssignment(className, assignmentName, assignmentArray);
//     expect(result).toEqual(false);
//   });
// });

// describe('convertAssignmentToDtbForm', () => {
//   it ('should convert an assignment array to the correct format', () => {
//     const assignmentName = 'Assignment0';
//     const assignmentArray = [
//       {text: 'text0', translation: 'translation0', audio: 'audio0'},
//       {text: 'text1', translation: 'translation1', audio: 'audio1'},
//       {text: 'text2', translation: 'translation2', audio: 'audio2'}
//     ];
//     const convertedAssignment = mongo.convertAssignmentToDtbForm(assignmentName, assignmentArray);
//     expect(convertedAssignment).toEqual([
//       {assignment: 'Assignment0', card: 0, text: 'text0', translation: 'translation0', audio: 'audio0'},
//       {assignment: 'Assignment0', card: 1, text: 'text1', translation: 'translation1', audio: 'audio1'},
//       {assignment: 'Assignment0', card: 2, text: 'text2', translation: 'translation2', audio: 'audio2'}
//     ]);
//   });
// });



// describe("viewAssignment", () => {
//   // Works in a typical case, where no errors should be thrown and a valid output should be returned
//   it("Returns existing assignment in correct form", async () => {
//     const cards = await mongo.viewAssignment("Spanish454_QRAPCC", "war");
//     expect(cards.length).toEqual(5);
//     expect(cards.map(e => e.text)).toEqual(["right", "provide"]);
//   });

//   // Reacts correctly for class that doesn't exist
//   it("Throws an error for a non-existent class", async () => {
//     console.log = jest.fn();
//     await mongo.viewAssignment("ABCD", "war");
//     expect(console.log).toHaveBeenCalledWith("Class does not exist");
//   });

//   // Reacts correctly for assignment that doesn't exist
//   it("Throws an error for a non-existent assignment", async () => {
//     console.log = jest.fn();
//     await mongo.viewAssignment("Spanish454_QRAPCC", "ABCD");
//     expect(console.log).toHaveBeenCalledWith("Assignment does not exist");
//   });
// });

// describe("addToAssignment", () => {
//   it("Inserts flashcard to existing class and existing assignment", async () => {
//     const inserted = await mongo.addToAssignment("Spanish454_QRAPCC", "war", {text: "asdf", translation: "qwer", audio: "zcxv"});
//     expect(inserted).toEqual(true);
//     try{
//       await mongo.client.connect();
//       let db = mongo.client.db("Spanish454_QRAPCC");
//       let col = db.collection("assignments");
//       const card = await col.find({audio: "zcxv"}).toArray();
//       expect(card.length).toEqual(1);
//       expect(card[0].assignment).toEqual("war");
//       expect(card[0].card).toEqual(2);
//       expect(card[0].text).toEqual("asdf");
//       expect(card[0].translation).toEqual("qwer");
//       expect(card[0].audio).toEqual("zcxv");
//       await col.deleteOne({audio: "zcxv"});
//     }
//     finally{
//       await mongo.client.close();
//     }
//   });

//   it("Throws an error for a non-existent class", async () => {
//     console.log = jest.fn();
//     const inserted = await mongo.addToAssignment("ABCD", "war", {text: "asdf", translation: "qwer", audio: "zcxv"});
//     expect(inserted).toEqual(false);
//     expect(console.log).toHaveBeenCalledWith("Class does not exist");
//   });

//   it("Throws an error for a non-existent assignment", async () => {
//     console.log = jest.fn();
//     const inserted = await mongo.addToAssignment("Spanish454_QRAPCC", "ASDF", {text: "asdf", translation: "qwer", audio: "zcxv"});
//     expect(inserted).toEqual(false);
//     expect(console.log).toHaveBeenCalledWith("Assignment does not exist");
//   });
// })

// describe('this suit will test the function createClass',() =>{
//   it('Add a class to a given teacher, and vice versa. In this case, the class already existed', async() => {
//     const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
//     const client = new MongoClient(connectionString);
//     const email = "jyhuang@umass.edu";
//     const className ="Vietnamese219_VJTCBB"; 
//   await createClass(className, email);
//   await client.connect();
//     db = client.db("UserData");
//     db1 = client.db(className);
//     col = await db.collection("teachers");
//     col1 = await db1.collection("teachers");
//   const testTeacher = (await col.find({email: email}).toArray())[0].courseList.indexOf(className);
//   const testClassDataBase = await col1.find({email:email}).toArray();
//   expect(testTeacher).toBeGreaterThan(-1);
//   expect(testClassDataBase.length).toBeGreaterThan(0);
//   });

//   // test case 2
  
//   it('Add a class to a given teacher, and vice versa. In this case, the class does not exist', async() => {
    
//     const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
//     const client = new MongoClient(connectionString);
//     await client.connect();
//     const email = "jyhuang@umass.edu";
//     const className ="LeageOfLegend_101";
//   await createClass(className, email);
//    db = client.db("UserData");
//     col = await db.collection("teachers");
//     const testTeacher = (await col.find({email: email}).toArray())[0].courseList.indexOf(className);
  
//   //const testClassDataBase = await col1.find({email:email}).toArray();
//   //await client.close();
//   expect(testTeacher).toBeGreaterThan(-1);
//   });
// });
// describe('this suit will test the function Enroll Class',() =>{
//   it('Add a class to a given student course, and vice versa. In this case, the class is not in the student course yet', async() => {
//     const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
//     const client = new MongoClient(connectionString);
//     try{
//     const email = "Troy.Briggs@yahoo.com";
//     const className ="Latin281";
//     const ID = "RXPILU";
//     const class_Full_Name = className + "_" + ID;
//   await enrollClass(className, ID, email);
//   await client.connect();
//   // Test the class is added to student's collection in UserData
//     db = client.db("UserData");
//     col = await db.collection("students");
//   const test_student_course_list = (await col.find({email: email}).toArray())[0].courseList.indexOf(class_Full_Name);
//   expect(test_student_course_list).toBeGreaterThan(-1);
//   // Test the student is added to class's student's collection
//   db1 = client.db(class_Full_Name);
//   col1 = await db1.collection("students");
//   const test_student_list = await col1.find({email: email}).toArray();
//   expect(test_student_list.length).toEqual(1);
//     }
//     catch(error){
//       throw (error);
//     }
//     finally{
//       await client.close();
//     }
//   });
// });
// describe('this suit will test the function delete Assignment',() =>{
//   it('check the presence of the assingment in the class first, then delete, and check the presence again. In this case, the assignments are already there', async() => {
//     const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
//     const client = new MongoClient(connectionString);
//     try{
//     const class_Name = "Chinese671_JPYVGX";
//     const assignment_name = "momentum";
//     await client.connect();
//     db = client.db(class_Name);
//     col = await db.collection("assignments");
//     // Test the the presence of assignemnts in the given class
//   const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
//   expect(presence_of_assignments.length).toBeGreaterThan(0);
//   await deleteAssignment(class_Name, assignment_name);
//  // Test the the presence of assignemnts in the given class after deleting
//  await client.connect();
//  db1 = client.db(class_Name);
//  col1 = await db1.collection("assignments");
//   const presence_after = await col1.find({assignment: assignment_name}).toArray();
//   expect(presence_after.length).toEqual(0);
//     }
//     catch(error){
//       throw (error);
//     }
//     finally{
//       await client.close();
//     }
//   });
//   it('check the presence of the assingment in the class first, then delete, and check the presence again. In this case, the assignments are not there', async() => {
//     const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
//     const client = new MongoClient(connectionString);
//     try{
//     const class_Name = "Chinese671_JPYVGX";
//     const assignment_name = "momentum";
//     await client.connect();
//     db = client.db(class_Name);
//     col = await db.collection("assignments");
//     // Test the the presence of assignemnts in the given class
//   const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
//   expect(presence_of_assignments.length).toEqual(0);
//   await deleteAssignment(class_Name, assignment_name);
//  // Test the the presence of assignemnts in the given class after deleting
//  await client.connect();
//  db1 = client.db(class_Name);
//  col1 = await db1.collection("assignments");
//   const presence_after = await col1.find({assignment: assignment_name}).toArray();
//   expect(presence_after.length).toEqual(0);
//     }
//     catch(error){
//       throw (error);
//     }
//     finally{
//       await client.close();
//     }
//   });
// });
// describe('this suit will test the function delete object from a given Assignment',() =>{
//   it('delete only ones that match the object preference', async() => {
//     const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
//     const client = new MongoClient(connectionString);
//     try{
//     const class_Name = "Chinese671_JPYVGX";
//     const assignment_name = "bad";
//     await client.connect();
//     db = client.db(class_Name);
//     col = await db.collection("assignments");
//     // Test the the presence of assignemnts in the given class
//   const presence_of_assignments = (await col.find({assignment: assignment_name}).toArray());
//   expect(presence_of_assignments.length).toEqual(3);
//   await deleteFromAssignment(class_Name, assignment_name,{text: "international", translation: "low",audio: "http://www.webster-durham.info/"});
//  // Test the the presence of assignemnts in the given class after deleting
//  await client.connect();
//  db1 = client.db(class_Name);
//  col1 = await db1.collection("assignments");
//   const presence_after = await col1.find({assignment: assignment_name}).toArray();
//   expect(presence_after.length).toEqual(2);
//     }
//     catch(error){
//       throw (error);
//     }
//     finally{
//       await client.close();
//     }
//   });
// });