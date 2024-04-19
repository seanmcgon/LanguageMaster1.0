const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');
const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);
const {
 createAssignment, addToAssignment, viewAssignment, deleteAssignment, convertAssignmentToDtbForm
} = require('../src/assignments.js')

//TODO:write the IO functions for all functions above
function createAssignmentIO(socket) {
    //model in userIO for reference NOT USABLE CODE
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

export {createAssignmentIO}