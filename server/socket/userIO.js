const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');
const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);
const {
  verifyTeacher, createTeacher, verifyStudent, createStudent
} = require('../src/userAccounts');


function verifyTeacherData(socket) {
    socket.on('teacherInfo', async (teacherEmail, teacherPassword) => {
      console.log(teacherEmail, teacherPassword)
        let teacherVerified;
        try {
          teacherVerified = await verifyTeacher(teacherEmail, teacherPassword);
        } catch (error) {
            console.error('Error verifying student:', error);
            teacherVerified = false;
        }
        console.log("verifyTeacher was called and returned value:", teacherVerified);
        socket.emit("teacherVerification", teacherVerified);
        return teacherVerified;
    });
}


function createTeacherAccount(socket) {
  socket.on('createTeacher', async (firstName, lastName, teacherEmail, teacherPassword) => {
    let teacherCreated;
    console.log(firstName, lastName, teacherEmail, teacherPassword);
      try {
          teacherCreated = await createTeacher(firstName, lastName, teacherEmail, teacherPassword);
      } catch (error) {
          console.error('Error creating teacher:', error);
          teacherCreated = false;
      }
      console.log("teacherCreated was called and returned value:", teacherCreated);
      socket.emit("createTeacherStatus", teacherCreated);
      return teacherCreated;
  });
}

function verifyStudentData(socket) {
  socket.on('studentInfo', async (studentEmail, studentPassword) => {
      console.log(studentEmail, studentPassword);
      let studentVerified;
      try {
          studentVerified = await verifyStudent(studentEmail, studentPassword);
      } catch (error) {
          console.error('Error verifying student:', error);
          studentVerified = false;
      }
      console.log("verifyStudent was called and returned value:", studentVerified);
      socket.emit("studentVerification", studentVerified);
      return studentVerified;
  });
}

function createStudentAccount(socket) {
  socket.on('createStudent', async (firstName, lastName, studentEmail, studentPassword) => {
      let studentCreated;
      console.log(firstName, lastName, studentEmail, studentPassword);
      try {
          studentCreated = await createStudent(firstName, lastName, studentEmail, studentPassword);
      } catch (error) {
          console.error('Error creating student:', error);
          studentCreated = false;
      }
      console.log("studentCreated was called and returned value:", studentCreated);
      socket.emit("createStudentStatus", studentCreated);
      return studentCreated;
  });
}


module.exports = { verifyTeacherData, createTeacherAccount, verifyStudentData, createStudentAccount};