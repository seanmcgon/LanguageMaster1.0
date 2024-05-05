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
import Flashcard  from './components/Flashcard/Flashcard.js';
import StudentGrades from './components/StudentGrades/studentGrades.js';
const App = () => {
  //development credentials
    //Teacher
    const [isLoggedIn, setIsLoggedIn] = useState(true);  // Set to true for development
    const [userEmail, setUserEmail] = useState("jasonhuang685@gmail.com");  // Hardcoded email
    const [isTeacher, setIsTeacher] = useState(true);

    //Student
    // const [userEmail, setUserEmail] = useState("studentJason@gmail.com");  // Hardcoded email
    // const [isTeacher, setIsTeacher] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(true);

    //Production
    // const [isTeacher, setIsTeacher] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        getClassesForUser(userEmail);  // Fetch classes for the hardcoded user
      }, []);  // Empty dependency array to run only on mount
  
 
    const [classList, setClassList] = useState([]);
    const [currentClass, setCurrentClass] = useState(""); 
    const [currentAssignments, setCurrentAssignments] = useState([]); 
    const [currentAssignment, setCurrentAssignment] = useState(""); 
    const [currentAssignmentName, setCurrentAssignmentName] = useState(""); 
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const [curWord, setCurrentWord]= useState("");
    const [curAverage, setCurrentAverage] = useState("");
    const [attemptScore, setAttemptScore] = useState("");
    const [transcription, setTranscription] = useState("");
    const [language, setLanguage] = useState("")
    //TODO: Use these globals for the flashcard IO
   
    const [showFlashcardView, setShowFlashcardView] = useState(false);
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);

    const [hideBanner, setHideBanner] = useState(false);
    const [curGrades, setCurGrades] = useState(null);
    
    const getClassesForUser = (userEmail) => {
        getClasses(userEmail, isTeacher, (fetchedClasses) => {
            setClassList(()=> fetchedClasses);
        })
    };
    const handleShowFlashcardView = () => {
        setShowFlashcardView(true);
        console.log("setFlashcardView", showFlashcardView)

    };

    const handleBackToAssignments = () => {
        setShowFlashcardView(false);
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
        //get current language
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

    const handleGradesClick = () => {
        // Dummy for now
        setCurGrades([1]);
    }

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

    const goBackToAssignment = () => {
        console.log("I am being clicked")
        setShowFlashcardView(false)
    };
    
    const handleShowCreateAssignment = () => {
      setShowCreateAssignment(true);  
      setShowCreateAssignment(true);  
    };
  
    const handleHideCreateAssignment = () => {
      setShowCreateAssignment(false); 
      setShowCreateAssignment(false); 
    };

    const handleCreateClass = (className, language) => {
        try {
            
         createClass(className, userEmail, language, (classCreated) => {
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
                    getClassesForUser(userEmail)
                    retValue = false;
                }
                
            })
        
        return retValue;
    }

    const dummyFlashcards = 
        [
            {
              wordName: "苹果",
              englishTranslation: "Apple",
              audioFile: "path/to/apple.mp3", // Ensure you have a valid path for audio files
              score: 95
            },
            {
              wordName: "书",
              englishTranslation: "Book",
              audioFile: "path/to/book.mp3",
              score: 88
            },
            {
              wordName: "汽车",
              englishTranslation: "Car",
              audioFile: "path/to/car.mp3",
              score: 78
            }
        ]
        const lessonName = "ChineseTest";
 
    return (
        <>
            <NavBar 
                isTeacher={isTeacher} 
                setIsTeacher={setIsTeacher} 
                onJoinClass={handleJoinClass} 
                onCreateClass={handleCreateClass} 
                isLoggedIn={isLoggedIn} 
                userName={userEmail} 
                onSignOut={handleSignOut} 
                hideBanner={setHideBanner}
            />
            <div>
                {isLoggedIn ? (
                     showFlashcardView ? (
                        <Flashcard
                            flashcards={dummyFlashcards}
                            onBack= {goBackToAssignment}
                            onSubmit = {handleFeedbackClick}
                        />
                    ) : curGrades ? (
                        <StudentGrades
                            lessonName={currentAssignmentName}
                            onBack={() => setCurGrades(null)}
                        />
                    ) :
                    showCreateAssignment ? (
                        <CreateAssignment 
                            onBack={handleHideCreateAssignment} 
                            onCreateAssignment={handleCreateAssignment} 
                        />
                    ) : currentAssignment ? (
                        isTeacher ? (
                            <ViewAssignment
                                lessonName={currentAssignmentName}
                                flashcards={currentAssignment}
                                onBack={goBackToAssignmentList}
                                viewGrades={handleGradesClick}
                            />
                        ) : (
                            <ViewAssignmentStudent
                                // lessonName={currentAssignmentName}
                                // flashcards={currentAssignment}
                                lessonName = {lessonName}
                                flashcards={ dummyFlashcards}
                                onBack={goBackToAssignmentList}
                                onShowFlashcardView={handleShowFlashcardView}
                            />
                        )
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
                        <ClassMenu 
                            classes={classList} 
                            onClassClick={handleClassClick} 
                        />
                    )
                ) : (
                    <>
                        <Login 
                            setIsTeacher={setIsTeacher} 
                            onLoginSuccess={handleLoginSuccess} 
                        />
                        <SignUp 
                            onLoginSuccess={handleLoginSuccess} 
                        />
                        {!hideBanner && <Banner 
                            handleClick={() => {
                                const signUpModal = new Modal(document.getElementById('SignUpForm'));
                                signUpModal.show();
                            }} 
                        />}
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