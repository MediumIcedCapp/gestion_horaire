// Mahad M - 2708767
// page accueil
// TODO: ajouter plus de contenu

import React from 'react'
import styles from './Accueil.module.css'
import Footer from '../../composantes/Footer'

export default function Accueil() {
    console.log("home load")

    var temp = null
    var x = 0

    // fonction creer compte
    function creerCompte() {
    console.log("creer compte")
    // TODO ca marche pas encore
    alert("Creer un compte - pas encore implementer")
    }

    // fonction se connecter  
    function seConnecter() {
    console.log("se connecter")
    alert("Se connecter - pas encore implementer")
    }

return (
    <div className={styles.accueil_page}>
        <div className={styles.logo_container}>
            <img src="/logo.png" alt="LOGO" className={styles.logo} />
        </div>

        <div className={styles.main_section}>
            <h1 className={styles.titre_principal} style={{color: 'darkblue'}}>Bienvenu Sur Notre Site!</h1>
            <p className={styles.sous_titre}>Pour votre planification quotidienne!</p>

            <div className={styles.boutons_container}>
                <button className={styles.bouton_principal} onClick={creerCompte}>Creer Un Compte</button>
                <button className={styles.bouton_principal} onClick={seConnecter}>Se connecter</button>
            </div>
        </div>

        <div className={styles.section_bas}>
            <div className={styles.contenu_bas}>
                <div className={styles.image_gauche}>
                    <img src="/logo.png" alt="logo" className={styles.logo_bas} />
                </div>
                <div className={styles.texte_droite}>
                    <h2>Gestion de calendrier gratuit</h2>
                    <p>Description</p>
                </div>
            </div>
        </div>

        <div className={Footer}>
            <Footer />
        </div>
    </div>
)
}