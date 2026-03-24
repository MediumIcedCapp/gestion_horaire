//Queren D: Consulter les cours avec filtres (programme, étape, durée, type de salle, période).
import React, { useState, useEffect } from "react";
import styles from "./ConsultationCours.module.css";

export default function ConsultationCours() {
  const [cours, setCours] = useState([]);
  const [filteredCours, setFilteredCours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    programme: "",
    etapeEtude: "",
    duree: "",
    typeSalle: "",
    periode: ""
  });

  const typesSalle = ["Laboratoire", "Salle de cours", "Amphithéâtre", "Salle informatique"];
  const etapes = ["1", "2", "3", "4", "5", "6"];
  const periodes = ["Matin", "Après-midi", "Soir"];

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/cours");
      const data = await response.json();
      if (data.success) {
        setCours(data.cours);
        setFilteredCours(data.cours);
      }
    } catch (err) {
      console.error("Erreur chargement cours:", err);
      alert("Erreur lors du chargement des cours");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let result = cours;
    if (filters.programme) {
      result = result.filter((c) => c.programme.toLowerCase().includes(filters.programme.toLowerCase()));
    }
    if (filters.etapeEtude) {
      result = result.filter((c) => c.etapeEtude === filters.etapeEtude);
    }
    if (filters.duree) {
      result = result.filter((c) => c.duree === parseInt(filters.duree));
    }
    if (filters.typeSalle) {
      result = result.filter((c) => c.typeSalle === filters.typeSalle);
    }
    if (filters.periode) {
      result = result.filter((c) => c.periode === filters.periode);
    }
    setFilteredCours(result);
  }, [filters, cours]);

  const resetFilters = () => {
    setFilters({ programme: "", etapeEtude: "", duree: "", typeSalle: "", periode: "" });
  };

  return (
    <div className={styles.consultation_page}>
      <div className={styles.consultation_container}>
        <div className={styles.consultation_header}>
          <h2>Consultation des cours</h2>
          <p>Filtrez et consultez les cours disponibles</p>
        </div>

        <div className={styles.filters_card}>
          <h3>Filtres</h3>
          <div className={styles.filters_grid}>
            <div className={styles.filter_group}>
              <label htmlFor="programme">Programme</label>
              <input type="text" id="programme" name="programme" value={filters.programme} onChange={handleFilterChange} placeholder="Rechercher par programme" />
            </div>

            <div className={styles.filter_group}>
              <label htmlFor="etapeEtude">Étape d'étude</label>
              <select id="etapeEtude" name="etapeEtude" value={filters.etapeEtude} onChange={handleFilterChange}>
                <option value="">Toutes les étapes</option>
                {etapes.map((etape) => (<option key={etape} value={etape}>Étape {etape}</option>))}
              </select>
            </div>

            <div className={styles.filter_group}>
              <label htmlFor="duree">Durée (heures)</label>
              <input type="number" id="duree" name="duree" value={filters.duree} onChange={handleFilterChange} placeholder="Durée" min="1" />
            </div>

            <div className={styles.filter_group}>
              <label htmlFor="typeSalle">Type de salle</label>
              <select id="typeSalle" name="typeSalle" value={filters.typeSalle} onChange={handleFilterChange}>
                <option value="">Tous les types</option>
                {typesSalle.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
            </div>

            <div className={styles.filter_group}>
              <label htmlFor="periode">Période</label>
              <select id="periode" name="periode" value={filters.periode} onChange={handleFilterChange}>
                <option value="">Toutes les périodes</option>
                {periodes.map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
          </div>
          <button className={styles.reset_btn} onClick={resetFilters}>Réinitialiser les filtres</button>
        </div>

        <div className={styles.results_card}>
          <h3>Résultats ({filteredCours.length} cours)</h3>
          {isLoading ? (
            <p className={styles.loading}>Chargement...</p>
          ) : filteredCours.length === 0 ? (
            <p className={styles.no_results}>Aucun cours trouvé</p>
          ) : (
            <table className={styles.cours_table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom</th>
                  <th>Programme</th>
                  <th>Étape</th>
                  <th>Durée</th>
                  <th>Type de salle</th>
                </tr>
              </thead>
              <tbody>
                {filteredCours.map((c) => (
                  <tr key={c.id || c.code}>
                    <td>{c.code}</td>
                    <td>{c.nom}</td>
                    <td>{c.programme}</td>
                    <td>{c.etapeEtude}</td>
                    <td>{c.duree}h</td>
                    <td>{c.typeSalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
