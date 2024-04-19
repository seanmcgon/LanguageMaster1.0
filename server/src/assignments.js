const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');

const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);

function checkValid(className) {
    const regex = /^[^ ]+\_[^ ]{1,6}$/;
    if (className.match(regex)) {
        return true;
    }
    return false;
}

async function createAssignment(className, assignmentName, assignmentArray) {
    let createdAssignment = false;
    try {
        await client.connect();
        const db = client.db(className);
        const col = db.collection("assignments");
        if ((await col.find({ assignment: assignmentName }).toArray()).length === 0 && assignmentArray.length > 0) {
            for (const flashcard of convertAssignmentToDtbForm(assignmentName, assignmentArray)) {
                await col.insertOne(flashcard);
            }
            createdAssignment = true;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return createdAssignment;
}

function convertAssignmentToDtbForm(assignmentName, assignmentArray) {
    return assignmentArray.map((flashcard, index) => ({
        assignment: assignmentName,
        card: index,
        text: flashcard.text,
        translation: flashcard.translation,
        audio: flashcard.audio
    }));
}

async function addToAssignment(className, assignmentName, card) {
    let inserted = false;
    try {
        await client.connect();
        const db = client.db(className);
        const col = db.collection("assignments");
        const cardNum = (await col.find({ assignment: assignmentName }).toArray()).length;
        await col.insertOne({ assignment: assignmentName, card: cardNum, ...card });
        inserted = true;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return inserted;
}

async function viewAssignment(className, assignmentName) {
    let cards = [];
    try {
        await client.connect();
        const db = client.db(className);
        const col = db.collection("assignments");
        cards = await col.find({ assignment: assignmentName }).toArray();
        if (cards.length === 0) {
            throw("Assignment does not exist");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return cards.map(e => ({ text: e.text, translation: e.translation, audio: e.audio }));
}

async function deleteAssignment(className, assignmentName) {
    try {
        await client.connect();
        const db = client.db(className);
        const col = db.collection("assignments");
        if ((await col.find({ assignment: assignmentName }).toArray()).length > 0) {
            await col.deleteMany({ assignment: assignmentName });
            console.log("The assignment has been deleted");
        } else {
            throw("Assignment does not exist");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

module.exports = {
    createAssignment, addToAssignment, viewAssignment, deleteAssignment, convertAssignmentToDtbForm
};
