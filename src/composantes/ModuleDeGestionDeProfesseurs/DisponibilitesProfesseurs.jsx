// Mahad M: Définir les disponibilités du professeur (jours et plages horaires). 
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Professeurs.module.css";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const emptyDisponibilite = {
  jour: "Lundi",
  heureDebut: "08:00",
  heureFin: "12:00"
};

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
      console.error("Erreur chargement disponibilites:", err);
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
      alert("Veuillez completer le jour et les deux heures.");
      return;
    }

    if (currentSlot.heureDebut >= currentSlot.heureFin) {
      alert("L'heure de fin doit etre apres l'heure de debut.");
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
      alert("Veuillez selectionner un professeur.");
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
        alert("Disponibilites enregistrees avec succes.");
        if (onSave) onSave(data.data);
      } else {
        alert(data.message || "Erreur lors de l'enregistrement des disponibilites.");
      }
    } catch (err) {
      console.error("Erreur sauvegarde disponibilites:", err);
      alert("Erreur lors de l'enregistrement des disponibilites.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Definir les disponibilites</h2>
            <p>Choisissez le professeur puis enregistrez ses plages horaires par jour.</p>
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

                <button type="button" className={styles.neutralButton} onClick={handleAddSlot}>Ajouter la plage</button>
              </div>

              <div className={styles.infoBox}>
                Enregistrez une ou plusieurs disponibilites. Vous pouvez revenir plus tard pour les modifier.
              </div>

              <div className={styles.slotList}>
                {isLoading ? (
                  <div className={styles.centerText}>Chargement des disponibilites...</div>
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
                  <div className={styles.centerText}>Aucune disponibilite definie pour ce professeur.</div>
                )}
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={onCancel}>Annuler</button>
                <button type="button" className={styles.primaryButton} onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Enregistrement..." : "Enregistrer les disponibilites"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
