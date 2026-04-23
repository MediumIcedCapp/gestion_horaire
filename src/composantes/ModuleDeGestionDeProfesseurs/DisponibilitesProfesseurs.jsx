// Mahad M: Definir les indisponibilites du professeur (jours et plages horaires).
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Professeurs.module.css";
import Swal from 'sweetalert2'; 


const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const emptyDisponibilite = {
  jour: "Lundi",
  heureDebut: "08:00",
  heureFin: "12:00"
};

function estEnConflit(debutA, finA, debutB, finB) {
  return debutA < finB && finA > debutB;
}

export default function DisponibilitesProfesseurs({ onSave, onCancel }) {
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProfesseurId, setSelectedProfesseurId] = useState("");
  const [slots, setSlots] = useState([]);
  const [currentSlot, setCurrentSlot] = useState(emptyDisponibilite);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfesseurs = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/professeurs");
      const data = await response.json();
      setProfesseurs(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Erreur chargement professeurs:", err);
      setProfesseurs([]);
    }
  }, []);

  const fetchDisponibilites = useCallback(async (professeurId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${professeurId}/disponibilites`);
      const data = await response.json();
      const disponibilites = Array.isArray(data) ? data : data.data || [];
      setSlots(
        disponibilites.map((item) => ({
          idDisponibilite: item.idDisponibilite,
          jour: item.jour,
          heureDebut: String(item.heureDebut).slice(0, 5),
          heureFin: String(item.heureFin).slice(0, 5)
        }))
      );
    } catch (err) {
      console.error("Erreur chargement indisponibilites:", err);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfesseurs();
  }, [fetchProfesseurs]);

  const handleProfesseurChange = async (e) => {
    const professeurId = e.target.value;
    setSelectedProfesseurId(professeurId);
    setCurrentSlot(emptyDisponibilite);

    if (!professeurId) {
      setSlots([]);
      return;
    }

    await fetchDisponibilites(professeurId);
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setCurrentSlot((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = () => {
    if (!currentSlot.jour || !currentSlot.heureDebut || !currentSlot.heureFin) {
      Swal.fire({
        title: 'Erreur',
        text: "Veuillez completer le jour et les deux heures.",
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
      return;
    }

    if (currentSlot.heureDebut >= currentSlot.heureFin) {
      Swal.fire({
        title: 'Erreur',
        text: "L'heure de fin doit etre apres l'heure de debut.",
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
      return;
    }

    const conflitExistant = slots.some(
      (slot) =>
        slot.jour === currentSlot.jour &&
        estEnConflit(currentSlot.heureDebut, currentSlot.heureFin, slot.heureDebut, slot.heureFin)
    );

    if (conflitExistant) {
      Swal.fire({
        title: 'Erreur',
        text: "Cette plage est en conflit avec une indisponibilite existante.",
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
      return;
    }

    setSlots((prev) => [...prev, { ...currentSlot, idDisponibilite: `${currentSlot.jour}-${currentSlot.heureDebut}-${prev.length}` }]);
    setCurrentSlot(emptyDisponibilite);
  };

  const handleRemoveSlot = (slotId) => {
    setSlots((prev) => prev.filter((slot) => slot.idDisponibilite !== slotId));
  };

  const handleSave = async () => {
    if (!selectedProfesseurId) {
      Swal.fire({
        title: 'Erreur',
        text: "Veuillez selectionner un professeur.",
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
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${selectedProfesseurId}/disponibilites`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disponibilites: slots.map(({ jour, heureDebut, heureFin }) => ({ jour, heureDebut, heureFin }))
        })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Succès',
          text: 'Indisponibilites enregistrees avec succes.',
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
        if (onSave) onSave(data.data);
      } else {
        Swal.fire({
          title: 'Erreur',
          text: data.message || "Erreur lors de l'enregistrement des indisponibilites.",
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
    } catch (err) {
      console.error("Erreur sauvegarde indisponibilites:", err);
      Swal.fire({
        title: 'Erreur',
        text: "Erreur lors de l'enregistrement des indisponibilites.",
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
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Definir les indisponibilites</h2>
            <p>Choisissez le professeur puis enregistrez ses plages d'indisponibilite par jour.</p>
          </div>

          <div className={styles.selectionRow}>
            <label htmlFor="professeur-disponibilites">Professeur</label>
            <select id="professeur-disponibilites" className={styles.selectInput} value={selectedProfesseurId} onChange={handleProfesseurChange}>
              <option value="">-- Selectionnez un professeur --</option>
              {professeurs.map((professeur) => (
                <option key={professeur.idProfesseur} value={professeur.idProfesseur}>
                  {professeur.nom} {professeur.prenom} ({professeur.matricule})
                </option>
              ))}
            </select>
          </div>

          {selectedProfesseurId && (
            <>
              <div className={styles.slotForm}>
                <div className={styles.field}>
                  <label htmlFor="jour">Jour</label>
                  <select id="jour" name="jour" value={currentSlot.jour} onChange={handleSlotChange} className={styles.selectInput}>
                    {jours.map((jour) => (
                      <option key={jour} value={jour}>{jour}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="heureDebut">Heure de debut</label>
                  <input id="heureDebut" name="heureDebut" type="time" value={currentSlot.heureDebut} onChange={handleSlotChange} className={styles.timeInput} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="heureFin">Heure de fin</label>
                  <input id="heureFin" name="heureFin" type="time" value={currentSlot.heureFin} onChange={handleSlotChange} className={styles.timeInput} />
                </div>

                <button type="button" className={styles.neutralButton} onClick={handleAddSlot}>Ajouter l'indisponibilite</button>
              </div>

              <div className={styles.infoBox}>
                Enregistrez une ou plusieurs indisponibilites. Vous pouvez revenir plus tard pour les modifier.
              </div>

              <div className={styles.slotList}>
                {isLoading ? (
                  <div className={styles.centerText}>Chargement des indisponibilites...</div>
                ) : slots.length > 0 ? (
                  slots.map((slot) => (
                    <div key={slot.idDisponibilite} className={styles.slotItem}>
                      <span className={styles.slotText}>{slot.jour} - {slot.heureDebut} a {slot.heureFin}</span>
                      <button type="button" className={styles.dangerButton} onClick={() => handleRemoveSlot(slot.idDisponibilite)}>
                        Retirer
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.centerText}>Aucune indisponibilite definie pour ce professeur.</div>
                )}
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={onCancel}>Annuler</button>
                <button type="button" className={styles.primaryButton} onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Enregistrement..." : "Enregistrer les indisponibilites"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
