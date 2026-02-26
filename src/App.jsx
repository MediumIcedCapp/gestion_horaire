// Mahad Mouhoumed - 2708767
// app principal

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import CreerCours from './CreerCours'
import ConsulterCours from './ConsulterCours'
import './App.css'

function App() {
console.log("app load")

var temp = null

return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/creer-cours" element={<CreerCours />} />
<Route path="/consulter-cours" element={<ConsulterCours />} />
</Routes>
</BrowserRouter>
)
}

export default App
