import React from 'react';
import './viewStudentGrades.css'; 

export function ViewStudentGrades({ lessonName, onBack }) {  //not sure how getting data from the backend hence creating dummy data
  const studentGrades = [
    { studentName: 'Suhani', wordName: 'Apple', englishTranslation: 'Apple', grade: 20 },
    { studentName: 'Jason', wordName: 'Banana', englishTranslation: 'Banana', grade: 70 },
    { studentName: 'Bach', wordName: 'Orange', englishTranslation: 'Orange', grade: 85 },
  ];
    return (
        <div className="viewStudentGrades">
            <button onClick={onBack} className="backButton">Back to Assignments</button>

            <h1 className="lessonName">{lessonName}</h1>
            <div className="tableContainer">
                <table className="gradesTable">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Term</th>
                            <th>Translation</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentGrades.map((student, index) => (
                            <tr key={index}>
                                <td>{student.studentName}</td>
                                <td>{student.wordName}</td>
                                <td>{student.englishTranslation}</td>
                                <td>{student.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}