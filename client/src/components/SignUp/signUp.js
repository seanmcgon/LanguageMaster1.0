// Subcomponents
import SignUpForm from "./SignUpForm.js";
// CSS file
import "./signUp.css";

// Button for opening Sign Up Modal
let openButton = (
  <button
    type="button"
    className="login-button1"
    data-bs-toggle="modal"
    // Unique ID for the Sign Up modal
    data-bs-target="#SignUpForm"
  >
    Sign Up
  </button>
);

// Main Function
function SignUpModal(props) {
  return (
    <>
      {openButton}
      <div
        className="modal fade"
        id="SignUpForm" // Updated ID
        tabIndex="-1"
        aria-labelledby="ModalFormLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-body">
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
              <SignUpForm onLoginSuccess={props.onLoginSuccess}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpModal;
