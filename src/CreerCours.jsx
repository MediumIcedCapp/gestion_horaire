// Mahad Mouhoumed - 2708767
// page creer cours

import React from 'react'

function CreerCours() {
console.log("creer cours load")

var temp = null
var isSubmit = false

// fonction pour soumettre formulaire
function handleSubmit(e) {
e.preventDefault()
console.log("submit")

var nom = document.getElementById('nomCours').value
var code = document.getElementById('codeCours').value
var duree = document.getElementById('dureeCours').value
var programme = document.getElementById('programmeCours').value

console.log(nom)
console.log(code)

if (nom == "" || code == "" || duree == "") {
document.getElementById('messageErreur').innerHTML = "Veuillez remplir tous les champs obligatoires!"
console.log("erreur")
return
}

alert("Cours cree avec succes!")
console.log("ok")

document.getElementById('formCours').reset()
document.getElementById('messageErreur').innerHTML = ""
isSubmit = true
}

// fonction annuler
function annuler() {
console.log("annuler")
window.location.href = "/"
}

return (
<div>
<div className="logo-container">
<img src="/logo.png" alt="LOGO" className="logo" />
</div>

<div className="main-section">
<h1 className="titre-principal">Créer un Cours</h1>

<form id="formCours" onSubmit={handleSubmit}>
<div className="form-group">
<label>Nom du cours *</label>
<input type="text" id="nomCours" className="form-input" />
</div>

<div className="form-group">
<label>Code du cours *</label>
<input type="text" id="codeCours" className="form-input" />
</div>

<div className="form-group">
<label>Durée (heures) *</label>
<input type="number" id="dureeCours" className="form-input" />
</div>

<div className="form-group">
<label>Programme</label>
<select id="programmeCours" className="form-input">
<option value="">Sélectionner...</option>
<option value="informatique">Informatique</option>
<option value="gestion">Gestion</option>
<option value="sante">Santé</option>
</select>
</div>

<div id="messageErreur" className="message-erreur"></div>

<div className="boutons-container">
<button type="submit" className="bouton-principal">Créer</button>
<button type="button" className="bouton-secondaire" onClick={annuler}>Annuler</button>
</div>
</form>
</div>

<div className="footer">
<p>Footer</p>
</div>
</div>
)
}

export default CreerCours
