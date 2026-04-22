

import { useEffect, useMemo, useState } from 'react';
import styles from './AffectationEmploisTemps.module.css';
import { validerEvenementComplet } from '../affectations/AffectationCoursEmploisDuTemps.js';

export default function AffectationEmploisTemps({ selectedDate, onClose, onSave }) {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [coursList, setCoursList] = useState([]);
  const [sallesList, setSallesList] = useState([]);
  const [isLoadingCours, setIsLoadingCours] = useState(true);
  const [isLoadingSalles, setIsLoadingSalles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : todayStr,
    cours: '',
    salle: '',
    heureDebut: '08:00',
    heureFin: '11:00'
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : todayStr
    }));
  }, [selectedDate, todayStr]);

  useEffect(() => {
    const fetchCours = async () => {
      setIsLoadingCours(true);
      setErrorMessage('');
      try {
        const response = await fetch('http://localhost:5000/api/cours');
        if (!response.ok) {
          throw new Error('Impossible de charger la liste des cours.');
        }
        const data = await response.json();
        setCoursList(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorMessage('Erreur de chargement des cours.');
      } finally {
        setIsLoadingCours(false);
      }
    };

    fetchCours();
  }, []);

  useEffect(() => {
    const fetchSalles = async () => {
      setIsLoadingSalles(true);
      setErrorMessage('');
      try {
        const response = await fetch('http://localhost:5000/api/salles');
        if (!response.ok) {
          throw new Error('Impossible de charger la liste des salles.');
        }
        const data = await response.json();
        const salles = Array.isArray(data) ? data : [];
        setSallesList(salles);
      } catch (error) {
        setErrorMessage('Erreur de chargement des salles.');
      } finally {
        setIsLoadingSalles(false);
      }
    };

    fetchSalles();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (formData.heureFin <= formData.heureDebut) {
      setErrorMessage("L'heure de fin doit être après l'heure de début.");
      return;
    }

    if (!formData.salle) {
      setErrorMessage('Veuillez sélectionner une salle existante.');
      return;
    }

    const validation = await validerEvenementComplet(formData);
    if (!validation.isValid) {
      const conflitsSalle = validation.conflits?.salle || [];
      const conflitsCours = validation.conflits?.cours || [];
      if (conflitsSalle.length > 0) {
        setErrorMessage(conflitsSalle[0].message);
      } else if (conflitsCours.length > 0) {
        setErrorMessage(conflitsCours[0].message);
      } else if (validation.erreurs?.length > 0) {
        setErrorMessage(validation.erreurs[0]);
      } else {
        setErrorMessage('Conflit détecté pour cette plage horaire.');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/evenements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("L'enregistrement de l'affectation a échoué.");
      }

      if (onSave) {
        onSave();
      }
      onClose();
    } catch (error) {
      setErrorMessage('Erreur lors de la sauvegarde de l\'affectation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2>Affecter un cours</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fermer">
            x
          </button>
        </div>

        <p className={styles.subtitle}>Choisissez une date et ajoutez un cours à l'emploi du temps.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              min={todayStr}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="cours">Cours</label>
            <select
              id="cours"
              name="cours"
              value={formData.cours}
              onChange={handleChange}
              required
              disabled={isLoadingCours}
            >
              <option value="">-- Choisir un cours --</option>
              {coursList.map((cours) => (
                <option key={cours.code} value={cours.nomDuCours}>
                  {cours.nomDuCours} ({cours.code})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.timeGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="heureDebut">Début</label>
              <input
                id="heureDebut"
                name="heureDebut"
                type="time"
                value={formData.heureDebut}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="heureFin">Fin</label>
              <input
                id="heureFin"
                name="heureFin"
                type="time"
                value={formData.heureFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="salle">Salle</label>
            <select
              id="salle"
              name="salle"
              value={formData.salle}
              onChange={handleChange}
              required
              disabled={isLoadingSalles}
            >
              <option value="">-- Choisir une salle --</option>
              {sallesList.map((salle) => (
                <option key={salle.id || salle.code} value={salle.code}>
                  {salle.code} - {salle.type} ({salle.capacite} places)
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting || isLoadingCours || isLoadingSalles}>
              {isSubmitting ? 'Enregistrement...' : 'Ajouter le cours'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}