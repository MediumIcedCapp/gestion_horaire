//Résumé du fichier: 
//  Autheur: Queren D
//  Tâche: Ajouter une composante pour ajouter un événement au calendrier en sélectionnant un cours, une salle, une date et une heure de début/fin.

//importations des bibliothèques et des styles
import React, { useState, useEffect } from "react";
import styles from "./AjoutEvenement.module.css";

// Composante pour ajouter un événement au calendrier en sélectionnant un cours, une salle, une date et une heure de début/fin
export default function AjoutEvenement({ selectedDate, onClose, onSave }) {
  /* State pour stocker la liste des cours, la liste des salles, les données du formulaire, 
  l'état de soumission et la date d'aujourd'hui pour la validation*/
  const [coursList, setCoursList] = useState([]);
  const [sallesList, setSallesList] = useState([]);
  const [professeursList, setProfesseursList] = useState([]);
  const [evenementsExistants, setEvenementsExistants] = useState([]);  
  
  // Date d'aujourd'hui pour la validation (format YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Initialisation du formulaire avec la date sélectionnée ou la date d'aujourd'hui, et les autres champs vides
  const [formData, setFormData] = useState({
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : todayStr,
    cours: "",
    salle: "",
    capacite: "",
    professeur: "",
    heureDebut: "08:00",
    heureFin: "11:00"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les cours et les salles depuis l'API au montage de la composante
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/cours").then(res => res.json()),
      fetch("http://localhost:5000/api/salles").then(res => res.json()),
      fetch("http://localhost:5000/api/professeurs").then(res => res.json())
    ])
    .then(([coursData, sallesData, professeursData]) => {
      setCoursList(coursData);
      setSallesList(sallesData);
      setProfesseursList(professeursData);
    })
    .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  

  // Fonction pour gérer les changements dans les champs du formulaire et mettre à jour le state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour valider les données du formulaire avant soumission, en vérifiant la date, les heures, les salles, les disponibilités des professeurs, etc. 
  const validateTime = () => {
    const now = new Date();
    
    // On crée un objet Date basé sur la date saisie dans le formulaire
    const [year, month, day] = formData.date.split('-').map(Number);
    const [h, m] = formData.heureDebut.split(':').map(Number);
    
    // On combine la date et l'heure de début pour faire une validation complète
    const selectedFullDate = new Date(year, month - 1, day, h, m, 0, 0);

    // Vérification de la date (ne peut pas être dans le passé)
    if (formData.date < todayStr) {
      alert("La date sélectionnée ne peut pas être dans le passé.");
      return false;
    }

    // Vérification de l'heure de début (ne peut pas être dans le passé si la date est aujourd'hui)
    if (formData.date === todayStr && selectedFullDate < now) {
      alert("L'heure de début est déjà passée pour aujourd'hui.");
      return false;
    }

    // Vérification de la cohérence Début/Fin
    if (formData.heureDebut >= formData.heureFin) {
      alert("L'heure de fin doit être après l'heure de début.");
      return false;
    }
    const professeur = professeursList.find(p => String(p.matricule) === String(formData.professeur));
    const coursSelectionne = coursList.find(c => String(c.nomDuCours) === String(formData.cours));
    
    if (!professeur) {
      alert("Veuillez sélectionner un professeur.");
      return false;
    }

    if (professeur.disponibilite === "Indisponible") {
      alert(`Le professeur ${professeur.nom} est marqué comme indisponible.`);
      return false;
    }

    if (coursSelectionne && professeur.specialite) {
      const specialiteCours = coursSelectionne.nomDuCours.trim().toLowerCase();
      const specialiteProf = professeur.specialite.trim().toLowerCase();
      if (specialiteCours !== specialiteProf) {
        alert(`Incompatibilité : Ce cours nécessite la spécialité '${coursSelectionne.nomDuCours}', mais le professeur est spécialisé en '${professeur.specialite}'.`);
        return false;
      }
    }

    const estOccupe = evenementsExistants.some(e => {
      return (
        String(e.professeur) === String(formData.professeur) &&
        e.date === formData.date &&
        ((formData.heureDebut >= e.heureDebut && formData.heureDebut < e.heureFin) ||
         (formData.heureFin > e.heureDebut && formData.heureFin <= e.heureFin))
      );
    });

    if (estOccupe) {
      alert("Ce professeur est déjà assigné à un autre cours sur cette plage horaire.");
      return false;
    }

    return true;
  };

  // Fonction pour gérer la soumission du formulaire, envoyer les données au backend et gérer la réponse
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTime()) return;

    setIsSubmitting(true);
    
    // Préparation des données à envoyer au backend
    try {
      const response = await fetch("http://localhost:5000/api/evenements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Traiter la réponse du backend et afficher un message de succès ou d'erreur
      if (response.ok) {
        alert("Événement ajouté au calendrier !");
        if (onSave) onSave();
        onClose();
      }
    } catch (err) {
      alert("Erreur lors de l'ajout de l'événement");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Rendu du formulaire d'ajout d'événement avec validation et gestion des erreurs, en utilisant 
  les données chargées pour les cours et les salles*/
  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        {/* Conteneur principal pour le formulaire d'ajout d'événement */}
        <div className={styles.modal_card}>
          <div className={styles.modal_header}>
            <h2>Plages et Affectations</h2>
            <button className={styles.close_btn} onClick={onClose}>&times;</button>
          </div>
          {/* Formulaire pour saisir les détails de l'événement, avec des champs pour la date, le cours, la salle et les heures de début/fin */}
          <form onSubmit={handleSubmit} className={styles.event_form}>
            <div className={styles.form_group}>
              <label>Date sélectionnée</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                min={todayStr} 
                required
              />
            </div>

            {/* Champs de sélection pour les cours et les salles, avec des options chargées depuis l'API */}
            <div className={styles.form_group}>
              <label>Cours</label>
              <select name="cours" required value={formData.cours} onChange={handleChange}>
                <option value="">-- Choisir un cours --</option>
                {coursList.map(c => (
                  <option key={c.code} value={c.nomDuCours}>
                    {c.nomDuCours} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Champ de sélection pour les Professeurs */}
            <div className={styles.form_group}>
              <label>Professeur</label>
              <select 
                name="professeur" 
                required 
                value={formData.professeur} 
                onChange={handleChange}
              >
                <option value="">-- Choisir un professeur --</option>
                {professeursList.map(p => (
                  <option key={p.matricule} value={p.matricule}>
                    {p.prenom} {p.nom} ({p.specialite})
                  </option>
                ))}
              </select>
            </div>

            {/* Champ de sélection pour les salles, avec des options chargées depuis l'API */}
            <div className={styles.form_group}>
              <label>Salle</label>
              <select name="salle" required value={formData.salle} onChange={handleChange}>
                <option value="">-- Choisir une salle --</option>
                {sallesList.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Champs de saisie pour les heures de début et de fin, avec validation pour assurer la cohérence des horaires */}
            <div className={styles.time_grid}>
              <div className={styles.form_group}>
                <label>Début</label>
                <input type="time" name="heureDebut" value={formData.heureDebut} onChange={handleChange} />
              </div>
              <div className={styles.form_group}>
                <label>Fin</label>
                <input type="time" name="heureFin" value={formData.heureFin} onChange={handleChange} />
              </div>
            </div>

            {/* Boutons d'action pour annuler ou confirmer l'ajout de l'événement, avec gestion de l'état de soumission */}
            <div className={styles.modal_buttons}>
              <button type="button" className={styles.cancel_btn} onClick={onClose}>Annuler</button>
              <button type="submit" className={styles.confirm_btn} disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Confirmer l'ajout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}