// Mahad Mouhoumed - 2708767
// page consulter cours
// v2 avec filtres

import React from 'react'

function ConsulterCours() {
console.log("consulter cours load")
// console.log("page load ok")

// donnees des cours
var coursList = [
{nom: "Programmation Web", code: "INFO101", duree: 45, programme: "informatique", etape: "1", salle: "labo"},
{nom: "Base de donnees", code: "INFO201", duree: 60, programme: "informatique", etape: "2", salle: "labo"},
{nom: "Gestion de projet", code: "GEST101", duree: 30, programme: "gestion", etape: "1", salle: "classe"},
{nom: "Comptabilite", code: "GEST202", duree: 45, programme: "gestion", etape: "2", salle: "classe"},
{nom: "Soins infirmiers", code: "SANT101", duree: 90, programme: "sante", etape: "1", salle: "labo"}
]

var temp = []
var count = 0
var test = null

console.log(coursList.length)
console.log("nombre cours: " + coursList.length)

// fonction rechercher
function rechercherCours() {
console.log("recherche")

var nom = document.getElementById('filtreNom').value
var code = document.getElementById('filtreCode').value
var programme = document.getElementById('filtreProgramme').value
var etape = document.getElementById('filtreEtape').value

console.log(nom)

var resultats = []

for(var i=0; i<coursList.length; i++){
var cours = coursList[i]
var match = true

// chercher nom - pas sensible a la casse
if(nom != ""){
var nomCours = cours.nom.toLowerCase()
var nomRecherche = nom.toLowerCase()
// console.log("chercher: " + nomRecherche)
if(nomCours.indexOf(nomRecherche) < 0){
match = false
}
}

// chercher code - pas sensible a la casse
if(code != ""){
var codeCours = cours.code.toLowerCase()
var codeRecherche = code.toLowerCase()
if(codeCours.indexOf(codeRecherche) < 0){
match = false
}
}

if(programme != ""){
if(cours.programme != programme){
match = false
}
}

if(etape != ""){
if(cours.etape != etape){
match = false
}
}

if(match == true){
resultats.push(cours)
console.log(cours.nom)
}
}

console.log(resultats.length)
console.log("ca marche")
afficherCours(resultats)
}

// fonction afficher
function afficherCours(cours) {
console.log(cours.length)
// console.log("afficher cours")

var html = ""

// boucle pour afficher
for (var i = 0; i < cours.length; i++) {
html = html + "<div class='cours-item'>"
html = html + "<h3>" + cours[i].nom + "</h3>"
html = html + "<p><strong>Code:</strong> " + cours[i].code + "</p>"
html = html + "<p><strong>Duree:</strong> " + cours[i].duree + " heures</p>"
html = html + "<p><strong>Programme:</strong> " + cours[i].programme + "</p>"
html = html + "<p><strong>Etape:</strong> " + cours[i].etape + "</p>"
html = html + "<p><strong>Type de salle:</strong> " + cours[i].salle + "</p>"
html = html + "</div>"
// console.log("cours " + i)
}

if (cours.length == 0) {
html = "<p>Aucun cours trouve.</p>"
console.log("0")
}

document.getElementById('resultatsCours').innerHTML = html
document.getElementById('nombreResultats').innerHTML = cours.length
}

// fonction reinitialiser
function reinitialiser() {
console.log("reset")
// console.log("reinitialiser filtres")
document.getElementById('filtreNom').value = ""
document.getElementById('filtreCode').value = ""
document.getElementById('filtreProgramme').value = ""
document.getElementById('filtreEtape').value = ""
afficherCours(coursList)
}

// afficher tous les cours au debut
setTimeout(function() {
console.log("afficher tous")
afficherCours(coursList)
}, 100)

return (
<div>
<div className="logo-container">
<img src="/logo.png" alt="LOGO" className="logo" />
</div>

<div className="main-section">
<h1 className="titre-principal">Consulter les Cours</h1>

<div className="filtres-container">
<div className="form-group">
<label>Nom du cours</label>
<input type="text" id="filtreNom" className="form-input" />
</div>

<div className="form-group">
<label>Code du cours</label>
<input type="text" id="filtreCode" className="form-input" />
</div>

<div className="form-group">
<label>Programme</label>
<select id="filtreProgramme" className="form-input">
<option value="">Tous</option>
<option value="informatique">Informatique</option>
<option value="gestion">Gestion</option>
<option value="sante">Santé</option>
</select>
</div>

<div className="form-group">
<label>Etape</label>
<select id="filtreEtape" className="form-input">
<option value="">Toutes</option>
<option value="1">1</option>
<option value="2">2</option>
</select>
</div>

<div className="boutons-container">
<button className="bouton-principal" onClick={rechercherCours}>Rechercher</button>
<button className="bouton-secondaire" onClick={reinitialiser}>Reinitialiser</button>
</div>
</div>

<div className="resultats-section">
<p>Nombre de resultats: <span id="nombreResultats">0</span></p>
<div id="resultatsCours"></div>
</div>
</div>

<div className="footer">
<p>Footer</p>
</div>
</div>
)
}

export default ConsulterCours
