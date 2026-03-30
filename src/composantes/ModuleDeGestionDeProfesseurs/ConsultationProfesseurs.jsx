import { useEffect, useState } from "react";
import styles from "./ConsultationProfesseurs.module.css";

const disponibilites = ["Disponible", "Occupe", "Indisponible"];

export default function ConsultationProfesseurs() {
  const [professeurs, setProfesseurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialite: "",
    disponibilite: ""
  });

  const fetchProfesseurs = async (activeFilters = filters) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      if (activeFilters.specialite.trim() !== "") {
        params.append("specialite", activeFilters.specialite.trim());
      }

      if (activeFilters.disponibilite !== "") {
        params.append("disponibilite", activeFilters.disponibilite);
      }

      const queryString = params.toString();
      const response = await fetch(`http://localhost:5000/api/professeurs${queryString ? `?${queryString}` : ""}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setProfesseurs(data.data || []);
      } else {
        setProfesseurs([]);
      }
    } catch (err) {
      console.error("Erreur chargement professeurs:", err);
      setProfesseurs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadProfesseurs = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/professeurs");
        const data = await response.json();

        if (response.ok && data.success) {
          setProfesseurs(data.data || []);
        } else {
          setProfesseurs([]);
        }
      } catch (err) {
        console.error("Erreur chargement professeurs:", err);
        setProfesseurs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfesseurs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProfesseurs(filters);
  };

  const handleReset = () => {
    const emptyFilters = { specialite: "", disponibilite: "" };
    setFilters(emptyFilters);
    fetchProfesseurs(emptyFilters);
  };

  return (
    <div className={styles.consultation_page}>
      <div className={styles.consultation_container}>
        <div className={styles.consultation_header}>
          <h2>Consultation des professeurs</h2>
          <p>Filtrez les professeurs par specialite et disponibilite.</p>
        </div>

        <form className={styles.filters_card} onSubmit={handleSubmit}>
          <div className={styles.filters_grid}>
            <div className={styles.filter_group}>
              <label htmlFor="specialite">Specialite</label>
              <input
                id="specialite"
                type="text"
                name="specialite"
                value={filters.specialite}
                onChange={handleChange}
                placeholder="Ex: Mathematiques"
              />
            </div>

            <div className={styles.filter_group}>
              <label htmlFor="disponibilite">Disponibilite</label>
              <select
                id="disponibilite"
                name="disponibilite"
                value={filters.disponibilite}
                onChange={handleChange}
              >
                <option value="">Toutes</option>
                {disponibilites.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.submit_btn} type="submit">Rechercher</button>
            <button className={styles.reset_btn} type="button" onClick={handleReset}>Reinitialiser</button>
          </div>
        </form>

        <div className={styles.results_section}>
          <div className={styles.results_count}>{professeurs.length} professeur(s) trouve(s)</div>

          <div className={styles.table_wrapper}>
            <table className={styles.professeurs_table}>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Specialite</th>
                  <th>Disponibilite</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className={styles.center_text}>Chargement...</td>
                  </tr>
                ) : professeurs.length > 0 ? (
                  professeurs.map((professeur) => (
                    <tr key={professeur.idProfesseur}>
                      <td>{professeur.matricule}</td>
                      <td>{professeur.nom}</td>
                      <td>{professeur.prenom}</td>
                      <td>{professeur.specialite}</td>
                      <td><span className={styles.badge}>{professeur.disponibilite}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.center_text}>Aucun professeur ne correspond aux filtres.</td>
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
