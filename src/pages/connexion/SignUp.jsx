import React, { useState } from "react";
import styles from "./Login.module.css";
import Logo from "../../assets/logoGestionHoraire.png";
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
            newErrors.password = "Le mot de passe doit contenir au moins 10 caractères et inclure au moins une lettre et un numéro";
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
            newErrors.username = "Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne doit contenir que des lettres, chiffres et underscores";
        }
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
          //Send to backend for authentication
        }
    }

return (
<div className={styles.login_page}>

    <div className={styles.login_container}>

        <img src={Logo} alt="Logo" className={styles.login_logo} />
        
        <div className={styles.login_card}>
            <div className={styles.login_header}>
            <h2>Sign Up</h2>
            <p>Remplissez les champs de saisie pour continuer</p>
        </div>

    <form className={styles.login_form} noValidate onSubmit={handleSubmit}>
        <div className={styles.name_row}>
            <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                    <input 
                        type="text"
                        id="prenom"
                        name="prenom"
                        required
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                    />
                    <label htmlFor="prenom">Prénom</label>
                </div>
                {errors.prenom && <span className={styles.error_message}>{errors.prenom}</span>}
            </div>

            <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
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
                {errors.nom && <span className={styles.error_message}>{errors.nom}</span>}
            </div>
        </div>

        <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
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
                {errors.username && <span className={styles.error_message}>{errors.username}</span>}
            </div>

        <div className={styles.form_group}>
            <div className={styles.input_wrapper}>
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
            {errors.email && <span className={styles.error_message}>{errors.email}</span>}
        </div>

        <div className={styles.form_group}>
            <div className={styles.input_wrapper}>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Mot de passe</label>
            </div>
            {errors.password && <span className={styles.error_message}>{errors.password}</span>}
        </div>

        <div className={styles.form_group}>
            <div className={styles.input_wrapper}>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    autoComplete="current-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">Confirmer votre mot de passe</label>
            </div>
            {errors.confirmPassword && <span className={styles.error_message}>{errors.confirmPassword}</span>}
        </div>

        <button className={styles.login_btn} type="submit">
            Sign Up
        </button>
    </form>

        <div className={styles.detailCreerCompte} style={{ marginTop:"20px", fontSize:"12px"}}>
            <p>Tu as deja{" "}
                <Link to="/login" style={{color:"Blue", textDecoration:"underline"}}>
                un compte?
                </Link>
            </p>
        </div>
    </div>
    </div>
</div>
);
}
