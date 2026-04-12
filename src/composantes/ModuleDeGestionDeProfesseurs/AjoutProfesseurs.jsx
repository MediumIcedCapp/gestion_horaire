// Mahad M: Ajouter un professeur avec ses informations personnelles (matricule, nom, prénom, spécialité).
import React, { useState } from "react";
import styles from "./Professeurs.module.css";

const disponibilites = ["Disponible", "Occupe", "Indisponible"];

const emptyForm = {
  matricule: "",
  nom: "",
  prenom: "",
  specialite: "",
  disponibilite: "Disponible",
  email: ""
};

export default function AjoutProfesseurs({ onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.matricule.trim()) nextErrors.matricule = "Le matricule est requis.";
    if (!formData.nom.trim()) nextErrors.nom = "Le nom est requis.";
    if (!formData.prenom.trim()) nextErrors.prenom = "Le prenom est requis.";
    if (!formData.specialite.trim()) nextErrors.specialite = "La specialite est requise.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Valider les données du formulaire avant de les envoyer au backend
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/professeurs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matricule: formData.matricule,
            nom: formData.nom,
            prenom: formData.prenom,
            specialite: formData.specialite,
            disponibilite: formData.disponibilite,
            email: formData.email
          }),
        });
        
        // Traiter la réponse du backend et afficher un message de succès ou d'erreur
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Réponse non-JSON du serveur:", jsonError);
          throw new Error("Le serveur a retourné une réponse invalide. Vérifiez que le serveur est en cours d'exécution.");
        }

        if (response.ok) { 
          alert("Professeur ajouté avec succès");
          setFormData(emptyForm);
          if (onSave) onSave(data);
        } else {
          alert(data.message || "Erreur lors de l'ajout du professeur");
        }

      // Gérer les erreurs de réseau ou autres exceptions lors de la requête
      } catch (err) {
        console.error("Erreur ajout professeur:", err);
        alert("Erreur lors de l'ajout du professeur : " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Ajouter un professeur</h2>
            <p>Enregistrez les informations du professeur avant de gerer ses disponibilites.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="matricule">Matricule</label>
                <input id="matricule" name="matricule" value={formData.matricule} onChange={handleChange} className={styles.textInput} />
                {errors.matricule && <span className={styles.errorText}>{errors.matricule}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="nom">Nom</label>
                <input id="nom" name="nom" value={formData.nom} onChange={handleChange} className={styles.textInput} />
                {errors.nom && <span className={styles.errorText}>{errors.nom}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="prenom">Prenom</label>
                <input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} className={styles.textInput} />
                {errors.prenom && <span className={styles.errorText}>{errors.prenom}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="specialite">Specialite</label>
                <input id="specialite" name="specialite" value={formData.specialite} onChange={handleChange} className={styles.textInput} />
                {errors.specialite && <span className={styles.errorText}>{errors.specialite}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="disponibilite">Disponibilite</label>
                <select id="disponibilite" name="disponibilite" value={formData.disponibilite} onChange={handleChange} className={styles.selectInput}>
                  {disponibilites.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Courriel</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={styles.textInput} />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.secondaryButton} onClick={onCancel} disabled={isSubmitting}>Annuler</button>
              <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                {isSubmitting ? "Ajout..." : "Ajouter le professeur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
