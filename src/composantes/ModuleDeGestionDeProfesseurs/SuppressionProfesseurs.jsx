// Mahad M: Supprimer un professeur après vérification de ses affectations.
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Professeurs.module.css";
import Swal from 'sweetalert2'; 


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
        Swal.fire({
          title: 'Erreur',
          text: data.message || "Impossible de verifier la suppression.",
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
      console.error("Erreur verification suppression:", err);
      Swal.fire({
        title: 'Erreur',
        text: "Erreur lors de la verification de la suppression.",
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
      setIsChecking(false);
    }
  };

  const handleDelete = async () => {
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

    if (!verification?.canDelete) {
      Swal.fire({
        title: 'Erreur',
        text: "La suppression est bloquee.",
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
        Swal.fire({
          title: 'Succès',
          text: 'Professeur supprime avec succes.',
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
      } else {
        Swal.fire({
          title: 'Erreur',
          text: data.message || "Erreur lors de la suppression du professeur.",
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
      console.error("Erreur suppression professeur:", err);
      Swal.fire({
        title: 'Erreur',
        text: "Erreur lors de la suppression du professeur.",
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
