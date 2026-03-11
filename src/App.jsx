import { useState } from 'react'
import './composantes/PageCalendrier.css'
import PageCalendrier from './composantes/PageCalendrier.jsx'

export default function App() {
  const [currentPage, setCurrentPage] = useState('calendar')

  return (
    <div className="App">
      <PageCalendrier />
    </div>
  )
}
