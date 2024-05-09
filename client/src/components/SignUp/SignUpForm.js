import React, { useState } from "react";
import { Modal } from 'bootstrap';
import "./signUp.css";
import { createStudent, createTeacher } from '../socket'; // Adjust the path as necessary
import Bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

function SignUp(props) {
  const [isTeach, setTeach] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

  const handleCloseClick = () => {
    const modalElement = document.getElementById('SignUpForm');
    const signUpModal = Modal.getInstance(modalElement);
    if (signUpModal) {
        signUpModal.hide();
    }

    // Manually remove the modal backdrop if it doesn't disappear
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }

    // Remove 'modal-open' class from body if it's there
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

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

    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
    }

    const createAction = isTeach ? createTeacher : createStudent;
    createAction(firstName, lastName, email, password, (createStatus) => {
        if (createStatus) {
            //log users in automatically
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

            document.body.classList.remove('modal-open');
            props.onLoginSuccess(email, isTeach);
        } else {
            setErrorMessage("Account creation failed!");
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        <div className="mb-3">
          <label htmlFor="ConfirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control grey-background"
            id="ConfirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-light mt-3">
          Sign up
        </button>
        <p className="text-center">{errorMessage}</p>
        <p>
          Already a member? <a href="#" onClick={handleLoginClick}>Log in</a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
