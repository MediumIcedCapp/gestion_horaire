import React, { useState } from "react";
import "./Login.css";
import Logo from "../../assets/logoGestionHoraire.png";
import LoginVerification from "../../utils/loginValidation";
import { Link } from "react-router-dom";
import loginVerification from "../../utils/loginValidation"; 

export default function SignUp() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [username, setUsername] = useState("");
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

        if (!loginVerification.passwordMatch(password, confirmPassword)) {
            newErrors.confirmPassword = "Mot de passe et confirmation ne correspondent pas";
        }

        if (!loginVerification.validateName(prenom)) {
            newErrors.prenom = "Le prénom ne doit contenir que des lettres";
        }

        if (!loginVerification.validateName(nom)) {
            newErrors.nom = "Le nom ne doit contenir que des lettres";
        }

        if (!loginVerification.validateUsername(username)) {
            newErrors.username = "Le nom d'utilisateur ne doit contenir que des lettres et des chiffres";
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
            <h2>Sign Up</h2>
            <p>Remplissez les champs de saisie pour continuer</p>
        </div>

    <form className="login-form" noValidate onSubmit={handleSubmit}>
        <div className="name-row">
            <div className="form-group">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="prenom"
                        name="prenom"
                        required
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                    />
                    <label htmlFor="prenom">Prenom</label>
                </div>
                {errors.prenom && <span className="error-message">{errors.prenom}</span>}
            </div>

            <div className="form-group">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="nom"
                        name="nom"
                        required
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                    <label htmlFor="nom">Nom</label>
                </div>
                {errors.nom && <span className="error-message">{errors.nom}</span>}
            </div>
        </div>

        <div className="form-group">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username">Nom d'utilisateur</label>
                </div>
                {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

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

        <div className="form-group">
            <div className="input-wrapper">
                <input
                    type="password"
                    id="confimPassword"
                    name="confimPassword"
                    required
                    autoComplete="current-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="confimPassword">Confirmer votre mot de passe</label>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button className="login-btn" type="submit">
            Sign Up
        </button>
    </form>

        <div className="detailCreerCompte" style={{ marginTop:"20px", fontSize:"12px"}}>
            <p>Tu as deja{" "}
                <Link to="/login" style={{color:"Blue", textDecoration:"underline"}}>
                un compte?
                </Link>
            </p>
        </div>
    </div>
</div>
);
}
