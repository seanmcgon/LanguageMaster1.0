
const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');

const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);

function checkValidityOfEmail(emailAddress){
  const regex = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
  if(emailAddress.match(regex)){
    return true;
  }
  return false;
}
  function checkValidityOfPassword(password){
    const regex = /^[^ ]{2,15}$/;
    if(password.match(regex)){
      return true;
    }
    return false;
  }

async function verifyTeacher(teacherEmail, password){
  try{
    await client.connect();
    db = client.db("UserData");
    col = await db.collection("teachers");
    let result = await col.find({$and:[{email: teacherEmail}, {password: password}]}).toArray();
    return result.length == 1 ? true: false;
  }
  finally{
  await client.close();
  }
}
async function verifyStudent(studentEmail, password){
  try{
    await client.connect();
    db = client.db("UserData");
  col = await db.collection("students");
  let result = await col.find({$and:[{email: studentEmail}, {password: password}]}).toArray();
  return result.length == 1 ? true: false;
  }
  finally{
  await client.close();
  }
}


async function createTeacher(firstName,lastName,teacherEmail, password){
  let createdTeacher = false;

  let re = verifyTeacher(teacherEmail.trim(), password.trim());
  let boo = false;
  boo = await re.then(e => e);
  try{
  if(!boo){
    await client.connect();
    db = client.db("UserData");
    col = await db.collection("teachers");
    const booE = checkValidityOfEmail(teacherEmail);
    const booP = checkValidityOfPassword(password);
    let courses = [];

    if(booE && booP){
      let result = {name: firstName.trim() + " " + lastName.trim(), email: teacherEmail.trim(),password: password.trim(),courseList: courses};
      await col.insertOne(result);
      createdTeacher = True;
      console.log("Successfully create new teacher",teacherEmail, password);
    }
    else if(!booE && booP){
      throw("Email is invalid");
    }
    else if(booE && !booP){
      throw("Pass is invalid");
    }
    else{
      throw("Both are invalid");
    }
  }
  else{
    throw ("Teacher already exist!");
  }  
}
  catch (err){
    console.log(err);
  }
  finally{
  await client.close();
  return createdTeacher;
  }
  }

  // Written by Maya Kandeshwarath
  // Accepts:
  // String firstName, student's first name
  // String lastName, student's last name
  // String studentEmail, student's email
  // String password, student's password
  // The function creates a student document to be inserted into the db
  // as as long as no fields are invalid and the studentEmail isn't already in the db,
  // it inserts the following document, 
  // {name: firstName + lastName, email: studentEmail, password: password, courseList: []}
  // Then the function returns true if the document is inserted and false if it's not
  async function createStudent(firstName, lastName, studentEmail, password){
    // boolean to return based on whether the student is returned or not
    let inserted = false;
    try{
      // Connect to db and go to student data collection
      await client.connect();
      let db = client.db("UserData");
      let col = db.collection("students");

      // Check that the email isn't already in the database
      if((await col.find({email: studentEmail.trim()}).toArray()).length === 0){
        // Booleans for valdidity of email and password
        let validEmail = checkValidityOfEmail(studentEmail.trim());
        let validPass = checkValidityOfPassword(password.trim());
        // If all is correct, insert student and set return boolean to whether student is correctly inserted
        if(validEmail && validPass){
          await col.insertOne({name: firstName.trim() + " " + lastName.trim(), email: studentEmail.trim(), password: password.trim(), courseList: []});
          inserted = true;
        }
        // One or both of the password and email are invalid, throw an error corresponding to which are invalid
        else if(!validEmail && validPass){
          throw("Email is invalid");
        }
        else if(validEmail && !validPass){
          throw("Password is invalid");
        }
        else{
          throw("Both email and password are invalid");
        }
      }
      else{
        throw("Student already exists!");
      }
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
    return inserted;
  }

  // Written by Maya Kandeshwarath
  // Accepts: String className, name of class
  // The function returns an array of student documents from the class className
  async function getStudentsInClass(className){
    // array of students to return
    let students = [];
    try{
      await client.connect();
      let db = client.db(className);
      // If the db doesn't exist, then find will just return an empty array,
      // but when a class is created some teacher must be assigned
      const teachers = await db.collection("teachers").find().toArray();
      if(teachers.length === 0){
        throw("Class does not exist");
      }
      else{
        let col = db.collection("students");
        students = await col.find().toArray();
      }
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
    return students;
  }

  // Written by Maya Kandeshwarath
  // Accepts: String className, name of class
  // The function returns an array of teacher documents from the class className
  async function getTeachersInClass(className){
    // array of students to return
    let teachers = [];
    try{
      await client.connect();
      let db = client.db(className);
      let col = db.collection("teachers");
      // If the db doesn't exist, then find will just return an empty array,
      // but when a class is created some teacher must be assigned
      teachers = await col.find().toArray();
      if(teachers.length === 0){
        throw("Class does not exist");
      }
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
    return teachers;
  }

  // Written by Maya Kandeshwarath
  // Accepts:
  // String className, name of class
  // String assignmentName, name of assignment
  // The function searches for all flashcards 
  // under assignment assignmentName returns them
  async function viewAssignment(className, assignmentName){
    let cards = [];
    try{
      await client.connect();
      let db = client.db(className);
      let col = db.collection("teachers");
      const teachers = await col.find().toArray();
      // If there are no teachers assigned to the class, then it doesn't exist
      if(teachers.length === 0){
        throw("Class does not exist");
      }
      col = db.collection("assignments");
      cards = await col.find({assignment: assignmentName}).toArray();
      // If there are no cards in the assignment, it doesn't exist
      if(cards.length === 0){
        throw("Assignment does not exist");
      }
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
      // Currently cards are in {_id, assignment, card, text, translation, audio}, just want {text, translation, audio} returned
      return cards.map(e => ({text: e.text, translation: e.translation, audio: e.audio}));
    }
  }

  // Written by Maya Kandeshwarath
  // Accepts:
  // String className, name of class
  // String assignmentName, name of assignment
  // {String text, String translation, String audio} card, flashcard to be inserted
  // The function inserts the given flashcard information into the database in the database format,
  // then inserts blank student grades for the card into the db,
  // then returns a boolean representing whether or not the card was inserted
  async function addToAssignment(className, assignmentName, card){
    let inserted = false;
    try{
      await client.connect();
      let db = client.db(className);
      let col = db.collection("teachers");
      const teachers = await col.find().toArray();
      if(teachers.length === 0){
        throw("Class does not exist");
      }
      col = db.collection("assignments");
      const cardNum = (await col.find({assignment: assignmentName}).toArray()).length;
      // This segment of code might have to be deleted, depends on if you can add cards to empty assignments or not though
      // it throws an error if an assignment doesn't have any cards in it
      if(cardNum === 0){
        throw("Assignment does not exist");
      }
      let exists = col.find({assignment: assignmentName, text: card.text}).toArray();
      if(exists){
        await col.insertOne({assignment: assignmentName, card: cardNum, text: card.text, translation: card.translation, audio: card.audio});
        col = db.collection("metrics");
        let students = await getStudentsInClass(className);
        try{
        for(let i = 0; i < students.length; i++){
          await col.insertOne({studentEmail: students[i].email, assignment: assignmentName, card: cardNum, timesPracticed: 0, score: 0});
        }
      }
      catch(err){console.log(err)}
        inserted = true;
      }
      
      
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
      return inserted;
    }
  }
  module.exports = {createTeacher, verifyTeacher, createStudent, getStudentsInClass, getTeachersInClass, viewAssignment, addToAssignment, client};
