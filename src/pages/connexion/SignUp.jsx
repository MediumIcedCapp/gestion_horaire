import React from "react";
import "./Login.css";
import Logo from "../../assets/logoGestionHoraire.png";
import LoginVerification from "../../utils/loginVerification";
import { Link } from "react-router-dom";

export default function Login() {

return (
    <div className="login-container">

        <img src={Logo} alt="Logo" className="login-logo" />
        
        <div className="login-card">
            <div className="login-header">
            <h2>Sign Up</h2>
            <p>Remplissez les champs de saisie pour continuer</p>
        </div>

    <form className="login-form" noValidate>
        <div className="name-row">
            <div className="form-group">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="prenom"
                        name="prenom"
                        required
                    />
                    <label htmlFor="prenom">Prenom</label>
                </div>
            </div>

            <div className="form-group">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="nom"
                        name="nom"
                        required
                    />
                    <label htmlFor="nom">Nom</label>
                </div>
            </div>
        </div>

        <div className="form-group">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        id="username"
                        name="username"
                        required
                    />
                    <label htmlFor="username">Nom d'utilisateur</label>
                </div>
            </div>

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

        <div className="form-group">
            <div className="input-wrapper">
                <input
                    type="password"
                    id="confimPassword"
                    name="confimPassword"
                    required
                    autoComplete="current-password"
                />
                <label htmlFor="confimPassword">Confirmer votre mot de passe</label>
            </div>
            <span className="error-message"></span>
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
