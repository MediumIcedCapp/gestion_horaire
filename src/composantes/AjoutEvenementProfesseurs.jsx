import React, { useState, useEffect } from "react";
import styles from "./AjoutEvenementProfesseurs.module.css";
import { validerEvenementComplet } from '../affectations/AffectationProfesseursCours.js';
import Swal from "sweetalert2";

export default function AjoutEvenement({ selectedDate, onClose, onSave }) {
  const [coursList, setCoursList] = useState([]);
  const [isLoadingCours, setIsLoadingCours] = useState(true);
  const [professeursList, setProfesseursList] = useState([]);
  
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : todayStr,
    cours: "",
    professeur: "",
    salle: "",
    heureDebut: "08:00",
    heureFin: "11:00"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/professeurs")
      .then(res => res.json())
      .then((professeursData) => setProfesseursList(professeursData || []))
      .catch(err => console.error("Erreur de chargement des professeurs:", err));
  }, []);

  useEffect(() => {
    const fetchCoursAffectes = async () => {
      setIsLoadingCours(true);
      try {
        // Charger TOUS les cours disponibles, pas seulement ceux de la date
        const [responseEvenements, responseCours] = await Promise.all([
          fetch(`http://localhost:5000/api/evenements/${formData.date}`),
          fetch("http://localhost:5000/api/cours")
        ]);

        const evenements = await responseEvenements.json();
        const coursCatalog = await responseCours.json();

        // Charger les cours planifiés pour cette date
        const coursMapDate = new Map();
        if (Array.isArray(evenements)) {
          evenements.forEach((ev) => {
            if (!ev.cours || coursMapDate.has(ev.cours)) {
              return;
            }

            const coursTrouve = Array.isArray(coursCatalog)
              ? coursCatalog.find((cours) => cours.nomDuCours === ev.cours)
              : null;

            coursMapDate.set(ev.cours, {
              nomDuCours: ev.cours,
              code: coursTrouve?.code || "-",
              heureDebut: ev.heureDebut,
              heureFin: ev.heureFin,
              salle: ev.salle
            });
          });
        }

        const coursAffectesDate = Array.from(coursMapDate.values());

        // Si aucun cours n'est planifié cette date, permettre la sélection de tous les cours
        let coursAffectes = coursAffectesDate;
        if (coursAffectesDate.length === 0 && Array.isArray(coursCatalog)) {
          coursAffectes = coursCatalog.map((cours) => ({
            nomDuCours: cours.nomDuCours,
            code: cours.code || "-",
            heureDebut: "08:00",
            heureFin: "11:00",
            salle: "-"
          }));
        }

        setCoursList(coursAffectes);
        const nomsValides = coursAffectes.map((cours) => cours.nomDuCours);
        setFormData((prev) => {
          if (!nomsValides.includes(prev.cours)) {
            return { ...prev, cours: "", salle: "", heureDebut: "", heureFin: "" };
          }

          const coursSelectionne = coursAffectes.find((cours) => cours.nomDuCours === prev.cours);
          if (!coursSelectionne) {
            return prev;
          }

          return {
            ...prev,
            salle: coursSelectionne.salle || "",
            heureDebut: coursSelectionne.heureDebut || "",
            heureFin: coursSelectionne.heureFin || ""
          };
        });
      } catch (err) {
        console.error("Erreur de chargement des cours affectés:", err);
        setCoursList([]);
      } finally {
        setIsLoadingCours(false);
      }
    };

    if (formData.date) {
      fetchCoursAffectes();
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cours") {
      const coursSelectionne = coursList.find((cours) => cours.nomDuCours === value);
      setFormData((prev) => ({
        ...prev,
        cours: value,
        salle: coursSelectionne?.salle || "",
        heureDebut: coursSelectionne?.heureDebut || "",
        heureFin: coursSelectionne?.heureFin || ""
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nomsCoursDisponibles = coursList.map((cours) => cours.nomDuCours);
      if (!nomsCoursDisponibles.includes(formData.cours)) {
        Swal.fire({
          title: 'Erreur',
          text: "Veuillez sélectionner un cours valide.",
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#333',
          iconColor: '#e4e8d6',
          customClass: {
            popup: 'pop-up-toast',
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        setIsSubmitting(false);
        return;
      }

      // Validation (Spécialité + Disponibilité + Chevauchement)
      const validationResult = await validerEvenementComplet(formData);

      if (!validationResult.isValid) {
        Swal.fire({
          title: 'Erreur',
          text: validationResult.erreurs.join("\n"),
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#333',
          iconColor: '#e4e8d6',
          customClass: {
            popup: 'pop-up-toast',
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/evenements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Succès',
          text: "Professeur affecté au cours avec succès !",
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#333',
          iconColor: '#e4e8d6',
          customClass: {
            popup: 'pop-up-toast',
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        if (onSave) onSave();
        onClose();
      } else {
        const errorPayload = await response.json().catch(() => ({}));
        Swal.fire({
          title: 'Erreur',
          text: errorPayload.message || "Erreur lors de l'affectation du professeur.",
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#333',
          iconColor: '#e4e8d6',
          customClass: {
            popup: 'pop-up-toast',
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

      }
    } catch {
      Swal.fire({
        title: 'Erreur',
        text: "Erreur lors de l'affectation du professeur.",
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#ffffff',
        color: '#333',
        iconColor: '#e4e8d6',
        customClass: {
          popup: 'pop-up-toast',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
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
              <select name="cours" required value={formData.cours} onChange={handleChange} disabled={isLoadingCours}>
                <option value="">-- Choisir un cours --</option>
                {coursList.map((cours) => (
                  <option key={cours.nomDuCours} value={cours.nomDuCours}>
                    {cours.nomDuCours} ({cours.code})
                  </option>
                ))}
              </select>
              {!isLoadingCours && coursList.length === 0 && (
                <small style={{ color: '#ef4444' }}>Aucun cours disponible.</small>
              )}
              {!isLoadingCours && formData.cours && (
                <small>
                  Plage horaire : {formData.heureDebut?.substring(0, 5)} - {formData.heureFin?.substring(0, 5)} | Salle: {formData.salle}
                </small>
              )}
            </div>

            <div className={styles.form_group}>
              <label>Professeur</label>
              <select name="professeur" required value={formData.professeur} onChange={handleChange}>
                <option value="">-- Choisir un professeur --</option>
                {professeursList.map(p => (
                  <option key={p.matricule || p.idProfesseur} value={p.matricule || p.idProfesseur}>
                    {p.prenom} {p.nom} ({p.specialite})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modal_buttons}>
              <button type="button" className={styles.cancel_btn} onClick={onClose}>Annuler</button>
              <button type="submit" className={styles.confirm_btn} disabled={isSubmitting || isLoadingCours}>
                {isSubmitting ? "Enregistrement..." : "Confirmer l'affectation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}