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
    // const [isLoggedIn, setIsLoggedIn] = useState(true);  // Set to true for development
    // const [userEmail, setUserEmail] = useState("jasonhuang685@gmail.com");  // Hardcoded email
    // const [isTeacher, setIsTeacher] = useState(true);

    const [userEmail, setUserEmail] = useState("jStudent@gmail.com");  // Hardcoded email
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
        setCurrentAssignmentName(assignmentName)
        
        try {
            viewAssignment(currentClass, assignmentName, (fetchedAssignment) => {
                setCurrentAssignment(fetchedAssignment);
            }) 
        } catch (error) {
            console.error('Error fetching assignment:', error);
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
    };
  
    const handleHideCreateAssignment = () => {
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

        try {
         enrollInClass(className, userEmail, (classCreated) => {
                console.log("classCreated")
                getClassesForUser(userEmail)

            })
        }
        catch {
            console.log("error in joining class")
        }
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