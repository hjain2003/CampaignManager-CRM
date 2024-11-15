import React, { useState } from "react";
import "./Login.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import xenologo from "../../xenologo.png";
import customerimg from '../../customersphoto.png'
import { useNavigate } from "react-router-dom";
import filterimg from '../../gold.png'

const Login = () => {
    // console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (response) => {
    const { credential } = response; // This is the Google ID token
    setIsLoading(true);

    try {
      // Send token to backend
      const res = await axios.post(
        "http://localhost:5000/user/login",
        { token: credential },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = res.data.user;

      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify({
        username: userData.username,
        email: userData.email,
        googleIdToken: userData.googleIdToken,
        googleAccessToken: userData.googleAccessToken,
        profilePic: userData.profilePic || "", 
      }));

      // console.log("User data stored in localStorage:", userData);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="big_login_div">
      <div className="left_login_div">
        <div className="image_heading">
          <img src={xenologo} alt="Logo" /> &nbsp;&nbsp;<b>XENO CRM</b>{" "}
        </div>
        <br />
        <br />
        <b className="left_shift">Xeno Authorized Employees Only</b>
        <span className="please_login">
          <b>Please login into your account</b>
        </span>
        <br />
        <br />
        <div className="login_container">
          <label>Email</label>
          <input type="email" placeholder="Enter your company email" />
          <br />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />
          <span className="forgot">
            <b>Forgot Password?</b>
          </span>
          <br />
          <br />
          <button id="login_btn">LOGIN</button>
          <br />
          <br />
          <hr />
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div id="gauth" className="google-login-button">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                className="google-login-button"
              />
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>

      <div className="right_login_div">
      <div className="r_content">

      <h2>Empowering Business with Smarter Customer Connections</h2>
      <br/>
      <span>Simply your workday with Xeno CRM -- manage customer interactions, track campaigns, and<br/> collaborate seamlessly to boost productivity and success</span>
      <br/><br/><br/><br/><br/>
      <div className="image_container">
        <img src={filterimg}/>
      </div>
      </div>
      </div>

      {/* Show Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="spinner"></div> {/* Spinner or any loading indicator */}
          {/* <p>Loading...</p> */}
        </div>
      )}
    </div>
  );
};

export default Login;
