const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');
const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);
const {
 createAssignment, addToAssignment, viewAssignment, viewAssignmentStudent, deleteAssignment, getAllAssignments
} = require('../src/assignments.js')

//TODO:write the IO functions for all functions above
//Remember to console log the results in the backend and frontend for testing

//Finished by Sean 4/22/2024

//TODO: Create assignment should listen for a create assignment event ID, call createAssignment, send back boolean status to the frontend
//Parameters to listen for: className, assignmentName, assignmentArray
function createAssignmentIO(socket) {
  socket.on("createAssignment", async (className, assignmentName, assignFields) => {
    console.log("className:", className, "assignmentName", assignmentName, "assignmentArray", assignFields)
    let assignmentCreated;
    try {
      assignmentCreated = await createAssignment(className, assignmentName, assignFields);
    } catch (error) {
      console.log("Error creating assignment");
      assignmentCreated = false;
    }
    socket.emit("createAssignmentStatus", assignmentCreated);
    console.log("createAssignment was called and returned", assignmentCreated)

    return assignmentCreated;
  })
}

function getAllAssignmentsIO(socket) {
  socket.on("viewAllAssignments", async (className) => {
    console.log(className)
    let assignments;
    try {
      assignments = await getAllAssignments(className); // I think this function needs attention (returns wrong array of objects)
    } catch (error) {
      console.log("Error fetching assignments");
      assignments = [];
    }
    socket.emit("assignmentsFetched", assignments);
    console.log("getAllAssignments called and returned", assignments)

    return assignments;
  })
}

//TODO:View assignment should listen for view assignment event ID, call viewAssignment, send back assignment
//Parameters to listen for: className, assignmentName
function viewAssignmentIO(socket) {
  socket.on("viewAssignment", async (className, assignmentName) => {
    console.log("className", className, "assignmentName", assignmentName)

    let assignment;
    try {
      assignment = await viewAssignment(className, assignmentName);
    } catch (error) {
      console.log("Error fetching assignment");
      assignment = [];
    }
    socket.emit("assignmentFetched", assignment);
    console.log("viewAssignment called and returned", assignment)

    return assignment;
  })
}

// New function for student viewing an assignment (so scores are included)
// Assuming viewAssignmentStudent gets created in assignments.js
function viewAssignmentStudentIO(socket) {
  socket.on("viewAssignmentStudent", async (className, assignmentName) => {
    console.log("className", className, "assignmentName", assignmentName)

    let assignment;
    try {
      assignment = await viewAssignmentStudent(className, assignmentName);
    } catch (error) {
      console.log("Error fetching assignment");
      assignment = [];
    }
    socket.emit("assignmentFetched", assignment);
    console.log("viewAssignmentStudent called and returned", assignment)

    return assignment;
  })
}



//Call viewAssignmentIO and createAssignmentIO with the socket in socketManager.js
//export {createAssignmentIO, viewAssignmentIO, getAllAssignmentsIO}
module.exports = {createAssignmentIO, getAllAssignmentsIO, viewAssignmentIO, viewAssignmentStudentIO}