// Queren D, Danick A et Mahad M
// Page d'accueil - Avec Calendrier Animé
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Accueil.module.css";
import Footer from "../../composantes/Footer";
import Logo from "../../assets/logoGestionHoraire.png";

const SWIPE_THRESHOLD_RATIO = 0.34;
const MAX_DRAG_DISTANCE = 110;

export default function Accueil() {
  const [theme, setTheme] = useState("light");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef(null);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  const jours = Array.from({ length: 28 }, (_, i) => i + 1);

  const toggleTheme = () => setTheme((curr) => (curr === "light" ? "dark" : "light"));
  const globalThemeClass = theme === "dark" ? styles.mode_sombre : styles.mode_clair;

  const beginDrag = (clientX) => {
    startXRef.current = clientX;
    movedRef.current = false;
    setIsDragging(true);
  };

  const updateDrag = (clientX) => {
    const delta = clientX - startXRef.current;
    const limitedDelta = Math.max(-MAX_DRAG_DISTANCE, Math.min(MAX_DRAG_DISTANCE, delta));
    if (Math.abs(limitedDelta) > 4) movedRef.current = true;
    setDragOffset(limitedDelta);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const threshold = Math.max((handleRef.current?.offsetWidth ?? 0) * SWIPE_THRESHOLD_RATIO, 70);
    if (dragOffset >= threshold) setTheme("dark");
    else if (dragOffset <= -threshold) setTheme("light");
    setDragOffset(0);
    setIsDragging(false);
  };

  const sectionThemeClass = theme === "dark" ? styles.section_dark : styles.section_light;
  const handleThemeClass = theme === "dark" ? styles.handle_dark : styles.handle_light;

  return (
    <div className={`${styles.accueil_page} ${globalThemeClass}`}>
      {/* --- HEADER & NAVIGATION --- */}
      <header className={styles.header_section}>
        <nav className={styles.navbar}>
          <div className={styles.nav_left}>
            <img src={Logo} alt="Logo Planigo" className={styles.logo_nav} />
            <span className={styles.nav_brand}>PLANIGO</span>
          </div>
          <div className={styles.nav_right}>
            <a href="#intro" className={styles.nav_link}>Introduction</a>
            <a href="#users" className={styles.nav_link}>Utilisateurs</a>
            <a href="#features" className={styles.nav_link}>Fonctionnalités</a>
            <Link to="/login" className={styles.nav_link}>Se connecter</Link>
            <Link to="/signup">
              <button className={styles.bouton_nav_accent}>Créer un compte</button>
            </Link>
          </div>
        </nav>

        <div className={styles.main_section}>
          <h1 className={styles.titre_principal}>PLANIGO</h1>
          <p className={styles.sous_titre}>La plateforme web sécurisée pour la gestion académique globale.</p>
        </div>
      </header>

      <div className={styles.accueil_container}>
        
        {/* --- SECTION INTRODUCTION --- */}
        <section id="intro" className={styles.section_textuelle}>
          <div className={styles.contenu_info}>
            <span className={styles.badge}>Bienvenue sur Planigo</span>
            <h2>Simplifiez la gestion académique</h2>
            <p>
              Dans le monde de l'éducation moderne, la synchronisation entre les professeurs, les locaux 
              et les ressources est un défi quotidien. <strong>Planigo</strong> a été conçu pour 
              éliminer la friction administrative grâce à une solution centralisée, intuitive et sécurisée.
            </p>
          </div>
        </section>

        {/* --- NOUVELLE SECTION : UTILISATEURS --- */}
        <section id="users" className={styles.users_section}>
          <h2 className={styles.section_title}>Types d'Utilisateurs & Rôles</h2>
          <div className={styles.users_grid}>
            
            {/* Carte Administrateur */}
            <div className={styles.user_card}>
              <div className={styles.user_icon_box_emoji}>
                🛡️
              </div>
              <h3>Administrateur Plateforme</h3>
              <p>Le garant de la sécurité et de la structure du système.</p>
              <ul className={styles.user_list}>
                <li>Gestion des comptes utilisateurs</li>
                <li>Contrôle des accès et permissions</li>
                <li>Maintenance des modules globaux</li>
                <li>Supervision de la sécurité serveur</li>
              </ul>
            </div>

            {/* Carte Responsable Administratif */}
            <div className={styles.user_card}>
              <div className={styles.user_icon_box_emoji}>
                👨‍💼
              </div>
              <h3>Responsable Administratif</h3>
              <p>Le maître d'œuvre de la planification académique quotidienne.</p>
              <ul className={styles.user_list}>
                <li>Gestion des cours, locaux et professeurs</li>
                <li>Affectation des cours aux plages horaires</li>
                <li>Vérification et résolution des conflits d'horaires</li>
                <li>Analyse de l'utilisation des ressources</li>
              </ul>
            </div>

          </div>
        </section>

        {/* --- SECTION INTERACTIVE (THEME TOGGLE) --- */}
        <div className={styles.section_description}>
          <div
            ref={handleRef}
            className={`${styles.calendrier_anime} ${handleThemeClass} ${isDragging ? styles.handle_dragging : ""}`}
            style={{ transform: `translateX(${dragOffset}px)` }}
            onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); beginDrag(e.clientX); }}
            onPointerMove={(e) => isDragging && updateDrag(e.clientX)}
            onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); endDrag(); }}
            onPointerCancel={endDrag}
            onClick={() => !movedRef.current && toggleTheme()}
          >
            <div className={styles.cal_header}>
               <div className={styles.cal_dots}>
                  <span style={{background: '#ff5f57'}}></span>
                  <span style={{background: '#febc2e'}}></span>
                  <span style={{background: '#28c840'}}></span>
               </div>
               <span className={styles.cal_month}>Avril 2026</span>
            </div>
            <div className={styles.cal_grid}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                <div key={d} className={styles.cal_weekday}>{d}</div>
              ))}
              {Array.from({ length: 28 }, (_, i) => i + 1).map(j => (
                <div key={j} className={`${styles.cal_day} ${j === 15 ? styles.cal_active : ''}`}>{j}</div>
              ))}
            </div>
            <div className={styles.floating_task}>
              <div className={styles.task_icon_emoji}>🚫</div>
              <div>
                <p className={styles.task_title}>Anti-Conflit Actif</p>
                <p className={styles.task_time}>Salles & Professeurs</p>
              </div>
            </div>
          </div>

          <div className={styles.texte_description}>
            <span className={styles.swipe_hint}>Cliquer sur le calendrier pour changer l'ambiance</span>
            <h2>Interface Simple & Sécurisée</h2>
            <p>
              Une architecture web conçue pour protéger vos données sensibles tout en offrant 
              une navigation fluide pour chaque type de rôle.
            </p>
          </div>
        </div>

        {/* --- SECTION FONCTIONNALITÉS --- */}
        <section id="features" className={styles.features_grid_section}>
          <h2 className={styles.section_title}>Fonctionnalités Clés</h2>
          <div className={styles.grid_container}>
            
            {/* Gestion des Profils */}
            <div className={styles.feature_card}>
              <div className={styles.feature_icon_container_emoji}>👥</div>
              <h3>Gestion des Profils</h3>
              <p>Contrôle d'accès strict pour les Administrateurs et Responsables Administratifs.</p>
            </div>

            {/* Module Cours */}
            <div className={styles.feature_card}>
              <div className={styles.feature_icon_container_emoji}>📚</div>
              <h3>Module Cours</h3>
              <p>Création, modification et filtrage avancé par programme et type de salle.</p>
            </div>

            {/* Module Salles */}
            <div className={styles.feature_card}>
              <div className={styles.feature_icon_container_emoji}>🏛️</div>
              <h3>Module Salles</h3>
              <p>Optimisation des capacités et vérification d'occupation en temps réel.</p>
            </div>

            {/* Module Professeurs */}
            <div className={styles.feature_card}>
              <div className={styles.feature_icon_container_emoji}>👨‍🏫</div>
              <h3>Module Professeurs</h3>
              <p>Suivi des spécialités et définition précise des disponibilités.</p>
            </div>

            {/* Anti-Conflit */}
            <div className={styles.feature_card}>
              <div className={styles.feature_icon_container_emoji}>🚫</div>
              <h3>Anti-Conflit</h3>
              <p>Vérification automatique des doubles réservations (salles et professeurs).</p>
            </div>

            {/* Sécurité */}
            <div className={styles.feature_card}>
              <div className={styles.feature_icon_container_emoji}>🔒</div>
              <h3>Sécurité Web</h3>
              <p>Actions serveur protégées et accès restreint aux utilisateurs authentifiés.</p>
            </div>

          </div>
        </section>

        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}