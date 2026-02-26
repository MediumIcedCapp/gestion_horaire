import { useState } from 'react';
import logo from '../assets/logoGestionHoraire.png'
import Footer from './Footer.jsx'

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
    <div className="calendar-page">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Gestion des Horaires" className="logo-img" />
          <div className="header-title">
            <h1>GESTION DES HORAIRES</h1>
            <p>Organiseur des professeurs par les administrateurs</p>
          </div>
        </div>
      </header>
      <main className="calendar-main">
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="btn btn-icon" onClick={() => changeMonth(-1)}>Prec</button>
            <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
            <button className="btn btn-icon" onClick={() => changeMonth(1)}>Suiv</button>
          </div>
          <div className="calendar-grid">
            {dayNames.map(day => (<div key={day} className="calendar-day-name">{day}</div>))}
            {getDaysInMonth(selectedDate).map((day, index) => (
              <div key={index} className={`calendar-day ${day ? 'has-day' : ''} ${day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() ? 'today' : ''}`}
                onClick={() => day && alert(`Selectionne: ${day} ${monthNames[selectedDate.getMonth()]}`)}
              >{day}</div>
            ))}
          </div>
        </div>
        <div className="calendar-sidebar">
          <h3>Evenements du jour</h3>
          <div className="event-list">
            <div className="event-item"><span className="event-time">09:00</span><span className="event-title">Reunion equipe</span></div>
            <div className="event-item"><span className="event-time">14:00</span><span className="event-title">Cours programmation</span></div>
            <div className="event-item"><span className="event-time">16:30</span><span className="event-title">Projet Integrateur</span></div>
          </div>
          <button className="btn btn-primary btn-full">+ Ajouter evenement</button>
        </div>
      </main>
      <div className="footer">
        <Footer />
      </div>
      
    </div>
  )
}

