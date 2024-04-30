import React from "react";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import "./classAsgmts.css";

export default function ClassAsgmts({ className, asgmts, onAssignmentClick, onBack, onCreateAssignmentClick, isTeacher }) {
  return (
    <div id="classAsgmtsBody">
      <button onClick={onBack} className="backButtonAssView" style={{ margin: '10px' }}>Back to Class View</button>
      <div id="classHeading">
        <h1 id="nameOfClass">{className}</h1>
      </div>
      <br />
      <div id="asgmtsHeaderContainer">
        {isTeacher && (
          <div
            className="btn btn-primary createAssignment"
            onClick={onCreateAssignmentClick}  // Button shows only if isTeacher is true
          >
            Create Assignment
          </div>
        )}
        {/* Additional buttons or features for teachers can be conditionally rendered here */}
      </div>
      <div id="asgmtsBody">
        {asgmts.length > 0 ? (
          <div id="asgmtsGrid">
            <Row xs={1} md={3} className="g-4">
              {asgmts.map((asgmt, idx) => (
                <Col key={idx} onClick={() => onAssignmentClick(asgmt.name)}>
                  <Card
                    text="white"
                    style={{ cursor: "pointer" }}
                    className="custom-card"
                  >
                    <Card.Body>
                      <Card.Title>{asgmt.name}</Card.Title>
                      <Card.Text className="termCount">
                        {asgmt.termCount} terms
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div>
            <p>No current assignments</p>
          </div>
        )}
      </div>
    </div>
  );
}
