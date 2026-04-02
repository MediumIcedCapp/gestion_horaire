// importations d'images, de style et de footer
import { useState, useEffect } from 'react'; 
import logo from '../../assets/logoGestionHoraire.png'
import Footer from '../../composantes/Footer.jsx'
import styles from './PageCalendrier.module.css'
import UserProfile from '../../assets/UserProfile.png'
import DropDownButtonLines from '../../assets/DropDownLines.png'
import DropDownButtonArrow from '../../assets/DropDownArrow.png'
import { useNavigate, Link } from 'react-router-dom';

// Importation des composantes de gestion de salles 
import AjoutSalles from '../../composantes/ModuleDeGestionDeSalles/AjoutSalles.jsx';
import ModificationSalles from '../../composantes/ModuleDeGestionDeSalles/ModificationSalles.jsx';
import ConsultationSalles from '../../composantes/ModuleDeGestionDeSalles/ConsultationSalles.jsx';
import SuppressionSalles from '../../composantes/ModuleDeGestionDeSalles/SuppressionSalles.jsx';

// Import des composants de gestion de cours
import AjoutCours from '../../composantes/ModuleDeGestionDeCours/AjoutCours.jsx';
import ModificationCours from '../../composantes/ModuleDeGestionDeCours/ModificationCours.jsx';
import SuppressionCours from '../../composantes/ModuleDeGestionDeCours/SuppressionCours.jsx';
import ConsultationCours from '../../composantes/ModuleDeGestionDeCours/ConsultationCours.jsx';

// Import du nouveau composant d'événement
import AjoutEvenement from '../../composantes/AjoutEvenement.jsx';

//Importation des photos de l'utilisateur 
import lettreAProfilePic from "../assets/lettreAProfilePic.png";
import lettreBProfilePic from "../assets/lettreBProfilePic.png";
import lettreCProfilePic from "../assets/lettreCProfilePic.png";
import lettreDProfilePic from "../assets/lettreDProfilePic.png";
import lettreEProfilePic from "../assets/lettreEProfilePic.png";
import lettreFProfilePic from "../assets/lettreFProfilePic.png";
import lettreGProfilePic from "../assets/lettreGProfilePic.png";
import lettreHProfilePic from "../assets/lettreHProfilePic.png";
import lettreIProfilePic from "../assets/lettreIProfilePic.png";
import lettreJProfilePic from "../assets/lettreJProfilePic.png";
import lettreKProfilePic from "../assets/lettreKProfilePic.png";
import lettreLProfilePic from "../assets/lettreLProfilePic.png";
import lettreMProfilePic from "../assets/lettreMProfilePic.png";
import lettreNProfilePic from "../assets/lettreNProfilePic.png";
import lettreOProfilePic from "../assets/lettreOProfilePic.png";
import lettrePProfilePic from "../assets/lettrePProfilePic.png";
import lettreQProfilePic from "../assets/lettreQProfilePic.png";
import lettreRProfilePic from "../assets/lettreRProfilePic.png";
import lettreSProfilePic from "../assets/lettreSProfilePic.png";
import lettreTProfilePic from "../assets/lettreTProfilePic.png";
import lettreUProfilePic from "../assets/lettreUProfilePic.png";
import lettreVProfilePic from "../assets/lettreVProfilePic.png";
import lettreWProfilePic from "../assets/lettreWProfilePic.png";
import lettreXProfilePic from "../assets/lettreXProfilePic.png";
import lettreYProfilePic from "../assets/lettreYProfilePic.png";
import lettreZProfilePic from "../assets/lettreZProfilePic.png";


export default function PageCalendrier() {
  const navigate = useNavigate();

  // États de date et données
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [evenementsDuJour, setEvenementsDuJour] = useState([]);
  
  // États d'affichage (UI)
  const [toggleMenu, setToggleMenu] = useState(false);
  const [activeView, setActiveView] = useState('calendrier');
  const [showAjoutEvenement, setShowAjoutEvenement] = useState(false);
  const [showDeconnexionConfirm, setShowDeconnexionConfirm] = useState(false);

  // États pour les modales de salles
  const [showAjouterSalle, setShowAjouterSalle] = useState(false);
  const [showModificationSalle, setShowModificationSalle] = useState(false);
  const [showConsultationSalle, setShowConsultationSalle] = useState(false);
  const [showSuppressionSalle, setShowSuppressionSalle] = useState(false);

  //État pour stocker le prénom de l'utiilisateur
  const [prenom, setPrenom] = useState("");


  // Fonction pour récupérer les événements depuis l'API
  const fetchEvenements = async (dateObj) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    try {
      const response = await fetch(`http://localhost:5000/api/evenements/${dateStr}`);
      const data = await response.json();
      setEvenementsDuJour(data);
    } catch (err) {
      console.error("Erreur de chargement des événements:", err);
    }
  };

  // Recharger les événements quand la date change
  useEffect(() => {
    fetchEvenements(selectedDate);
  }, [selectedDate]);

  // Récupérer le prénom au chargement
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('utilisateur'));
    if (storedUser && storedUser.email) {
      fetch(`http://localhost:5000/api/utilisateur/${encodeURIComponent(storedUser.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.utilisateur) {
            setPrenom(data.utilisateur.prenom || "");
          }
        })
        .catch(err => console.error("Erreur profil:", err));
    }
  }, []);

  // La fonction de sélection d'image 
  const getProfilePic = (prenom) => {
    if (!prenom) return lettreAProfilePic;
    const firstLetter = prenom.charAt(0).toUpperCase();
    const profilePics = {
      A: lettreAProfilePic, B: lettreBProfilePic, C: lettreCProfilePic,
      D: lettreDProfilePic, E: lettreEProfilePic, F: lettreFProfilePic,
      G: lettreGProfilePic, H: lettreHProfilePic, I: lettreIProfilePic,
      J: lettreJProfilePic, K: lettreKProfilePic, L: lettreLProfilePic,
      M: lettreMProfilePic, N: lettreNProfilePic, O: lettreOProfilePic,
      P: lettrePProfilePic, Q: lettreQProfilePic, R: lettreRProfilePic,
      S: lettreSProfilePic, T: lettreTProfilePic, U: lettreUProfilePic,
      V: lettreVProfilePic, W: lettreWProfilePic, X: lettreXProfilePic,
      Y: lettreYProfilePic, Z: lettreZProfilePic
    };
    return profilePics[firstLetter] || lettreAProfilePic;
  };

  //Use effect pour récupérer le prénom de l'utilisateur connecté

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    const days = []
    for (let i = 0; i < startingDay; i++) { days.push(null) }
    for (let i = 1; i <= daysInMonth; i++) { days.push(i) }
    return days
  }

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setSelectedDate(newDate)
  }

  const handleDayClick = (day) => {
    if (day) {
      //création de la date complète
      const fullDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      
      // mise à jour la date sélectionnée (pour charger les événements existants)
      setSelectedDate(fullDate);
      setShowAjoutEvenement(true);
    }
  };

  const handleMenuClick = (view) => {
    setActiveView(view)
    setToggleMenu(false) // Fermer le menu après sélection
  }

  const handleClosePanel = () => {
    setActiveView('calendrier')
    setSelectedCours(null)
  }

  const handleDeconnexion = () => {
    setShowDeconnexionConfirm(true)
  }

  const confirmDeconnexion = () => {
    localStorage.removeItem("utilisateur");
    navigate("/login");
  }

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
            <Link to="/compteutilisateur" className={styles.profile_link}>
              <span className={styles.welcome_text}>Bienvenue, {prenom}</span>
              <img 
                src={getProfilePic(prenom)} 
                alt="Profil" 
                className={styles.user_profile} 
              />
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.main_content}>
        {toggleMenu && (
          <div id='toggleNavMenu' className={styles.dropdown_content}>
            <div className={styles.dropdown_elements}>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('calendrier'); }}>Calendrier</a></li>
                <li><a href="#">Gérer un cours</a>
                  <ul className={styles.submenu}>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('ajoutCours'); }}>Ajouter un cours</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('modificationCours'); }}>Modifier un cours</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('suppressionCours'); }}>Supprimer un cours</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('consultationCours'); }}>Consulter un cours</a></li>
                  </ul>
                </li>
                <li><a href="#">Gérer un professeur</a></li>
                <li><a href="#">Gérer une salle</a>
                  <ul className={styles.submenu}>
                    <li><a onClick={(e) => { e.preventDefault(); setShowAjouterSalle(true); }} href="#">Ajouter une salle</a></li>
                    <li><a onClick={(e) => { e.preventDefault(); setShowModificationSalle(true); }} href="#">Modifier une salle</a></li>
                    <li><a onClick={(e) => { e.preventDefault(); setShowSuppressionSalle(true); }} href="#">Supprimer une salle</a></li>
                    <li><a onClick={(e) => { e.preventDefault(); setShowConsultationSalle(true); }} href="#">Consulter une salle</a></li>
                  </ul>
                </li>

                <ul>
                  <li>
                    <h2>Ajout d'un événement</h2>
                  </li>
                </ul>

                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleDeconnexion(); }}>Déconnexion</a>
                </li>
              </ul>
            </div>
          </div>
        )}

        <main id="calendar_main" className={styles.calendar_main}>
          <div className={styles.calendar_container}>
            <div className={styles.calendar_header}>
              <button className={styles.btn} onClick={() => changeMonth(-1)}>Préc</button>
              <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
              <button className={styles.btn} onClick={() => changeMonth(1)}>Suiv</button>
            </div>
            <div className={styles.calendar_grid}>
              {dayNames.map(day => (<div key={day} className={styles.calendar_day_name}>{day}</div>))}
              {getDaysInMonth(selectedDate).map((day, index) => {
                const isToday = day === new Date().getDate() && 
                                selectedDate.getMonth() === new Date().getMonth() && 
                                selectedDate.getFullYear() === new Date().getFullYear();
                const isSelected = day === selectedDate.getDate();

                return (
                  <div key={index} 
                    className={`${styles.calendar_day} ${day ? styles.has_day : ''} ${isToday ? styles.today : ''} ${isSelected ? styles.selected_day : ''}`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
          
          {activeView === 'ajoutCours' && (
            <div className={styles.side_panel}>
              <AjoutCours onSave={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}
          {activeView === 'modificationCours' && (
            <div className={styles.side_panel}>
              <ModificationCours onSave={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}
          {activeView === 'suppressionCours' && (
            <div className={styles.side_panel}>
              <SuppressionCours onConfirm={handleClosePanel} onCancel={handleClosePanel} />
            </div>
          )}
          {activeView === 'consultationCours' && (
            <div className={styles.side_panel}>
              <ConsultationCours />
            </div>
          )}
          
          {activeView === 'calendrier' && (
            <div className={`${styles.calendar_container} ${styles.today_event}`}>
              <h3>Événements du jour</h3>
              
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
                  <p className={styles.no_event}>Aucun cours programmé pour cette journée.</p>
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

      {/* Modales */}
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
              <h2>Déconnexion</h2>
              <button className={styles.close_btn} onClick={() => setShowDeconnexionConfirm(false)}>&times;</button>
            </div>
            <div className={styles.modal_body}>
              <div className={styles.warning_icon}>⚠️</div>
              <p className={styles.warning_text}>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            </div>
            <div className={styles.modal_buttons}>
              <button className={styles.cancel_btn} onClick={() => setShowDeconnexionConfirm(false)}>Annuler</button>
              <button className={styles.confirm_btn} onClick={confirmDeconnexion}>Se déconnecter</button>
            </div>
          </div>
        </div>
      )}

      {/*Ajouter le controle des pages ici */}
    </div>
  );

}