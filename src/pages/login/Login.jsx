import React, { useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { auth } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("login succesful")
      navigate("/", { forceRefresh: true });
    } catch (error) {
      setError(true);
    }
  };

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      // Navigate to "/" after successful login
      navigate("/");
    }
  }, [currentUser, navigate]);


  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">WE Soc</h3>
          <span className="loginDesc">
            Connect with the world around you.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <div className="bottom">
              <form onSubmit={handleLogin} className="bottomBox">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="loginInput"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="loginInput"
                  minLength={6}
                  required
                />

                <button type="submit" className="loginButton">
                  Sign In
                </button>
                <Link to="/register">
                  <button className="loginRegisterButton">
                    Create a New Account
                  </button>
                </Link>
                {error && <span>Something went wrong</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
