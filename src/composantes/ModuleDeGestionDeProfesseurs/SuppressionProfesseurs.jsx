// Mahad M: Supprimer un professeur après vérification de ses affectations.
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Professeurs.module.css";

export default function SuppressionProfesseurs({ onSave, onCancel }) {
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProfesseurId, setSelectedProfesseurId] = useState("");
  const [verification, setVerification] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    fetchProfesseurs();
  }, [fetchProfesseurs]);

  const handleSelectionChange = async (e) => {
    const professeurId = e.target.value;
    setSelectedProfesseurId(professeurId);
    setVerification(null);

    if (!professeurId) {
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${professeurId}/verification-suppression`);
      const data = await response.json();

      if (data.success) {
        setVerification(data.data);
      } else {
        alert(data.message || "Impossible de verifier la suppression.");
      }
    } catch (err) {
      console.error("Erreur verification suppression:", err);
      alert("Erreur lors de la verification de la suppression.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProfesseurId) {
      alert("Veuillez selectionner un professeur.");
      return;
    }

    if (!verification?.canDelete) {
      alert("La suppression est bloquee.");
      return;
    }

    if (!window.confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${selectedProfesseurId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (data.success) {
        alert("Professeur supprime avec succes.");
        if (onSave) onSave();
      } else {
        alert(data.message || "Erreur lors de la suppression du professeur.");
      }
    } catch (err) {
      console.error("Erreur suppression professeur:", err);
      alert("Erreur lors de la suppression du professeur.");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedProfesseur = professeurs.find((professeur) => String(professeur.idProfesseur) === selectedProfesseurId);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Supprimer un professeur</h2>
            <p>La suppression se fait apres verification de ses affectations dans le projet.</p>
          </div>

          <div className={styles.selectionRow}>
            <label htmlFor="professeur-suppression">Professeur a supprimer</label>
            <select id="professeur-suppression" value={selectedProfesseurId} onChange={handleSelectionChange} className={styles.selectInput}>
              <option value="">-- Selectionnez un professeur --</option>
              {professeurs.map((professeur) => (
                <option key={professeur.idProfesseur} value={professeur.idProfesseur}>
                  {professeur.nom} {professeur.prenom} ({professeur.matricule})
                </option>
              ))}
            </select>
          </div>

          {isChecking && <div className={styles.infoBox}>Verification en cours...</div>}

          {selectedProfesseur && verification && (
            <>
              <div className={styles.warningBox}>
                <strong>{selectedProfesseur.nom} {selectedProfesseur.prenom}</strong>
                <div>{verification.message}</div>
                <div>Disponibilites enregistrees: {verification.disponibilites}</div>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={onCancel}>Annuler</button>
                <button type="button" className={styles.dangerButton} onClick={handleDelete} disabled={isDeleting || !verification.canDelete}>
                  {isDeleting ? "Suppression..." : "Supprimer le professeur"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
