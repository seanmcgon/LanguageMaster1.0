import { useState } from "react";
import "./CreateAssignment.css";

function CreateAssignment({ onBack, onCreateAssignment }) {
    const [assignFields, setAssignFields] = useState([
        { wordName: "", englishTranslation: "", audioFile: "" },
    ]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState(""); // State to store the error message

    const handleFormChange = (event, index) => {
        let data = [...assignFields];
        data[index][event.target.name] = event.target.value;
        setAssignFields(data);
        if (error) setError(""); // Clear error when the user is correcting input
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        if (error) setError(""); // Clear error when the user is correcting input
    };

    const submit = (e) => {
        e.preventDefault(); // Prevent form from submitting via HTTP request
        
        // Check if all required fields are filled
        const allFieldsComplete = assignFields.every(field => 
            field.wordName && field.englishTranslation
        );
        
        if (!allFieldsComplete) {
            setError("Please fill out all word and translation fields.");
            return;
        }

        if (onCreateAssignment) {
            onCreateAssignment({ title, assignFields });
        }
    };

    const addFields = () => {
        setAssignFields([...assignFields, { wordName: "", englishTranslation: "", audioFile: "" }]);
    };

    const removeFields = (index) => {
        let data = [...assignFields];
        data.splice(index, 1);
        setAssignFields(data);
    };

    return (
        <div className="CreateAsgmts container d-flex justify-content-center">
            <h1 id="assignmentTitle">Create Assignment</h1>
            <form onSubmit={submit}>
                <div className="form-group">
                    <button type="button" onClick={onBack} className="backButtonCreate">Back to Assignments</button>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Assignment Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter assignment title"
                    />
                </div>
                {assignFields.map((form, index) => (
                    <div key={index} className="card-entry">
                        <span className="card-number">{index + 1}.</span>
                        <div className="input-group">
                            <input
                                className="form-control"
                                name="wordName"
                                placeholder="Word"
                                value={form.wordName}
                                onChange={(event) => handleFormChange(event, index)}
                            />
                            <input
                                className="form-control"
                                name="englishTranslation"
                                placeholder="Translation"
                                value={form.englishTranslation}
                                onChange={(event) => handleFormChange(event, index)}
                            />
                            <input
                                type="file"
                                name="audioFile"
                                className="form-control-file"
                                onChange={(event) => handleFormChange(event, index)}
                            />
                            <button type="button" className="removeCardButton" onClick={() => removeFields(index)}>Remove</button>
                        </div>
                    </div>
                ))}
                <div className="d-flex justify-content-center">
                    <button type="button" className="addCard btn btn-outline-secondary" onClick={addFields}>Add Card</button>
                    <button type="button" className="submitNewAssignment btn btn-primary" onClick={submit}>Create Assignment</button>
                </div>
                {error && <p className="text-center text-danger">{error}</p>} {/* Display error message */}
            </form>
        </div>
    );
}

export default CreateAssignment;
