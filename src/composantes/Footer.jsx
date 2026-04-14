import React from 'react';
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.app_footer}>
      <div className={styles.footer_container}>
        
        {/* Colonne 1 : À propos */}
        <div className={styles.footer_column}>
          <h4>PLANIGO</h4>
          <p>La solution intelligente pour la gestion des horaires et des ressources académiques.</p>
        </div>

        {/* Colonne 2 : Liens rapides */}
        <div className={styles.footer_column}>
          <h4>NAVIGATION</h4>
          <ul>
            <li><a href="/aide">Centre d'aide</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/contact">Utilisateurs</a></li>
            <li><a href="/contact">Introduction</a></li>
            <li><a href="/contact">Fonctionnalités</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Réseaux sociaux */}
        <div className={styles.footer_column}>
          <h4>SUIVEZ-NOUS</h4>
          <div className={styles.social_links}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://x.com/planigocalendar?s=21" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.instagram.com/planigocontact/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>

      </div>

      <div className={styles.footer_bottom}>
        <p>&copy; Tous les droits réservés {new Date().getFullYear()} Planigo. Conçu pour les éducateurs.</p>
      </div>
    </footer>
  );
};

export default Footer;