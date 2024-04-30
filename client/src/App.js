import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar/NavBar.js";
import Login from "./components/Login/Login.js";
import SignUp from "./components/SignUp/signUp.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Banner from "./components/banner";
import ClassMenu from "./components/Class/ClassMenu.js";

import CreateAssignment from "./CreateAssignment/CreateAssignment.js";

import "./App.css";
import { Modal } from "bootstrap";
import ClassAsgmts from "./components/ClassAssignments/classAsgmts.js";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);  // Set to true for development
  const [classList, setClassList] = useState([]);
  const [userEmail, setUserEmail] = useState("jyhuang@umass.edu");  // Hardcoded email
  const [userName, setUserName] = useState("Jason Huang");  // Hardcoded user name
  const [currentClass, setCurrentClass] = useState("");
  const [currentAssignments, setCurrentAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState("");
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);


  useEffect(() => {
    getClassesForUser(userEmail);  // Fetch classes for the hardcoded user
  }, []);  // Empty dependency array to run only on mount

  
  function getClassesHelper(userEmail) {
    const classesTest = [
      {
        title: "Spanish100",
        link: null,
      },
      {
        title: "Arabic for Business",
        link: null,
      },
      {
        title: "Classical Chinese",
        link: null,
      },
    ];
    return () => classesTest;
  }

  const getClassesForUser = (userEmail) => {
    const testClass = getClassesHelper(userEmail);
    try {
      setClassList(testClass());
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleClassClick = (className) => {
    setCurrentClass(className);
    const testAssignments = [
      { name: "Lesson 1: Talking in Class", termCount: 20 },
      { name: "Lesson 2: Greetings and Introductions", termCount: 15 },
      { name: "Lesson 3: Numbers and Colors", termCount: 17 },
      { name: "Lesson 4: Family and Relationships", termCount: 25 },
      { name: "Lesson 5: Daily Routines", termCount: 21 },
      { name: "Lesson 6: Describing People and Places", termCount: 10 },
      { name: "Lesson 7: Food and Dining", termCount: 12 },
    ];
    try {
      setCurrentAssignments(testAssignments);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  // setUserEmail("jyhuang@umass.edu")
  const handleLoginSuccess = (email, name) => {
    getClassesForUser(userEmail)
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserName(name); // Assume 'name' is passed along with 'email' after successful login
    ;
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

  const goBackToClassView = () => {
    setCurrentClass(null); // Or setCurrentClass('');
  };

  return (
    <>
      <CreateAssignment />
      <NavBar
        isLoggedIn={isLoggedIn}
        userName={userEmail}
        onSignOut={handleSignOut}
      />
      <div>
        {isLoggedIn ? (
          currentClass ? (
            <>
              <button onClick={goBackToClassView} style={{ margin: "10px" }}>
                Back to Classes
              </button>
              <ClassAsgmts
                className={currentClass}
                asgmts={currentAssignments}
              />
            </>
          ) : (
            <ClassMenu classes={classList} onClassClick={handleClassClick} />
          )
        ) : (
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <SignUp onLoginSuccess={handleLoginSuccess} />
            <Banner
              handleClick={() => {
                const signUpModal = new Modal(
                  document.getElementById("SignUpForm")
                );
                signUpModal.show();
              }}
            />
          </>
        )}
      </div>
      {showLogoutMessage && (
        <div className="logout-message">Logging out...</div>
      )}
    </>
  );
};

export default App;
