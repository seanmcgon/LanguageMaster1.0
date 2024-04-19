import { Col } from "react-bootstrap";
import class_bg from "./class-bg.jpg";

const ClassCard = ({ title, link, onClassClick }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div className="class-card-container" onClick={onClassClick}> {/* Add onClick handler here */}
        <img
          className="class-bg" 
          src={class_bg}
          alt=""
        />
        <div className="class-txt">
          <h4 id = "classPageTitle">{title}</h4>
        </div>
      </div>
    </Col>
  );
};
export default ClassCard;
