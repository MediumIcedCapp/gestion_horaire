// Composant de pied de page pour l'application, incluant des liens vers les réseaux sociaux et des informations de copyright
import React from 'react';
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.app_footer}>
      <div className={styles.footer_content}>

        <div className={styles.footer_socials}>
          <h4>Suivez-nous</h4>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter (X)
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>

      <div className={styles.footer_bottom}>
        <p>&copy; {new Date().getFullYear()} Planigo. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;