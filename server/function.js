
const { MongoClient } = require('mongodb');

const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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


async function createTeacher(firstName,lastName,teacherEmail, password){
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
      console.log("Successfully create new teacher");
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
  }
}

async function getClassesTeacher(teacherEmail) {
  try {
    await client.connect();
    const db = client.db("UserData");
    const col = db.collection("teachers");
    const result = await col.findOne({email: teacherEmail.trim() });
    if (result) {
      return result.courseList || [];
    } else {
      throw("Teacher not found");
    }
  } finally {
    await client.close();
  }
}

async function getClassesStudent(studentEmail) {
  try {
    await client.connect();
    const db = client.db("UserData");
    const col = db.collection("students");
    const result = await col.findOne({email: studentEmail.trim() });
    if (result) {
      return result.courseList || [];
    } else {
      throw "Student not found";
    }
  } finally {
    await client.close();
  }
}


async function createAssignment(className, assignmentName, assignmentArray) {
  let createdAssignment = false;
  try {
    await client.connect();
    const db = client.db(className);
    const col = db.collection("assignments");

    // check if there exisits duplicate
    const assignmentExists = await col.find({ assignment: assignmentName }).toArray().length > 0;
    // (!) We can change this part depending on how we want to operate:
    // (Option 1) If there exist such assignment, we do NOT create a new assignment but add cards to the exisiting asssignment
    /*
    if (assignmentExisits) {
      createdAssignment = addToAssignment(className, assignmentName, assignmentArray);
    }
    */
    // (Option 2) If there exisits such assignment, we throw an error and do NOT add cards to the exisiting assignment
    if (assignmentExisits) {
      throw new Error("Assignment already exisits");
    }
    // Create a new assignment with the provided cards
    // (!) We can change this part depending on how we want to operate:
    // Assume we are not allowed to use addToAssignment() function here 
    // Because we don't add any cards to an empty assignment,
    // We have to initialize the assignment with at least one card.
    else if (!assignmentExists && assignmentArray.length()> 0) {
      for(const flashcard of convertAssignmentToDtbForm(assignmentName, assignmentArray)) {
        await col.insertOne(flashcard);
      }
      createdAssignment = true;
    }
    else if (!assignmentExists && assignmentArray.length == 0) {
      throw("Input array is empty")
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
  return createdAssignment;
}

function convertAssignmentToDtbForm(assignmentName, assignmentArray) {
  let convertedAssignmentArray = [];
  for (let index = 0; index < assignmentArray.length; index++) {
    const flashcard = assignmentArray[index];
    convertedAssignmentArray.push({
      assignment: assignmentName,
      card: index,
      text: flashcard.text,
      translation: flashcard.translation,
      audio: flashcard.audio
    });
  }
  return convertedAssignmentArray;
}

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
    await col.insertOne({assignment: assignmentName, card: cardNum, text: card.text, translation: card.translation, audio: card.audio})
    inserted = true;
    
  }
  catch(err){
    console.log(err);
  }
  finally{
    await client.close();
    return inserted;
  }
}

module.exports = {createTeacher, verifyTeacher, getClassesTeacher, getClassesStudent, createAssignment};

