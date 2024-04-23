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
        text: flashcard.wordName,  // Changed from flashcard.text to flashcard.wordName
        translation: flashcard.englishTranslation,  // Changed from flashcard.translation to flashcard.englishTranslation
        audio: flashcard.audioFile  // Changed from flashcard.audio to flashcard.audioFile
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

async function getAllAssignments(className) {
    let assignmentSummary = [];
    try {
        await client.connect();
        const db = client.db(className);
        const col = db.collection("assignments");

        // Aggregation pipeline to group by assignment and count terms
        assignmentSummary = await col.aggregate([
            {
                $group: {
                    _id: "$assignment",  // Grouping by the assignment name
                    termCount: { $count: {} }  // Counting the number of documents (cards) in each group
                }
            },
            {
                $project: {
                    _id: 0, // Excluding the _id from the results
                    name: "$_id", // Mapping the _id (which is the assignment name) to 'name'
                    termCount: 1 // Including the term count
                }
            }
        ]).toArray();

        if (assignmentSummary.length === 0) {
            throw new Error("No assignments found");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return assignmentSummary;
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
    return cards.map(e => ({ wordName: e.text, englishTranslation: e.translation, audioFile: e.audio }));
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
    createAssignment, addToAssignment, viewAssignment, deleteAssignment, getAllAssignments
};
