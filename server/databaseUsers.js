//Old file where all tests for backend were put in the same file, 
//reorganized for clarity and scalability into smaller files under server/src


// const { assert } = require('console');
// const { MongoClient } = require('mongodb');
// const { TextEncoder } = require('util');

// const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
// const client = new MongoClient(connectionString);

// function checkValidityOfEmail(emailAddress) {
//     const regex = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
//     if (emailAddress.match(regex)) {
//         return true;
//     }
//     return false;
// }

// function checkValidityOfPassword(password) {
//     const regex = /^[^ ]{2,15}$/;
//     if (password.match(regex)) {
//         return true;
//     }
//     return false;
// }

//   async function verifyTeacher(teacherEmail, password) {
//     if (!password) {
//       return false;
//     }
//     try {
//       await client.connect();
//       const db = client.db("UserData");
//       const col = db.collection("teachers");
//       const result = await col.findOne({ email: teacherEmail, password: password });
//       await client.close();
//       return result !== null;
//     } catch (error) {
//       console.error('Error in verifyTeacher:', error);
//       await client.close();
//       return false;
//     } finally {
//       await client.close();
//     }
//   }

//   async function verifyStudent(studentEmail, password) {
//     if (!password) {
//       return false;
//     }
//     try {
//       await client.connect();
//       const db = client.db("UserData");
//       const col = db.collection("students");
//       const result = await col.findOne({ email: studentEmail, password: password });
//       await client.close();
//       return result !== null;
//     } catch (error) {
//       console.error('Error in verifyStudent:', error);
//       await client.close();
//       return false;
//     } finally {
//       await client.close();
//     }
//   }
  


// async function createTeacher(firstName,lastName,teacherEmail, password){
//   let createdTeacher = false;

//     const re = verifyTeacher(teacherEmail.trim(), password.trim());
//     let boo = await re;
//     if (!boo) {
//         await client.connect();
//         const db = client.db("UserData");
//         const col = await db.collection("teachers");
//         const doubleE = await col.find({ email: teacherEmail }).toArray();
//         const booE = checkValidityOfEmail(teacherEmail);
//         const booP = checkValidityOfPassword(password);
//         let courses = [];

//         if (booE && booP && doubleE.length !== 1) {
//             const result = { name: `${firstName.trim()} ${lastName.trim()}`, email: teacherEmail.trim(), password: password.trim(), courseList: courses };
//             await col.insertOne(result);
//             createdTeacher = true;
//             console.log("Successfully created new teacher");
//         }

//         await client.close();
//     }
//     return createdTeacher;
// }

// function checkValid(className) {
//     const regex = /^[^ ]+\_[^ ]{1,6}$/;
//     if (className.match(regex)) {
//         return true;
//     }
//     return false;
// }

// // async function updateClassForGivenTeacher(col, teacherEmail, className) {
// //     const courseL = await col.find({ email: teacherEmail }).toArray();
// //     let originalCourse = courseL[0].courseList;
// //     if (!originalCourse.includes(className)) {
// //         originalCourse.push(className);
// //     }
// //     if(booE && booP){
// //       let result = {name: firstName.trim() + " " + lastName.trim(), email: teacherEmail.trim(),password: password.trim(),courseList: courses};
// //       await col.insertOne(result);
// //       createdTeacher = true;
// //       console.log("Successfully create new teacher",teacherEmail, password);
// //     }
// //     await col.updateOne({ email: teacherEmail }, { $set: { courseList: originalCourse } });
// // }

// // async function createClass(className, teacherEmail) {
// //     let classCreated = false;

// //     await client.connect();
// //     const db = client.db("UserData");
// //     const col = await db.collection("teachers");
// //     const checkTheValidOfClassName = checkValid(className);

// //     const allCoursesPipeline = [
// //         { $unwind: "$courseList" },
// //         { $group: { _id: null, allCourses: { "$push": "$courseList" } } },
// //         { '$addFields': { 'courseList': { '$setUnion': ['$fcourseList', []] } } }
// //     ];

// //     let courses = await col.aggregate(allCoursesPipeline);
// //     let c = await courses.next();

// //     if (checkTheValidOfClassName) {
// //         if ((await col.find({ email: teacherEmail }).toArray()).length === 1) {
// //             await updateClassForGivenTeacher(col, teacherEmail, className);
// //             let getTeacherInfo = await col.find({ email: teacherEmail }).toArray();
// //             if (c.allCourses.includes(className)) {
// //                 const db1 = client.db(className);
// //                 const col1 = await db1.collection("teachers");
// //                 const teacherInThatClass = await col.find({ email: teacherEmail }).toArray();
// //                 if (teacherInThatClass.length !== 1) {
// //                     await col1.insertOne(getTeacherInfo[0]);
// //                 } else {
// //                     await col1.deleteOne({ email: teacherEmail });
// //                     await col1.insertOne(getTeacherInfo[0]);
// //                 }
// //                 classCreated = true;
// //             } else {
// //                 MongoClient.connect(connectionString).then(async (client) => {
// //                     const db = client.db(className);
// //                     db.createCollection("assignments");
// //                     db.createCollection("metrics");
// //                     db.createCollection("students");
// //                     db.createCollection("teachers");
// //                     col = db.collection("teachers");
// //                     await col.insertOne(getTeacherInfo[0]);
// //                     await client.close();
// //                     classCreated = true;
// //                 });
// //             }
// //         }
// //     }

// //     return classCreated;
// // }

// async function getStudentsInClass(className){
//   // array of students to return
//   let students = [];
//   try{
//     await client.connect();
//     let db = client.db(className);
//     // If the db doesn't exist, then find will just return an empty array,
//     // but when a class is created some teacher must be assigned
//     const teachers = await db.collection("teachers").find().toArray();
//     if(teachers.length === 0){
//       throw("Class does not exist");
//     }
//     else{
//       let col = db.collection("students");
//       students = await col.find().toArray();
//     }
//   }
//   catch(err){
//     console.log(err);
//   }
//   finally{
//     await client.close();
//   }
//   return students;
// }

// async function getTeachersInClass(className){
//   // array of students to return
//   let teachers = [];
//   try{
//     await client.connect();
//     let db = client.db(className);
//     let col = db.collection("teachers");
//     // If the db doesn't exist, then find will just return an empty array,
//     // but when a class is created some teacher must be assigned
//     teachers = await col.find().toArray();
//     if(teachers.length === 0){
//       throw("Class does not exist");
//     }
//   }
//   catch(err){
//     console.log(err);
//   }
//   finally{
//     await client.close();
//   }
//   return teachers;
// }


// async function getClassesTeacher(teacherEmail) {
//   try {
//     await client.connect();
//     const db = client.db("UserData");
//     const col = db.collection("teachers");
//     const result = await col.findOne({email: teacherEmail.trim() });
//     if (result) {
//       return result.courseList || [];
//     } else {
//       return [];
//     }
//   } finally {
//     await client.close();
//   }
// }

// async function getClassesStudent(studentEmail) {
//   try {
//     await client.connect();
//     const db = client.db("UserData");
//     const col = db.collection("students");
//     const result = await col.findOne({email: studentEmail.trim() });
//     if (result) {
//       return result.courseList || [];
//     } else {
//       return [];
//     }
//   } finally {
//     await client.close();
//   }
// }

// async function createStudent(firstName, lastName, studentEmail, password){
//   // boolean to return based on whether the student is returned or not
//   let inserted = false;
//   try{
//     // Connect to db and go to student data collection
//     await client.connect();
//     let db = client.db("UserData");
//     let col = db.collection("students");

//     // Check that the email isn't already in the database
//     if((await col.find({email: studentEmail.trim()}).toArray()).length === 0){
//       // Booleans for valdidity of email and password
//       let validEmail = checkValidityOfEmail(studentEmail.trim());
//       let validPass = checkValidityOfPassword(password.trim());
//       // If all is correct, insert student and set return boolean to whether student is correctly inserted
//       if(validEmail && validPass){
//         await col.insertOne({name: firstName.trim() + " " + lastName.trim(), email: studentEmail.trim(), password: password.trim(), courseList: []});
//         inserted = true;
//       }
//       // One or both of the password and email are invalid, throw an error corresponding to which are invalid
//       else if(!validEmail && validPass){
//         throw("Email is invalid");
//       }
//       else if(validEmail && !validPass){
//         throw("Password is invalid");
//       }
//       else{
//         throw("Both email and password are invalid");
//       }
//     }
//     else{
//       throw("Student already exists!");
//     }
//   }
//   catch(err){
//     console.log(err);
//   }
//   finally{
//     await client.close();
//   }
//   return inserted;
// }



// async function createAssignment(className, assignmentName, assignmentArray) {
//   let createdAssignment = false;
//   try {
//     await client.connect();
//     const db = client.db(className);
//     const col = db.collection("assignments");

//     // check if there exists duplicate
//     const assignmentExists = await col.find({ assignment: assignmentName }).toArray().length > 0;
//     // (!) We can change this part depending on how we want to operate:
//     // (Option 1) If there exist such assignment, we do NOT create a new assignment but add cards to the existing assignment
//     /*
//     if (assignmentExists) {
//       createdAssignment = addToAssignment(className, assignmentName, assignmentArray);
//     }
//     */
//     // (Option 2) If there exists such assignment, we throw an error and do NOT add cards to the existing assignment
//     // if (assignmentExists) {
//     //   throw new Error("Assignment already exisits");
//     // }
//     // Create a new assignment with the provided cards
//     // (!) We can change this part depending on how we want to operate:
//     // Assume we are not allowed to use addToAssignment() function here 
//     // Because we don't add any cards to an empty assignment,
//     // We have to initialize the assignment with at least one card.
//     if (!assignmentExists && assignmentArray.length > 0) {
//       for(const flashcard of convertAssignmentToDtbForm(assignmentName, assignmentArray)) {
//         await col.insertOne(flashcard);
//       }
//       createdAssignment = true;
//     }
//     else if (!assignmentExists && assignmentArray.length == 0) {
      
//       return createdAssignment;

//     }
//   } catch (err) {
//     console.log(err);
//     return createdAssignment;

//   } finally {
//     await client.close();
    
//   }
//   return createdAssignment;
// }

// function convertAssignmentToDtbForm(assignmentName, assignmentArray) {
//   let convertedAssignmentArray = [];
//   for (let index = 0; index < assignmentArray.length; index++) {
//     const flashcard = assignmentArray[index];
//     convertedAssignmentArray.push({
//       assignment: assignmentName,
//       card: index,
//       text: flashcard.text,
//       translation: flashcard.translation,
//       audio: flashcard.audio
//     });
//   }
//   return convertedAssignmentArray;
// }

// async function addToAssignment(className, assignmentName, card){
//   let inserted = false;
//   try{
//     await client.connect();
//     let db = client.db(className);
//     let col = db.collection("teachers");
//     const teachers = await col.find().toArray();
//     if(teachers.length === 0){
//       throw("Class does not exist");
//     }
//     col = db.collection("assignments");
//     const cardNum = (await col.find({assignment: assignmentName}).toArray()).length;
//     // This segment of code might have to be deleted, depends on if you can add cards to empty assignments or not though
//     // it throws an error if an assignment doesn't have any cards in it
//     if(cardNum === 0){
//       throw("Assignment does not exist");
//     }
//     await col.insertOne({assignment: assignmentName, card: cardNum, text: card.text, translation: card.translation, audio: card.audio})
//     inserted = true;
    
//   }
//   catch(err){
//     console.log(err);
//   }
//   finally{
//     await client.close();
//     return inserted;
//   }
// }

// async function viewAssignment(className, assignmentName){
//   let cards = [];
//   try{
//     await client.connect();
//     let db = client.db(className);
//     let col = db.collection("teachers");
//     const teachers = await col.find().toArray();
//     // If there are no teachers assigned to the class, then it doesn't exist
//     if(teachers.length === 0){
//       throw("Class does not exist");
//     }
//     col = db.collection("assignments");
//     cards = await col.find({assignment: assignmentName}).toArray();
//     // If there are no cards in the assignment, it doesn't exist
//     if(cards.length === 0){
//       throw("Assignment does not exist");
//     }
//   }
//   catch(err){
//     console.log(err);
//   }
//   finally{
//     await client.close();
//     // Currently cards are in {_id, assignment, card, text, translation, audio}, just want {text, translation, audio} returned
//     return cards.map(e => ({text: e.text, translation: e.translation, audio: e.audio}));
//   }
// }

// async function updateClassForGivenTeacher(col, teacherEmail,className){
//   let courseL = await col.find({email: teacherEmail}).toArray();
//   let originalCourse = courseL[0].courseList;
//   if(originalCourse.indexOf(className) === -1){
//   originalCourse.push(className);
//   }
//   await col.updateOne({email: teacherEmail}, {$set:{courseList: originalCourse}})
// }

// async function createClass(className, teacherEmail){
//   // Add class to the teacher's course List
//   try{
//   await client.connect();
//   db = client.db("UserData");
//   col = await db.collection("teachers");
//  //console.log(getTeacherInfo[0]);
//   const checkTheValidOfClassName = checkValid(className);
//   const allCoursesPipeline = [
//     {
//       $unwind: {
//          path: "$courseList",
//          preserveNullAndEmptyArrays: false,
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         allCourses: {
//           "$push": "$courseList"
//         }
//       }
//     },
//     {'$addFields': {'courseList': {'$setUnion': ['$fcourseList', []]}}}
//   ];

// // Use query, set output to courses to be used later
// let courses = await col.aggregate(allCoursesPipeline);
// // courses is not a variable or list or anything that js can output, it's a MongoDB cursor
// // This is part of how to access the info in it
// c = await courses.next();
// //console.log("The index of the given class name is: " + c.allCourses.indexOf(className));
// //console.log(c.allCourses);
  
// if(checkTheValidOfClassName){
//     //create a class data base based on the given name
//     //1) if the class already exist in the database, so we do not need to create a new one, but update the teacher collection of that class database
//    // update class course of the given teacher
//    if(((await col.find({email: teacherEmail}).toArray()).length) === 1){
//    updateClassForGivenTeacher(col, teacherEmail, className);
//    let getTeacherInfo = await col.find({email: teacherEmail}).toArray();
//     if(c.allCourses.indexOf(className) !== -1){
//     db1 =  client.db(className);
//     col1 = await db1.collection("teachers");
//     const teacherInThatClass = await col.find({email: teacherEmail}).toArray();
//     if(teacherInThatClass.length !== 1){
//     await col1.insertOne(getTeacherInfo[0]);
//     }
//     else{
//       await col1.deleteOne({email:teacherEmail});
//       await col1.insertOne(getTeacherInfo[0]);
//     } 
//    }
//    //
//    //2) If the given class name does not have dabase for itself, then we need to create a database for it, and add teacher info into that class 
//   //create class db.
//   else{

//    MongoClient.connect(connectionString).then(async (client) => { 

//     //console.log('Database is being created ... '); 
      
//     // database name 
//     const db = client.db(className); 
      
//     // collection name 
//     db.createCollection("assignments");
//     db.createCollection("metrics");
//     db.createCollection("students");
//     db.createCollection("teachers");
//     //console.log("Success!!")
//     //Add teacher to the new class
//     col = db.collection("teachers");
//     await col.insertOne(getTeacherInfo[0]);
//     await client.close();
// })
//   }
// }
// else{
//   throw("The teacher does not exist");
// }
//   }
//   else{
//     throw("inValid class name");
//   }
// }
//   catch(err){
//     throw (err);
//   }
//   finally{
//     await client.close();
//   }


  

// }
// async function enrollClass(className, classID, studentEmail){
// try{
// await client.connect();
// db = client.db("UserData");
// col = await db.collection("students");
// const neededData = className + "_" + classID;
// if(checkValid(neededData)){
//   let student_Data = await col.find({email: studentEmail}).toArray();
//   let student_courses = student_Data[0].courseList;
//   if(student_courses.indexOf(neededData) == -1){
//     student_courses.push(neededData);
//     await col.updateOne({email:studentEmail}, {$set:{courseList: student_courses}});
//     db1 = client.db(neededData);
//     col1 = await db1.collection("students");
//     await col1.insertOne(student_Data[0]);
//   }
//   else{
//     throw("The class already exist");
//   }

// }
// else{
//   throw("Invalid class");
// }
// } catch(err){
// console.log(err);
// }
// finally{
// await client.close();
// }

// }
// async function deleteAssignment(className,assignmentName){
// try{
// await client.connect();
// if(checkValid(className)){
//   db = client.db(className);
//   col = await db.collection("assignments");
//   const presense = await col.find({assignment: assignmentName}).toArray();
//   if(presense.length >= 1){
//   await col.deleteMany({assignment: assignmentName});
//   console.log("The assignments have been deleted");
//   }
//   else{
//     throw("No presence of the assignment");
//   }
// }
// else{
//   throw("Invalid class");
// }
// }
// catch(error){
//   console.log(error);
// }
// finally{
//   await client.close();
// }

// }

// async function deleteFromAssignment(className,assignmentName,flashcard_Object){
//   try{
//     await client.connect();
//     if(checkValid(className)){
//       db = client.db(className);
//       col = await db.collection("assignments");
//       const presence = await col.find({assignment: assignmentName}).toArray();
//       if(presence.length >0){
//         await col.deleteMany({$and: [{assignment: assignmentName},{text: flashcard_Object.text}, {translation: flashcard_Object.translation},{audio: flashcard_Object.audio}]})
//       console.log("Done!!!");
//       }
//       else{
//         throw("No data");
//       }
//     }
//     else{
//       throw("Invalid className");
//     }

//   }
//   catch(err){
//     console.log(err);
//   }
//   finally{
//     await client.close();
//   }
// }

// module.exports = { 
//   createTeacher, createStudent, verifyTeacher, verifyStudent, 
//   createClass, getClassesTeacher, getClassesStudent, getStudentsInClass, getTeachersInClass,
//   convertAssignmentToDtbForm, addToAssignment, createAssignment,
//   getStudentsInClass, getTeachersInClass, viewAssignment, addToAssignment,
//   enrollClass,deleteAssignment,deleteFromAssignment

// }
