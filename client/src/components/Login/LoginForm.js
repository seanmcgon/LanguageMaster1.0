import React, { useState } from "react";
import { Modal } from 'bootstrap';
import "./Login.css";
import { verifyStudent, verifyTeacher } from '../socket';
import Bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

function LoginForm({ setIsTeacher, onLoginSuccess }) {
  const [role, setRole] = useState(false);  // false for student, true for teacher
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State for error message

  const handleCloseClick = () => {
    const modalElement = document.getElementById('LoginForm');
    const loginModal = Modal.getInstance(modalElement);
    loginModal?.hide();
    document.body.classList.remove('modal-open');
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCloseClick(); // Close login modal

    const signUpModalElement = document.getElementById('SignUpForm');
    let signUpModal = Modal.getInstance(signUpModalElement);
    signUpModal = signUpModal || new Modal(signUpModalElement);
    signUpModal.show();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt: ", { role: role ? "Teacher" : "Student", email, password });  // Log login attempt details
    //TODO
    setIsTeacher(role);  // Update the global isTeacher state
    window.localStorage.setItem("isTeacher", role ? "true" : "false");
    console.log("setIsTeacher called with: ", role);  // Log when setIsTeacher is called

    const verificationFunction = role ? verifyTeacher : verifyStudent;
    verificationFunction(email, password, (verificationStatus) => {
        if (verificationStatus) {
            handleCloseClick();  // Hide the login modal on successful login
            onLoginSuccess(email);  // Call onLoginSuccess with the email
        } else {
            setErrorMessage("Login failed. Please check your email and password.");
            console.log("Login failed");  // Log when login fails
        }
    });
  };

  const toggleRole = () => {
    setRole(!role);
    console.log("Role changed to: ", !role ? "Teacher" : "Student");  // Log role change
  };

  return (
    <div className="myform" id="LoginForm">
      <div className="modal-header">
        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
      </div>
      <h1 className="text-center">Login for {role ? "Teacher" : "Student"}</h1>
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn btn-role bg-transparent"
          onClick={toggleRole}
        >
          I'm a {role ? "Student" : "Teacher"}
        </button>
        <div className="mb-3 mt-4">
          <label htmlFor="InputEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control grey-background"
            id="InputEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control grey-background"
            id="InputPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>}
        <button type="submit" className="btn btn-light mt-3">
          Login
        </button>
        <p>
          Not a member? <a href="#" onClick={handleSignUpClick}>Signup now</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
