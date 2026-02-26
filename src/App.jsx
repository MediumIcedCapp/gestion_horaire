import { useState } from 'react'
import './App.css'
import PageCalendrier from './composantes/PageCalendrier'

export default function App() {
  const [currentPage, setCurrentPage] = useState('calendar')

  return (
    <div className="App">
      <PageCalendrier />
    </div>
  )
}

