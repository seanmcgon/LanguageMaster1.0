import { useState } from "react";
import "./CreateAssignment.css";

function CreateAssignment({ onBack }) {
    const [assignFields, setAssign] = useState([
        { wordName: "", englishTranslation: "", audioFile: "" },
    ]);
    const [title, setTitle] = useState("");

    const handleFormChange = (event, index) => {
        let data = [...assignFields];
        data[index][event.target.name] = event.target.value;
        setAssign(data);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        console.log({ title, assignFields });
    };

    const addFields = () => {
        setAssign([...assignFields, { wordName: "", englishTranslation: "", audioFile: "" }]);
    };

    const removeFields = (index) => {
        let data = [...assignFields];
        data.splice(index, 1);
        setAssign(data);
    };

    return (
        <>
            <div className="CreateAsgmts container d-flex justify-content-center">
            <h1 id="assignmentTitle">Create Assignment</h1>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <button onClick={onBack} className="backButtonCreate">Back to Assignments</button>
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
                        <button className="addCard btn btn-outline-secondary" onClick={addFields}>Add Card</button>
                        <button className="submitNewAssignment btn btn-primary" onClick={submit}>Create Assignment</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateAssignment;
