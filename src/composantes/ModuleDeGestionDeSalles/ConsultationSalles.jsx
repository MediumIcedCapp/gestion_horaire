// Résumé du fichier:
// Auteur: Queren D
// Tâche: Ajouter des composantes de consultation des salles avec filtres dynamiques et affichage en temps réel (Style ConsultationCours)

import React, { useState, useEffect } from "react";
import styles from "./ConsultationSalles.module.css";

export default function ConsultationSalles() {
  // State pour stocker les salles, les filtrées, le chargement et les filtres
  const [salles, setSalles] = useState([]);
  const [filteredSalles, setFilteredSalles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    code: "",
    type: "",
    capaciteMin: ""
  });

  // Liste des types de salles pour le filtre
  const typesSalle = ["Laboratoire", "Salle de cours", "Amphithéâtre", "Salle informatique"];

  // Chargement initial
  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/salles");
      const data = await response.json();
      const sallesData = Array.isArray(data) ? data : (data.salles || []);
      setSalles(sallesData);
      setFilteredSalles(sallesData);
    } catch (err) {
      console.error("Erreur chargement salles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage dynamique
  useEffect(() => {
    const result = salles.filter((salle) => {
      return (
        (filters.code === "" || 
          salle.code?.toLowerCase().includes(filters.code.toLowerCase())) &&
        (filters.type === "" || 
          salle.type === filters.type) &&
        (filters.capaciteMin === "" || 
          Number(salle.capacite) >= Number(filters.capaciteMin))
      );
    });
    setFilteredSalles(result);
  }, [filters, salles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ code: "", type: "", capaciteMin: "" });
  };

  return (
    <div className={styles.consultation_page}>
      <div className={styles.consultation_container}>
        <div className={styles.consultation_header}>
          <h2>Consultation des Salles</h2>
          <p>Utilisez les filtres pour affiner les locaux disponibles en temps réel.</p>
        </div>

        {/* Section des Filtres */}
        <div className={styles.filters_card}>
          <div className={styles.filters_grid}>
            <div className={styles.filter_group}>
              <label>Code de salle</label>
              <input 
                type="text" 
                name="code" 
                value={filters.code} 
                onChange={handleFilterChange} 
                placeholder="Rechercher..." 
              />
            </div>

            <div className={styles.filter_group}>
              <label>Type de Salle</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">Tous les types</option>
                {typesSalle.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className={styles.filter_group}>
              <label>Capacité Minimum</label>
              <input 
                type="number" 
                name="capaciteMin" 
                value={filters.capaciteMin} 
                onChange={handleFilterChange} 
                placeholder="Ex: 30" 
              />
            </div>
          </div>
          <button className={styles.reset_btn} onClick={resetFilters}>Réinitialiser les filtres</button>
        </div>

        {/* Tableau des Résultats */}
        <div className={styles.results_section}>
          <div className={styles.results_count}>
            {filteredSalles.length} salles trouvées
          </div>
          
          <div className={styles.table_wrapper}>
            <table className={styles.salles_table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type de Salle</th>
                  <th>Capacité</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="3" className={styles.center_text}>Chargement...</td></tr>
                ) : filteredSalles.length > 0 ? (
                  filteredSalles.map((salle, index) => (
                    <tr key={index}>
                      <td className={styles.orange_text}><strong>{salle.code}</strong></td>
                      <td>{salle.type}</td>
                      <td>
                        <span className={styles.orange_badge}>{salle.capacite} places</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className={styles.center_text}>Aucune salle trouvée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}