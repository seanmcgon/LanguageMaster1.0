const { assert } = require('console');
const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');

const connectionString = "mongodb+srv://mkandeshwara:1234@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(connectionString);

// Quoc
function checkValidityOfEmail(emailAddress) {
    const regex = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (emailAddress.match(regex)) {
        return true;
    }
    return false;
}

// Quoc
function checkValidityOfPassword(password) {
    const regex = /^[^ ]{2,15}$/;
    if (password.match(regex)) {
        return true;
    }
    return false;
}

// Quoc
async function verifyTeacher(teacherEmail, password) {
    if (!password) {
      return false;
    }
    try {
      await client.connect();
      const db = client.db("UserData");
      const col = db.collection("teachers");
      const result = await col.findOne({ email: teacherEmail, password: password });
      await client.close();
      return result !== null;
    } catch (error) {
      console.error('Error in verifyTeacher:', error);
      await client.close();
      return false;
    } finally {
      await client.close();
    }
}

// Quoc
async function verifyStudent(studentEmail, password) {
    if (!password) {
      return false;
    }
    try {
      await client.connect();
      const db = client.db("UserData");
      const col = db.collection("students");
      const result = await col.findOne({ email: studentEmail, password: password });
      await client.close();
      return result !== null;
    } catch (error) {
      console.error('Error in verifyStudent:', error);
      await client.close();
      return false;
    } finally {
      await client.close();
    }
}

// Quoc
async function createTeacher(firstName, lastName, teacherEmail, password) {
    let createdTeacher = false;
    const re = verifyTeacher(teacherEmail.trim(), password.trim());
    let boo = await re;
    if (!boo) {
        await client.connect();
        const db = client.db("UserData");
        const col = await db.collection("teachers");
        const doubleE = await col.find({ email: teacherEmail }).toArray();
        const booE = checkValidityOfEmail(teacherEmail);
        const booP = checkValidityOfPassword(password);
        let courses = [];

        if (booE && booP && doubleE.length !== 1) {
            const result = { name: `${firstName.trim()} ${lastName.trim()}`, email: teacherEmail.trim(), password: password.trim(), courseList: courses };
            await col.insertOne(result);
            createdTeacher = true;
            console.log("Successfully created new teacher");
        }

        await client.close();
    }
    return createdTeacher;
}

// Maya
async function createStudent(firstName, lastName, studentEmail, password) {
    let inserted = false;
    try {
        await client.connect();
        let db = client.db("UserData");
        let col = db.collection("students");
        if ((await col.find({ email: studentEmail.trim() }).toArray()).length === 0) {
            let validEmail = checkValidityOfEmail(studentEmail.trim());
            let validPass = checkValidityOfPassword(password.trim());
            if (validEmail && validPass) {
                await col.insertOne({ name: firstName.trim() + " " + lastName.trim(), email: studentEmail.trim(), password: password.trim(), courseList: [] });
                inserted = true;
            } else if (!validEmail && validPass) {
                throw("Email is invalid");
            } else if (validEmail && !validPass) {
                throw("Password is invalid");
            } else {
                throw("Both email and password are invalid");
            }
        } else {
            throw("Student already exists!");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return inserted;
}


module.exports = {
    createTeacher, createStudent, verifyTeacher, verifyStudent
};
