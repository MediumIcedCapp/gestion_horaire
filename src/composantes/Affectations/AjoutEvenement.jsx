//  Autheur: Quérèn D et Danick A
//  Tâche: Affectation des professeurs aux cours avec vérification de spécialité et disponibilité.

import React, { useState, useEffect } from "react";
import styles from "./AjoutEvenement.module.css";

// Import du module de validation des conflits
import { validerEvenementComplet } from '../affectations/AffectationCoursEmploisDuTemps.js';

// Composante pour ajouter un événement au calendrier en sélectionnant un cours, une salle, une date et une heure de début/fin
export default function AjoutEvenement({ selectedDate, onClose, onSave }) {
  const [coursList, setCoursList] = useState([]);
  const [sallesList, setSallesList] = useState([]);
  const [professeursList, setProfesseursList] = useState([]);
  const [evenementsExistants, setEvenementsExistants] = useState([]);  
  
  const todayStr = new Date().toISOString().split('T')[0];

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

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/cours").then(res => res.json()),
      fetch("http://localhost:5000/api/salles").then(res => res.json()),
      fetch("http://localhost:5000/api/professeurs").then(res => res.json()),
      fetch("http://localhost:5000/api/evenements").then(res => res.json()) // Crucial pour les collisions
    ])
    .then(([coursData, sallesData, professeursData, evData]) => {
      setCoursList(coursData);
      setSallesList(sallesData);
      setProfesseursList(professeursData);
      setEvenementsExistants(evData || []);
    })
    .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateTime = () => {
    const now = new Date();
    const [year, month, day] = formData.date.split('-').map(Number);
    const [h, m] = formData.heureDebut.split(':').map(Number);
    const selectedFullDate = new Date(year, month - 1, day, h, m, 0, 0);

    if (formData.date < todayStr) {
      alert("La date sélectionnée ne peut pas être dans le passé.");
      return false;
    }

    if (formData.date === todayStr && selectedFullDate < now) {
      alert("L'heure de début est déjà passée pour aujourd'hui.");
      return false;
    }

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

    const professeur = professeursList.find(p => String(p.matricule) === String(formData.professeur));
    const coursSelectionne = coursList.find(c => String(c.nomDuCours) === String(formData.cours));
    
    if (!professeur) {
      alert("Veuillez sélectionner un professeur.");
      return false;
    }

    // 1. Vérifier Disponibilité Statut
    if (professeur.disponibilite === "Indisponible") {
      alert(`Le professeur ${professeur.nom} est marqué comme indisponible.`);
      return false;
    }

    // 2. Vérifier Spécialité (Version Robuste)
    if (coursSelectionne && professeur.specialite) {
      const specCours = String(coursSelectionne.specialite).trim().toLowerCase();
      const specProf = String(professeur.specialite).trim().toLowerCase();

      if (specCours !== specProf) {
        alert(`Incompatibilité : Ce cours nécessite la spécialité '${coursSelectionne.specialite}', mais le professeur est spécialisé en '${professeur.specialite}'.`);
        return false;
      }
    }

    // 3. Empêcher l'affectation à deux cours simultanés
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTime()) return;

    setIsSubmitting(true);
    try {
      // Validation complète des conflits d'horaire
      const validationResult = await validerEvenementComplet(formData);

      if (!validationResult.isValid) {
        // Afficher les erreurs de validation
        let messageErreur = "Erreurs de validation:\n";

        if (validationResult.erreurs && validationResult.erreurs.length > 0) {
          messageErreur += "\nErreurs de données:\n" + validationResult.erreurs.join("\n");
        }

        if (validationResult.conflits && validationResult.conflits.hasConflicts) {
          messageErreur += "\n\nConflits détectés:";

          if (validationResult.conflits.salle.length > 0) {
            messageErreur += "\n\nConflits de salle:";
            validationResult.conflits.salle.forEach(conflit => {
              messageErreur += `\n• ${conflit.message}`;
            });
          }
        }

        alert(messageErreur);
        setIsSubmitting(false);
        return;
      }

      // Si validation réussie, procéder à l'envoi
      const response = await fetch("http://localhost:5000/api/evenements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Événement ajouté et professeur affecté avec succès !");
        if (onSave) onSave();
        onClose();
      } else {
        alert("Erreur lors de l'ajout de l'événement");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la validation ou de l'ajout de l'événement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_card}>
          <div className={styles.modal_header}>
            <h2>Affectation Professeur & Cours</h2>
            <button className={styles.close_btn} onClick={onClose}>&times;</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.event_form}>
            <div className={styles.form_group}>
              <label>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} min={todayStr} required />
            </div>

            <div className={styles.form_group}>
              <label>Cours (Vérifie la spécialité)</label>
              <select name="cours" required value={formData.cours} onChange={handleChange}>
                <option value="">-- Choisir un cours --</option>
                {coursList.map(c => (
                  <option key={c.code} value={c.nomDuCours}>{c.nomDuCours} ({c.specialite})</option>
                ))}
              </select>
            </div>

            <div className={styles.form_group}>
              <label>Professeur</label>
              <select name="professeur" required value={formData.professeur} onChange={handleChange}>
                <option value="">-- Choisir un professeur --</option>
                {professeursList.map(p => (
                  <option key={p.matricule} value={p.matricule}>{p.prenom} {p.nom} ({p.specialite})</option>
                ))}
              </select>
            </div>

            <div className={styles.form_group}>
              <label>Salle</label>
              <select name="salle" required value={formData.salle} onChange={handleChange}>
                <option value="">-- Choisir une salle --</option>
                {sallesList.map(s => (
                  <option key={s.code} value={s.code}>{s.code}</option>
                ))}
              </select>
            </div>

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

            <div className={styles.modal_buttons}>
              <button type="button" className={styles.cancel_btn} onClick={onClose}>Annuler</button>
              <button type="submit" className={styles.confirm_btn} disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Confirmer l'affectation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}