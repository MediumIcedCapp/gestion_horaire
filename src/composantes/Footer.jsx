import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">

        <div className="footer-socials">
          <h4>Connect With Us</h4>
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

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Planigo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;