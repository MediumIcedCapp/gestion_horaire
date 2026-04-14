// middleware.js
export const authentificationAdministrateur = (req, res, next) => {
    // On vérifie si la session existe et si le rôle est admin
    if (req.session && req.session.utilisateur && req.session.utilisateur.role === "administrateur") {
        return next(); // Autorisé : on passe à la route suivante
    } else {
        return res.status(403).json({ 
            success: false, 
            message: "Accès refusé : Seuls les administrateurs peuvent effectuer cette action." 
        });
    }
};