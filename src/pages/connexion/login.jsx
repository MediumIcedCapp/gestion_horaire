import React, { useState } from "react";
import "./Login.css";
import Logo from "../../assets/logoGestionHoraire.png";
import loginVerification from "../../utils/loginValidation"; 
import { Link } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    
    e.preventDefault();
    
    let newErrors = {};

    if (!loginVerification.validateEmail(email)) {
      newErrors.email = "Format invalid";
    }

    if (!loginVerification.validatePassword(password)) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères et inclure au moins une lettre majuscule, une lettre minuscule et un numéro";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      //Send to backend for authentication
    }
  }
  
  return (
    <div className="login-container">

        <img src={Logo} alt="Logo" className="login-logo" />
        
      <div className="login-card">
        <div className="login-header">
          <h2>Log In</h2>
          <p>Remplissez les champs de saisie pour continuer</p>
        </div>

        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button className="login-btn" type="submit" >
            Log In
          </button>
        </form>
          <div className="detailCreerCompte" style={{ marginTop:"20px", fontSize:"12px"}}>
            <p>Besoin de{" "}
              <Link to="/signup" style={{color:"Blue", textDecoration:"underline"}}>
              créer un compte?
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}
