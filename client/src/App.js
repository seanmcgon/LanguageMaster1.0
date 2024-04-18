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
import {createClass, getClassesIO} from './components/socket.js'

const App = () => {
  //development credentials
    const [isLoggedIn, setIsLoggedIn] = useState(true);  // Set to true for development
    const [classList, setClassList] = useState([]);
    const [userEmail, setUserEmail] = useState("jyhuang@umass.edu");  // Hardcoded email
    const [userName, setUserName] = useState("Jason Huang");  // Hardcoded user name

    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [classList, setClassList] = useState([]);
    // const [userEmail, setUserEmail] = useState("");
    // const [userName, setUserName] = useState(""); 
    const [currentClass, setCurrentClass] = useState(""); 
    const [currentAssignments, setCurrentAssignments] = useState([]); 
    const [currentAssignment, setCurrentAssignment] = useState(""); 
    const [currentAssignmentName, setCurrentAssignmentName] = useState(""); 
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);

    useEffect(() => {
      getClassesForUser(userEmail);  // Fetch classes for the hardcoded user
    }, []);  // Empty dependency array to run only on mount
  

    function getClassesHelper(userEmail) {
       let classes  = [
        {
            title: "Spanish 110",
            link: null,
        },
        {
            title: "Chinese 187",
            link: null,
        },
        {
            title: "French 220",
            link: null,
        },
    ];   
     
        try {
            classes =  getClassesIO(userEmail)
        } catch (error) {
            classes = [
                {
                    title: "Spanish 110",
                    link: null,
                },
                {
                    title: "Chinese 187",
                    link: null,
                },
                {
                    title: "French 220",
                    link: null,
                },
            ];   
        }

        return () => classes;

    }
    
    const getClassesForUser = (userEmail) => {
        const testClass = getClassesHelper(userEmail);
        try {
            setClassList(testClass()); 
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };
    const handleCreateClass = (newClassName) => {
        // Here you can set the state or perform other actions with the new class name
        const createClassResult =  createClass(newClassName, userEmail, (createStatus) => {
            console.log("Trying")
            if (createClassResult) {
                console.log("New class created:", newClassName);  // Example action
            }
            else {
                console.log("Class creation failed")
            }
        })
    }
    
    const handleClassClick = (className) => {
        setCurrentClass(className)
        //getAssignmentsForClass(className)
        const testAssignments =[
            { name: "Lesson 1: Greetings and Introductions", termCount: 15 },
            { name: "Lesson 2: Numbers and Colors", termCount: 17 },
            { name: "Lesson 3: Family and Relationships", termCount: 25 },
            { name: "Lesson 4: Daily Routines", termCount: 21 },
            { name: "Lesson 5: Describing People and Places", termCount: 10 },
            { name: "Lesson 6: Food and Dining", termCount: 12 },
          ]
        try {
            setCurrentAssignments(testAssignments); 
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleAssignmentClick = (assignmentName) => {
        setCurrentAssignmentName(assignmentName)
        //getAssignmentsForClass(className)
        const testAssignment = [
            { wordName: 'Hola', englishTranslation: 'Hello', audioFile: 'hola.mp3' },
            { wordName: 'Buenos días', englishTranslation: 'Good morning', audioFile: 'buenos_dias.mp3' },
            { wordName: 'Buenas tardes', englishTranslation: 'Good afternoon', audioFile: 'buenas_tardes.mp3' },
            { wordName: 'Buenas noches', englishTranslation: 'Good night', audioFile: 'buenas_noches.mp3' },
            { wordName: 'Por favor', englishTranslation: 'Please', audioFile: 'por_favor.mp3' },
            { wordName: 'Gracias', englishTranslation: 'Thank you', audioFile: 'gracias.mp3' },
            { wordName: 'De nada', englishTranslation: 'You’re welcome', audioFile: 'de_nada.mp3' },
            { wordName: 'Perdón', englishTranslation: 'Excuse me', audioFile: 'perdon.mp3' },
            { wordName: 'Lo siento', englishTranslation: 'Sorry', audioFile: 'lo_siento.mp3' },
            { wordName: 'Sí', englishTranslation: 'Yes', audioFile: 'si.mp3' },
            { wordName: 'No', englishTranslation: 'No', audioFile: 'no.mp3' },
            { wordName: '¿Cómo te llamas?', englishTranslation: 'What is your name?', audioFile: 'como_te_llamas.mp3' },
            { wordName: 'Me llamo...', englishTranslation: 'My name is...', audioFile: 'me_llamo.mp3' },
            { wordName: '¿Cómo estás?', englishTranslation: 'How are you?', audioFile: 'como_estas.mp3' },
            { wordName: 'Estoy bien, gracias', englishTranslation: 'I’m fine, thank you', audioFile: 'estoy_bien_gracias.mp3' },
            
          ];
        
        try {
            setCurrentAssignment(testAssignment); 
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleLoginSuccess = (email, name) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        setUserName(name); // Assume 'name' is passed along with 'email' after successful login
        getClassesForUser(email);
    };

   
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

    const handleShowCreateAssignment = () => {
      setShowCreateAssignment(true);  // Show CreateAssignment component
    };
  
   const handleHideCreateAssignment = () => {
      setShowCreateAssignment(false); // Hide CreateAssignment component
    };
    return (
        <>
            <NavBar isLoggedIn={isLoggedIn} userName={userName} onSignOut={handleSignOut} onCreateClass={handleCreateClass} />
            <div>
                {isLoggedIn ? (
                    showCreateAssignment ? (
                        <CreateAssignment onBack={handleHideCreateAssignment} />
                    ) : currentAssignment.length ? (
                        <ViewAssignment
                            lessonName={currentAssignmentName}
                            flashcards={currentAssignment}
                            onBack={() => setCurrentAssignment([])}
                        />
                    ) : currentClass ? (
                        <ClassAsgmts
                            className={currentClass}
                            asgmts={currentAssignments}
                            onAssignmentClick={handleAssignmentClick}
                            onBack={() => setCurrentClass("")}
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
            {showLogoutMessage && <div className="logout-message">Logging out...</div>}
        </>
    );
};

export default App;