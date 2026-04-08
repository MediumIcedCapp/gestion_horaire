// Mahad M - 2708767
// page accueil
// TODO: ajouter plus de contenu

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Accueil.module.css";
import Footer from "../../composantes/Footer";
import Logo from "../../assets/logoGestionHoraire.png";
import ShowcaseImage from "../../assets/AccueilCalendarShowcase.jpg";

const SWIPE_THRESHOLD_RATIO = 0.34;
const MAX_DRAG_DISTANCE = 110;

export default function Accueil() {
  const [theme, setTheme] = useState("light");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef(null);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  // The swipe threshold adapts to the image size so the interaction stays usable on smaller screens.
  const getThreshold = () => {
    const width = handleRef.current?.offsetWidth ?? 0;
    return Math.max(width * SWIPE_THRESHOLD_RATIO, 70);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const beginDrag = (clientX) => {
    startXRef.current = clientX;
    movedRef.current = false;
    setIsDragging(true);
  };

  // Clamp the drag distance to keep the image handle inside the card while dragging.
  const updateDrag = (clientX) => {
    const delta = clientX - startXRef.current;
    const limitedDelta = Math.max(-MAX_DRAG_DISTANCE, Math.min(MAX_DRAG_DISTANCE, delta));

    if (Math.abs(limitedDelta) > 4) {
      movedRef.current = true;
    }

    setDragOffset(limitedDelta);
  };

  const endDrag = () => {
    if (!isDragging) {
      return;
    }

    const threshold = getThreshold();

    // Crossing the threshold snaps the card to the matching visual theme.
    if (dragOffset >= threshold) {
      setTheme("dark");
    } else if (dragOffset <= -threshold) {
      setTheme("light");
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    beginDrag(event.clientX);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) {
      return;
    }

    updateDrag(event.clientX);
  };

  const handlePointerUp = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    endDrag();
  };

  const handleClick = () => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    toggleTheme();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setTheme("dark");
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setTheme("light");
    }
  };

  const sectionThemeClass = theme === "dark" ? styles.section_dark : styles.section_light;
  const handleThemeClass = theme === "dark" ? styles.handle_dark : styles.handle_light;
  const handleDraggingClass = isDragging ? styles.handle_dragging : "";

  return (
    <div className={styles.accueil_page}>
      <div className={styles.accueil_container}>
        <div className={styles.main_section}>
          <div className={styles.header_section}>
            <img src={Logo} alt="Logo Planigo" className={styles.logo} />
            <h1 className={styles.titre_principal}>PLANIGO</h1>
            <p className={styles.sous_titre}>Pour votre planification quotidienne.</p>
          </div>

          <div className={styles.boutons_container}>
            <Link to="/signup">
              <button className={styles.bouton_principal}>Creer un compte</button>
            </Link>
            <Link to="/login">
              <button className={styles.bouton_principal}>Se connecter</button>
            </Link>
          </div>
        </div>

        <div className={`${styles.section_description} ${sectionThemeClass}`}>
          <button
            ref={handleRef}
            type="button"
            className={`${styles.image_handle} ${handleThemeClass} ${handleDraggingClass}`}
            style={{ transform: `translateX(${dragOffset}px)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={endDrag}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label="Faire glisser l'image pour changer le theme"
          >
            <img src={ShowcaseImage} alt="Apercu du calendrier" className={styles.showcase_image} />
          </button>

          <div className={styles.texte_description}>
            <span className={styles.swipe_hint}>Glissez l'image pour changer l'ambiance</span>
            <h2>Gestion de calendrier gratuite</h2>
            <p>
              Centralisez les cours, les salles et les disponibilites des
              professeurs afin de preparer un horaire plus clair et plus rapide.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}