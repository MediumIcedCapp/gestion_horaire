import { useState, useEffect } from "react";
import logo from "../../assets/logoGestionHoraire.png";
import Footer from "../../composantes/Footer.jsx";
import styles from "./PageCalendrier.module.css";
import UserProfile from "../../assets/UserProfile.png";
import DropDownButtonLines from "../../assets/DropDownLines.png";
import DropDownButtonArrow from "../../assets/DropDownArrow.png";
import { useNavigate, Link } from "react-router-dom";

import AjoutSalles from "../../composantes/ModuleDeGestionDeSalles/AjoutSalles.jsx";
import ModificationSalles from "../../composantes/ModuleDeGestionDeSalles/ModificationSalles.jsx";
import ConsultationSalles from "../../composantes/ModuleDeGestionDeSalles/ConsultationSalles.jsx";
import SuppressionSalles from "../../composantes/ModuleDeGestionDeSalles/SuppressionSalles.jsx";

import AjoutCours from "../../composantes/ModuleDeGestionDeCours/AjoutCours.jsx";
import ModificationCours from "../../composantes/ModuleDeGestionDeCours/ModificationCours.jsx";
import SuppressionCours from "../../composantes/ModuleDeGestionDeCours/SuppressionCours.jsx";
import ConsultationCours from "../../composantes/ModuleDeGestionDeCours/ConsultationCours.jsx";

import ConsultationProfesseurs from "../../composantes/ModuleDeGestionDeProfesseurs/ConsultationProfesseurs.jsx";
import ModificationProfesseurs from "../../composantes/ModuleDeGestionDeProfesseurs/ModificationProfesseurs.jsx";

import AjoutEvenement from "../../composantes/AjoutEvenement.jsx";

export default function PageCalendrier() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [evenementsDuJour, setEvenementsDuJour] = useState([]);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [activeView, setActiveView] = useState("calendrier");
  const [showAjoutEvenement, setShowAjoutEvenement] = useState(false);
  const [showDeconnexionConfirm, setShowDeconnexionConfirm] = useState(false);
  const [showAjouterSalle, setShowAjouterSalle] = useState(false);
  const [showModificationSalle, setShowModificationSalle] = useState(false);
  const [showConsultationSalle, setShowConsultationSalle] = useState(false);
  const [showSuppressionSalle, setShowSuppressionSalle] = useState(false);

  const fetchEvenements = async (dateObj) => {
    const dateStr = dateObj.toISOString().split("T")[0];

    try {
      const response = await fetch(`http://localhost:5000/api/evenements/${dateStr}`);
      const data = await response.json();
      setEvenementsDuJour(data);
    } catch (err) {
      console.error("Erreur de chargement des evenements:", err);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadEvenements = async () => {
      const dateStr = selectedDate.toISOString().split("T")[0];

      try {
        const response = await fetch(`http://localhost:5000/api/evenements/${dateStr}`);
        const data = await response.json();

        if (isActive) {
          setEvenementsDuJour(data);
        }
      } catch (err) {
        console.error("Erreur de chargement des evenements:", err);
      }
    };

    loadEvenements();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startingDay; i += 1) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i += 1) {
      days.push(i);
    }

    return days;
  };

  const monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const handleDayClick = (day) => {
    if (day) {
      const fullDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      setSelectedDate(fullDate);
      setShowAjoutEvenement(true);
    }
  };

  const handleMenuClick = (view) => {
    setActiveView(view);
    setToggleMenu(false);
  };

  const handleClosePanel = () => {
    setActiveView("calendrier");
  };

  const handleDeconnexion = () => {
    setShowDeconnexionConfirm(true);
  };

  const confirmDeconnexion = () => {
    localStorage.removeItem("utilisateur");
    navigate("/login");
  };

  return (
    <div className={styles.calendar_page}>
      <header className={styles.header}>
        <div className={styles.header_content}>
          <div className={styles.dropdown_wrapper}>
            <button className={styles.dropdown_button} onClick={() => setToggleMenu(!toggleMenu)}>
              <img className={styles.dropdown_icon} src={toggleMenu ? DropDownButtonArrow : DropDownButtonLines} alt="Menu" />
            </button>
          </div>

          <img src={logo} alt="Gestion des Horaires" className={styles.logo_img} />
          <div className={styles.header_title}>
            <h1>PLANIGO</h1>
            <p>Organiseur des professeurs par les administrateurs</p>
          </div>
          <div className={styles.header_account}>
            <Link to="/compteutilisateur">
              <img src={UserProfile} alt="Profil" className={styles.user_profile} />
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.main_content}>
        {toggleMenu && (
          <div id="toggleNavMenu" className={styles.dropdown_content}>
            <div className={styles.dropdown_elements}>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("calendrier"); }}>Calendrier</a></li>
                <li><a href="#">Gerer un cours</a>
                  <ul className={styles.submenu}>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("ajoutCours"); }}>Ajouter un cours</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("modificationCours"); }}>Modifier un cours</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("suppressionCours"); }}>Supprimer un cours</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("consultationCours"); }}>Consulter un cours</a></li>
                  </ul>
                </li>
                <li><a href="#">Gerer un professeur</a>
                  <ul className={styles.submenu}>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("consultationProfesseurs"); }}>Consulter les professeurs</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick("modificationProfesseurs"); }}>Modifier un professeur</a></li>
                  </ul>
                </li>
                <li><a href="#">Gerer une salle</a>
                  <ul className={styles.submenu}>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setShowAjouterSalle(true); }}>Ajouter une salle</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setShowModificationSalle(true); }}>Modifier une salle</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setShowSuppressionSalle(true); }}>Supprimer une salle</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setShowConsultationSalle(true); }}>Consulter une salle</a></li>
                  </ul>
                </li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowAjoutEvenement(true); }}>Ajout d un evenement</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleDeconnexion(); }}>Deconnexion</a></li>
              </ul>
            </div>
          </div>
        )}

        <main id="calendar_main" className={styles.calendar_main}>
          <div className={styles.calendar_container}>
            <div className={styles.calendar_header}>
              <button className={styles.btn} onClick={() => changeMonth(-1)}>Prec</button>
              <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
              <button className={styles.btn} onClick={() => changeMonth(1)}>Suiv</button>
            </div>
            <div className={styles.calendar_grid}>
              {dayNames.map((day) => (<div key={day} className={styles.calendar_day_name}>{day}</div>))}
              {getDaysInMonth(selectedDate).map((day, index) => {
                const isToday = day === new Date().getDate()
                  && selectedDate.getMonth() === new Date().getMonth()
                  && selectedDate.getFullYear() === new Date().getFullYear();
                const isSelected = day === selectedDate.getDate();

                return (
                  <div
                    key={index}
                    className={`${styles.calendar_day} ${day ? styles.has_day : ""} ${isToday ? styles.today : ""} ${isSelected ? styles.selected_day : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {activeView === "ajoutCours" && (
            <div className={styles.side_panel}>
              <AjoutCours onSave={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}
          {activeView === "modificationCours" && (
            <div className={styles.side_panel}>
              <ModificationCours onSave={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}
          {activeView === "suppressionCours" && (
            <div className={styles.side_panel}>
              <SuppressionCours onConfirm={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}
          {activeView === "consultationCours" && (
            <div className={styles.side_panel}>
              <ConsultationCours />
            </div>
          )}
          {activeView === "consultationProfesseurs" && (
            <div className={styles.side_panel}>
              <ConsultationProfesseurs />
            </div>
          )}
          {activeView === "modificationProfesseurs" && (
            <div className={styles.side_panel}>
              <ModificationProfesseurs onSave={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}

          {activeView === "calendrier" && (
            <div className={`${styles.calendar_container} ${styles.today_event}`}>
              <h3>Evenements du jour</h3>

              <div className={styles.event_list}>
                {evenementsDuJour.length > 0 ? (
                  evenementsDuJour.map((ev, index) => (
                    <div key={index} className={styles.event_card}>
                      <span className={styles.event_time}>{ev.heureDebut.substring(0, 5)} - {ev.heureFin.substring(0, 5)}</span>
                      <p><strong>{ev.cours}</strong></p>
                      <p className={styles.event_room}>Salle: {ev.salle}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.no_event}>Aucun cours programme pour cette journee.</p>
                )}
              </div>
              <button className={styles.add_event_inline} onClick={() => setShowAjoutEvenement(true)}>
                + Programmer un cours
              </button>
            </div>
          )}
        </main>
      </div>

      <div className={styles.footer_wrapper}>
        <Footer />
      </div>

      {showAjouterSalle && <AjoutSalles onClose={() => setShowAjouterSalle(false)} />}
      {showModificationSalle && <ModificationSalles onClose={() => setShowModificationSalle(false)} />}
      {showConsultationSalle && <ConsultationSalles onClose={() => setShowConsultationSalle(false)} />}
      {showSuppressionSalle && <SuppressionSalles onClose={() => setShowSuppressionSalle(false)} />}

      {showAjoutEvenement && (
        <AjoutEvenement
          selectedDate={selectedDate}
          onClose={() => setShowAjoutEvenement(false)}
          onSave={() => {
            fetchEvenements(selectedDate);
            setShowAjoutEvenement(false);
          }}
        />
      )}

      {showDeconnexionConfirm && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <div className={styles.modal_header}>
              <h2>Deconnexion</h2>
              <button className={styles.close_btn} onClick={() => setShowDeconnexionConfirm(false)}>&times;</button>
            </div>
            <div className={styles.modal_body}>
              <div className={styles.warning_icon}>!</div>
              <p className={styles.warning_text}>Etes-vous sur de vouloir vous deconnecter ?</p>
            </div>
            <div className={styles.modal_buttons}>
              <button className={styles.cancel_btn} onClick={() => setShowDeconnexionConfirm(false)}>Annuler</button>
              <button className={styles.confirm_btn} onClick={confirmDeconnexion}>Se deconnecter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
