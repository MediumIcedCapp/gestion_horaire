import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./CompteUtilisateur.module.css";
import logo from "../assets/logoGestionHoraire.png";
import Footer from "./Footer";

// Importer tous les photos de profiles
import lettreAProfilePic from "../assets/lettreAProfilePic.png";
import lettreBProfilePic from "../assets/lettreBProfilePic.png";
import lettreCProfilePic from "../assets/lettreCProfilePic.png";
import lettreDProfilePic from "../assets/lettreDProfilePic.png";
import lettreEProfilePic from "../assets/lettreEProfilePic.png";
import lettreFProfilePic from "../assets/lettreFProfilePic.png";
import lettreGProfilePic from "../assets/lettreGProfilePic.png";
import lettreHProfilePic from "../assets/lettreHProfilePic.png";
import lettreIProfilePic from "../assets/lettreIProfilePic.png";
import lettreJProfilePic from "../assets/lettreJProfilePic.png";
import lettreKProfilePic from "../assets/lettreKProfilePic.png";
import lettreLProfilePic from "../assets/lettreLProfilePic.png";
import lettreMProfilePic from "../assets/lettreMProfilePic.png";
import lettreNProfilePic from "../assets/lettreNProfilePic.png";
import lettreOProfilePic from "../assets/lettreOProfilePic.png";
import lettrePProfilePic from "../assets/lettrePProfilePic.png";
import lettreQProfilePic from "../assets/lettreQProfilePic.png";
import lettreRProfilePic from "../assets/lettreRProfilePic.png";
import lettreSProfilePic from "../assets/lettreSProfilePic.png";
import lettreTProfilePic from "../assets/lettreTProfilePic.png";
import lettreUProfilePic from "../assets/lettreUProfilePic.png";
import lettreVProfilePic from "../assets/lettreVProfilePic.png";
import lettreWProfilePic from "../assets/lettreWProfilePic.png";
import lettreXProfilePic from "../assets/lettreXProfilePic.png";
import lettreYProfilePic from "../assets/lettreYProfilePic.png";
import lettreZProfilePic from "../assets/lettreZProfilePic.png";

export default function CompteUtilisateur() {
  const navigate = useNavigate();

  // Etats pour stocker les donnees utilisateur
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("*******");

  // Etats pour le mode edition
  const [isEditing, setIsEditing] = useState(false);
  const [editNom, setEditNom] = useState("");
  const [editPrenom, setEditPrenom] = useState("");
  const [editNomUtilisateur, setEditNomUtilisateur] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMotDePasse, setEditMotDePasse] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Recuperer les donnees de l'utilisateur depuis localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('utilisateur'));

        if (storedUser && storedUser.email) {
          const response = await fetch(
            `http://localhost:5000/api/utilisateur/${encodeURIComponent(storedUser.email)}`
          );

          const data = await response.json();
          console.log("Reponse fetchUserData :", data);

          if (data.success && data.utilisateur) {
            setNomUtilisateur(data.utilisateur.nomUtilisateur || "");
            setNom(data.utilisateur.nom || "");
            setPrenom(data.utilisateur.prenom || "");
            setEmail(data.utilisateur.email || "");
            setMotDePasse("******");
          } else {
            console.error("Utilisateur non trouve ou reponse invalide :", data);
          }
        }
      } catch (error) {
        console.error("Erreur fetchUserData:", error);
      }
    };
    
    fetchUserData();
  }, []);

  // Fonction pour obtenir une photo de profile base sur le prenom
  const getProfilePic = (prenom) => {
    if (!prenom) return lettreAProfilePic;

    const firstLetter = prenom.charAt(0).toUpperCase();

    const profilePics = {
      A: lettreAProfilePic,
      B: lettreBProfilePic,
      C: lettreCProfilePic,
      D: lettreDProfilePic,
      E: lettreEProfilePic,
      F: lettreFProfilePic,
      G: lettreGProfilePic,
      H: lettreHProfilePic,
      I: lettreIProfilePic,
      J: lettreJProfilePic,
      K: lettreKProfilePic,
      L: lettreLProfilePic,
      M: lettreMProfilePic,
      N: lettreNProfilePic,
      O: lettreOProfilePic,
      P: lettrePProfilePic,
      Q: lettreQProfilePic,
      R: lettreRProfilePic,
      S: lettreSProfilePic,
      T: lettreTProfilePic,
      U: lettreUProfilePic,
      V: lettreVProfilePic,
      W: lettreWProfilePic,
      X: lettreXProfilePic,
      Y: lettreYProfilePic,
      Z: lettreZProfilePic
    };

    return profilePics[firstLetter] || lettreAProfilePic;
  };

  const handleDeconnexion = () => {
    localStorage.removeItem("utilisateur");
    navigate("/login");
  };

  // Fonction pour ouvrir le mode edition
  const handleModifier = () => {
    setEditNom(nom);
    setEditPrenom(prenom);
    setEditNomUtilisateur(nomUtilisateur);
    setEditEmail(email);
    setEditMotDePasse("");
    setIsEditing(true);
  };

  // Fonction pour annuler l'edition
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditMotDePasse("");
  };

  // Fonction pour sauvegarder les modifications
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/utilisateur/${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: editNom,
            prenom: editPrenom,
            nomUtilisateur: editNomUtilisateur,
            nouveauEmail: editEmail,
            motDePasse: editMotDePasse,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNom(editNom);
        setPrenom(editPrenom);
        setNomUtilisateur(editNomUtilisateur);
        setEmail(editEmail);
        setIsEditing(false);

        localStorage.setItem(
          "utilisateur",
          JSON.stringify({ email: editEmail })
        );

        alert("Informations mises a jour avec succes !");
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise a jour:", error);
      alert("Erreur lors de la mise a jour des informations");
    }
  };

  // Fonction pour supprimer le compte
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/utilisateur/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("utilisateur");
        alert("Compte supprime avec succes");
        navigate("/login");
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du compte");
    }
  };

  return (
    <div className={styles.compte_page}>
      <div className={styles.compte_container}>
        <header className={styles.header}>
          <div className={styles.header_content}>
            <img src={logo} alt="Gestion des Horaires" className={styles.logo_img} />
            <div className={styles.header_title}>
              <h1>PLANIGO</h1>
              <p>Organiseur des professeurs par les administrateurs</p>
            </div>
          </div>
          <div className={styles.header_avatar}>
            <img src={getProfilePic(prenom)} alt="Lettre" className={styles.header_avatar_img} />
          </div>
        </header>

        <div className={styles.compte_content}>
          <div className={styles.side_menu}>
            <h2>Compte Planigo</h2>
            <ul>
              <li className={styles.modifier_btn} onClick={handleModifier}>
                <a href="#">Modifier les informations</a>
              </li>
              <li className={styles.supprimer_btn} onClick={() => setShowDeleteConfirm(true)}>
                <a href="#">Supprimer le compte</a>
              </li>
              <li className={styles.retour_btn}>
                <a href="#" onClick={() => navigate("/pageCalendrier")}>Retour au calendrier</a>
              </li>
              <li className={styles.deconnexion_btn} onClick={handleDeconnexion}>
                <a href="#">Deconnexion</a>
              </li>
            </ul>
          </div>
          
          <div className={styles.profile_section}>
            <div className={styles.avatar_container}>
              <img src={getProfilePic(prenom)} alt="Lettre" className={styles.avatar_img} />
            </div>
            <h2 className={styles.user_fullname}>{nom} {prenom}</h2>
            
            {!isEditing ? (
              <div className={styles.info_section}>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Nom d'utilisateur:</span>
                  <span className={styles.info_value}>{nomUtilisateur}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Nom:</span>
                  <span className={styles.info_value}>{nom}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Prenom:</span>
                  <span className={styles.info_value}>{prenom}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Email:</span>
                  <span className={styles.info_value}>{email}</span>
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Mot de passe: </span>
                  <span className={styles.info_value}>{motDePasse}</span>
                </div>
              </div>
            ) : (
              <div className={styles.info_section}>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Nom d'utilisateur:</span>
                  <input
                    type="text"
                    value={editNomUtilisateur}
                    onChange={(e) => setEditNomUtilisateur(e.target.value)}
                    className={styles.edit_input}
                  />
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Nom:</span>
                  <input
                    type="text"
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                    className={styles.edit_input}
                  />
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Prenom:</span>
                  <input
                    type="text"
                    value={editPrenom}
                    onChange={(e) => setEditPrenom(e.target.value)}
                    className={styles.edit_input}
                  />
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Email:</span>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={styles.edit_input}
                  />
                </div>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Nouveau mot de passe:</span>
                  <input
                    type="password"
                    value={editMotDePasse}
                    onChange={(e) => setEditMotDePasse(e.target.value)}
                    placeholder="Laisser vide pour ne pas changer"
                    className={styles.edit_input}
                  />
                </div>
                <div className={styles.edit_buttons}>
                  <button onClick={handleSaveEdit} className={styles.save_btn}>Sauvegarder</button>
                  <button onClick={handleCancelEdit} className={styles.cancel_btn}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className={styles.modal_overlay}>
            <div className={styles.modal_content}>
              <h3>Confirmer la suppression</h3>
              <p>Etes-vous sur de vouloir supprimer votre compte ? Cette action est irreversible.</p>
              <div className={styles.modal_buttons}>
                <button onClick={handleDeleteAccount} className={styles.confirm_delete_btn}>Supprimer</button>
                <button onClick={() => setShowDeleteConfirm(false)} className={styles.cancel_delete_btn}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
