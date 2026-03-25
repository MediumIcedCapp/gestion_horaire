//Queren D: Créer un cours en définissant : nom, code, durée, programme, étape d'étude et type de salle.
import React, { useState } from "react";
import styles from "./AjoutCours.module.css";

export default function AjoutCours({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    duree: "",
    programme: "",
    etape: "",
    typeSalle: ""
  });

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
    let newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom du cours est requis";
    if (!formData.code.trim()) newErrors.code = "Le code du cours est requis";
    if (!formData.duree || formData.duree <= 0) newErrors.duree = "La durée est requise";
    if (!formData.programme.trim()) newErrors.programme = "Le programme est requis";
    if (!formData.etapeEtude.trim()) newErrors.etapeEtude = "L'étape d'étude est requise";
    if (!formData.typeSalle.trim()) newErrors.typeSalle = "Le type de salle est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/cours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: formData.nom,
            code: formData.code,
            duree: Number(formData.duree),      
            programme: formData.programme,
            etape: Number(formData.etape),      
            typeSalle: formData.typeSalle
          }),
        });

        const data = await response.json();

        if (response.ok) { 
          alert("Cours créé avec succès");
          if (onSave) onSave(data);
        } else {
          alert(data.message || "Erreur lors de la création du cours");
        }

      } catch (err) {
        console.error("Erreur création cours:", err);
        alert("Erreur lors de la création du cours : " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const typesSalle = ["Laboratoire", "Salle de cours", "Amphithéâtre", "Salle informatique"];
  const etapes = ["1", "2", "3", "4", "5", "6"];

  return (
    <div className={styles.ajout_page}>
      <div className={styles.ajout_container}>
        <div className={styles.ajout_card}>
          <div className={styles.ajout_header}>
            <h2>Ajouter un cours</h2>
            <p>Remplissez les champs pour créer un nouveau cours</p>
          </div>

          <form className={styles.ajout_form} noValidate onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <div className={styles.input_wrapper}>
                <input type="text" id="nom" name="nom" required value={formData.nom} onChange={handleChange} />
                <label htmlFor="nom">Nom du cours</label>
              </div>
              {errors.nom && <span className={styles.error_message}>{errors.nom}</span>}
            </div>

            <div className={styles.form_group}>
              <div className={styles.input_wrapper}>
                <input type="text" id="code" name="code" required value={formData.code} onChange={handleChange} />
                <label htmlFor="code">Code du cours</label>
              </div>
              {errors.code && <span className={styles.error_message}>{errors.code}</span>}
            </div>

            <div className={styles.form_group}>
              <div className={styles.input_wrapper}>
                <input type="number" id="duree" name="duree" required min="1" value={formData.duree} onChange={handleChange} />
                <label htmlFor="duree">Durée (heures)</label>
              </div>
              {errors.duree && <span className={styles.error_message}>{errors.duree}</span>}
            </div>

            <div className={styles.form_group}>
              <div className={styles.input_wrapper}>
                <input type="text" id="programme" name="programme" required value={formData.programme} onChange={handleChange} />
                <label htmlFor="programme">Programme</label>
              </div>
              {errors.programme && <span className={styles.error_message}>{errors.programme}</span>}
            </div>

            <div className={styles.form_group}>
              <div className={styles.input_wrapper}>
                <select id="etapeEtude" name="etapeEtude" required value={formData.etapeEtude} onChange={handleChange}>
                  <option value="">Sélectionnez une étape</option>
                  {etapes.map((etape) => (<option key={etape} value={etape}>Étape {etape}</option>))}
                </select>
                <label htmlFor="etapeEtude">Étape d'étude</label>
              </div>
              {errors.etapeEtude && <span className={styles.error_message}>{errors.etapeEtude}</span>}
            </div>

            <div className={styles.form_group}>
              <div className={styles.input_wrapper}>
                <select id="typeSalle" name="typeSalle" required value={formData.typeSalle} onChange={handleChange}>
                  <option value="">Sélectionnez un type de salle</option>
                  {typesSalle.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
                <label htmlFor="typeSalle">Type de salle</label>
              </div>
              {errors.typeSalle && <span className={styles.error_message}>{errors.typeSalle}</span>}
            </div>

            <div className={styles.form_actions}>
              <button type="button" className={styles.cancel_btn} onClick={onCancel} disabled={isSubmitting}>Annuler</button>
              <button className={styles.submit_btn} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le cours"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
