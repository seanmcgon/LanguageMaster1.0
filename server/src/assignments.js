const { MongoClient } = require('mongodb');
const { TextEncoder } = require('util');

const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
const client = new MongoClient(connectionString);

// Quoc
function checkValid(className) {
   const regex = /^[^ ]+\_[^ ]{1,6}$/;
    if (className.match(regex)) {
        return true;
    }
    return false;
}
// Shuto
async function createAssignment(className, assignmentName, assignmentArray) {
    let createdAssignment = false;
    try {
        await client.connect();
        const db = client.db(className);
        const col = db.collection("assignments");
        // Delete any duplicates from assignmentArray
        const uniqueArray = assignmentArray.reduce((acc, obj) => {
            if (!acc.some(item => JSON.stringify(item) === JSON.stringify(obj))) {
                acc.push(obj);
            }
            return acc;
        }, []);
        // Insert each card in the converted array if the assignment doesn't exist
        if ((await col.find({ assignment: assignmentName }).toArray()).length === 0 && uniqueArray.length > 0) {  
            const flashcards = convertAssignmentToDtbForm(assignmentName, uniqueArray);
            for (const flashcard of flashcards) {
                let cardNum = 0;
                await col.insertOne(flashcard);
            }
            createdAssignment = true;
        }
        if (createAssignment) {
            // Get all the students in the class
            let students = await db.collection("students").find().toArray();
            for (let i = 0; i < uniqueArray.length; i++) {
                // Create a blank grade for every students for every flashcard
                for (let j = 0; j < students.length; j++) {
                    await db.collection("metrics").insertOne({
                        studentEmail: students[j].email, assignment: assignmentName, card: i, timePracticed: 0, score: 0
                    });
                }
            }
        }

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return createdAssignment;
}

// Shuto
function convertAssignmentToDtbForm(assignmentName, assignmentArray) {
    return assignmentArray.map((flashcard, index) => ({
        assignment: assignmentName,
        card: index,
        text: flashcard.wordName,  // Changed from flashcard.text to flashcard.wordName
        translation: flashcard.englishTranslation,  // Changed from flashcard.translation to flashcard.englishTranslation
        audio: flashcard.audioFile  // Changed from flashcard.audio to flashcard.audioFile
    }));
}

// Maya
async function addToAssignment(className, assignmentName, card) {
    let inserted = false;
    try {
        await client.connect();
        const db = client.db(className);
        let col = db.collection("teachers");
        const teachers = await col.find().toArray();
        if(teachers.length === 0){
            throw("Class does not exist");
        }
        col = db.collection("assignments");
        const cardNum = (await col.find({ assignment: assignmentName }).toArray()).length;
        if(cardNum === 0){
            throw("Assignment does not exist");
        }
        await col.insertOne({ assignment: assignmentName, card: cardNum, ...card });

        col = db.collection("students");
        let students = await col.find().toArray();

        col = db.collection("metrics");

        for(let i = 0; i < students.length; i++){
            await col.insertOne({studentEmail: students[i].email, assignment: assignmentName, card: cardNum, timesPracticed: 0, score: 0});
        }

        inserted = true;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return inserted;
}

//Jason
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

// Maya
async function viewAssignment(className, assignmentName) {
    let cards = [];
    try {
        await client.connect();
        const db = client.db(className);
        let col = db.collection("teachers");
        const teachers = await col.find().toArray();
        // If there are no teachers assigned to the class, then it doesn't exist
        if(teachers.length === 0){
            throw("Class does not exist");
        }
        col = db.collection("assignments");
        cards = await col.find({ assignment: assignmentName }).toArray();
        if (cards.length === 0) {
            throw("Assignment does not exist");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    //Additional field- for each card also include the grade
    return cards.map(e => ({ wordName: e.text, englishTranslation: e.translation, audioFile: e.audio }));
}

// Quoc
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

// Quoc
async function deleteFromAssignment(className,assignmentName,flashcard_Object){
    try{
      await client.connect();
      if(checkValid(className)){
        db = client.db(className);
        col = await db.collection("assignments");
        const presence = await col.find({assignment: assignmentName}).toArray();
        if(presence.length >0){
          await col.deleteMany({$and: [{assignment: assignmentName},{text: flashcard_Object.text}, {translation: flashcard_Object.translation},{audio: flashcard_Object.audio}]})
        console.log("Done!!!");
        }
        else{
          throw("No data");
        }
      }
      else{
        throw("Invalid className");
      }

    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }

  }

//   Maya Kandeshwarath 4/30/2024
// Input: className: String, exact name of class in the database
//        assignmentName: String, exact name of assignment in the database
// Output: array of arrays, the sub arrays are the grades of the students
//         where each element is a grade for a single flashcard
async function getAllStudentData(className, assignmentName){
    let grades = [];
    try{
        await client.connect();
        let db = client.db(className);
        let col = db.collection("teachers");
        if((await col.find().toArray()).length === 0){
            throw("Class does not exist");
        }
        col = db.collection("metrics");
        if((await col.find({assignment: assignmentName}).toArray()).length === 0){
            throw("Assignment does not exist");
        }
        const pipeline = [
            {$match:{assignment: assignmentName}}, 
            {$group: 
                {_id: "$studentEmail", grades: 
                    {$push: {card: "$card", timesPracticed: "$timesPracticed", score: "$score"}}}}
        ]

        let g = await col.aggregate(pipeline);
        while(await g.hasNext()){
            grades.push(await g.next());
        }
    }
    catch(err){
        console.log(err);
    }
    finally{
        await client.close();
        return grades;
    }
}

// Sean 5/5: Dummy function for returning student grades in the form expected by Suhani's component
async function getStudentGrades(className, assignmentName) {
    return [
        { studentName: 'Suhani', wordName: 'Apple', englishTranslation: 'Apple', grade: 20 },
        { studentName: 'Jason', wordName: 'Apple', englishTranslation: 'Apple', grade: 70 },
        { studentName: 'Bach', wordName: 'Apple', englishTranslation: 'Apple', grade: 85 },
        { studentName: 'Suhani', wordName: 'Banana', englishTranslation: 'Banana', grade: 30 },
        { studentName: 'Jason', wordName: 'Banana', englishTranslation: 'Banana', grade: 60 },
        { studentName: 'Bach', wordName: 'Banana', englishTranslation: 'Banana', grade: 90 },
        { studentName: 'Suhani', wordName: 'Orange', englishTranslation: 'Orange', grade: 40 },
        { studentName: 'Jason', wordName: 'Orange', englishTranslation: 'Orange', grade: 50 },
        { studentName: 'Bach', wordName: 'Orange', englishTranslation: 'Orange', grade: 80 },
    ];
}

module.exports = {
    createAssignment, addToAssignment, viewAssignment, deleteAssignment, getAllAssignments, convertAssignmentToDtbForm,
    deleteFromAssignment, getAllStudentData, getStudentGrades
};

// db.metrics.aggregate([{$match:{assignment: "war"}}, {$group: {_id: "$studentEmail", grades: {$push: {card: "$card", timesPracticed: "$timesPracticed", score: "$score"}}}}])