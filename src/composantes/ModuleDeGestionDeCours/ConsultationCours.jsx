//Résumé du fichier: 
//  Autheur: Queren D 
//  Tâche: Ajouter des composante de consultation des cours avec filtres dynamiques et affichage en temps réel

//importations des bibliothèques et des styles
import React, { useState, useEffect } from "react";
import styles from "./ConsultationCours.module.css";
import Swal from 'sweetalert2'; 


// Composante pour consulter les cours avec des filtres dynamiques
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

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/cours");
      const data = await response.json();
      const coursData = Array.isArray(data) ? data : (data.cours || []);
      setCours(coursData);
      setFilteredCours(coursData);
    } catch (err) {
      console.error("Erreur chargement cours:", err);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    const result = cours.filter((item) => {
      return (
        (filters.programme === "" || 
          item.programme?.toLowerCase().includes(filters.programme.toLowerCase())) &&
        // On compare la valeur du filtre (etapeEtude) avec la colonne DB (etape)
        (filters.etapeEtude === "" || 
          String(item.etape) === String(filters.etapeEtude)) &&
        (filters.duree === "" || 
          Number(item.duree) === Number(filters.duree)) &&
        (filters.typeSalle === "" || 
          item.typeSalle === filters.typeSalle)
      );
    });
    setFilteredCours(result);
  }, [filters, cours]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ programme: "", etapeEtude: "", duree: "", typeSalle: "", periode: "" });
  };

  return (
    <div className={styles.consultation_page}>
      <div className={styles.consultation_container}>
        <div className={styles.consultation_header}>
          <h2>Consultation des cours</h2>
          <p>Utilisez les filtres pour affiner les résultats en temps réel.</p>
        </div>

        <div className={styles.filters_card}>
          <div className={styles.filters_grid}>
            <div className={styles.filter_group}>
              <label>Programme</label>
              <input type="text" name="programme" value={filters.programme} onChange={handleFilterChange} placeholder="Rechercher..." />
            </div>

            <div className={styles.filter_group}>
              <label>Étape</label>
              <select name="etapeEtude" value={filters.etapeEtude} onChange={handleFilterChange}>
                <option value="">Toutes</option>
                {etapes.map((e) => <option key={e} value={e}>Étape {e}</option>)}
              </select>
            </div>

            <div className={styles.filter_group}>
              <label>Durée (h)</label>
              <input type="number" name="duree" value={filters.duree} onChange={handleFilterChange} placeholder="H" />
            </div>

            <div className={styles.filter_group}>
              <label>Type de Salle</label>
              <select name="typeSalle" value={filters.typeSalle} onChange={handleFilterChange}>
                <option value="">Tous</option>
                {typesSalle.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button className={styles.reset_btn} onClick={resetFilters}>Réinitialiser les filtres</button>
        </div>

        <div className={styles.results_section}>
          <div className={styles.results_count}>{filteredCours.length} cours trouvés</div>
          <div className={styles.table_wrapper}>
            <table className={styles.cours_table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom du Cours</th>
                  <th>Programme</th>
                  <th>Étape</th>
                  <th>Durée</th>
                  <th>Type de Salle</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" className={styles.center_text}>Chargement...</td></tr>
                ) : filteredCours.length > 0 ? (
                  filteredCours.map((c, index) => (
                    <tr key={index}>
                      <td className={styles.orange_text}><strong>{c.code}</strong></td>
                      <td>{c.nomDuCours}</td>
                      <td>{c.programme}</td>
                      <td><span className={styles.orange_badge}>Étape {c.etape}</span></td>
                      <td>{c.duree} h</td>
                      <td>{c.typeSalle}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className={styles.center_text}>Aucun cours ne correspond aux critères.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}