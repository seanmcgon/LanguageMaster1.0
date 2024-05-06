const { MongoClient } = require('mongodb');
const request = require('supertest');
// const app = require('../index.js');
const { createTeacher, createStudent, verifyTeacher, verifyStudent } = require('../src/userAccounts.js');
const connectionString = "mongodb+srv://mkandeshwara:1234@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(connectionString);

jest.mock('mongoose');
const mongo = require('../src/userAccounts.js');

describe('User Verification Tests', () => {
    describe('createTeacher', () => {
        it('Test existing teacher by his email and different password', async () => {
            const firstName = "huy";
            const lastName = "Gu";
            const email = "huyGu@gmail.com";
            const password = "password";
        
            await createTeacher(firstName, lastName, email, password);
            let result = await verifyTeacher(email, 'notThePassword');
            expect(result).toEqual(false);
        }, 100000);
    });
    
    describe('verifyTeacher', () => {
        it('Test existing teacher ', async () => {
            const email = "Stephen.Calderon@gmail.com";
            const password = "OqzGbcWE";
            let result = await verifyTeacher(email, password);
            expect(result).toEqual(true);
        });

        it('Test existing teacher with wrong email', async () => {
            const email = "JamesMoore@gmail.com";
            const password = "wemKmhTh";
            let result = await verifyTeacher(email, password);
            expect(result).toEqual(false);
        });

        it('Test existing teacher with wrong email and password', async () => {
            const email = "JamesMoore@gmail.com";
            const password = "wemKmh";
            let result = await verifyTeacher(email, password);
            expect(result).toEqual(false);
        });
    });

    describe('verifyStudent', () => {
        it('Test existing student ', async () => {
            const email = "Antonio.Greene@yahoo.com";
            const password = "AdjgpXiY";
            let result = await verifyStudent(email, password);
            expect(result).toEqual(true);
        });

        it('Test existing student with wrong email', async () => {
            const email = "CatherineFreeman@yahoo.com";
            const password = "NXnXBVDt";
            let result = await verifyTeacher(email, password);
            expect(result).toEqual(false);
        });

        it('Test existing teacher with wrong email and password', async () => {
            const email = "CatherineFreeman@yahoo.com";
            const password = "NragBVDt";
            let result = await verifyTeacher(email, password);
            expect(result).toEqual(false);
        });
    });    

    describe('createStudent', () => {
        it('Inserts student if student is not in db', async () => {
          // Check that if the insertion was successful, which it should be here, then the return value is correct
          expect(await createStudent("Maya", "Kandeshwarath", "mkandeshwarath@umass.edu", "1324")).toEqual(true);
          try{
            // connect to the db, get the inserted document and check that all the fields are correct
            await client.connect();
            const ret = await client.db("UserData").collection("students").find({email: "mkandeshwarath@umass.edu"}).toArray();
            expect(ret.length).toEqual(1);
            expect(ret[0].name).toEqual("Maya Kandeshwarath");
            expect(ret[0].email).toEqual("mkandeshwarath@umass.edu");
            expect(ret[0].password).toEqual("1324");
            expect(ret[0].courseList).toEqual([]);
            // Remove the document from the db
            await client.db("UserData").collection("students").deleteOne({email: "mkandeshwarath@umass.edu"});
          }
          finally{
             await client.close();
          }
    
        });
    
        it("Doesn't insert if the email is already in the db", async () => {
          console.log = jest.fn();
          expect(await createStudent("Dua", "Aegah", "Antonio.Greene@yahoo.com", "weaghwha")).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Student already exists!");
        });
    
        it("Doesn't insert if the email format is incorrect", async () => {
          console.log = jest.fn();
          expect(await createStudent("Dua", "Aegah", "relwargg", "weaghwha")).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Email is invalid");
        });
    
        it("Doesn't insert if the password format is incorrect", async () => {
          console.log = jest.fn();
          expect(await createStudent("Dua", "Aegah", "lawdla@dalkf.com", "aaaaaaaaaaaaaaaaaaaa")).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Password is invalid");
        });
    
        it("Doesn't insert if the email and password format are incorrect", async () => {
          console.log = jest.fn();
          expect(await createStudent("Dua", "Aegah", "lawdladalkf", "aaaaaaaaaaaaaaaaaaaa")).toEqual(false);
          expect(console.log).toHaveBeenCalledWith("Both email and password are invalid");
        });
      });
});
