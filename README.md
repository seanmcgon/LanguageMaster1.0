Part 1: Featureless Live Product Website: 
Once you complete the steps in part 2, the website should be running at http://localhost:3000/. 

Features that can be used and tested:
  Login
  Signup

Persistence is built in and UI and terminal feedback is incorporated for all user actions


Part 2: Usage and Development Material

Source control and build process instructions:

Go to: https://github.com/musicApprentice/LanguageMasterSource
Download the repository as an offline copy
Open the folder in VS Code
In the terminal, ensure you are in the same directory as your folder
In the root directory run npm install
cd into the server directory
Run npm install
cd into the client directory
Run npm install
Back in the main directory: run npm start to start the entire application
[0]- indicates terminal messages from the backend
[1]- indicates terminal messages from the frontend
Bug Tracking:
Database access instructions: .
The data is stored in the cluster0 in the MongoDB. We have created several databases including UserData, and a database for each course. The following steps will help you to access our database successfully.

Follow Source control and build process above
In the “databaseUsers.js” in server directory, we have 2 active functions in total (the rest are just helpers

The function verifyTeacher: this function takes two arguments: teacherEmail, and password. This function will check whether the given information matches any data in our database. It returns the boolean value of whether it found a matching teacher user.

The function createTeacher: this function will return true if it successfully creates a student, and it will update the new teacher to the database. This function needs two supporting functions: checkValidityOfEmail and checkValidityOfPassword to make sure the given email and password are correct forms. If one of them is not valid, the function logs the message error.

To run these functions:
Option 1: run via server.test.js : This file is the place where we add tests for functions, so you could add your own test if you want. Run “npm run test”
Option 2: Call and execute the functions yourself: At the end of the file, you can simply write the order for which function you want to run: for example createTeacher(“FirstName”, “LastName”, “Email”, “Password”). Run “node function.js”
Remember: When you test the webpage, these functions are called as well
