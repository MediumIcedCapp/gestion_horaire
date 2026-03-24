//Queren D: Supprimer un cours avec confirmation et archivage.
import React, { useState } from "react";
import styles from "./SuppressionCours.module.css";

export default function SuppressionCours({ cours, onConfirm, onCancel, onArchive }) {
  const [step, setStep] = useState("confirmation");
  const [archiveReason, setArchiveReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const archivedCours = {
        ...cours,
        dateArchivage: new Date().toISOString(),
        raisonArchivage: archiveReason || "Suppression par administrateur",
        statut: "archive"
      };

      if (onArchive) {
        await onArchive(archivedCours);
      }

      const response = await fetch(`http://localhost:5000/api/cours/${cours.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.success) {
        alert("Cours supprimé avec succès");
        if (onConfirm) onConfirm(cours.id);
      } else {
        alert(data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression du cours : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmStep = () => {
    setStep("archivage");
  };

  return (
    <div className={styles.suppression_page}>
      <div className={styles.suppression_overlay} onClick={onCancel}></div>
      <div className={styles.suppression_container}>
        <div className={styles.suppression_card}>
          <div className={styles.suppression_header}>
            <h2>Supprimer le cours</h2>
            <button className={styles.close_btn} onClick={onCancel}>&times;</button>
          </div>

          {step === "confirmation" && (
            <div className={styles.suppression_body}>
              <div className={styles.warning_icon}>
                <span role="img" aria-label="warning">&#9888;</span>
              </div>
              <p className={styles.warning_text}>Êtes-vous sûr de vouloir supprimer ce cours ?</p>
              <div className={styles.cours_details}>
                <p><strong>Code:</strong> {cours?.code}</p>
                <p><strong>Nom:</strong> {cours?.nom}</p>
                <p><strong>Programme:</strong> {cours?.programme}</p>
                <p><strong>Durée:</strong> {cours?.duree}h</p>
              </div>
              <p className={styles.info_text}>
                Cette action archivera le cours avant de le supprimer. Vous pourrez retrouver les informations dans les archives.
              </p>
              <div className={styles.form_actions}>
                <button type="button" className={styles.cancel_btn} onClick={onCancel} disabled={isProcessing}>Annuler</button>
                <button type="button" className={styles.danger_btn} onClick={handleConfirmStep} disabled={isProcessing}>Continuer</button>
              </div>
            </div>
          )}

          {step === "archivage" && (
            <div className={styles.suppression_body}>
              <h3>Archivage du cours</h3>
              <p>Avant de supprimer le cours, veuillez indiquer la raison de la suppression (optionnel):</p>

              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <textarea
                    id="archiveReason"
                    value={archiveReason}
                    onChange={(e) => setArchiveReason(e.target.value)}
                    placeholder="Ex: Cours annulé, Professeur parti, Réorganisation..."
                    rows="3"
                  />
                  <label htmlFor="archiveReason">Raison de la suppression</label>
                </div>
              </div>

              <div className={styles.archive_info}>
                <p><strong>Informations archivées:</strong></p>
                <ul>
                  <li>Code: {cours?.code}</li>
                  <li>Nom: {cours?.nom}</li>
                  <li>Programme: {cours?.programme}</li>
                  <li>Date d'archivage: {new Date().toLocaleDateString("fr-FR")}</li>
                </ul>
              </div>

              <div className={styles.form_actions}>
                <button type="button" className={styles.cancel_btn} onClick={() => setStep("confirmation")} disabled={isProcessing}>Retour</button>
                <button type="button" className={styles.danger_btn} onClick={handleDelete} disabled={isProcessing}>
                  {isProcessing ? "Suppression..." : "Confirmer la suppression"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
