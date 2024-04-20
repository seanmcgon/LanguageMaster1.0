const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');
const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);
const {
 createAssignment, addToAssignment, viewAssignment, deleteAssignment, getAllAssignments
} = require('../src/assignments.js')

//TODO:write the IO functions for all functions above
//Remember to console log the results in the backend and frontend for testing


//TODO: Create assignment should listen for a create assignment event ID, call createAssignment, send back boolean status to the frontend
//Parameters to listen for: className, assignmentName, assignmentArray
function createAssignmentIO(socket) {
  createAssignment()
}

function getAllAssignmentsIO(socket) {
  getAllAssignments()
}

//TODO:View assignment should listen for view assignment event ID, call viewAssignment, send back assignment
//Parameters to listen for: className, assignmentName
function viewAssignmentIO(socket) {
  viewAssignment()
}



//Call viewAssignmentIO and createAssignmentIO with the socket in socketManager.js
export {createAssignmentIO, viewAssignmentIO, getAllAssignmentsIO}