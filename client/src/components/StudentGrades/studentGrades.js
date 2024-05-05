import React from 'react';
import './studentGrades.css';

export default function StudentGrades({ lessonName, onBack, studentGrades }) {
//   const studentGrades = [
//     { studentName: 'Suhani', wordName: 'Apple', englishTranslation: 'Apple', grade: 20 },
//     { studentName: 'Jason', wordName: 'Apple', englishTranslation: 'Apple', grade: 70 },
//     { studentName: 'Bach', wordName: 'Apple', englishTranslation: 'Apple', grade: 85 },
//     { studentName: 'Suhani', wordName: 'Banana', englishTranslation: 'Banana', grade: 30 },
//     { studentName: 'Jason', wordName: 'Banana', englishTranslation: 'Banana', grade: 60 },
//     { studentName: 'Bach', wordName: 'Banana', englishTranslation: 'Banana', grade: 90 },
//     { studentName: 'Suhani', wordName: 'Orange', englishTranslation: 'Orange', grade: 40 },
//     { studentName: 'Jason', wordName: 'Orange', englishTranslation: 'Orange', grade: 50 },
//     { studentName: 'Bach', wordName: 'Orange', englishTranslation: 'Orange', grade: 80 },
//   ];

  // Transpose the data
  const terms = [...new Set(studentGrades.map(grade => grade.wordName))];
  const translations = [...new Set(studentGrades.map(grade => grade.englishTranslation))];
  const studentNames = [...new Set(studentGrades.map(grade => grade.studentName))];
  const transposedData = terms.map((term, index) => ({
    term,
    translation: translations[index],
    ...studentNames.reduce((acc, studentName) => {
      acc[studentName] = studentGrades.find(grade => grade.wordName === term && grade.studentName === studentName).grade;
      return acc;
    }, {}),
  }));

  return (
    <div className="viewStudentGrades">
      <button onClick={onBack} className="backButton">Back to Assignment</button>

      <h1 className="lessonName">{lessonName} - Student Grades</h1>
      <div className="tableContainer">
        <table className="gradesTable">
          <thead>
            <tr>
              <th>Term</th>
              <th>Translation</th>
              {studentNames.map(studentName => (
                <th key={studentName}>{studentName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transposedData.map((row, index) => (
              <tr key={index}>
                <td>{row.term}</td>
                <td>{row.translation}</td>
                {studentNames.map(studentName => (
                  <td key={studentName}>{row[studentName]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
