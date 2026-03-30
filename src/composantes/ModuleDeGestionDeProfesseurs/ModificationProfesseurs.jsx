// Mahad M: Modifier les informations et disponibilités d’un professeur.
import React, { useCallback, useEffect, useState } from "react";
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

export default function ModificationProfesseurs({ onSave, onCancel }) {
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProfesseurId, setSelectedProfesseurId] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setErrors({});

    if (!professeurId) {
      setFormData(emptyForm);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${professeurId}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          matricule: data.data.matricule || "",
          nom: data.data.nom || "",
          prenom: data.data.prenom || "",
          specialite: data.data.specialite || "",
          disponibilite: data.data.disponibilite || "Disponible",
          email: data.data.email || ""
        });
      } else {
        alert(data.message || "Impossible de charger ce professeur.");
      }
    } catch (err) {
      console.error("Erreur chargement professeur:", err);
      alert("Erreur lors du chargement du professeur.");
    } finally {
      setIsLoading(false);
    }
  };

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

    if (!selectedProfesseurId) {
      alert("Veuillez selectionner un professeur.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${selectedProfesseurId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert("Professeur modifie avec succes.");
        if (onSave) onSave(data.data);
      } else {
        alert(data.message || "Erreur lors de la modification du professeur.");
      }
    } catch (err) {
      console.error("Erreur modification professeur:", err);
      alert("Erreur lors de la modification du professeur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Modifier un professeur</h2>
            <p>Mettez a jour les informations principales et le statut de disponibilite.</p>
          </div>

          <div className={styles.selectionRow}>
            <label htmlFor="professeur-modification">Choisir le professeur a modifier</label>
            <select id="professeur-modification" value={selectedProfesseurId} onChange={handleSelectionChange} className={styles.selectInput}>
              <option value="">-- Selectionnez un professeur --</option>
              {professeurs.map((professeur) => (
                <option key={professeur.idProfesseur} value={professeur.idProfesseur}>
                  {professeur.nom} {professeur.prenom} ({professeur.matricule})
                </option>
              ))}
            </select>
          </div>

          {isLoading && <div className={styles.infoBox}>Chargement du professeur...</div>}

          {selectedProfesseurId && !isLoading && (
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
                <button type="button" className={styles.secondaryButton} onClick={onCancel}>Annuler</button>
                <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
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
