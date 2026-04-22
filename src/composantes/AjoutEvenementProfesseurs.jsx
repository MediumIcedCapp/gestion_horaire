import React, { useState, useEffect } from "react";
import styles from "./AjoutEvenementProfesseurs.module.css";
import { validerEvenementComplet } from '../affectations/AffectationProfesseursCours.js';

export default function AjoutEvenement({ selectedDate, onClose, onSave }) {
  const [coursList, setCoursList] = useState([]);
  const [professeursList, setProfesseursList] = useState([]);
  const [evenementsExistants, setEvenementsExistants] = useState([]);  
  
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : todayStr,
    cours: "",
    professeur: "",
    heureDebut: "08:00",
    heureFin: "11:00"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/cours").then(res => res.json()),
      fetch("http://localhost:5000/api/professeurs").then(res => res.json()),
      fetch("http://localhost:5000/api/evenements").then(res => res.json())
    ])
    .then(([coursData, professeursData, evData]) => {
      setCoursList(coursData);
      setProfesseursList(professeursData);
      setEvenementsExistants(evData || []);
    })
    .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation (Spécialité + Disponibilité + Chevauchement)
      const validationResult = await validerEvenementComplet(formData);

      if (!validationResult.isValid) {
        alert(validationResult.erreurs.join("\n"));
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/evenements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Professeur affecté au cours avec succès !");
        if (onSave) onSave();
        onClose();
      }
    } catch (err) {
      alert("Erreur lors de l'affectation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_card}>

          <div className={styles.modal_header}>
            <h1>Plages et affectation des professeurs</h1>

            <button className={styles.close_btn} onClick={onClose}>&times;</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.event_form}>
            
            <div className={styles.form_group}>
              <label>Cours</label>
              <select name="cours" required value={formData.cours} onChange={handleChange}>
                <option value="">-- Choisir un cours --</option>
                {coursList.map(c => (
                  <option key={c.code} value={c.nomDuCours}>
                    {c.nomDuCours} ({c.specialite})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.form_group}>
              <label>Professeur</label>
              <select name="professeur" required value={formData.professeur} onChange={handleChange}>
                <option value="">-- Choisir un professeur --</option>
                {professeursList.map(p => (
                  <option key={p.matricule} value={p.matricule}>
                    {p.prenom} {p.nom} ({p.specialite})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.time_grid}>
              <div className={styles.form_group}>
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} min={todayStr} required />
              </div>
              <div className={styles.form_group}>
                <label>Début</label>
                <input type="time" name="heureDebut" value={formData.heureDebut} onChange={handleChange} required />
              </div>
              <div className={styles.form_group}>
                <label>Fin</label>
                <input type="time" name="heureFin" value={formData.heureFin} onChange={handleChange} required />
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