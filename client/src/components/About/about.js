import React from 'react';
import "./about.css";
import jasonImage from '../../photos/Jason.jpg';
import mayaImage from '../../photos/Maya.jpg';
import quocImage from '../../photos/Quoc.jpg';
import shutoImage from '../../photos/Shuto.jpg';
import bachImage from '../../photos/Bach.jpg';
import suhaniImage from '../../photos/Suhani.jpg';
import seanImage from '../../photos/Sean.jpg';
// import aayushImage from '../../photos/Aayush.jpg';

const AboutComponent = () => {
  return (
    <div className="about-container">
      <h1>About LanguageMaster</h1>
      <p>
        Welcome to LanguageMaster, a web app dedicated to helping foreign language students in classrooms. 
        Foreign language teachers can create a class and then create assignments for students to practice their pronunciation.
        Utilizing Google's speech-to-text technology, LanguageMaster's innovative flashcard interface provides 
        instant feedback to students on each pronounced word/phrase, promoting an automated, interactive learning experience. 
        This software was developed by students from UMass Amherst's CS 320 Software Engineering Class in Spring 2024.

      </p>
      <div className="team-section">
        {/* Leadership and Full-Stack */}
        <h2>Full-Stack</h2>
        <div className="member">
          <img src={jasonImage} alt="Jason Huang" />
          <div>
            <h3>Jason Huang</h3>
            <p>Team Leader and Full Stack Developer</p>
          </div>
        </div>
        <div className="member">
          <img src={seanImage} alt="Sean McGonigle" />
          <div>
            <h3>Sean McGonigle</h3>
            <p>Full-Stack Developer</p>
          </div>
        </div>

        <h2>Backend Team</h2>
        <div className="member">
          <img src={mayaImage} alt="Maya Kandeshwarath" />
          <div>
            <h3>Maya Kandeshwarath</h3>
            <p>Backend and Database Leader</p>
          </div>
        </div>
        <div className="member">
          <img src={quocImage} alt="Quoc Thien Vi Lam" />
          <div>
            <h3>Quoc Thien Vi Lam</h3>
            <p>Backend Engineer</p>
          </div>
        </div>
        <div className="member">
          <img src={shutoImage} alt="Shuto Nakatsubo" />
          <div>
            <h3>Shuto Nakatsubo</h3>
            <p>API and Backend Engineer</p>
          </div>
        </div>

        <h2>Frontend Team</h2>
        <div className="member">
          <img src={bachImage} alt="Bach Tran" />
          <div>
            <h3>Back Tran</h3>
            <p>Frontend Leader</p>
          </div>
        </div>
        
        <div className="member">
          <img src={suhaniImage} alt="Suhani Chawla" />
          <div>
            <h3>Suhani Chawla</h3>
            <p>Frontend Engineer</p>
          </div>
        </div>
        

        <h2>Management</h2>
        <div className="member">
          {/* <img src={aayushImage} alt="Aayush Patel" /> */}
          <div>
            <h3>Aayush Patel</h3>
            <p>Project Manager</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutComponent;
