// Mahad Mouhoumed - 2708767
// page accueil

import React from 'react'

function Home() {
console.log("home load")

var temp = null

// fonction creer compte
function creerCompte() {
console.log("creer compte")
alert("Creer un compte - pas encore implementer")
}

// fonction se connecter
function seConnecter() {
console.log("se connecter")
alert("Se connecter - pas encore implementer")
}

return (
<div>
{/* logo en haut */}
<div className="logo-container">
<img src="/logo.png" alt="LOGO" className="logo" />
</div>

{/* section principale */}
<div className="main-section">
<h1 className="titre-principal">Bienvenue Sur Notre Site!</h1>
<p className="sous-titre">Pour votre planification quotidienne!</p>

{/* boutons */}
<div className="boutons-container">
<button className="bouton-principal" onClick={creerCompte}>Créer Un Compte</button>
<button className="bouton-principal" onClick={seConnecter}>Se connecter</button>
</div>
</div>

{/* section bas de page */}
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

{/* footer */}
<div className="footer">
<p>Footer</p>
</div>
</div>
)
}

export default Home
