import React, { useState, useEffect } from 'react';
import "./NavBar.css";
import CreateClassPopup from './createClassPopup';
import JoinClassPopup from './joinClass';
import AboutComponent from '../About/about';

import { Modal } from 'bootstrap';
import { Dropdown } from 'react-bootstrap';

function NavBar({ onCreateClass, onJoinClass, isLoggedIn, userName, onSignOut, isTeacher, hideBanner }) {
    const [showCreateClassModal, setCreateClassModal] = useState(false);
    const [showJoinClassModal, setJoinClassModal] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            setShowAbout(false);
        }
    }, [isLoggedIn]);

    const showSignUp = () => {
        const signUpModal = new Modal(document.getElementById('SignUpForm'));
        signUpModal.show();
    };

    const showLogIn = () => {
        const loginModal = new Modal(document.getElementById('LoginForm'));
        loginModal.show();
    };

    function about () {
        hideBanner(!showAbout);
        setShowAbout(!showAbout);
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">LanguageMaster</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="#about" onClick={about}>About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link login-button" href="#login" onClick={showLogIn}>Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link signup-button" href="#signup" onClick={showSignUp}>Sign Up</a>
                                </li>
                            </>
                        ) : (
                            <>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                        Profile ({isTeacher ? "Teacher" : "Student"} - {userName})
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={onSignOut}>Sign Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {isTeacher ? (
                                    <li className="nav-item-loginAfter">
                                        <a className="nav-link-color" href="#" onClick={() => setCreateClassModal(true)}>Create Class</a>
                                    </li>
                                ) : (
                                    <li className="nav-item-loginAfter">
                                        <a className="nav-link-color" href="#" onClick={() => setJoinClassModal(true)}>Join Class</a>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>

                {/* Modals */}
                <CreateClassPopup onCreateClass={onCreateClass} show={showCreateClassModal} onHide={() => setCreateClassModal(false)} />
                <JoinClassPopup onJoinClass={onJoinClass} show={showJoinClassModal} onHide={() => setJoinClassModal(false)} />
            </nav>
            {showAbout && <AboutComponent />}
        </>
    );
}

export default NavBar;
