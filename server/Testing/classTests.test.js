//cd into server and run using "npx jest Testing/classTests"

const { MongoClient } = require('mongodb');
const { getClassesTeacher, getClassesStudent, enrollClass } = require('../src/classes.js');

jest.mock('mongoose');
const mongo = require('../src/classes.js');

describe('Class Management Tests', () => {
    describe('getClassesTeacher', () => {
        it('should return an array of classes for a teacher', async () => {
          const classes = await getClassesTeacher('johndoe@gmail.com');
          expect(Array.isArray(classes)).toBe(true);
        });
      
        it('should return an empty array if teacher does not exist', async () => {
          const classes = await getClassesTeacher('nonexistentteacher');
          expect(classes).toEqual([]);
        });
      });
      
     describe('getClassesStudent', () => {
        it('should return an array of classes for a student', async () => {
          const classes = await getClassesStudent('Stephen.Calderon@gmail.com');
          expect(Array.isArray(classes)).toBe(true);
        });
      
        it('should return an empty array if student does not exist', async () => {
          const classes = await getClassesStudent('nonexistentstudent');
          expect(classes).toEqual([]);
        });
      });
      
    describe('enrollClass', () => {
        it('enroll a student in a class not already enrolled', async () => {
            const email = "Troy.Briggs@yahoo.com";
            const className = "Latin281";
            const ID = "RXPILU";
            const result = await enrollClass(className, ID, email);
            expect(result).toBe(true);
        });
    });

    describe("getStudentsInClass", () => {
        it("Gets students from existing class", async () => {
          const students = await mongo.getStudentsInClass("Chinese671_JPYVGX");
          expect(students.length).toEqual(2);
          expect(students.map(e => e.email)).toEqual(["Michael.Hinton@gmail.com", "Mark.Wilson@yahoo.com"]);
        });
      
        it("Throws an error with a non-existent class", async () => {
          console.log = jest.fn();
          await mongo.getStudentsInClass("ABCD");
          expect(console.log).toHaveBeenCalledWith("Class does not exist");
        });
      
        it("Returns an empty list for an empty class", async () => {
          expect(await mongo.getStudentsInClass("English235_JHBWXD")).toEqual([]);
        });
      });
      
      describe("getTeachersInClass", () => {
        it("Gets teachers from existing class", async () => {
          const teachers = await mongo.getTeachersInClass("Chinese671_JPYVGX");
          expect(teachers.length).toEqual(1);
          expect(teachers[0].email).toEqual("Stephen.Calderon@gmail.com");
        });
      
        it("Throws an error with a non-existent class", async () => {
          console.log = jest.fn();
          await mongo.getTeachersInClass("ABCD");
          expect(console.log).toHaveBeenCalledWith("Class does not exist");
        })
      })

      describe('this suit will test the function createClass',() =>{
        it('Add a class to a given teacher, and vice versa. In this case, the class already existed', async() => {
          const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
          const client = new MongoClient(connectionString);
          const email = "jyhuang@umass.edu";
          const className ="Vietnamese219_VJTCBB"; 
        await createClass(className, email);
        await client.connect();
          db = client.db("UserData");
          db1 = client.db(className);
          col = await db.collection("teachers");
          col1 = await db1.collection("teachers");
        const testTeacher = (await col.find({email: email}).toArray())[0].courseList.indexOf(className);
        const testClassDataBase = await col1.find({email:email}).toArray();
        expect(testTeacher).toBeGreaterThan(-1);
        expect(testClassDataBase.length).toBeGreaterThan(0);
        });
      
        // test case 2
        
        it('Add a class to a given teacher, and vice versa. In this case, the class does not exist', async() => {
          
          const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
          const client = new MongoClient(connectionString);
          await client.connect();
          const email = "jyhuang@umass.edu";
          const className ="LeageOfLegend_101";
        await createClass(className, email);
         db = client.db("UserData");
          col = await db.collection("teachers");
          const testTeacher = (await col.find({email: email}).toArray())[0].courseList.indexOf(className);
        
        //const testClassDataBase = await col1.find({email:email}).toArray();
        //await client.close();
        expect(testTeacher).toBeGreaterThan(-1);
        });
      });
      
      describe('this suit will test the function Enroll Class',() =>{
        it('Add a class to a given student course, and vice versa. In this case, the class is not in the student course yet', async() => {
          const connectionString = "mongodb+srv://mkandeshwara:0CgF5I8hwXaf88dy@cluster0.tefxjrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
          const client = new MongoClient(connectionString);
          try{
          const email = "Troy.Briggs@yahoo.com";
          const className ="Latin281";
          const ID = "RXPILU";
          const class_Full_Name = className + "_" + ID;
        await enrollClass(className, ID, email);
        await client.connect();
        // Test the class is added to student's collection in UserData
          db = client.db("UserData");
          col = await db.collection("students");
        const test_student_course_list = (await col.find({email: email}).toArray())[0].courseList.indexOf(class_Full_Name);
        expect(test_student_course_list).toBeGreaterThan(-1);
        // Test the student is added to class's student's collection
        db1 = client.db(class_Full_Name);
        col1 = await db1.collection("students");
        const test_student_list = await col1.find({email: email}).toArray();
        expect(test_student_list.length).toEqual(1);
          }
          catch(error){
            throw (error);
          }
          finally{
            await client.close();
          }
        });
      });
     
});
