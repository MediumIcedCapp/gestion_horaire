import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PageAdministrateur.module.css';
import Logo from '../../assets/logoGestionHoraire.png';

import lettreAProfilePic from "../../assets/lettreAProfilePic.png";
import lettreBProfilePic from "../../assets/lettreBProfilePic.png";
import lettreCProfilePic from "../../assets/lettreCProfilePic.png";
import lettreDProfilePic from "../../assets/lettreDProfilePic.png";
import lettreEProfilePic from "../../assets/lettreEProfilePic.png";
import lettreFProfilePic from "../../assets/lettreFProfilePic.png";
import lettreGProfilePic from "../../assets/lettreGProfilePic.png";
import lettreHProfilePic from "../../assets/lettreHProfilePic.png";
import lettreIProfilePic from "../../assets/lettreIProfilePic.png";
import lettreJProfilePic from "../../assets/lettreJProfilePic.png";
import lettreKProfilePic from "../../assets/lettreKProfilePic.png";
import lettreLProfilePic from "../../assets/lettreLProfilePic.png";
import lettreMProfilePic from "../../assets/lettreMProfilePic.png";
import lettreNProfilePic from "../../assets/lettreNProfilePic.png";
import lettreOProfilePic from "../../assets/lettreOProfilePic.png";
import lettrePProfilePic from "../../assets/lettrePProfilePic.png";
import lettreQProfilePic from "../../assets/lettreQProfilePic.png";
import lettreRProfilePic from "../../assets/lettreRProfilePic.png";
import lettreSProfilePic from "../../assets/lettreSProfilePic.png";
import lettreTProfilePic from "../../assets/lettreTProfilePic.png";
import lettreUProfilePic from "../../assets/lettreUProfilePic.png";
import lettreVProfilePic from "../../assets/lettreVProfilePic.png";
import lettreWProfilePic from "../../assets/lettreWProfilePic.png";
import lettreXProfilePic from "../../assets/lettreXProfilePic.png";
import lettreYProfilePic from "../../assets/lettreYProfilePic.png";
import lettreZProfilePic from "../../assets/lettreZProfilePic.png";

export default function PageAdministrateur() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nomUtilisateur: '',
    email: '',
    motDePasse: '',
    modules: [] 
  });
  const [responsables, setResponsables] = useState([]);
  const [isLoadingResponsables, setIsLoadingResponsables] = useState(true);
  const [responsablesError, setResponsablesError] = useState('');
  
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    if (!user || user.role !== 'administrateur') {
      navigate('/'); 
    } else {
      setAdminName(user.prenom || "Admin");
    }
  }, [navigate]);

  const fetchResponsables = async () => {
    setIsLoadingResponsables(true);
    setResponsablesError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/responsables', {
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Impossible de charger la liste des responsables.');
      }

      setResponsables(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setResponsablesError(error.message || 'Erreur lors du chargement des responsables.');
    } finally {
      setIsLoadingResponsables(false);
    }
  };

  useEffect(() => {
    fetchResponsables();
  }, []);

  const modulesDisponibles = [
    { id: 'gestion_professeur', label: 'Gestion des Professeurs' },
    { id: 'gestion_salles', label: 'Gestion des Salles' },
    { id: 'gestion_cours', label: 'Gestion des Cours' }
  ];

  const getProfilePic = (name) => {
    if (!name) return lettreAProfilePic;
    const firstLetter = name.charAt(0).toUpperCase();
    const pics = { 'A': lettreAProfilePic, 'Q': lettreQProfilePic };
    return pics[firstLetter] || lettreAProfilePic;
  };

  const handleModuleChange = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(id => id !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  
        body: JSON.stringify({ ...formData, role: 'responsable' }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Responsable administratif créé avec succès !");
        // Reset du formulaire
        setFormData({ nom: '', prenom: '', nomUtilisateur: '', email: '', motDePasse: '', modules: [] });
        fetchResponsables();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Erreur lors de la création : " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('utilisateur');
    navigate('/login');
  };

  const getModulesLabel = (modulesAssignes) => {
    if (!modulesAssignes) return 'Aucun module';

    let parsedModules = modulesAssignes;
    if (typeof modulesAssignes === 'string') {
      try {
        parsedModules = JSON.parse(modulesAssignes);
      } catch {
        parsedModules = [];
      }
    }

    if (!Array.isArray(parsedModules) || parsedModules.length === 0) {
      return 'Aucun module';
    }

    const moduleLabels = {
      gestion_professeur: 'Gestion des Professeurs',
      gestion_salles: 'Gestion des Salles',
      gestion_cours: 'Gestion des Cours',
      page_administrateur: 'Page Administrateur'
    };

    return parsedModules.map((moduleId) => moduleLabels[moduleId] || moduleId).join(', ');
  };

  return (
    <div className={styles.admin_page}>
      <header className={styles.header}>
        <div className={styles.header_content}>
          <div className={styles.header_left}>
            <img src={Logo} alt="Logo" className={styles.logo_img} />
          </div>
          <div className={styles.header_center}>
            <h1>Portail Administrateur</h1>
            <button className={styles.home_btn} onClick={() => navigate('/pageCalendrier')}>Retour au calendrier</button>
          </div>
          <div className={styles.header_right}>
            <div className={styles.welcome_section}>
              <span className={styles.welcome_text}>Bonjour, {adminName}</span>
              <img src={getProfilePic(adminName)} className={styles.user_profile_img} alt="Profil" />
            </div>
            <button className={styles.logout_btn} onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </header>

      <main className={styles.main_content}>
        <section className={styles.creation_card}>
          <h2>Créer un Responsable Administratif</h2>
          <p>Remplissez les informations et assignez les permissions.</p>

          <form onSubmit={handleSubmit} className={styles.admin_form}>
            

            <div className={styles.form_row}> 
              <div className={styles.form_group}>
                <label>Prénom</label>
                <input 
                  type="text" 
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required 
                />
              </div>

              <div className={styles.form_group}>
                <label>Nom</label>
                <input 
                  type="text" 
                  placeholder="Nom de famille"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className={styles.form_group}>
              <label>Nom d'utilisateur</label>
              <input 
                type="text" 
                placeholder="Ex: jdupont2026"
                value={formData.nomUtilisateur}
                onChange={(e) => setFormData({...formData, nomUtilisateur: e.target.value})}
                required 
              />
            </div>
            
            <div className={styles.form_group}>
              <label>Email professionnel</label>
              <input 
                type="email" 
                placeholder="email@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>

            <div className={styles.form_group}>
              <label>Mot de passe temporaire</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={formData.motDePasse}
                onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                required 
              />
            </div>

            <div className={styles.modules_section}>
              <h3>Assigner des Modules</h3>
              <div className={styles.modules_grid}>
                {modulesDisponibles.map(module => (
                  <label key={module.id} className={styles.module_item}>
                    <input 
                      type="checkbox"
                      checked={formData.modules.includes(module.id)}
                      onChange={() => handleModuleChange(module.id)}
                    />
                    <span>{module.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className={styles.submit_btn}>
              Créer le compte responsable
            </button>
          </form>
        </section>

        <section className={styles.creation_card}>
          <h2>Responsables administratifs créés</h2>
          <p>Liste des comptes responsables actuellement enregistrés.</p>

          {isLoadingResponsables && <p className={styles.info_text}>Chargement de la liste...</p>}
          {responsablesError && <p className={styles.error_text}>{responsablesError}</p>}

          {!isLoadingResponsables && !responsablesError && (
            <div className={styles.responsables_table_wrapper}>
              {responsables.length === 0 ? (
                <p className={styles.info_text}>Aucun responsable n'a encore été créé.</p>
              ) : (
                <table className={styles.responsables_table}>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Courriel</th>
                      <th>Modules assignés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responsables.map((responsable) => (
                      <tr key={responsable.idInscriptionUtilisateur || responsable.email}>
                        <td>{[responsable.prenom, responsable.nom].filter(Boolean).join(' ') || '-'}</td>
                        <td>{responsable.email || '-'}</td>
                        <td>{getModulesLabel(responsable.modules_assignes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}