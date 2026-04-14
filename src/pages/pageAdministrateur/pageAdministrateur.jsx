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
    email: '',
    motDePasse: '',
    modules: [] 
  });
  
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  // Sécurité et récupération des données utilisateur
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    if (!user || user.role !== 'administrateur') {
      navigate('/'); 
    } else {
      setAdminName(user.prenom || "Admin");
    }
  }, [navigate]);

  const modulesDisponibles = [
    { id: 'gestion_professeur', label: 'Gestion des Professeurs' },
    { id: 'gestion_salles', label: 'Gestion des Salles' },
    { id: 'gestion_cours', label: 'Gestion des Cours' }
  ];

  // Fonction pour gérer la photo de profil dynamique
  const getProfilePic = (name) => {
    if (!name) return lettreAProfilePic;
    const firstLetter = name.charAt(0).toUpperCase();
    const pics = {
      'A': lettreAProfilePic,
      'Q': lettreQProfilePic,
      // Ajoute d'autres lettres ici si nécessaire
    };
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
        body: JSON.stringify({ ...formData, role: 'responsable' }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Responsable administratif créé avec succès !");
        setFormData({ nom: '', email: '', motDePasse: '', modules: [] });
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

  return (
    <div className={styles.admin_page}>
      <header className={styles.header}>
        <div className={styles.header_content}>
          
          <div className={styles.header_left}>
            <img src={Logo} alt="Logo" className={styles.logo_img} />
          </div>

          <div className={styles.header_center}>
            <h1>Portail Administrateur</h1>
          </div>

          <div className={styles.header_right}>
            <div className={styles.welcome_section}>
              <span className={styles.welcome_text}>Bonjour, {adminName}</span>
              <img 
                src={getProfilePic(adminName)} 
                className={styles.user_profile_img} 
                alt="Profil" 
              />
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
            <div className={styles.form_group}>
              <label>Nom complet</label>
              <input 
                type="text" 
                placeholder="Ex: Jean Dupont"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
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
      </main>
    </div>
  );
}