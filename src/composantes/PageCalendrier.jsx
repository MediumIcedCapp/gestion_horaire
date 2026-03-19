//importations 
import { useState } from 'react'; 
import logo from '../assets/logoGestionHoraire.png'
import Footer from './Footer.jsx'
import styles from './PageCalendrier.module.css'
import UserProfile from '../assets/UserProfile.png'
import DropDownButtonLines from '../assets/DropDownLines.png'
import DropDownButtonArrow from '../assets/DropDownArrow.png'
import { Link } from 'react-router-dom';

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

  function ToggleNavMenu() {
    if(toggleMenu) {
      document.getElementById("toggleNavMenu").style.width = "250px";
      document.getElementById("calendar_main").style.marginLeft = "250px";
    } else {
      document.getElementById("toggleNavMenu").style.width = "0";
      document.getElementById("calendar_main").style.marginLeft = "0";
    }
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
              <li><a href="#">Calendrier</a></li>
              <li><a href="#">Gérer un cours</a>
                <ul className={styles.submenu}>
                  <li><a href="#">Ajouter un cours</a></li>
                  <li><a href="#">Modifier un cours</a></li>
                  <li><a href="#">Supprimer un cours</a></li>
                </ul>
              </li>
              <li><a href="#">Gérer un professeur</a>
                <ul className={styles.submenu}>
                  <li><a href="#">Ajouter un professeur</a></li>
                  <li><a href="#">Modifier un professeur</a></li>
                  <li><a href="#">Supprimer un professeur</a></li>
                </ul>
              </li>
              <li><a href="#">Gérer une salle</a>
                <ul className={styles.submenu}>
                  <li><a href="#">Ajouter une salle</a></li>
                  <li><a href="#">Modifier une salle</a></li>
                  <li><a href="#">Supprimer une salle</a></li>
                </ul>
              </li>
              <li><a href="#">Déconnexion</a></li>
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
        <div className={`${styles.calendar_container} ${styles.today_event}`}>
          <h3>Evenements du jour</h3>
          <div className={styles.event_list}>
            <div className={styles.event_item}><span className={styles.event_time}>09:00</span><span className={styles.event_title}>Reunion equipe</span></div>
            <div className={styles.event_item}><span className={styles.event_time}>14:00</span><span className={styles.event_title}>Cours programmation</span></div>
            <div className={styles.event_item}><span className={styles.event_time}>16:30</span><span className={styles.event_title}>Projet Integrateur</span></div>
          </div>
        </div>
      </main>
      <div className={Footer}>
        <Footer />
      </div>
      </div>
    </div>
  )
}
