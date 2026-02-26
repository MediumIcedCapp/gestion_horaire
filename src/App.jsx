import { useState } from 'react'
import './composantes/PageCalendrier.css'
import PageCalendrier from './composantes/PageCalendrier'

function App() {
  const [currentPage, setCurrentPage] = useState('calendar')

  return (
    <div className="App">
      <PageCalendrier />
    </div>
  )
}

export default App;