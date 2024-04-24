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
        setCurrentAssignmentName(assignmentName)
        //getAssignmentsForClass(className)

         //TODO: Call getAssignmentsIO from client/src/components/socket.js and pass in the assignmentName and className (className is set globally as a state)
        //Pass a callback fetchedAssignment as a parameter, setCurrentAssignment with this fetchedAssignments
        //Instead of our dummy data you should see now the database data 
        // const testAssignment = [
        //     { wordName: 'Hola', englishTranslation: 'Hello', audioFile: 'hola.mp3' },
        //     { wordName: 'Buenos días', englishTranslation: 'Good morning', audioFile: 'buenos_dias.mp3' },
        //     { wordName: 'Buenas tardes', englishTranslation: 'Good afternoon', audioFile: 'buenas_tardes.mp3' },
        //     { wordName: 'Buenas noches', englishTranslation: 'Good night', audioFile: 'buenas_noches.mp3' },
        //     { wordName: 'Por favor', englishTranslation: 'Please', audioFile: 'por_favor.mp3' },
        //     { wordName: 'Gracias', englishTranslation: 'Thank you', audioFile: 'gracias.mp3' },
        //     { wordName: 'De nada', englishTranslation: 'You’re welcome', audioFile: 'de_nada.mp3' },
        //     { wordName: 'Perdón', englishTranslation: 'Excuse me', audioFile: 'perdon.mp3' },
        //     { wordName: 'Lo siento', englishTranslation: 'Sorry', audioFile: 'lo_siento.mp3' },
        //     { wordName: 'Sí', englishTranslation: 'Yes', audioFile: 'si.mp3' },
        //     { wordName: 'No', englishTranslation: 'No', audioFile: 'no.mp3' },
        //     { wordName: '¿Cómo te llamas?', englishTranslation: 'What is your name?', audioFile: 'como_te_llamas.mp3' },
        //     { wordName: 'Me llamo...', englishTranslation: 'My name is...', audioFile: 'me_llamo.mp3' },
        //     { wordName: '¿Cómo estás?', englishTranslation: 'How are you?', audioFile: 'como_estas.mp3' },
        //     { wordName: 'Estoy bien, gracias', englishTranslation: 'I’m fine, thank you', audioFile: 'estoy_bien_gracias.mp3' },
            
        //   ];
        
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
        setUserName(name); // Assume 'name' is passed along with 'email' after successful login
        getClassesForUser(email);
    };

   const handleCreateAssignment = (assignmentObject) => {
        //TODO: Call handleCreateAssignment from client/src/components/socket.js 
        //Pass a callback createAssignmentStatus as a parameter, log the result
        //When we go back to assignments we should see the new assignment
        createAssignment(currentClass, assignmentObject.title, assignmentObject.assignFields, (createAssignmentStatus) => {
            if (createAssignmentStatus) {
                console.log("Assignment created successfully"); 
                handleClassClick(currentClass)               
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
      setShowCreateAssignment(true);  // Show CreateAssignment component
    };
  
    const handleHideCreateAssignment = () => {
      setShowCreateAssignment(false); // Hide CreateAssignment component
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