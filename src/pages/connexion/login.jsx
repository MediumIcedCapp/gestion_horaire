import React, { useState } from "react";
import styles from "./Login.module.css";
import Logo from "../../assets/logoGestionHoraire.png";
import loginVerification from "../../utils/loginValidation"; 
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loggingIn, setLoggingIn] = useState(false);
  const [role, setRole] = useState("responsable"); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoggingIn(true);

    let newErrors = {};

    if (!loginVerification.validateEmail(email)) {
      newErrors.email = "Format invalide";
    }
        if (!password || password.trim() === "") {
      newErrors.password = "Le mot de passe est requis";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, motDePasse: password }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("Utilisateur reçu :", data.user);
          // Sauvegarder les données utilisateur dans localStorage
          localStorage.setItem('utilisateur', JSON.stringify(data.user));          
          alert("Connexion réussie");
          if (data.user.role === "responsable") {
            navigate("/pageCalendrier");
          } else if (data.user.role === "administrateur") {
            navigate("/pageAdministrateur");
          } else {
            alert("Role non reconnu ou erreur de connexion");
          }
        } else {
          alert("Role non reconnu ou erreur de connexion");
        }
      } catch (err) {
        console.error("Erreur login:", err);
        alert("Erreur lors de la connexion : " + err.message);
      } finally {
        setLoggingIn(false);
      }
    } else {
      setLoggingIn(false);
    }

  };

  return (
    <div className={styles.login_page}>
      <div className={styles.login_container}>
        <img src={Logo} alt="Logo" className={styles.login_logo} />
        <div className={styles.login_card}>
          <div className={styles.login_header}>
            <h2>Se Connecter</h2>
            <p>Remplissez les champs de saisie pour continuer</p>
          </div>

          <form className={styles.login_form} noValidate onSubmit={handleSubmit}>
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
              </div>
            </div>

            <button className={styles.login_btn} type="submit" disabled={loggingIn}>
              {loggingIn ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          
          <div className={styles.detailCreerCompte} style={{ marginTop:"20px", fontSize:"12px" }}>
            <p>
              Besoin de{" "}
              <Link to="/signup" style={{ color:"Blue", textDecoration:"underline" }}>
                créer un compte?
              </Link>
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}