import React from "react";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import "./classAsgmts.css";

export default function ClassAsgmts({ className, asgmts, onAssignmentClick, onBack, onCreateAssignmentClick }) {
  return (
    <div id="classAsgmtsBody">
      <button onClick={onBack} class= "backButtonAssView" style={{ margin: '10px' }}>Back to Class View</button>
      <div id="classHeading">
        <h1 id="nameOfClass">{className}</h1>
      </div>
      <br />
      <div id="asgmtsHeaderContainer">
        <div
          className="btn btn-primary createAssignment"
          onClick={onCreateAssignmentClick}  // Now correctly linked to the prop
        >
          Create Assignment
        </div>
        {/* <div className="btn btn-primary createAssignment">
          View Students in Class
        </div> */}
        {/* <h3 id="asgmtsHeader">Assignments:</h3> */}
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

