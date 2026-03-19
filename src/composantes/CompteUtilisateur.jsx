import React from 'react';
import styles from "./CompteUtilisateur.module.css";
import logo from "../assets/logoGestionHoraire.png";

export default function CompteUtilisateur() {
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
            </header>

            <div className={styles.compte_content}>
                <div className={styles.side_menu}>
                    <h2>Compte PLANIGO</h2>
                    <ul>
                        <li><a href="#">Modifier les informations</a></li>
                        <li><a href="#">Supprimer le compte</a></li>
                        <li><a href="#">Déconnexion</a></li>
                    </ul>
                </div>
                <div className={styles.Info_section}>
                    
                </div>
            </div>
        </div>
    </div>
  );
}
