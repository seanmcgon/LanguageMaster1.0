import React, { useState, useEffect } from 'react';
import NavBar from "./components/NavBar/NavBar.js";
import Login from "./components/Login/Login.js";
import SignUp from "./components/SignUp/signUp.js";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Banner from "./components/banner";
import ClassMenu from "./components/Class/ClassMenu.js";
import CreateAssignment from "./components/CreateAssignment/CreateAssignment.js";
import "./App.css";
import { Modal } from 'bootstrap';
import ClassAsgmts from './components/ClassAssignments/classAsgmts.js';
import ViewAssignment from './components/viewAssignments/viewAssignments.js';
import { createAssignment, viewAllAssignments, viewAssignment, viewAssignmentStudent, getFeedback } from './components/socket.js';
import { createClass, getClasses, enrollInClass } from './components/socket.js';
import ViewAssignmentStudent from "./components/ViewAssignmentStudent/ViewAssignmentStudent.js";

const App = () => {
  //development credentials
    // const [isLoggedIn, setIsLoggedIn] = useState(true);  // Set to true for development
    // const [userEmail, setUserEmail] = useState("jasonhuang685@gmail.com");  // Hardcoded email
    // const [isTeacher, setIsTeacher] = useState(true);

    const [userEmail, setUserEmail] = useState("studentJason@gmail.com");  // Hardcoded email
    const [isTeacher, setIsTeacher] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        getClassesForUser(userEmail);  // Fetch classes for the hardcoded user
      }, []);  

    const [classList, setClassList] = useState([]);
    // const [userEmail, setUserEmail] = useState("");
    const [currentClass, setCurrentClass] = useState(""); 
    const [currentAssignments, setCurrentAssignments] = useState([]); 
    const [currentAssignment, setCurrentAssignment] = useState(""); 
    const [currentAssignmentName, setCurrentAssignmentName] = useState(""); 
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);


    const [curWord, setCurrentWord]= useState("");
    const [curAverage, setCurrentAverage] = useState("");
    const [attemptScore, setAttemptScore] = useState("");
    const [transcription, setTranscription] = useState("");
    //TODO: Use these globals for the flashcard IO
   
  
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);
    
    const getClassesForUser = (userEmail) => {
        getClasses(userEmail, isTeacher, (fetchedClasses) => {
            setClassList(()=> fetchedClasses);
        })
    };

    const handleClassClick = (className) => {
        setCurrentClass(className);  

        console.log("currentClass set as", className);

        try {
            viewAllAssignments(className, (fetchedAssignments) => {
                setCurrentAssignments(fetchedAssignments);
            });
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleAssignmentClick = (assignmentName) => {
        //TODO: Sean- if isTeacher use current logic, else we want to retrieve student grades
        //Instead of just three fields (word, translation, audio), we want to have word, translation, audio, and student score (double)
        //You may just copy assignmentView component and modify it or modify assignmentView itself, whatever you feel is easiest 
        setCurrentAssignmentName(assignmentName)
        
        try {
            if (isTeacher) {
                viewAssignment(currentClass, assignmentName, (fetchedAssignment) => {
                    setCurrentAssignment(fetchedAssignment);
                }) 
            } else {
                viewAssignmentStudent(currentClass, assignmentName, (fetchedAssignment) => {
                    setCurrentAssignment(fetchedAssignment);
                })
            }
        } catch (error) {
            console.error('Error fetching assignment:', error);
        }
    };

    const handleFeedbackClick = (curWord, audioFile ) => {
        //TODO: Sean- pass these in, have a callback(s) which will be these three things: attemptScore(double), newAverage(double), transcription(string)
        //Set the states of these three things, we will link this with the flashcard UI
        try {
            getFeedback(curWord, audioFile, (attemptScore, newAverage, transcription) => {
                setAttemptScore(attemptScore);
                setCurrentAverage(newAverage);
                setTranscription(transcription);
            })
        } catch (error) {
            console.log("Error getting feedback:", error);
        }
    };

    const handleLoginSuccess = (email, name) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        getClassesForUser(email);
        console.log("is Teacher", isTeacher)
    };

    const handleCreateAssignment = (assignmentObject) => {
    
        createAssignment(currentClass, assignmentObject.title, assignmentObject.assignFields, (createAssignmentStatus) => {
            if (createAssignmentStatus) {
                console.log("Assignment created successfully"); 
                getClassesForUser(userEmail);
                setShowCreateAssignment(false);
                handleClassClick(currentClass);
                return;
            } else {
                console.log("Error creating assignment");
            }
        });
    }

    const handleSignOut = () => {
        setShowLogoutMessage(true);
        setTimeout(() => {
            setIsLoggedIn(false);
            setUserEmail("");
            setClassList([]);
            setShowLogoutMessage(false);
        }, 1000); 
    };

    const goBackToClassView = () => {
        setCurrentClass(null);  
    };
    const goBackToAssignmentList = () => {
        setCurrentAssignment(null);
        setCurrentAssignmentName('');
    };
    
    const handleShowCreateAssignment = () => {
      setShowCreateAssignment(true);  
      setShowCreateAssignment(true);  
    };
  
    const handleHideCreateAssignment = () => {
      setShowCreateAssignment(false); 
      setShowCreateAssignment(false); 
    };

    const handleCreateClass = (className) => {
        try {
            
         createClass(className, userEmail, (classCreated) => {
                console.log("classCreated")
                getClassesForUser(userEmail)

            })
        }
        catch {
            console.log("error in creating class")
        }
    }

    const handleJoinClass = (className) => {
        console.log("clicked join class")
        let retValue = false
         enrollInClass(className, userEmail, (classCreated) => {
                if (classCreated) {
                    getClassesForUser(userEmail)
                    console.log("class joined true")
                    retValue = true;
                    
                }
                else {
                    console.log("class joined false")

                    retValue = false;
                }
                
            })
        
        return retValue;
    }

    return (
        <>
            <NavBar isTeacher={isTeacher} setIsTeacher={setIsTeacher} onJoinClass = {handleJoinClass} onCreateClass = {handleCreateClass} isLoggedIn={isLoggedIn} userName={userEmail} onSignOut={handleSignOut} />
            <div>
                {isLoggedIn ? (
                    showCreateAssignment ? (
                        <CreateAssignment 
                            onBack={handleHideCreateAssignment} 
                            onCreateAssignment={handleCreateAssignment} 
                        />
                    ) : (currentAssignment && isTeacher) ? (
                        <ViewAssignment
                            lessonName={currentAssignmentName}
                            flashcards={currentAssignment}
                            onBack={goBackToAssignmentList}
                        />
                    ) : (currentAssignment && !isTeacher) ? (
                        <ViewAssignmentStudent
                            lessonName={currentAssignmentName}
                            flashcards={currentAssignment}
                            onBack={goBackToAssignmentList}
                        />
                    ) : currentClass ? (
                        <ClassAsgmts
                            className={currentClass}
                            asgmts={currentAssignments}
                            onAssignmentClick={handleAssignmentClick}
                            onBack={goBackToClassView}
                            onCreateAssignmentClick={handleShowCreateAssignment}
                            isTeacher={isTeacher}  
/>
                    ) : (
                        <ClassMenu classes={classList} onClassClick={handleClassClick} />
                    )
                ) : (
                    <>
                        <Login setIsTeacher={setIsTeacher} onLoginSuccess={handleLoginSuccess} />
                        <SignUp onLoginSuccess={handleLoginSuccess} />
                        <Banner handleClick={() => {
                            const signUpModal = new Modal(document.getElementById('SignUpForm'));
                            signUpModal.show();
                        }} />
                    </>
                )}
            </div>
            {showLogoutMessage && (
                <div className="logout-message">
                    Logging out...
                </div>
            )}
        </>
    );
}
    


export default App;