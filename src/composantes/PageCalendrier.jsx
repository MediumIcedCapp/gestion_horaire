//importations 
import { useState } from 'react'; 
import logo from '../assets/logoGestionHoraire.png'
import Footer from './Footer.jsx'
import styles from './PageCalendrier.module.css'

export default function PageCalendrier() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
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

  return (
    <div className={styles.calendar_page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Gestion des Horaires" className={styles.logo_img} />
          <div className={styles.header_title}>
            <h1>PLANIGO</h1>
            <p>Organiseur des professeurs par les administrateurs</p>
          </div>
        </div>
      </header>
      <main className={styles.calendar_main}>
        <div className={styles.calendar_container}>
          <div className={styles.calendar_header}>
            <button className={styles.btn} onClick={() => changeMonth(-1)}>Prec</button>
            <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
            <button className={styles.btn} onClick={() => changeMonth(1)}>Suiv</button>
          </div>
          <div className={styles.calendar_grid}>
            {dayNames.map(day => (<div key={day} className={styles.calendar_day_name}>{day}</div>))}
            {getDaysInMonth(selectedDate).map((day, index) => (
              <div key={index} className={`calendar-day ${day ? 'has-day' : ''} ${day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() ? 'today' : ''}`}
                onClick={() => day && alert(`Selectionne: ${day} ${monthNames[selectedDate.getMonth()]}`)}
              >{day}</div>
            ))}
          </div>
        </div>
        <div className={styles.calendar_sidebar}>
          <h3>Evenements du jour</h3>
          <div className={styles.event_list}>
            <div className={styles.event_item}><span className={styles.event_time}>09:00</span><span className={styles.event_title}>Reunion equipe</span></div>
            <div className={styles.event_item}><span className={styles.event_time}>14:00</span><span className={styles.event_title}>Cours programmation</span></div>
            <div className={styles.event_item}><span className={styles.event_time}>16:30</span><span className={styles.event_title}>Projet Integrateur</span></div>
          </div>
          <button className={styles.btn} onClick={() => alert('Supprimer un cours')}>+ Supprimer un cours</button>
          <button className={styles.btn} onClick={() => alert('Modifier une information')}>+ Modifier une information</button>
        </div>
      </main>
      <div className={Footer}>
        <Footer />
      </div>
      
    </div>
  )
}
