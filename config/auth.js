/* Nous allons créer une fonction pour protéger les routes en donnant l'accès 
à certains utilisateurs et non à d'autres. */

//Ces routes de page sont réservées aux administrateurs
export default function authentificationAdministrateur(request, response, next) {
  // Vérifier si l'utilisateur est authentifié et a le rôle d'administrateur
  if (request.session && request.session.utilisateur && request.session.utilisateur.role === "administrateur") {
    next(); // L'utilisateur est un administrateur, continuer vers la route protégée
  } else {
    response.status(403).json({ message: "Accès refusé: Administrateurs uniquement" }); // Accès refusé pour les autres utilisateurs
  }
}

// Ces routes API seront réservées aux administrateurs 
export default function userAdministrateurRedirect(request, response, next){
    if (request.user && request.user.niveau_access == 2) {
        next(request.session && request.session.utilisateur && request.session.utilisateur.role === "administrateur");
    }
    else{
        response.status(403).json();
    }

}