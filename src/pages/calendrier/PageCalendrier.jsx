//importations 
import { useState } from 'react'; 
import logo from '../../assets/logoGestionHoraire.png'
import Footer from '../../composantes/Footer.jsx'
import styles from './PageCalendrier.module.css'
import UserProfile from '../../assets/UserProfile.png'
import DropDownButtonLines from '../../assets/DropDownLines.png'
import DropDownButtonArrow from '../../assets/DropDownArrow.png'
import { Link } from 'react-router-dom';
import AjoutSalles from '../../composantes/ModuleDeGestionDeSalles/AjoutSalles.jsx';
import ModificationSalles from '../../composantes/ModuleDeGestionDeSalles/ModificationSalles.jsx';
import ConsultationSalles from '../../composantes/ModuleDeGestionDeSalles/ConsultationSalles.jsx';
import SuppressionSalles from '../../composantes/ModuleDeGestionDeSalles/SuppressionSalles.jsx';

// Import des composants de gestion de cours
import AjoutCours from '../../composantes/ModuleDeGestionDeCours/AjoutCours.jsx';
import ModificationCours from '../../composantes/ModuleDeGestionDeCours/ModificationCours.jsx';
import SuppressionCours from '../../composantes/ModuleDeGestionDeCours/SuppressionCours.jsx';
import ConsultationCours from '../../composantes/ModuleDeGestionDeCours/ConsultationCours.jsx';

export default function PageCalendrier() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [toggleMenu, setToggleMenu] = useState(false)

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

  const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setSelectedDate(newDate)
  }

  const handleMenuClick = (view) => {
    setActiveView(view)
  }

  const handleClosePanel = () => {
    setActiveView('calendrier')
    setSelectedCours(null)
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
            <Link to="/compteutilisateur">
              <img src={UserProfile} alt="Profil" className={styles.user_profile} />
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
              <li><a href="#">Gerer un cours</a>
                <ul className={styles.submenu}>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('ajoutCours'); }}>Ajouter un cours</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('modificationCours'); }}>Modifier un cours</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('suppressionCours'); }}>Supprimer un cours</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleMenuClick('consultationCours'); }}>Consulter un cours</a></li>
                </ul>
              </li>
              <li><a href="#">Gerer un professeur</a>
                <ul className={styles.submenu}>
                  <li><a href="#">Ajouter un professeur</a></li>
                  <li><a href="#">Definir disponibilite</a></li>
                  <li><a href="#">Modifier un professeur</a></li>
                  <li><a href="#">Supprimer un professeur</a></li>
                  <li><a href="#">Consulter un professeur</a></li>
                </ul>
              </li>
              <li><a href="#">Gerer une salle</a>
                <ul className={styles.submenu}>
                  <li><a onClick={() => setShowAjouterSalle(true)}
                      href="#">Ajouter une salle</a></li>
                  <li><a onClick={() => setShowModifierSalle(true)}
                      href="#">Modifier une salle</a></li>
                  <li><a onClick={() => setShowSuppressionSalle(true)}
                      href="#">Supprimer une salle</a></li>
                  <li><a onClick={() => setShowConsultationSalle(true)}
                      href="#">Consulter une salle</a></li>
                </ul>
              </li>
              <li><a href="#">Ajout d'un evenement</a></li>
              <li><a href="#">Deconnexion</a></li>
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
            {dayNames.map(day => (<div key={day} className={styles.calendar_day_name}>{day}</div>))}
            {getDaysInMonth(selectedDate).map((day, index) => (
              <div key={index} className={`${styles.calendar_day} ${day ? styles.has_day : ''} ${day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() ? styles.today : ''}`}
                onClick={() => day && alert(`Selectionne: ${day} ${monthNames[selectedDate.getMonth()]}`)}
              >{day}</div>
            ))}
          </div>
        </div>
        
        {/* Panneau lateral pour les composants de cours */}
        {activeView === 'ajoutCours' && (
          <div className={styles.side_panel}>
            <AjoutCours onSave={handleClosePanel} onCancel={handleClosePanel} />
          </div>
        )}
        {activeView === 'modificationCours' && (
          <div className={styles.side_panel}>
            <ModificationCours cours={selectedCours} onSave={handleClosePanel} onCancel={handleClosePanel} />
          </div>
        )}
        {activeView === 'suppressionCours' && (
          <div className={styles.side_panel}>
            <SuppressionCours cours={selectedCours} onConfirm={handleClosePanel} onCancel={handleClosePanel} />
          </div>
        )}
        {activeView === 'consultationCours' && (
          <div className={styles.side_panel}>
            <ConsultationCours />
          </div>
        )}
        
        {activeView === 'calendrier' && (
          <div className={`${styles.calendar_container} ${styles.today_event}`}>
            <h3>Évènements du jour</h3>
            <div className={styles.event_list}>
              
            </div>
          </div>
        )}
      </main>
      <div className={styles.footer}>
        <Footer />
      </div>
      </div>
      {showAjouterSalle && (
            <AjoutSalles onClose={() => setShowAjouterSalle(false)} />
      )}
      {showModifierSalle && (
            <ModificationSalles onClose={() => setShowModifierSalle(false)} />
      )}
      {showConsultationSalle && (
            <ConsultationSalles onClose={() => setShowConsultationSalle(false)} />
      )}
      {showSuppressionSalle && (
            <SuppressionSalles onClose={() => setShowSuppressionSalle(false)} />
      )}

      
    </div>
  )
}
