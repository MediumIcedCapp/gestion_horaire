import React, { useState } from "react";
import styles from "./Login.module.css";
import Swal from 'sweetalert2';
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
  const [role, setRole] = useState("administrateur");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!loginVerification.validateEmail(email)) {
      newErrors.email = "Format invalide";
    }

    if (!loginVerification.validatePassword(password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 10 caractères, une lettre et un numéro";
    }

    if (!loginVerification.passwordMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!loginVerification.validateName(prenom)) {
      newErrors.prenom = "Le prénom ne doit contenir que des lettres";
    }

    if (!loginVerification.validateName(nom)) {
      newErrors.nom = "Le nom ne doit contenir que des lettres";
    }

    if (!loginVerification.validateUsername(username)) {
      newErrors.username =
        "Nom d'utilisateur invalide (3-20 caractères)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            motDePasse: password,
            prenom,
            nom,
            nomUtilisateur: username,
            role, // On envoie le rôle au backend
            confirmationMotDePasse: confirmPassword,
            modules_assignes: ["gestion_professeur", "gestion_salles", "gestion_cours", "page_administrateur"]
          }),
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            title: 'Succès !',
            text: 'Compte administrateur créé avec succès',
            icon: 'success',
            toast: true,                
            position: 'top-end',        
            showConfirmButton: false,   
            timer: 3000,                
            timerProgressBar: true,     
            background: '#ffffff',
            color: '#333',
            iconColor: '#e4e8d6',       
            customClass: {
              popup: 'pop-up-toast',   
            },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });

          // On stocke les informations pour simuler une connexion automatique
          const userSession = {
            email: email,
            role: "administrateur",
            prenom: prenom
          };
          localStorage.setItem('utilisateur', JSON.stringify(userSession));

          // Redirection directe vers la page admin
          window.location.href = "/pageAdministrateur"; 
        } else {
            Swal.fire({
            title: 'Erreur lors de la création du compte',
            text:(data.message || 'Erreur lors de la création du compte'),
            icon: 'error',
            toast: true,                
            position: 'top-end',        
            showConfirmButton: false,   
            timer: 3000,                
            timerProgressBar: true,     
            background: '#ffffff',
            color: '#333',
            iconColor: '#e4e8d6',       
            customClass: {
              popup: 'pop-up-toast',   
            },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });
        }
      } catch (err) {
        console.error("Erreur:", err);
      }
    }
  };

  return (
    <div className={styles.login_page}>
      <div className={styles.login_container}>
        <img src={Logo} alt="Logo" className={styles.login_logo} />
        <div className={styles.login_card}>
          <div className={styles.login_header}>
            <h2>Créer un compte administrateur</h2>
            <p>Remplissez les informations ci-dessous</p>
          </div>

          <form className={styles.login_form} noValidate onSubmit={handleSubmit}>
            <div className={styles.name_row}>
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input
                    type="text"
                    id="prenom"
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
                  required
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
                  required
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
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              </div>
              {errors.confirmPassword && (
                <span className={styles.error_message}>{errors.confirmPassword}</span>
              )}
            </div>

            <button className={styles.login_btn} type="submit">
              Créer un compte
            </button>
          </form>

          <div className={styles.detailCreerCompte} style={{ marginTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "14px" }}>
              Déjà un compte ?{" "}
              <Link to="/login" style={{ color: "#ff5555", fontWeight: "600", textDecoration: "none" }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}