const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');
const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);
const {
    enrollClass, getClassesStudent, getClassesTeacher, createClass, getStudentsInClass, getTeachersInClass, updateClassForGivenTeacher
} = require('../src/classes.js')

//TODO:write the IO functions for all functions above
function createClassIO(socket) {    
    socket.on('createClass', async (className, userName) => {
      console.log(className, userName)
        let classCreated;
        try {
            classCreated = await createClass(className, userName);
        } catch (error) {
            console.error('Error creating class:', error);
            classCreated = false;
        }
        console.log("createClass was called and returned value:", classCreated);
        socket.emit("Created class", classCreated);
        return classCreated;
    });
}

function getClassesIO(socket) {    
    socket.on('getClasses', async (userName) => {
      console.log(userName)
        let classList;
        try {
            classList = await getClassesTeacher(userName);
        } catch (error) {
            console.error('Error getting classes:', error);
        }
        console.log("getClassesIO was called and returned value:", classList);
        socket.emit("getClassesStatus", classList);
        return classList;
    });
}


module.exports =  {createClassIO, getClassesIO}