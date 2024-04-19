import React, { useState } from "react";
import { Modal } from 'bootstrap';
import "./Login.css";
import { verifyStudent, verifyTeacher } from '../socket';
import Bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

function LoginForm(props) {
  const [isTeach, setTeach] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State for error message

  const handleCloseClick = () => {
    const modalElement = document.getElementById('LoginForm');
    const loginModal = Modal.getInstance(modalElement);
    if (loginModal) {
        loginModal.hide();
    }

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }

    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const loginModalElement = document.getElementById('LoginForm');
    const loginModal = Modal.getInstance(loginModalElement);
    if (loginModal) {
      loginModal.hide();
    }

    const signUpModalElement = document.getElementById('SignUpForm');
    let signUpModal = Modal.getInstance(signUpModalElement);
    if (!signUpModal) {
        signUpModal = new Modal(signUpModalElement);
    }
    signUpModal.show();

    signUpModalElement.querySelector('input')?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationFunction = isTeach ? verifyTeacher : verifyStudent;

    verificationFunction(email, password, (verificationStatus) => {
        if (verificationStatus) {
            const modalElement = document.getElementById('LoginForm');
            const loginModal = Bootstrap.Modal.getInstance(modalElement);
            if (loginModal) {
                loginModal.hide();
            }

            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

            document.body.classList.remove('modal-open');
            props.onLoginSuccess(email);
        } else {
            setErrorMessage("Login failed. Please check your email and password.");
        }
    });
  };

  return (
    <div className="myform" id="LoginForm">
      <div className="modal-header">
        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
      </div>
      <h1 className="text-center">Login for {isTeach ? "Teacher" : "Student"}</h1>
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn btn-role bg-transparent"
          onClick={() => setTeach(!isTeach)}
        >
          I'm a {isTeach ? "Student" : "Teacher"}
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
