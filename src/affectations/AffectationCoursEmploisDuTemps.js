// Module de validation des conflits d'horaire pour les événements

export async function verifierConflitsHoraire(nouvelEvenement) {
  const { date, heureDebut, heureFin, salle } = nouvelEvenement;

  try {
    // Récupérer tous les événements existants pour cette date
    const response = await fetch(`http://localhost:5000/api/evenements/${date}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des événements existants');
    }

    const evenementsExistants = await response.json();
    const conflits = {
      salle: [],
      hasConflicts: false
    };

    // Convertir les heures en minutes pour faciliter les comparaisons
    const debutNouveau = convertirHeureEnMinutes(heureDebut);
    const finNouveau = convertirHeureEnMinutes(heureFin);

    // Vérifier les conflits pour chaque événement existant
    for (const evenement of evenementsExistants) {
      const debutExistant = convertirHeureEnMinutes(evenement.heureDebut);
      const finExistant = convertirHeureEnMinutes(evenement.heureFin);

      // Vérifier si les périodes se chevauchent
      const chevauchement = periodesSeChevauchent(debutNouveau, finNouveau, debutExistant, finExistant);

      if (chevauchement) {
        // Conflit de salle
        if (evenement.salle === salle) {
          conflits.salle.push({
            type: 'salle',
            evenementConflit: evenement,
            message: `Salle ${salle} déjà occupée de ${evenement.heureDebut} à ${evenement.heureFin} par le cours "${evenement.cours}"`
          });
        }
      }
    }

    conflits.hasConflicts = conflits.salle.length > 0;

    return conflits;

  } catch (error) {
    console.error('Erreur lors de la vérification des conflits:', error);
    return {
      hasConflicts: true,
      error: error.message,
      salle: []
    };
  }
}

/**
 * Convertit une heure au format HH:MM en minutes depuis minuit
 * @param {string} heure - Heure au format HH:MM
 * @returns {number} Minutes depuis minuit
 */
function convertirHeureEnMinutes(heure) {
  const [heures, minutes] = heure.split(':').map(Number);
  return heures * 60 + minutes;
}

/**
 * Vérifie si deux périodes temporelles se chevauchent
 * @param {number} debut1 - Début de la première période (minutes)
 * @param {number} fin1 - Fin de la première période (minutes)
 * @param {number} debut2 - Début de la deuxième période (minutes)
 * @param {number} fin2 - Fin de la deuxième période (minutes)
 * @returns {boolean} True si les périodes se chevauchent
 */
function periodesSeChevauchent(debut1, fin1, debut2, fin2) {
  // Deux périodes se chevauchent si le début de l'une est avant la fin de l'autre
  // ET la fin de l'une est après le début de l'autre
  return debut1 < fin2 && fin1 > debut2;
}

/**
 * Valide les données d'un événement avant vérification des conflits
 * @param {Object} evenement - Données de l'événement à valider
 * @returns {Object} Résultat de validation avec erreurs si présentes
 */
export function validerDonneesEvenement(evenement) {
  const erreurs = [];
  const { date, heureDebut, heureFin, salle } = evenement;

  // Validation de la date
  if (!date) {
    erreurs.push('La date est obligatoire');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    erreurs.push('Format de date invalide (attendu: YYYY-MM-DD)');
  }

  // Validation des heures
  if (!heureDebut || !heureFin) {
    erreurs.push('Les heures de début et de fin sont obligatoires');
  } else {
    const debutMinutes = convertirHeureEnMinutes(heureDebut);
    const finMinutes = convertirHeureEnMinutes(heureFin);

    if (debutMinutes >= finMinutes) {
      erreurs.push('L\'heure de fin doit être après l\'heure de début');
    }
  }

  // Validation de la salle
  if (!salle) {
    erreurs.push('La salle est obligatoire');
  }

  return {
    isValid: erreurs.length === 0,
    erreurs: erreurs
  };
}

/**
 * Fonction principale pour valider un événement complet
 * Combine validation des données + vérification des conflits
 * @param {Object} evenement - Données de l'événement
 * @returns {Promise<Object>} Résultat complet de validation
 */
export async function validerEvenementComplet(evenement) {
  // Première validation: données de base
  const validationDonnees = validerDonneesEvenement(evenement);

  if (!validationDonnees.isValid) {
    return {
      isValid: false,
      erreurs: validationDonnees.erreurs,
      conflits: null
    };
  }

  // Deuxième validation: conflits d'horaire
  const conflits = await verifierConflitsHoraire(evenement);

  return {
    isValid: !conflits.hasConflicts,
    erreurs: validationDonnees.erreurs,
    conflits: conflits
  };
}