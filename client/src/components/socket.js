import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export const connectSocket = () => {
  socket.on("connect", () => {
    //we listen for the back-end confirmation message
    console.log("You connected with id", socket.id);
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

//change to student email
export const verifyStudent = (studentEmail, studentPassword, studentVerified) => {
  //we send the studentName and password and get back the boolean
  //function that checks before emitting
  //if good then send else don't
  socket.emit('studentInfo', studentEmail, studentPassword);
  socket.on("studentVerification", studentVerified);
};

export const createStudent = (studentFirstName, studentLastName, studentEmail, studentPassword, studentCreated) => {
  //we send the studentName and password and get back the boolean
  //function that checks before emitting
  //if good then send else don't
  socket.emit('createStudent', studentFirstName, studentLastName, studentEmail, studentPassword);
  socket.on("createStudentStatus", studentCreated);
};

export const verifyTeacher = (teacherEmail, teacherPassword, teacherVerified) => {
  // Emit teacher credentials and listen for verification status
  socket.emit('teacherInfo', teacherEmail, teacherPassword);
  socket.on("teacherVerification", teacherVerified);
};

export const createTeacher = (teacherFirstName, teacherLastName, teacherEmail, teacherPassword, teacherCreated) => {
  // Emit teacher details and listen for creation status
  socket.emit('createTeacher', teacherFirstName, teacherLastName, teacherEmail, teacherPassword);
  socket.on("createTeacherStatus", teacherCreated);
};

//TODO: Add functions for createAssignmentIO, viewAssignmentIO and viewAllAssignmentsIO
export const createAssignment = (className, assignmentName, assignFields, assignmentCreated) => {
  socket.emit("createAssignment", className, assignmentName, assignFields);
  socket.on("createAssignmentStatus", assignmentCreated);
}

export const viewAllAssignments = (className, fetchedAssignments) => {
  socket.emit("viewAllAssignments", className);
  socket.on("assignmentsFetched", fetchedAssignments);
}

export const viewAssignment = (className, assignmentName, fetchedAssignment) => {
  socket.emit("viewAssignment", className, assignmentName);
  socket.on("assignmentFetched", fetchedAssignment);
}

export const viewAssignmentStudent = (className, assignmentName, fetchedAssignment) => {
  socket.emit("viewAssignmentStudent", className, assignmentName);
  socket.on("assignmentFetched", fetchedAssignment);
}


//TODO: Add functions for classes

export const createClass = (className, teacherEmail, classCreated) => {
  socket.emit("createClass", className, teacherEmail);
  socket.on("createClassStatus", classCreated);
}

export const enrollInClass = (className, classID, studentEmail, enrolledInClass) => {
  socket.emit("enrollClass", className, classID, studentEmail);
  socket.on("enrollClassStatus", enrolledInClass);
}

export const getClasses = (email, teacherBool, fetchedClasses) => {
  socket.emit("getClasses", email, teacherBool);
  socket.on("getClassesStatus", fetchedClasses);
}

//TODO: Sean- Add getFlashcardListForAssignment(className, assignmentName, fetchedAssignment)

//TODO: Sean- Add getFeedback





