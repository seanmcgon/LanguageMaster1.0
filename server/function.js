
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

async function createAssignments(className, assignmentName, assignmentArray) {
  let created = false;
  try {
    await client.connect();
    const db = client.db(className);
    const col = db.collection("assignments");

    // Chack if there will a duplicate
    const existingAssignment = await col.findOne({ name: assignmentName });
    if (existingAssignment) {
      throw new Error("Assignment already exisits");
    }

    // Create a new assignment with the provided cards
    const newAssignment = { name: assignmentName, cards: assignmentArray };
    await col.insertOne(newAssignment);
    created = true;
  } finally {
    await client.close();
    return created;
  }
}

module.exports = {createTeacher, verifyTeacher, getClassesTeacher, getClassesStudent, createAssignments};

