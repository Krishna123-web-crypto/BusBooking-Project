import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/Signin.css";
import { AuthContext } from "./Context/AuthContext";
export default function SignIn() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const handleSendOtp = () => {
    if (phone) {
      setOtpSent(true);
      setTimer(60);
      alert("OTP sent to your phone (simulated)");
    } else {
      alert("Please enter phone number.");
    }
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    if (loginMethod === "email") {
      if (email && password) {
        login({ email });
        alert(`Signed in with Email: ${email}`);
        navigate("/");
      } 
      else {
        alert("Please enter both email and password.");
      }
    } 
    else {
      if (!otpSent) {
        handleSendOtp();
      } else {
        if (otp === "1234") {
          login({ phone });
          alert(`Signed in with Phone: ${phone}`);
          navigate("/");
        } 
        else {
          alert("Invalid OTP");
        }
      }
    }
  };
  const handleResendOtp = () => {
    if (timer === 0) {
      handleSendOtp();
    }
  };
  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Sign In</h2>
        <div className="toggle-buttons">
          <button
            className={loginMethod === "email" ? "active" : ""}
            onClick={() => setLoginMethod("email")}
            type="button"
          >
            Email
          </button>
          <button
            className={loginMethod === "phone" ? "active" : ""}
            onClick={() => {
              setLoginMethod("phone");
              setOtpSent(false);
              setPhone("");
              setOtp("");
              setTimer(0);
            }}
            type="button"
          >
            Phone
          </button>
        </div>
        <form onSubmit={handleSignIn} className="signin-form-fields">
          {loginMethod === "email" ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </>
          ) : (
            <>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={otpSent}
                placeholder="Phone Number"
              />
              {otpSent && (
                <>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                  />
                  <div className="otp-info">
                    {timer > 0 ? (
                      <p>Resend OTP in {timer}s</p>
                    ) : (
                      <button type="button" onClick={handleResendOtp}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          <button type="submit">
            {loginMethod === "phone" && !otpSent ? "Send OTP" : "Sign In"}
          </button>
        </form>
        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
