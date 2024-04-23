import { Col } from 'react-bootstrap';
import class_bg from './class-bg.jpg';

const ClassCard = ({ title, onClassClick }) => {
  return (
    <Col xs={12} sm={6} md={4}>
      <div className="class-card-container" onClick={onClassClick}>
        <img className="class-bg" src={class_bg} alt={title} />
        <div className="class-txt">
          <h4 id="classPageTitle">{title}</h4>
        </div>
      </div>
    </Col>
  );
};

export default ClassCard;
