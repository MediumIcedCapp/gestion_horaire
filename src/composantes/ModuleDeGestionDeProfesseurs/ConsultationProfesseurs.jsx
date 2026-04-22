// Mahad M: Consulter la liste des professeurs avec filtres (spécialité, disponibilité).
import React, { useCallback, useEffect, useState } from "react";
import styles from "./Professeurs.module.css";



const defaultFilters = {
  specialite: "",
  disponibilite: ""
};

const disponibilites = ["Disponible", "Occupe", "Indisponible"];

export default function ConsultationProfesseurs() {
  const [professeurs, setProfesseurs] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfesseurs = useCallback(async (activeFilters) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      if (activeFilters.specialite.trim() !== "") params.append("specialite", activeFilters.specialite.trim());
      if (activeFilters.disponibilite !== "") params.append("disponibilite", activeFilters.disponibilite);

      const queryString = params.toString();
      const response = await fetch(`http://localhost:5000/api/professeurs${queryString ? `?${queryString}` : ""}`);
      const data = await response.json();
      setProfesseurs(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Erreur chargement professeurs:", err);
      setProfesseurs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfesseurs(defaultFilters);
  }, [fetchProfesseurs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProfesseurs(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    fetchProfesseurs(defaultFilters);
  };

  const showEmailColumn = professeurs.some((professeur) => Object.prototype.hasOwnProperty.call(professeur, "email"));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Consultation des professeurs</h2>
            <p>Filtrez les professeurs par specialite et disponibilite.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="specialite">Specialite</label>
                <input id="specialite" name="specialite" value={filters.specialite} onChange={handleChange} className={styles.textInput} placeholder="Ex: Informatique" />
              </div>

              <div className={styles.field}>
                <label htmlFor="disponibilite">Disponibilite</label>
                <select id="disponibilite" name="disponibilite" value={filters.disponibilite} onChange={handleChange} className={styles.selectInput}>
                  <option value="">Toutes</option>
                  {disponibilites.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryButton}>Rechercher</button>
              <button type="button" className={styles.secondaryButton} onClick={handleReset}>Reinitialiser</button>
            </div>
          </form>

          <div className={styles.countText}>{professeurs.length} professeur(s) trouve(s)</div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Specialite</th>
                  <th>Disponibilite</th>
                  {showEmailColumn && <th>Courriel</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={showEmailColumn ? 6 : 5} className={styles.centerText}>Chargement...</td>
                  </tr>
                ) : professeurs.length > 0 ? (
                  professeurs.map((professeur) => (
                    <tr key={professeur.idProfesseur}>
                      <td>{professeur.matricule}</td>
                      <td>{professeur.nom}</td>
                      <td>{professeur.prenom}</td>
                      <td>{professeur.specialite}</td>
                      <td><span className={styles.badge}>{professeur.disponibilite}</span></td>
                      {showEmailColumn && <td>{professeur.email || "-"}</td>}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showEmailColumn ? 6 : 5} className={styles.centerText}>Aucun professeur ne correspond aux filtres.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
