import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import ClassCard from './ClassCard';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

import './ClassMenu.css';

function ClassMenu({ classes, onClassClick }) {
  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? 'animate__animated animate__fadeIn' : ''}>
                  <h2 className="enrolledClass">Enrolled Classes</h2>
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab" />
                    <Tab.Content id="slideInUp" className={isVisible ? 'animate__animated animate__slideInUp' : ''}>
                      {classes.length > 0 ? (
                        <Tab.Pane eventKey="first">
                          <Row>
                            {classes.map((className, index) => (
                              <ClassCard key={index} title={className} onClassClick={() => onClassClick(className)} />
                            ))}
                          </Row>
                        </Tab.Pane>
                      ) : (
                        <div className="no-classes-message">
                          No classes yet
                        </div>
                      )}
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
