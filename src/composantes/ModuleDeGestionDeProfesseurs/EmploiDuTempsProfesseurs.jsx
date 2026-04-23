import React, { useState, useEffect } from "react";
import styles from "./EmploiDuTemps.module.css";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correction de l'importation

// Fonction d'exportation corrigée
const exportProfesseurPDF = (professeur, planning) => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Emploi du temps : ${professeur.prenom} ${professeur.nom}`, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Matricule : ${professeur.matricule}`, 14, 30);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 14, 35);

    const tableColumn = ["Heure", "Cours", "Salle", "Date"];
    const tableRows = planning.map(ev => [
      `${ev.heureDebut} - ${ev.heureFin}`,
      ev.cours,
      ev.salle,
      ev.date
    ]);

    // Utilisation de la fonction importée directement
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [51, 51, 51] } 
    });

    doc.save(`Horaire_${professeur.nom}.pdf`);
  } catch (error) {
    console.error("Erreur génération PDF:", error);
  }
};

export default function EmploiDuTempsProfesseurs() {
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProf, setSelectedProf] = useState(null);
  const [planning, setPlanning] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/professeurs")
      .then(res => res.json())
      .then(data => setProfesseurs(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erreur chargement profs:", err));
  }, []);

  const handleProfClick = async (prof) => {
    setLoading(true);
    setSelectedProf(prof);
    
    try {
      // Sécurité : on vérifie que les URLs sont valides
      const resPlanning = await fetch(`http://localhost:5000/api/evenements/professeur/${prof.matricule}`);
      if (!resPlanning.ok) throw new Error("Erreur serveur planning");
      const dataPlanning = await resPlanning.json();
      setPlanning(dataPlanning);

      const resDispos = await fetch(`http://localhost:5000/api/professeurs/${prof.idProfesseur}/disponibilites`);
      if (!resDispos.ok) throw new Error("Erreur serveur disponibilites");
      const dataDispos = await resDispos.json();
      setDisponibilites(Array.isArray(dataDispos) ? dataDispos : dataDispos.data || []);
      
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      // On réinitialise pour ne pas afficher les données du prof précédent en cas d'erreur
      setPlanning([]);
      setDisponibilites([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Professeurs</h3>
        <div className={styles.prof_list}>
          {professeurs.map(p => (
            <div 
              key={p.idProfesseur} 
              className={`${styles.prof_item} ${selectedProf?.idProfesseur === p.idProfesseur ? styles.active : ''}`}
              onClick={() => handleProfClick(p)}
            >
              <div className={styles.avatar_small}>{p.prenom[0]}</div>
              <span>{p.prenom} {p.nom}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {selectedProf ? (
          <>
            <div className={styles.profile_card}>
              <div className={styles.profile_header}>
                <div className={styles.avatar_large}>{selectedProf.prenom[0]}</div>
                <div>
                  <h2>{selectedProf.prenom} {selectedProf.nom}</h2>
                  <span className={styles.badge}>{selectedProf.specialite || "Enseignant"}</span>
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      className={styles.export_button} 
                      onClick={() => exportProfesseurPDF(selectedProf, planning)}
                    >
                      📄 Exporter l'horaire PDF
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.info_grid}>
                <div className={styles.info_box}><strong>Matricule</strong> {selectedProf.matricule}</div>
                <div className={styles.info_box}><strong>Courriel</strong> {selectedProf.email || 'N/A'}</div>
                <div className={`${styles.info_box} ${styles.full_width}`}>
                  <strong>Indisponibilites hebdomadaires</strong>
                  <div className={styles.dispo_list}>
                    {disponibilites.length > 0 ? (
                      disponibilites.map((d, index) => (
                        <div key={index} className={styles.dispo_tag}>
                          {d.jour} - {String(d.heureDebut).slice(0, 5)} à {String(d.heureFin).slice(0, 5)}
                        </div>
                      ))
                    ) : <span className={styles.no_data}>Aucune indisponibilite definie</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.schedule_section}>
              <h3>Emploi du temps (Cours affectés)</h3>
              {loading ? <p>Chargement des données...</p> : (
                <div className={styles.timeline}>
                  {planning.length > 0 ? planning.map((ev, i) => (
                    <div key={i} className={styles.schedule_card}>
                      <div className={styles.time_tag}>{ev.heureDebut} - {ev.heureFin}</div>
                      <div className={styles.details}>
                        <strong>{ev.cours}</strong>
                        <span>Salle: {ev.salle} | {ev.date}</span>
                      </div>
                    </div>
                  )) : <p className={styles.placeholder_text}>Aucun cours assigné.</p>}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.placeholder_text}>Sélectionnez un professeur pour consulter ses informations.</p>
          </div>
        )}
      </div>
    </div>
  );
}