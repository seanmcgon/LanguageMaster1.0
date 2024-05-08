const { Server } = require("socket.io");
const { verifyTeacherData, createTeacherAccount, verifyStudentData, createStudentAccount} = require("./userIO");
//TODO: Add imports for classesIO, and assignmentsIO
const {createAssignmentIO, getAllAssignmentsIO, viewAssignmentIO, viewAssignmentStudentIO, getStudentGradesIO} = require("./assignmentsIO");
const {createClassIO, getClassesIO, enrollClassIO} = require("./classesIO")
const {getFeedbackIO, adderIO, getSignedUrl} = require("./flashCardIO");

function initSocket(server) {
    //create a new WebSocket server, io, that is attached to the existing HTTP server created in index.js
    const io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"], },
    });
    disconnectAllClients(io)

    let numConnected = 0;

    //whenever a client is connected, first param of io.on is event ID, second is socket which is the object for the unique client
    //socket.io in the front-end passes us the socket object, which we can then use to communicate with this specific client
    io.on('connection', socket => {
        console.log("numClients connected", ++numConnected);
        console.log(`Client connected: ${socket.id}`);

        //now with this socket between us and the unique client, we can then do two way communication
        //we use imported modules to keep code clean 

        //pass in the socket and call the function for the needed communication
        verifyTeacherData(socket);
        createTeacherAccount(socket);
        verifyStudentData(socket);
        createStudentAccount(socket);

        createClassIO(socket)
        getClassesIO(socket)
        enrollClassIO(socket)
    
        createAssignmentIO(socket);
        getAllAssignmentsIO(socket);
        viewAssignmentIO(socket);
        getStudentGradesIO(socket);

        //TODO: add function for getStudentAssignments here 
        viewAssignmentStudentIO(socket);

        //TODO: add function(s) for flashcardIO here 
        getFeedbackIO(socket);
        adderIO(socket)
        getSignedUrl(socket)

        // socket.on('disconnect', () => {
        //     console.log("numClients connected", --numConnected);
        // });
    });
}

function disconnectAllClients(io) {
    io.of("/").sockets.forEach(socket => {
        socket.disconnect(true);
    });
}

module.exports = { initSocket, disconnectAllClients };