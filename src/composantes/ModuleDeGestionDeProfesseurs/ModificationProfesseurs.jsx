import { useEffect, useState } from "react";
import styles from "./ModificationProfesseurs.module.css";

const disponibilites = ["Disponible", "Occupe", "Indisponible"];

export default function ModificationProfesseurs({ onSave, onCancel }) {
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProfesseurId, setSelectedProfesseurId] = useState("");
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    specialite: "",
    disponibilite: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/professeurs")
      .then((response) => response.json())
      .then((data) => setProfesseurs(data.data || []))
      .catch((err) => console.error("Erreur chargement professeurs:", err));
  }, []);

  const handleSelectionChange = async (e) => {
    const professeurId = e.target.value;
    setSelectedProfesseurId(professeurId);
    setErrors({});

    if (!professeurId) {
      setFormData({
        matricule: "",
        nom: "",
        prenom: "",
        specialite: "",
        disponibilite: ""
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/professeurs/${professeurId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({
          matricule: data.data.matricule || "",
          nom: data.data.nom || "",
          prenom: data.data.prenom || "",
          specialite: data.data.specialite || "",
          disponibilite: data.data.disponibilite || ""
        });
      } else {
        alert(data.message || "Impossible de charger le professeur");
      }
    } catch (err) {
      console.error("Erreur chargement professeur:", err);
      alert("Erreur lors du chargement du professeur");
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
    const newErrors = {};

    if (!formData.matricule.trim()) newErrors.matricule = "Le matricule est requis";
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prenom est requis";
    if (!formData.specialite.trim()) newErrors.specialite = "La specialite est requise";
    if (!formData.disponibilite) newErrors.disponibilite = "La disponibilite est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      if (response.ok && data.success) {
        alert("Professeur modifie avec succes.");
        setProfesseurs((prev) =>
          prev.map((professeur) =>
            professeur.idProfesseur === data.data.idProfesseur ? data.data : professeur
          )
        );

        if (onSave) {
          onSave();
        }
      } else {
        alert(data.message || "Erreur lors de la modification");
      }
    } catch (err) {
      console.error("Erreur modification professeur:", err);
      alert("Erreur lors de la modification du professeur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modification_page}>
      <div className={styles.modification_container}>
        <div className={styles.modification_card}>
          <div className={styles.modification_header}>
            <h2>Modifier un professeur</h2>
          </div>

          <div className={styles.selection_section}>
            <label className={styles.select_label_text} htmlFor="professeurSelect">
              Choisir le professeur a modifier :
            </label>
            <select
              id="professeurSelect"
              className={styles.main_select}
              value={selectedProfesseurId}
              onChange={handleSelectionChange}
            >
              <option value="">-- Selectionnez un professeur --</option>
              {professeurs.map((professeur) => (
                <option key={professeur.idProfesseur} value={professeur.idProfesseur}>
                  {professeur.nom} {professeur.prenom} ({professeur.matricule})
                </option>
              ))}
            </select>
          </div>

          {isLoading && <p className={styles.loading_text}>Chargement du professeur...</p>}

          {selectedProfesseurId && !isLoading && (
            <form className={styles.modification_form} onSubmit={handleSubmit} noValidate>
              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input id="matricule" type="text" name="matricule" value={formData.matricule} onChange={handleChange} />
                  <label htmlFor="matricule">Matricule</label>
                </div>
                {errors.matricule && <span className={styles.error_message}>{errors.matricule}</span>}
              </div>

              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input id="nom" type="text" name="nom" value={formData.nom} onChange={handleChange} />
                  <label htmlFor="nom">Nom</label>
                </div>
                {errors.nom && <span className={styles.error_message}>{errors.nom}</span>}
              </div>

              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input id="prenom" type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
                  <label htmlFor="prenom">Prenom</label>
                </div>
                {errors.prenom && <span className={styles.error_message}>{errors.prenom}</span>}
              </div>

              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <input id="specialite" type="text" name="specialite" value={formData.specialite} onChange={handleChange} />
                  <label htmlFor="specialite">Specialite</label>
                </div>
                {errors.specialite && <span className={styles.error_message}>{errors.specialite}</span>}
              </div>

              <div className={styles.form_group}>
                <div className={styles.input_wrapper}>
                  <select id="disponibilite" name="disponibilite" value={formData.disponibilite} onChange={handleChange}>
                    <option value=""></option>
                    {disponibilites.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="disponibilite">Disponibilite</label>
                </div>
                {errors.disponibilite && <span className={styles.error_message}>{errors.disponibilite}</span>}
              </div>

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
