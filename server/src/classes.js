const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');

const connectionString = "mongodb+srv://mkandeshwara:1234@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(connectionString);

// Quoc
function checkValid(className) {
    const regex = /^[^ ]{1,}$/;
    if (className.match(regex)) {
        return true;
    }
    return false;
}

// Maya
async function getStudentsInClass(className) {
    let students = [];
    try {
        await client.connect();
        let db = client.db(className);
        const teachers = await db.collection("teachers").find().toArray();
        if (teachers.length === 0) {
            throw("Class does not exist");
        } else {
            let col = db.collection("students");
            students = await col.find().toArray();
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return students;
}

// Maya
async function getTeachersInClass(className) {
    let teachers = [];
    try {
        await client.connect();
        let db = client.db(className);
        let col = db.collection("teachers");
        teachers = await col.find().toArray();
        if (teachers.length === 0) {
            throw("Class does not exist");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return teachers;
}
//Quoc
function create_unique_id_for_class(class_name,c_allCourses){
  const default_code = "000000";
  const arr_of_ID = c_allCourses.filter(e =>{
    const index_of_underscore = e.indexOf("_");
    return (index_of_underscore >=0 && Number.isInteger(parseInt(e.substring(index_of_underscore + 1, e.length))));
  }).map(e =>{
    const index_of_underscore = e.indexOf("_");
    return (parseInt(e.substring(index_of_underscore+1, e.length)) - 0);
  });
  const length_of_array_of_course = c_allCourses.length;
  let class_code;
  let i;
  for(i = 0; i<length_of_array_of_course; i++){
    if(arr_of_ID.indexOf(i)== -1){
      class_code = i;
      break;
    }
  }
  if(i == length_of_array_of_course){
    class_code = length_of_array_of_course + 1;
  }
  const modified_code = default_code.substring(0,default_code.length - (class_code + "").length) + class_code + "";
  const unique_id = class_name + "_" + modified_code;
  return unique_id;
}


// Quoc
async function createClass(className, teacherEmail, language){
  // Add class to the teacher's course List
  try{
  await client.connect();
  db = client.db("UserData");
  col = await db.collection("teachers");
  const teacher_info = await col.find({email: teacherEmail}).toArray();

 //console.log(getTeacherInfo[0]);
  const checkTheValidOfClassName = checkValid(className);
  const allCoursesPipeline = [
    {
      $unwind: {
         path: "$courseList",
         preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: null,
        allCourses: {
          "$push": "$courseList"
        }
      }
    },
    {'$addFields': {'courseList': {'$setUnion': ['$fcourseList', []]}}}
  ];

// Use query, set output to courses to be used later
let courses = await col.aggregate(allCoursesPipeline);
// courses is not a variable or list or anything that js can output, it's a MongoDB cursor
// This is part of how to access the info in it
c = await courses.next();
//console.log("The index of the given class name is: " + c.allCourses.indexOf(className));
//console.log(c.allCourses);

if(checkTheValidOfClassName && teacher_info.length ==1){
  await client.connect();
  db = client.db("UserData");
  col = await db.collection("teachers");
  //create a class data base based on the given name

  const className_on_data_base = create_unique_id_for_class(className,c.allCourses);
   await updateClassForGivenTeacher(col, teacherEmail, className_on_data_base);
   MongoClient.connect(connectionString).then(async (client) => {

    //console.log('Database is being created ... ');

    // database name
    const db = client.db(className_on_data_base);

    // collection name
    db.createCollection("assignments");
    db.createCollection("metrics");
    db.createCollection("students");
    db.createCollection("teachers");
    //console.log("Success!!")
    //Add teacher to the new class
    col = db.collection("teachers");
    await col.insertOne(teacher_info[0]);
    await col.insertOne({"name" : "language","language_name" : language});
    await client.close();


   })
}
  else{
    throw("inValid class name");
  }
}
  catch(err){
    throw (err);
  }
  finally{
    await client.close();
  }
}
 

async function updateClassForGivenTeacher(col, teacherEmail, className) {
  let courseL = await col.find({ email: teacherEmail }).toArray();
  let originalCourse = courseL[0].courseList;
  if (originalCourse.indexOf(className) === -1) {
      originalCourse.push(className);
  }
  await col.updateOne({ email: teacherEmail }, { $set: { courseList: originalCourse } });
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
      return [];
    }
  } finally {
    await client.close();
  }
}


// Shuto
async function getClassesTeacher(teacherEmail) {
    try {
      await client.connect();
      const db = client.db("UserData");
      const col = db.collection("teachers");
      const result = await col.findOne({email: teacherEmail.trim() });
      if (result) {
        return result.courseList || [];
      } else {
        return [];
      }
    } finally {
      await client.close();
    }
  }
  
  // Shuto
  async function getClassesStudent(studentEmail) {
    try {
      await client.connect();
      const db = client.db("UserData");
      const col = db.collection("students");
      const result = await col.findOne({email: studentEmail.trim() });
      if (result) {
        return result.courseList || [];
      } else {
        return [];
      }
    } finally {
      await client.close();
    }
  }

  // Quoc
  async function find_class_based_on_ID(classID){
    await client.connect();
    db = client.db("UserData");
    col = await db.collection("teachers");
   //console.log(getTeacherInfo[0]);
    const allCoursesPipeline = [
      {
        $unwind: {
           path: "$courseList",
           preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: null,
          allCourses: {
            "$push": "$courseList"
          }
        }
      },
      {'$addFields': {'courseList': {'$setUnion': ['$fcourseList', []]}}}
    ];
  
  // Use query, set output to courses to be used later
  let courses = await col.aggregate(allCoursesPipeline);
  // courses is not a variable or list or anything that js can output, it's a MongoDB cursor
  // This is part of how to access the info in it
  c = await courses.next();
  const test = c.allCourses.filter((e) => {
    const index = e.indexOf("_");
   return e.substring(index+1, e.length) == classID;
  })[0];
  return test;
  }

  // Quoc
  async function enrollClass(classID, studentEmail) {
    try {
      const neededData = await find_class_based_on_ID(classID);
      if (!neededData || !checkValid(neededData)) {
        throw new Error("Invalid class");
      }
  
      await client.connect();
      const db = client.db("UserData");
      const studentsCollection = db.collection("students");
      const classDb = client.db(neededData);
      const assignmentsCollection = classDb.collection("assignments");
      const metricsCollection = classDb.collection("metrics");
  
      const assignments = await assignmentsCollection.find().toArray();
      if (assignments.length === 0) {
        throw new Error("No assignments found for this class.");
      }
  
      const metricsUpdatePromises = assignments.map(assignment => {
        const metricQuery = {
          studentEmail: studentEmail,
          assignment: assignment.assignment,
          card: assignment.card
        };
        const metricUpdate = {
          $setOnInsert: { timesPracticed: 0, score: 0 }
        };
        return metricsCollection.updateOne(metricQuery, metricUpdate, { upsert: true });
      });
  
      await Promise.all(metricsUpdatePromises);
  
      const studentData = await studentsCollection.findOne({ email: studentEmail });
      if (!studentData.courseList.includes(neededData)) {
        const updatedCourseList = [...studentData.courseList, neededData];
        await studentsCollection.updateOne({ email: studentEmail }, { $set: { courseList: updatedCourseList } });
        await classDb.collection("students").insertOne(studentData);
      } else {
        console.log("The student is already enrolled in this class.");
      }
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await client.close();
    }
  }
  
  async function updateFlashcardForStudent(className, assignmentName, flashcardName, newScore, studentEmail) {
    try {
        await client.connect();
        const db = client.db(className);
        const assignmentsCollection = db.collection("assignments");
        const metricsCollection = db.collection("metrics");

        // Fetch the flashcard
        const flashcards = await assignmentsCollection.find({
            $and: [{ "assignment": assignmentName }, { "text": flashcardName }]
        }).toArray();
        if (flashcards.length === 0) {
            throw new Error("Flashcard not found.");
        }
        const flashcard = flashcards[0];

        // Fetch the student's metrics for the flashcard
        const metrics = await metricsCollection.find({
            $and: [
                { "studentEmail": studentEmail },
                { "assignment": assignmentName },
                { "card": flashcard.card }
            ]
        }).toArray();
        if (metrics.length === 0) {
            throw new Error("Student metrics not found.");
        }
        const studentMetrics = metrics[0];

        // Calculate the new metrics
        const newTimesPracticed = studentMetrics.timesPracticed + 1;
        const updatedScore = (studentMetrics.score * studentMetrics.timesPracticed + newScore) / newTimesPracticed;

        // Update the metrics in the database
        await metricsCollection.updateOne({
            $and: [
                { "studentEmail": studentEmail },
                { "assignment": assignmentName },
                { "card": flashcard.card }
            ]
        }, {
            $set: { "timesPracticed": newTimesPracticed, "score": updatedScore }
        });

        console.log("Successful update of student flashcard!");
        return updatedScore; // Return the new score after update
    } catch (err) {
        console.log(err);
        throw err; // Rethrow the error so it can be caught or handled by the calling function
    } finally {
        await client.close(); // Ensure the client is always closed, even if an error occurs
    }
}

module.exports = { create_unique_id_for_class,
    enrollClass, getClassesStudent, getClassesTeacher, createClass, getStudentsInClass, getTeachersInClass, updateClassForGivenTeacher, find_class_based_on_ID, updateFlashcardForStudent
};
