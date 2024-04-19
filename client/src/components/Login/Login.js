import LoginForm from "./LoginForm.js";
import "./Login.css";
import Bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

function LoginModal(props) { // Accept props here

  const handleSignUpInstead = () => {
    // Hide the current Login modal
    const loginModal = Bootstrap.Modal.getInstance(document.getElementById('LoginForm'));
    loginModal.hide();

    // Show the SignUp modal
    const signUpModal = new Bootstrap.Modal(document.getElementById('SignUpForm'));
    signUpModal.show();
  };

  return (
    <>
      <button
        type="button"
        className="login-button1"
        data-bs-toggle="modal"
        data-bs-target="#LoginForm"
      >
        Login
      </button>
      <div
        className="modal fade"
        id="LoginForm"
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
              <LoginForm onLoginSuccess={props.onLoginSuccess} />
              <button
                type="button"
                className="btn btn-link"
                onClick={handleSignUpInstead}
              >
                Sign Up Instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginModal;
