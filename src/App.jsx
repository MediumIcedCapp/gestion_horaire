// Mahad Mouhoumed - 2708767
// app principal
// TODO: ajouter navigation

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Accueil from './Accueil'
import CreerCours from './CreerCours'
import ConsulterCours from './ConsulterCours'
import './App.css'

function App() {
console.log("app load")
// console.log("test app")

var temp = null
var x = 0

return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Accueil />} />
<Route path="/creer-cours" element={<CreerCours />} />
<Route path="/consulter-cours" element={<ConsulterCours />} />
</Routes>
</BrowserRouter>
)
}

export default App
