//Résumé du fichier: 
//  Autheur: Queren D
//  Tâche: Ajouter une composante pour modifier les informations d'un cours existant
import React, { useState, useEffect } from "react";
import styles from "./ModificationCours.module.css";
import Swal from 'sweetalert2'; 


// Composante pour modifier les informations d'un cours existant
export default function ModificationCours({ onSave, onCancel }) {
  // State pour stocker la liste des cours, le nom du cours sélectionné et les données du formulaire
  const [coursList, setCoursList] = useState([]);
  const [selectedCoursNom, setSelectedCoursNom] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    duree: "",
    programme: "",
    etapeEtude: "",
    typeSalle: ""
  });

  // State pour les erreurs de validation et l'état de soumission
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger la liste des cours au démarrage
  useEffect(() => {
    fetch("http://localhost:5000/api/cours")
      .then((res) => res.json())
      .then((data) => setCoursList(data))
      .catch((err) => console.error("Erreur chargement cours:", err));
  }, []);

  // Remplir le formulaire quand on sélectionne un cours
  const handleSelectionChange = (e) => {
    const nomSelectionne = e.target.value;
    setSelectedCoursNom(nomSelectionne);

    // Trouver le cours sélectionné dans la liste et remplir le formulaire avec ses données
    if (nomSelectionne) {
      const cours = coursList.find((c) => c.nomDuCours === nomSelectionne);
      if (cours) {
        setFormData({
          nom: cours.nomDuCours || "",
          code: cours.code || "",
          duree: cours.duree || "",
          programme: cours.programme || "",
          etapeEtude: cours.etapeEtude || "",
          typeSalle: cours.typeSalle || ""
        });
      }
    }
  };

  // Fonction pour gérer les changements dans les champs du formulaire et mettre à jour le state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fonction pour valider les données du formulaire avant soumission
  const validateForm = () => {
    let newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.code.trim()) newErrors.code = "Le code est requis";
    if (!formData.duree || formData.duree <= 0) newErrors.duree = "Durée invalide";
    if (!formData.programme.trim()) newErrors.programme = "Le programme est requis";
    if (!formData.etapeEtude) newErrors.etapeEtude = "L'étape est requise";
    if (!formData.typeSalle) newErrors.typeSalle = "Le type de salle est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour gérer la soumission du formulaire, valider les données et envoyer la requête de modification au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ancienNomDuCours: selectedCoursNom,
          nom: formData.nom,
          code: formData.code,
          duree: formData.duree,
          programme: formData.programme,
          etape: formData.etapeEtude,
          typeSalle: formData.typeSalle
        }),
      });

      // Traiter la réponse du backend pour afficher un message de succès ou d'erreur
      const data = await response.json();
      if (data.success) {
          Swal.fire({
            title: 'Erreur de connexion',
            text: 'Role non reconnu ou erreur de connexion',
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
        if (onSave) onSave();
        onCancel();
      } else {
        Swal.fire({
          title: 'Erreur de connexion',
          text: 'Role non reconnu ou erreur de connexion',
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
      console("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Listes de valeurs pour les filtres de type salle, étape d'étude et période
  const typesSalle = ["Laboratoire", "Salle de cours", "Amphithéâtre", "Salle informatique"];
  const etapes = ["1", "2", "3", "4", "5", "6"];

  // State pour les filtres de consultation des cours
  return (
    <div className={styles.modification_page}>
      <div className={styles.modification_overlay} onClick={onCancel}></div>

      {/* Conteneur principal pour la modification d'un cours avec formulaire et sélection du cours à modifier */}
      <div className={styles.modification_container}>
        <div className={styles.modification_card}>
          <div className={styles.modification_header}>
            <h2>Modifier un cours</h2>
            <button className={styles.close_btn} onClick={onCancel}>&times;</button>
          </div>

          {/* Section de sélection du cours à modifier avec un menu déroulant */}
          <div className={styles.selection_section}>
            <label className={styles.select_label_text}>Choisir le cours à modifier :</label>
            <select 
              className={styles.main_select}
              value={selectedCoursNom} 
              onChange={handleSelectionChange}
            >
              <option value="">-- Sélectionnez un cours --</option>
              {coursList.map((c) => (
                <option key={c.nomDuCours} value={c.nomDuCours}>
                  {c.nomDuCours} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Afficher le formulaire de modification uniquement si un cours est sélectionné, avec validation et gestion des erreurs */}
          {selectedCoursNom && (
            <form className={styles.modification_form} onSubmit={handleSubmit} noValidate>
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input type="text" name="nom" required value={formData.nom} onChange={handleChange} />
                  <label>Nom du cours</label>
                </div>
                {errors.nom && <span className={styles.error_message}>{errors.nom}</span>}
              </div>

              {/* Champ de saisie pour le code du cours, avec validation et affichage des erreurs */}
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input type="text" name="code" required value={formData.code} onChange={handleChange} />
                  <label>Code du cours</label>
                </div>
                {errors.code && <span className={styles.error_message}>{errors.code}</span>}
              </div>

              {/* Champ de saisie pour la durée du cours, avec validation et affichage des erreurs */}
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input type="number" name="duree" required value={formData.duree} onChange={handleChange} />
                  <label>Durée (heures)</label>
                </div>
                {errors.duree && <span className={styles.error_message}>{errors.duree}</span>}
              </div>

              {/* Champ de saisie pour le programme du cours, avec validation et affichage des erreurs */}
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input type="text" name="programme" required value={formData.programme} onChange={handleChange} />
                  <label>Programme</label>
                </div>
                {errors.programme && <span className={styles.error_message}>{errors.programme}</span>}
              </div>

              {/* Menu déroulant pour sélectionner l'étape d'étude, avec validation et affichage des erreurs */}
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <select name="etapeEtude" required value={formData.etape} onChange={handleChange}>
                    <option value=""></option>
                    {etapes.map((e) => <option key={e} value={e}>Étape {e}</option>)}
                  </select>
                  <label>Étape d'étude</label>
                </div>
                {errors.etape && <span className={styles.error_message}>{errors.etape}</span>}
              </div>

              {/* Menu déroulant pour sélectionner le type de salle, avec validation et affichage des erreurs */}
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <select name="typeSalle" required value={formData.typeSalle} onChange={handleChange}>
                    <option value=""></option>
                    {typesSalle.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <label>Type de salle</label>
                </div>
                {errors.typeSalle && <span className={styles.error_message}>{errors.typeSalle}</span>}
              </div>

              {/* Boutons d'action pour annuler ou soumettre les modifications, avec état de soumission pour désactiver le bouton pendant l'enregistrement */}
              <div className={styles.form_actions}>
                <button type="button" className={styles.cancel_btn} onClick={onCancel}>Annuler</button>
                <button type="submit" className={styles.submit_btn} disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}