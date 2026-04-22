

/**
 * Vérifie la disponibilité spécifique du professeur pour une date donnée
 */
export async function verifierDisponibiliteProfesseur(professeurId, date) {
  try {
    // Récupérer les disponibilités du professeur
    const response = await fetch(`http://localhost:5000/api/professeurs/${professeurId}/disponibilites`);
    
    if (!response.ok) {
      // Si l'endpoint n'existe pas, vérifier via la field "disponibilite" du professeur
      return null;
    }
    
    const disponibilites = await response.json();
    
    // Vérifier si le professeur est disponible pour cette date
    const dateObj = new Date(date);
    const jourSemaine = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
    
    if (disponibilites && disponibilites.length > 0) {
      const dispoPourJour = disponibilites.find(d => 
        d.jour && d.jour.toLowerCase() === jourSemaine.toLowerCase()
      );
      
      if (!dispoPourJour) {
        return { isAvailable: false, reason: `Le professeur n'est pas disponible le ${jourSemaine}` };
      }
      
      return { isAvailable: true };
    }
    
    return null;
  } catch (error) {
    console.warn("Impossible de vérifier les disponibilités détaillées:", error);
    return null;
  }
}

/**
 * Valide si la spécialité du professeur correspond au cours
 */
export function validerSpecialite(professeur, cours) {
  if (!professeur.specialite || !cours.specialite) return true;
  return professeur.specialite.trim().toLowerCase() === cours.specialite.trim().toLowerCase();
}

/**
 * Convertit HH:MM en minutes pour faciliter les calculs
 */
function toMinutes(heure) {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Vérifie si deux plages horaires se chevauchent
 */
function estEnConflit(debut1, fin1, debut2, fin2) {
  return toMinutes(debut1) < toMinutes(fin2) && toMinutes(fin1) > toMinutes(debut2);
}

/**
 * Vérifie la disponibilité et les conflits sur le serveur
 */
export async function verifierConflitsProfesseur(formData) {
  try {
    // 1. Récupérer les données nécessaires (Profs, Cours, Événements)
    const [resProfs, resCours, resEv] = await Promise.all([
      fetch("http://localhost:5000/api/professeurs"),
      fetch("http://localhost:5000/api/cours"),
      fetch(`http://localhost:5000/api/evenements/${formData.date}`)
    ]);

    const professeurs = await resProfs.json();
    const coursList = await resCours.json();
    const evenements = await resEv.json();

    const prof = professeurs.find(p =>
      String(p.matricule) === String(formData.professeur) ||
      String(p.idProfesseur) === String(formData.professeur)
    );
    const cours = coursList.find(c => String(c.nomDuCours) === String(formData.cours) || String(c.code) === String(formData.cours));

    const erreurs = [];

    // 2. Vérifier l'existence
    if (!prof) return { isValid: false, erreurs: ["Professeur introuvable."] };
    if (!cours) return { isValid: false, erreurs: ["Cours introuvable."] };

    // 3. Vérifier la spécialité
    if (!validerSpecialite(prof, cours)) {
      const nomCours = cours.nomDuCours || cours.code || formData.cours;
      erreurs.push(`Incompatibilité : Le cours "${nomCours}" ne correspond pas à la spécialité du professeur.`);
    }

    // 4. Vérifier le statut de disponibilité (Général)
    if (prof.disponibilite === "Indisponible") {
      erreurs.push(`Le professeur ${prof.nom} est globalement indisponible.`);
    }

    // 5. Vérifier la disponibilité spécifique pour la date/heure
    const dispoCheck = await verifierDisponibiliteProfesseur(prof.idProfesseur || prof.matricule, formData.date);
    if (dispoCheck && !dispoCheck.isAvailable) {
      erreurs.push(dispoCheck.reason);
    }

    // 6. Vérifier que le cours n'est pas déjà assigné à un autre professeur
    const coursDejaAssigne = evenements.find(e => 
      String(e.cours) === String(formData.cours) &&
      e.date === formData.date &&
      String(e.professeur ?? e.idProfesseur ?? e.matriculeProfesseur ?? e.professeurId) !== String(formData.professeur)
    );

    if (coursDejaAssigne) {
      const autreProfesseur = professeurs.find(p => 
        String(p.matricule) === String(coursDejaAssigne.professeur ?? coursDejaAssigne.idProfesseur ?? coursDejaAssigne.matriculeProfesseur ?? coursDejaAssigne.professeurId) ||
        String(p.idProfesseur) === String(coursDejaAssigne.professeur ?? coursDejaAssigne.idProfesseur ?? coursDejaAssigne.matriculeProfesseur ?? coursDejaAssigne.professeurId)
      );
      const nomAutreProfesseur = autreProfesseur ? `${autreProfesseur.prenom} ${autreProfesseur.nom}` : "un autre professeur";
      erreurs.push(`Ce cours est déjà assigné à ${nomAutreProfesseur} pour cette date.`);
    }

    // 7. Empêcher l'affectation simultanée (Conflit d'horaire)
    const conflitHoraire = evenements.find(e => 
      String(e.professeur ?? e.idProfesseur ?? e.matriculeProfesseur ?? e.professeurId) === String(formData.professeur) &&
      e.date === formData.date &&
      estEnConflit(formData.heureDebut, formData.heureFin, e.heureDebut, e.heureFin)
    );

    if (conflitHoraire) {
      erreurs.push(`Conflit d'horaire : Le professeur est déjà assigné au cours "${conflitHoraire.cours}" de ${conflitHoraire.heureDebut} à ${conflitHoraire.heureFin}.`);
    }

    return {
      isValid: erreurs.length === 0,
      erreurs: erreurs
    };

  } catch (error) {
    console.error("Erreur validation:", error);
    return { isValid: false, erreurs: ["Erreur de connexion au serveur de validation."] };
  }
}

/**
 * Fonction principale exportée pour ton composant React
 */
export async function validerEvenementComplet(formData) {
  // Validation des champs vides
  if (!formData.professeur || !formData.cours || !formData.date || !formData.heureDebut || !formData.heureFin) {
    return { isValid: false, erreurs: ["Veuillez remplir tous les champs obligatoires (Prof, Cours, Date, heures)."] };
  }

  // Validation technique (Spécialité + Horaire)
  return await verifierConflitsProfesseur(formData);
}