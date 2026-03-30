// Mahad M - 2708767
// page accueil
// TODO: ajouter plus de contenu

import React, { useEffect, useRef, useState } from 'react'
import styles from './Accueil.module.css'
import Footer from '../../composantes/Footer'
import Logo from "../../assets/logoGestionHoraire.png";
import ShowcaseImage from "../../assets/AccueilCalendarShowcase.jpg";
import { Link } from "react-router-dom";

export default function Accueil() {
const [darkTheme, setDarkTheme] = useState(false);
const [dragPercent, setDragPercent] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const trackRef = useRef(null);

const updateDragPercent = (clientX) => {
    if (!trackRef.current) {
        return;
    }

    const rect = trackRef.current.getBoundingClientRect();
    const nextPercent = (clientX - rect.left) / rect.width;
    const clampedPercent = Math.min(Math.max(nextPercent, 0), 1);
    setDragPercent(clampedPercent);
};

useEffect(() => {
    if (!isDragging) {
        setDragPercent(darkTheme ? 1 : 0);
    }
}, [darkTheme, isDragging]);

useEffect(() => {
    if (!isDragging) {
        return undefined;
    }

    const handlePointerMove = (event) => {
        updateDragPercent(event.clientX);
    };

    const handlePointerUp = () => {
        const nextTheme = dragPercent >= 0.5;
        setDarkTheme(nextTheme);
        setDragPercent(nextTheme ? 1 : 0);
        setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
    };
}, [dragPercent, isDragging]);

const handleImagePointerDown = (event) => {
    updateDragPercent(event.clientX);
    setIsDragging(true);
};

const titreDescription = darkTheme ? "Passez en mode pro" : "Gestion de calendrier gratuit";
const texteDescription = darkTheme
    ? "Description: utilisez un affichage plus profond en violet et bleu pour donner une allure plus professionnelle a l accueil."
    : "Description";

return (
    <div className={`${styles.accueil_page} ${darkTheme ? styles.dark_theme : ""}`}>
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

            <div ref={trackRef} className={styles.section_description}>
                    <div
                        className={styles.image_handle}
                        style={{ left: `calc(${dragPercent * 100}% - 150px)` }}
                        onPointerDown={handleImagePointerDown}
                    >
                        <img src={ShowcaseImage} alt="Showcase" className={styles.showcase_image} />
                    </div>

                    <div className={styles.swipe_instruction}>
                        <span className={styles.swipe_hint_left}>Clair</span>
                        <p className={styles.swipe_label}>Glissez l image pour changer le thème</p>
                        <span className={styles.swipe_hint_right}>Pro</span>
                    </div>

                    <div className={styles.texte_description}>
                        <h2>{titreDescription}</h2>
                        <p>{texteDescription}</p>
                    </div>
            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    </div>
)
}
