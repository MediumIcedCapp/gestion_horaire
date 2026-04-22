//Résumé du fichier: 
//  Autheur: Queren D
//  Tâche: Supprimer un cours avec sélection préalable, confirmation et archivage.

//importations des bibliothèques et des styles
import React, { useState, useEffect } from "react";
import styles from "./SuppressionCours.module.css";
import Swal from 'sweetalert2'; 


// Composante pour supprimer un cours avec sélection préalable, confirmation et archivage
export default function SuppressionCours({ onConfirm, onCancel, onArchive }) {
  /* State pour stocker la liste des cours, le nom du cours sélectionné, les données du cours 
   sélectionné, l'étape du processus de suppression, la raison de l'archivage et l'état de traitement*/
  const [coursList, setCoursList] = useState([]);
  const [selectedCoursNom, setSelectedCoursNom] = useState("");
  const [selectedCoursData, setSelectedCoursData] = useState(null);
  
  const [step, setStep] = useState("selection"); // selection, confirmation, archivage
  const [archiveReason, setArchiveReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les cours au montage
  useEffect(() => {
    fetch("http://localhost:5000/api/cours")
      .then((res) => res.json())
      .then((data) => setCoursList(data))
      .catch((err) => console.error("Erreur chargement cours:", err));
  }, []);

  // Gérer le choix dans le dropdown
  const handleDropdownChange = (e) => {
    const nom = e.target.value;
    setSelectedCoursNom(nom);
    
    if (nom) {
      const coursFound = coursList.find((c) => c.nomDuCours === nom);
      setSelectedCoursData(coursFound);
      setStep("confirmation");
    } else {
      setSelectedCoursData(null);
      setStep("selection");
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      // Préparation des données pour l'archivage (optionnel selon ton backend)
      const archivedCours = {
        ...selectedCoursData,
        dateArchivage: new Date().toISOString(),
        raisonArchivage: archiveReason || "Suppression par administrateur",
      };

      if (onArchive) await onArchive(archivedCours);

      // Suppression via l'API (on utilise le nomDuCours comme identifiant ici)
      const response = await fetch(`http://localhost:5000/api/cours/${encodeURIComponent(selectedCoursNom)}`, {
        method: "DELETE",
      });
      
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Suppression réussie !',
          text: 'Le cours a été supprimé et archivé avec succès',
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
        if (onConfirm) onConfirm();
        onCancel(); // Ferme la modale
      } else {
        Swal.fire({
          title: 'Erreur lors de la suppression',
          text: data.message || "Erreur lors de la suppression",
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
      Swal.fire({
        title: 'Erreur lors de la suppression',
        text: "Erreur lors de la suppression",
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
      setIsProcessing(false);
    }
  };

  // Rendu de la page de suppression des cours avec les différentes étapes du processus (sélection, confirmation, archivage)
  return (
    <div className={styles.suppression_page}>
      <div className={styles.suppression_overlay} onClick={onCancel}></div>
      <div className={styles.suppression_container}>
        <div className={styles.suppression_card}>
          <div className={styles.suppression_header}>
            <h2>Supprimer un cours</h2>
            <button className={styles.close_btn} onClick={onCancel}>&times;</button>
          </div>

          {/*Dropdown de sélection(Toujours visible au début) */}
          <div className={styles.selection_section}>
            <label className={styles.select_label_text}>Sélectionnez le cours à supprimer :</label>
            <select 
              className={styles.main_select}
              value={selectedCoursNom} 
              onChange={handleDropdownChange}
              disabled={isProcessing}
            >
              <option value="">-- Choisir un cours --</option>
              {coursList.map((c) => (
                <option key={c.nomDuCours} value={c.nomDuCours}>
                  {c.nomDuCours} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/*Confirmation des détails */}
          {step === "confirmation" && selectedCoursData && (
            <div className={`${styles.suppression_body} ${styles.fadeIn}`}>
              <div className={styles.warning_icon}>⚠️</div>
              <p className={styles.warning_text}>Voulez-vous vraiment supprimer ce cours ?</p>
              
              <div className={styles.cours_details}>
                <p><strong>Code:</strong> {selectedCoursData.code}</p>
                <p><strong>Nom:</strong> {selectedCoursData.nomDuCours}</p>
                <p><strong>Programme:</strong> {selectedCoursData.programme}</p>
              </div>

              <div className={styles.form_actions}>
                <button className={styles.cancel_btn} onClick={onCancel}>Annuler</button>
                <button className={styles.danger_btn} onClick={() => setStep("archivage")}>Continuer</button>
              </div>
            </div>
          )}

          {/* raison d'archivage et action finale */}
          {step === "archivage" && selectedCoursData && (
            <div className={`${styles.suppression_body} ${styles.fadeIn}`}>
              <h3>Raison de l'archivage</h3>
              <div className={styles.form_group}>
                <textarea
                  className={styles.reason_area}
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="Ex: Fin de programme, modification majeure..."
                  rows="3"
                />
              </div>

              <div className={styles.form_actions}>
                <button className={styles.cancel_btn} onClick={() => setStep("confirmation")}>Retour</button>
                <button className={styles.danger_btn} onClick={handleDelete} disabled={isProcessing}>
                  {isProcessing ? "Traitement..." : "Confirmer la suppression définitive"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}