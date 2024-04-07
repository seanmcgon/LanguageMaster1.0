import React, { useState } from "react";
import { Modal } from 'bootstrap';
import "./signUp.css";
import { createStudent, createTeacher } from '../socket'; // Adjust the path as necessary

function SignUp() {
  const [isTeach, setTeach] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCloseClick = () => {
    window.location.reload();
  };

  const handleLoginClick = () => {
    const signUpModal = Modal.getInstance(document.getElementById('SignUpForm'));
    if (signUpModal) {
      signUpModal.hide();
    }

    const loginModal = new Modal(document.getElementById('LoginForm'));
    loginModal.show();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (studentPassword !== studentConfirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const createAction = isTeach ? createTeacher : createStudent;
    createAction(studentFirstName, studentLastName, studentEmail, studentPassword, (createStatus) => {
      if (createStatus) {
        setMessage(isTeach ? "Teacher created successfully!" : "Student created successfully!");
      } else {
        setMessage(isTeach ? "Teacher creation failed!" : "Student creation failed!");
      }
    });
  };

  return (
    <div className="myform" id="SignUpForm">
      <div className="modal-header">
        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
      </div>
      <h1 className="text-center">Create Account For {isTeach ? "Teacher" : "Student"}</h1>
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn btn-role bg-transparent"
          onClick={() => setTeach(!isTeach)}
        >
          I'm a {isTeach ? "Student" : "Teacher"}
        </button>
        <div className="mb-3">
          <label htmlFor="InputFirstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control grey-background"
            id="InputFirstName"
            value={studentFirstName}
            onChange={(e) => setStudentFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputLastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control grey-background"
            id="InputLastName"
            value={studentLastName}
            onChange={(e) => setStudentLastName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control grey-background"
            id="InputEmail"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
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
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ConfirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control grey-background"
            id="ConfirmPassword"
            value={studentConfirmPassword}
            onChange={(e) => setStudentConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-light mt-3">
          Sign up
        </button>
        <p className="text-center">{message}</p>
        <p>
          Already a member? <a href="#" onClick={handleLoginClick}>Log in</a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
