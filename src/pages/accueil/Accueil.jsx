// Mahad M - 2708767
// page accueil
// TODO: ajouter plus de contenu

import React from 'react'
import styles from './Accueil.module.css'
import Footer from '../../composantes/Footer'
import Logo from "../../assets/logoGestionHoraire.png";
import ShowcaseImage from "../../assets/AccueilCalendarShowcase.jpg";
import { Link } from "react-router-dom";

export default function Accueil() {

return (
    <div className={styles.accueil_page}>
        <div className={styles.accueil_container}>

            <div className={styles.main_section}>

                <div className={styles.header_section}>
                    <img src={Logo} alt="LOGO" className={styles.logo} />
                    <h1 className={styles.titre_principal}>PLANIGO</h1>
                    <p className={styles.sous_titre}>Pour votre planification quotidienne!</p>
                </div>

                <div className={styles.boutons_container}>
                    <Link to="/signup">
                        <button className={styles.bouton_principal}>Créer Un Compte</button>
                    </Link>
                    <Link to="/login">
                        <button className={styles.bouton_principal}>Se Connecter</button>
                    </Link>
                </div>
            </div>

            <div className={styles.section_description}>
                    <img src={ShowcaseImage} alt="Showcase" className={styles.showcase_image} />
                    <div className={styles.texte_description}>
                        <h2>Gestion de calendrier gratuit</h2>
                        <p>Description</p>
                    </div>
            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    </div>
)
}