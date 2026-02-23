import React from "react";
import "./Login.css";
import Logo from "../../assets/logoGestionHoraire.png"

export default function Login() {
  return (
    <div className="login-container">

        <img src={Logo} alt="Logo" className="login-logo" />
        
      <div className="login-card">
        <div className="login-header">
          <h2>Log In</h2>
          <p>Enter your credentials to continue</p>
        </div>

        <form className="login-form" noValidate>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
              />
              <label htmlFor="email">Email</label>
            </div>
            <span className="error-message"></span>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <span className="error-message"></span>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
