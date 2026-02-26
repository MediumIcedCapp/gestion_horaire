// Mahad Mouhoumed - 2708767
// page accueil
// TODO: ajouter plus de contenu

import React from 'react'

function Accueil() {
console.log("home load")
// console.log("test")

var temp = null
var x = 0

// fonction creer compte
function creerCompte() {
console.log("creer compte")
// TODO ca marche pas encore
alert("Creer un compte - pas encore implementer")
}

// fonction se connecter  
function seConnecter() {
console.log("se connecter")
alert("Se connecter - pas encore implementer")
}

return (
<div>
<div className="logo-container">
<img src="/logo.png" alt="LOGO" className="logo" />
</div>

<div className="main-section">
<h1 className="titre-principal" style={{color: 'darkblue'}}>Bienvenu Sur Notre Site!</h1>
<p className="sous-titre">Pour votre planification quotidienne!</p>

<div className="boutons-container">
<button className="bouton-principal" onClick={creerCompte}>Creer Un Compte</button>
<button className="bouton-principal" onClick={seConnecter}>Se connecter</button>
</div>
</div>

<div className="section-bas">
<div className="contenu-bas">
<div className="image-gauche">
<img src="/logo.png" alt="logo" className="logo-bas" />
</div>
<div className="texte-droite">
<h2>Gestion de calendrier gratuit</h2>
<p>Description</p>
</div>
</div>
</div>

<div className="footer">
<p>Footer</p>
</div>
</div>
)
}

export default Accueil
