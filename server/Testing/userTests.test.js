const { MongoClient } = require('mongodb');
const request = require('supertest');
const app = require('../index.js');
const { createTeacher, createStudent, verifyTeacher, verifyStudent } = require('../src/userAccounts.js');

jest.mock('mongoose');
const mongo = require('../src/userAccounts.js');

describe('User Verification Tests', () => {
    describe('the function should add new teacher', () => {
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
            const email = "jyhuang@umass.edu";
            const password = "Test";
            let result = await mongo.verifyTeacher(email, password);
            expect(result).toEqual(true);
        });

        it('Test existing teacher with wrong email', async () => {
            const email = "JamesMoore@gmail.com";
            const password = "wemKmhTh";
            let result = await mongo.verifyTeacher(email, password);
            expect(result).toEqual(false);
        });

        it('Test existing teacher with wrong email and password', async () => {
            const email = "JamesMoore@gmail.com";
            const password = "wemKmh";
            let result = await mongo.verifyTeacher(email, password);
            expect(result).toEqual(false);
        });
    });

    describe('createStudent', () => {
        it('Inserts student if student is not in db', async () => {
            expect(await mongo.createStudent("Maya", "Kandeshwarath", "mkandeshwarath@umass.edu", "1324")).toEqual(true);
        });

        it("Doesn't insert if the email is already in the db", async () => {
            console.log = jest.fn();
            expect(await mongo.createStudent("Dua", "Aegah", "Antonio.Greene@yahoo.com", "weaghwha")).toEqual(false);
            expect(console.log).toHaveBeenCalledWith("Student already exists!");
        });
    });
});
