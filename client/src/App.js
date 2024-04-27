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
import { createAssignment, viewAllAssignments, viewAssignment } from './components/socket.js';
import { createClass, getClasses, enrollInClass } from './components/socket.js';

const App = () => {
  //development credentials
    const [isLoggedIn, setIsLoggedIn] = useState(true);  // Set to true for development
    const [userEmail, setUserEmail] = useState("jasonhuang1685@umass.edu");  // Hardcoded email

    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [classList, setClassList] = useState([]);
    // const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState(""); 
    const [currentClass, setCurrentClass] = useState(""); 
    const [currentAssignments, setCurrentAssignments] = useState([]); 
    const [currentAssignment, setCurrentAssignment] = useState(""); 
    const [currentAssignmentName, setCurrentAssignmentName] = useState(""); 
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const [isTeacher, setIsTeacher] = useState(true);

    const [curWord, setCurrentWord]= useState("")
    const [curAverage, setCurrentAverage] = useState("")
    const [attemptScore, setAttemptScore] = useState("")
    //TODO: Use these globals for the flashcard IO

    useEffect(() => {
      getClassesForUser(userEmail);  // Fetch classes for the hardcoded user
    }, []);  // Empty dependency array to run only on mount
  
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);
    
    const getClassesForUser = (userEmail) => {
        getClasses(userEmail, true, (fetchedClasses) => {
            setClassList(()=> fetchedClasses);
        })
    };

    useEffect(() => {
        console.log("Updated currentClass is:", currentClass);
        // You can perform additional actions here when currentClass updates
    }, [currentClass]); // This effect runs when currentClass changes

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
            viewAssignment(currentClass, assignmentName, (fetchedAssignment) => {
                setCurrentAssignment(fetchedAssignment);
            }) 
        } catch (error) {
            console.error('Error fetching assignment:', error);
        }
    };

    const handleFeedbackClick = (curWord, audioFile ) => {
        //TODO: Sean- pass these in, have a callback(s) which will be these three things: attemptScore(double), newAverage(double), transcription(string)
        //Set the states of these three things, we will link this with the flashcard UI
    };

    const handleLoginSuccess = (email, name) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        setUserName(name); // Assume 'name' is passed along with 'email' after successful login
        getClassesForUser(email);
    };

   const handleCreateAssignment = (assignmentObject) => {
        
        createAssignment(currentClass, assignmentObject.title, assignmentObject.assignFields, (createAssignmentStatus) => {
            if (createAssignmentStatus) {
                console.log("Assignment created successfully"); 
                getClassesForUser(userEmail)               
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
            setUserName("");
            setClassList([]);
            setShowLogoutMessage(false);
        }, 1000); 
    };

    const goBackToClassView = () => {
        setCurrentClass(null);  // Or setCurrentClass('');
    };
    const goBackToAssignmentList = () => {
        setCurrentAssignment(null);
        setCurrentAssignmentName('');
    };
    
    const handleShowCreateAssignment = () => {
      setShowCreateAssignment(true);  
    };
  
    const handleHideCreateAssignment = () => {
      setShowCreateAssignment(false); 
    };

    const handleCreateClass = (className) => {
        try {
         createClass(className, userEmail, (classCreated) => {
                console.log("classCreated")
            })
        }
        catch {
            console.log("error in creating class")
        }
    }

    //TODO: Sean- Add viewAssignmentStudent component if you decide to make a new component, else disregard this
    return (
        <>
            <NavBar onCreateClass = {handleCreateClass} isLoggedIn={isLoggedIn} userName={userEmail} onSignOut={handleSignOut} />
            <div>
                {isLoggedIn ? (
                    showCreateAssignment ? (
                        <CreateAssignment 
                            onBack={handleHideCreateAssignment} 
                            onCreateAssignment={handleCreateAssignment} 
                        />
                    ) : currentAssignment ? (
                        <ViewAssignment
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
                        />
                    ) : (
                        <ClassMenu classes={classList} onClassClick={handleClassClick} />
                    )
                ) : (
                    <>
                        <Login onLoginSuccess={handleLoginSuccess} />
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