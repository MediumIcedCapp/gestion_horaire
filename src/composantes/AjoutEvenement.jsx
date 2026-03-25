import React, { useState, useEffect } from "react";
import styles from "./AjoutEvenement.module.css";

export default function AjoutEvenement({ selectedDate, onClose, onSave }) {
  const [coursList, setCoursList] = useState([]);
  const [sallesList, setSallesList] = useState([]);
  
  // Date d'aujourd'hui pour la validation (format YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : todayStr,
    cours: "",
    salle: "",
    heureDebut: "08:00",
    heureFin: "11:00"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/cours").then(res => res.json()),
      fetch("http://localhost:5000/api/salles").then(res => res.json())
    ])
    .then(([coursData, sallesData]) => {
      setCoursList(coursData);
      setSallesList(sallesData);
    })
    .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateTime = () => {
    const now = new Date();
    
    // On crée un objet Date basé sur la date saisie dans le formulaire
    const [year, month, day] = formData.date.split('-').map(Number);
    const [h, m] = formData.heureDebut.split(':').map(Number);
    
    // month - 1 car les mois commencent à 0 en JS
    const selectedFullDate = new Date(year, month - 1, day, h, m, 0, 0);

    // 1. Vérification de la date (Aujourd'hui ou futur)
    if (formData.date < todayStr) {
      alert("La date sélectionnée ne peut pas être dans le passé.");
      return false;
    }

    // 2. Vérification de l'heure si c'est aujourd'hui
    if (formData.date === todayStr && selectedFullDate < now) {
      alert("L'heure de début est déjà passée pour aujourd'hui.");
      return false;
    }

    // 3. Vérification de la cohérence Début/Fin
    if (formData.heureDebut >= formData.heureFin) {
      alert("L'heure de fin doit être après l'heure de début.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTime()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/evenements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_card}>
          <div className={styles.modal_header}>
            <h2>Programmer un cours</h2>
            <button className={styles.close_btn} onClick={onClose}>&times;</button>
          </div>

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
                {isSubmitting ? "Enregistrement..." : "Confirmer l'ajout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}