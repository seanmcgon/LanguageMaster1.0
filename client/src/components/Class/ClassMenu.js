import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import ClassCard from "./ClassCard";
import "animate.css";
import TrackVisibility from "react-on-screen";
import ClassObj from "./Class";

import "./ClassMenu.css";
function ClassMenu(props) {
  const { classes, onClassClick } = props; // Receive the onClassClick function as a prop

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2 class = "enrolledClass" >Enrolled Classes</h2>
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    </Nav>
                    <Tab.Content
                      id="slideInUp"
                      className={
                        isVisible ? "animate__animated animate__slideInUp" : ""
                      }
                    >
                      <Tab.Pane eventKey="first">
                        <Row className="ClassCard">
                          {classes.map((cl, index) => (
                            <ClassCard key={index} {...cl} onClassClick={() => onClassClick(cl.title)} />
                          ))}
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
}


export default ClassMenu;
