import { io } from 'socket.io-client';

const socket = io('https://languagemaster1-0.onrender.com');

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

//TODO: Add functions for classes

export const createClass = (className, teacherEmail, language, classCreated) => {
  socket.emit("createClass", className, teacherEmail, language);
  socket.on("createClassStatus", classCreated);
}

// export const enrollInClass = (className, classID, studentEmail, enrolledInClass) => {
//   socket.emit("enrollClass", className, classID, studentEmail);
//   socket.on("enrollClassStatus", enrolledInClass);
// }

export const enrollInClass = (className, studentEmail, enrolledInClass) => {
  socket.emit("enrollClass", className, studentEmail);
  socket.on("enrollClassStatus", enrolledInClass);
}

export const getClasses = (email, teacherBool, fetchedClasses) => {
  socket.emit("getClasses", email, teacherBool);
  socket.on("getClassesStatus", fetchedClasses);
}

export const viewAssignmentStudent = (className, assignmentName, userEmail, fetchedAssignment) => {
  socket.emit("viewAssignmentStudent", className, assignmentName, userEmail);
  socket.on("assignmentFetched", fetchedAssignment);
}

export const getFeedback = (curWord, audioFile, currentAssignment, currentClass, studentEmail, feedback) => {
  console.log("get feedback called with", audioFile)
  socket.emit("getFeedback", curWord, audioFile, currentAssignment, currentClass, studentEmail);
  

  socket.once("feedback", feedback);
}

export const adderIO = (number1, number2, feedback) => {
  socket.emit("adder", number1, number2);
  socket.once("adderResult", feedback);
}

export const getStudentGrades = (className, assignmentName, grades) => {
  socket.emit("getStudentGrades", className, assignmentName);
  socket.on("studentGrades", grades);
}

export const getSignedURL = (url, signedURL) => {
  console.log("url", url)
  socket.emit("getSignedUrl", url)
  socket.on("signedUrl", signedURL)
}


