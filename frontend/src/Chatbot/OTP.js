import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./style.css";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

import app from "../firebaseOTP";
const auth = getAuth(app);

const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

const OTP = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpsent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(true);
  const history = useHistory();
  const onCaptchaVerify = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal",
        callback: (response) => {
          onSignInSubmit();
        },
        "expired-callback": () => {},
      },
      auth
    );
  };
  const handleRequestOTP = (e) => {
    e.preventDefault();
    onSignInSubmit();
  };
  const onSignInSubmit = () => {
    onCaptchaVerify();
    const phone = "+91" + phoneNumber;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log(window.confirmationResult);
        setVisible(false);
        setOtpSent(true);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error.message);
      });
  };
  const handleSubmitOTP = (e) => {
    e.preventDefault();
    const otp = code;
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        const u = result.user;
        const id = generateUniqueId();
        history.push(`/chatbot/${id}`);
      })
      .catch((error) => {
        alert("Invalid");
      });
  };
  return (
    <div className="not-verified">
      <h1>STACK OVERFLOW CHATBOT</h1>
      <div className="recaptcha">
        {visible && <div id="recaptcha-container"></div>}
        {<p className="error">{error}</p>}
      </div>
      <form className="OTP-Form">
        <div className="OTP-number">
          {!otpsent && (
            <div className="input">
              <label className="label">Enter your Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                className="code-phone"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button onClick={handleRequestOTP} className="send-otp">
                Send OTP
              </button>
            </div>
          )}
          {otpsent && (
            <>
              <label className="label">Enter the OTP</label>
              <input
                type="text"
                value={code}
                className="code-phone"
                onChange={(e) => setCode(e.target.value)}
              />
              <button onClick={handleSubmitOTP} className="send-otp">
                Verify
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default OTP;
