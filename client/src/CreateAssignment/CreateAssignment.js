import { useState } from "react";

function CreateAssignment() {
  // Hook for list of cards
  const [assignFields, setAssign] = useState([
    { wordName: "", englishTranslation: "", audioFile: "" },
  ]);
  // State for assignment title
  const [title, setTitle] = useState("");

  // Update form as user input
  const handleFormChange = (event, index) => {
    let data = [...assignFields];
    data[index][event.target.name] = event.target.value;
    setAssign(data);
  };

  // Handle title change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  //TODO: Handle submission for backend
  const submit = (e) => {
    e.preventDefault();
    console.log({ title, assignFields });
  };

  // Add a card
  const addFields = () => {
    let object = {
      wordName: "",
      englishTranslation: "",
      audioFile: "",
    };
    setAssign([...assignFields, object]);
  };

  // Remove a card
  const removeFields = (index) => {
    let data = [...assignFields];
    data.splice(index, 1);
    setAssign(data);
  };

  // Main component
  return (
    <>
      <div className="CreateAsgmts container d-flex justify-content-center">
        <form onSubmit={submit}>
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
            <div key={index} className="row">
              <div className="form-group col-md-4">
                <input
                  className="form-control"
                  name="wordName"
                  placeholder="Word"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.wordName}
                />
              </div>
              <div className="form-group col-md-4">
                <input
                  className="form-control"
                  name="englishTranslation"
                  placeholder="Translation"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.englishTranslation}
                />
              </div>
              <div className="form-group col-md-4">
                <label>Choose Audio File</label>
                <input
                  type="file"
                  name="audioFile"
                  className="form-control-file"
                  id={`audioFile${index}`}
                  onChange={(event) => handleFormChange(event, index)}
                />
              </div>
              <div className="form-group col-md-4">
                <button type="button" onClick={() => removeFields(index)}>Remove Card</button>
              </div>
            </div>
          ))}
        </form>
      </div>
      <div className="d-flex justify-content-center">
        <button onClick={addFields}>Add Cards</button>
        <br />
        <button onClick={submit}>Submit</button>
      </div>
    </>
  );
}

export default CreateAssignment;
