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

async function getStudentsInClass(className) {
    let students = [];
    try {
        await client.connect();
        let db = client.db(className);
        const teachers = await db.collection("teachers").find().toArray();
        if (teachers.length === 0) {
            throw("Class does not exist");
        } else {
            let col = db.collection("students");
            students = await col.find().toArray();
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return students;
}

async function getTeachersInClass(className) {
    let teachers = [];
    try {
        await client.connect();
        let db = client.db(className);
        let col = db.collection("teachers");
        teachers = await col.find().toArray();
        if (teachers.length === 0) {
            throw("Class does not exist");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
    return teachers;
}

async function createClass(className, teacherEmail) {
    try {
        await client.connect();
        db = client.db("UserData");
        col = await db.collection("teachers");
        const checkTheValidOfClassName = true
        if (checkTheValidOfClassName) {
            if ((await col.find({ email: teacherEmail }).toArray()).length > 1) {
                updateClassForGivenTeacher(col, teacherEmail, className);
                let getTeacherInfo = await col.find({ email: teacherEmail }).toArray();
                db1 = client.db(className);
                col1 = await db1.collection("teachers");
                if ((await col1.find({ email: teacherEmail }).toArray()).length === 0) {
                    await col1.insertOne(getTeacherInfo[0]);
                } else {
                    await col1.deleteOne({ email: teacherEmail });
                    await col1.insertOne(getTeacherInfo[0]);
                }
                return true;
            } else {
                throw("Teacher does not exist");
            }
        } else {
            throw("Invalid class name");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function updateClassForGivenTeacher(col, teacherEmail, className) {
    let courseL = await col.find({ email: teacherEmail }).toArray();
    let originalCourse = courseL[0].courseList;
    if (originalCourse.indexOf(className) === -1) {
        originalCourse.push(className);
    }
    await col.updateOne({ email: teacherEmail }, { $set: { courseList: originalCourse } });
}
async function getClassesTeacher(teacherEmail) {
    try {
      await client.connect();
      const db = client.db("UserData");
      const col = db.collection("teachers");
      const result = await col.findOne({email: teacherEmail.trim() });
      if (result) {
        await client.close();
        return result.courseList || [];
      } else {
        await client.close();
        return [];
      }
    } catch (error) {
      await client.close();
      return []

    }
  }
  
  async function getClassesStudent(studentEmail) {
    try {
      await client.connect();
      const db = client.db("UserData");
      const col = db.collection("students");
      const result = await col.findOne({email: studentEmail.trim() });
      if (result) {
        return result.courseList || [];
      } else {
        return [];
      }
    } finally {
      await client.close();
    }
  }

  async function enrollClass(className, classID, studentEmail) {
    try {
        await client.connect();
        db = client.db("UserData");
        col = await db.collection("students");
        const neededData = className + "_" + classID;
        if (checkValid(neededData)) {
            let student_Data = await col.find({ email: studentEmail }).toArray();
            let student_courses = student_Data[0].courseList;
            if (student_courses.indexOf(neededData) == -1) {
                student_courses.push(neededData);
                await col.updateOne({ email: studentEmail }, { $set: { courseList: student_courses } });
                db1 = client.db(neededData);
                col1 = await db1.collection("students");
                await col1.insertOne(student_Data[0]);
            } else {
                throw("The class already exists");
            }
        } else {
            throw("Invalid class");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}
module.exports = {
    enrollClass, getClassesStudent, getClassesTeacher, createClass, getStudentsInClass, getTeachersInClass, updateClassForGivenTeacher
};
