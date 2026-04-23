import express from "express";
import cors from "cors";
import db from "./baseDeDonnees.js";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express();
app.use(express.json());

app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(session({
  secret: 'une_cle_tres_secrete_et_unique_2026', // <--- Ajoute une vraie chaîne de caractères ici
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

const authentificationAdministrateur = (req, res, next) => {
    if (req.session && req.session.utilisateur && req.session.utilisateur.role === "administrateur") {
        next(); // Autorisé
    } else {
        res.status(403).json({ success: false, message: "Accès refusé: Administrateurs uniquement" });
    }
};

// Création d'un compte
app.post("/api/signup", async (req, res) => {
  const { email, motDePasse, prenom, nom, nomUtilisateur, confirmationMotDePasse, modules_assignes } = req.body;

  if (!email || !motDePasse || !prenom || !nom || !nomUtilisateur || !confirmationMotDePasse || !modules_assignes) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
  }

  if (motDePasse !== confirmationMotDePasse) {
    return res.status(400).json({ success: false, message: "Mot de passe différent" });
  }

  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const modulesString = JSON.stringify(modules_assignes); // Stockage du tableau en texte
    db.query(
      "INSERT INTO utilisateurinscription (nom, nomUtilisateur, prenom, email, motDePasse, role, modules_assignes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nom, nomUtilisateur, prenom, email, hashedPassword, 'administrateur', modulesString], 
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Compte créé !" });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Connexion
app.post("/api/login", async (req, res) => {
  const { email, motDePasse } = req.body;
  if (!email || !motDePasse) return res.status(400).json({ success: false, message: "Tous les champs sont requis" });

  try {
    db.query("SELECT * FROM utilisateurinscription WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (results.length === 0) return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });

      req.session.utilisateur = {
          id: user.idInscriptionUtilisateur, 
          email: user.email,
          role: user.role
      };

      res.json({
        success: true,
        user: req.session.utilisateur
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Création d'un responsable par l'Admin
app.post("/api/admin/create-user", async (req, res) => {
    const { prenom, nom, email, motDePasse, modules } = req.body;
    if (!prenom || !nom || !email || !motDePasse || !modules) return res.status(400).json({ success: false, message: "Champs manquants" });

    try {
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        const modulesString = JSON.stringify(modules); // Stockage du tableau en texte

        db.query(
            "INSERT INTO utilisateurinscription (prenom, nom, email, motDePasse, role, modules_assignes) VALUES (?, ?, ?, ?, 'responsable', ?)",
            [prenom, nom, email, hashedPassword, modulesString],
            (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: "Responsable créé avec succès !" });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lister tous les responsables créés
app.get("/api/admin/responsables", (req, res) => {
  const query = `
    SELECT idInscriptionUtilisateur, prenom, nom, nomUtilisateur, email, modules_assignes
    FROM utilisateurinscription
    WHERE role = 'responsable'
    ORDER BY nom ASC, prenom ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({ success: true, data: results || [] });
  });
});

// Récupérer les infos d'un utilisateur
app.get("/api/utilisateur/:email", (req, res) => {
  const email = req.params.email;

  db.query(
    "SELECT nom, prenom, nomUtilisateur, email, modules_assignes FROM utilisateurinscription WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (results.length === 0) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });

      console.log("Utilisateur trouvé :", results[0]); // <-- vérifie la console serveur
      res.json({ success: true, utilisateur: results[0] });
    }
  );
});

// Modifier les informations d'un utilisateur
app.put("/api/utilisateur/:email", async (req, res) => {
  const emailParam = req.params.email;
  const { nom, prenom, nomUtilisateur, nouveauEmail, motDePasse } = req.body;

  try {
    // Si un nouveau mot de passe est fourni, le hasher
    if (motDePasse && motDePasse.trim() !== "") {
      const hashedPassword = await bcrypt.hash(motDePasse, 10);
      db.query(
        "UPDATE utilisateurinscription SET nom = ?, prenom = ?, nomUtilisateur = ?, email = ?, motDePasse = ? WHERE email = ?",
        [nom, prenom, nomUtilisateur, nouveauEmail || emailParam, hashedPassword, emailParam],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
          res.json({ success: true, message: "Informations mises à jour avec succès" });
        }
      );
    } else {
      // Mise à jour sans changer le mot de passe
      db.query(
        "UPDATE utilisateurinscription SET nom = ?, prenom = ?, nomUtilisateur = ?, email = ? WHERE email = ?",
        [nom, prenom, nomUtilisateur, nouveauEmail || emailParam, emailParam],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
          res.json({ success: true, message: "Informations mises à jour avec succès" });
        }
      );
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ajouter salle

app.post('/api/salles', (req, res) => {
    const { code, type, capacity } = req.body;

    const query = 'INSERT INTO module_gestion_salle (code, type, capacite) VALUES (?, ?, ?)';
    db.query(query, [code, type, capacity], (err, result) => {
        if (err) {
          console.error("ERREUR SQL :", err);
          return res.status(500).json({
            message: err.message
        });
}
        res.json({ message: 'Salle ajoutée avec succès !', id: result.insertId });
    });
});

//fetch salles

app.get('/api/salles', (req, res) => {
    db.query('SELECT * FROM module_gestion_salle', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
});


//modifier salle

app.put('/api/salles', (req, res) => {
  const { ancienCode, nouveauCode, type, capacite } = req.body;

  if (!ancienCode) {
    return res.status(400).json({ message: "L'ancien code de la salle est requis" });
  }

  const query = `
    UPDATE module_gestion_salle 
    SET code = ?, type = ?, capacite = ? 
    WHERE code = ?
  `;

  db.query(query, [nouveauCode, type, capacite, ancienCode], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ message: "Erreur lors de la modification de la salle." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Salle non trouvée." });
    }

    res.json({ message: "Salle modifiée avec succès !" });
  });
});

//supprimer salle

app.delete('/api/salles/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM module_gestion_salle WHERE idSalle = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de la suppression de la salle.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Salle non trouvée.' });
        }
        res.json({ message: 'Salle supprimée avec succès !' });
    });
});


// Route pour récupérer tous les cours 
app.get('/api/cours', (req, res) => {
    db.query('SELECT * FROM module_gestion_cours', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json(results);
    });
});

app.post('/api/cours', (req, res) => {
  // On récupère exactement les 6 infos envoyées par ton React
  const { nom, code, duree, programme, etape, typeSalle } = req.body;

  const query = `
      INSERT INTO module_gestion_cours 
      (nomDuCours, code, duree, programme, etape, typeSalle)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nom, code, duree, programme, etape, typeSalle],
    (err, result) => {
      if (err) {
        console.error("ERREUR SQL COURS :", err.message);
        return res.status(500).json({
          success: false,
          message: "Erreur lors de l'ajout du cours : " + err.message
        });
      }

      res.json({
        success: true,
        message: "Cours ajouté avec succès !",
        id: result.insertId
      });
    }
  );
});


// Modifier un cours grâce au nom du cours
app.put('/api/cours', (req, res) => {
  const { ancienNomDuCours, nom, code, duree, programme, etape, typeSalle } = req.body;

  if (!ancienNomDuCours) {
    return res.status(400).json({ success: false, message: "Le nom du cours à modifier est requis" });
  }

  const query = `
    UPDATE module_gestion_cours
    SET nomDuCours = ?, code = ?, duree = ?, programme = ?, etape = ?, typeSalle = ?
    WHERE nomDuCours = ?
  `;

  db.query(query, [nom, code, duree, programme, etape, typeSalle, ancienNomDuCours], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ success: false, message: "Erreur lors de la modification du cours." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cours non trouvé." });
    }

    res.json({ success: true, message: "Cours modifié avec succès !" });
  });
});

// Supprimer un cours grâce au nom du cours
app.delete('/api/cours/:nom', (req, res) => {
  const nomCours = req.params.nom;

  const query = 'DELETE FROM module_gestion_cours WHERE nomDuCours = ?';

  db.query(query, [nomCours], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ success: false, message: 'Erreur lors de la suppression.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cours non trouvé.' });
    }
    res.json({ success: true, message: 'Cours supprimé avec succès !' });
  });
});

// Supprimer un compte utilisateur
app.delete("/api/utilisateur/:email", (req, res) => {
  const email = req.params.email;

  db.query(
    "DELETE FROM utilisateurinscription WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      res.json({ success: true, message: "Compte supprimé avec succès" });
    }
  );
});

// Route pour ajouter un professeur
app.post('/api/professeurs', (req, res) => {
    const { matricule, nom, prenom, specialite, disponibilite, email } = req.body;
    
    const sql = "INSERT INTO module_gestion_professeur (matricule, nom, prenom, specialite, disponibilite, email) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [matricule, nom, prenom, specialite, disponibilite, email], (err, result) => {
        if (err) {
            console.error("Erreur SQL Professeur:", err);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Professeur ajouté !", data: { id: result.insertId, ...req.body } });
    });
});

// 1. Consulter les professeurs (Filtres inclus)
app.get('/api/professeurs', (req, res) => {
  const { specialite, disponibilite } = req.query;
  let query = "SELECT * FROM module_gestion_professeur WHERE 1=1";
  let params = [];

  if (specialite) {
    query += " AND specialite LIKE ?";
    params.push(`%${specialite}%`);
  }
  if (disponibilite) {
    query += " AND disponibilite = ?";
    params.push(disponibilite);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results);
  });
});

// 2. Récupérer un professeur spécifique (pour la modification)
app.get('/api/professeurs/:id', (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM module_gestion_professeur WHERE idProfesseur = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Professeur non trouvé" });
    res.json({ success: true, data: results[0] });
  });
});

// 3. Modifier un professeur 
app.put('/api/professeurs/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prenom, matricule, specialite, disponibilite, email } = req.body;
  
  const query = `
    UPDATE module_gestion_professeur 
    SET nom = ?, prenom = ?, matricule = ?, specialite = ?, disponibilite = ?, email = ? 
    WHERE idProfesseur = ?
  `;

  db.query(query, [nom, prenom, matricule, specialite, disponibilite, email, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Professeur mis à jour avec succès !" });
  });
});

// 4. Supprimer un professeur
app.delete('/api/professeurs/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM module_gestion_professeur WHERE idProfesseur = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Professeur supprimé." });
  });
});

// 5. Vérification avant suppression
app.get('/api/professeurs/:id/verification-suppression', (req, res) => {
  const { id } = req.params;
  db.query("SELECT COUNT(*) as count FROM disponibilites_professeur WHERE idProfesseur = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ 
      success: true, 
      data: { 
        canDelete: true, 
        disponibilites: results[0].count,
        message: "La suppression effacera aussi les plages horaires associées."
      } 
    });
  });
});

// --- ROUTES POUR LES DISPONIBILITÉS ---

// Récupérer les plages horaires d'un prof
app.get('/api/professeurs/:id/disponibilites', (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM disponibilites_professeur WHERE idProfesseur = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results);
  });
});

// Enregistrer/Mettre à jour les plages horaires
app.put('/api/professeurs/:id/disponibilites', (req, res) => {
  const { id } = req.params;
  const { disponibilites } = req.body;

  // On vide les anciennes pour mettre les nouvelles
  db.query("DELETE FROM disponibilites_professeur WHERE idProfesseur = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (!disponibilites || disponibilites.length === 0) return res.json({ success: true });

    const values = disponibilites.map(d => [id, d.jour, d.heureDebut, d.heureFin]);
    db.query("INSERT INTO disponibilites_professeur (idProfesseur, jour, heureDebut, heureFin) VALUES ?", [values], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Horaires enregistrés !" });
    });
  });
});



// Enregistrer un nouvel événement
app.post('/api/evenements', (req, res) => {
  const { date, cours, salle, heureDebut, heureFin, professeur, isRecurrent, dateFinRecurrence } = req.body;

    if (!date || !cours || !salle || !heureDebut || !heureFin) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Cas 1: Affectation d'un professeur a un cours deja planifie -> on met a jour au lieu d'inserer
    if (professeur !== undefined && String(professeur).trim() !== '') {
      const resolveProfessorColumnSql = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'ajoutEvenement'
          AND COLUMN_NAME IN ('professeur', 'idProfesseur', 'matriculeProfesseur', 'professeurId')
      `;

      db.query(resolveProfessorColumnSql, (columnErr, columnRows) => {
        if (columnErr) {
          return res.status(500).json({
            message: "Erreur lors de la vérification de la colonne d'affectation du professeur.",
            details: columnErr.sqlMessage || columnErr.message
          });
        }

        const preferredOrder = ['professeur', 'idProfesseur', 'matriculeProfesseur', 'professeurId'];
        const existingColumns = (columnRows || []).map((row) => row.COLUMN_NAME);
        const assignProfessorToMatchingEvent = (professeurColumn) => {
          const findSql = `
            SELECT evenementId
            FROM ajoutEvenement
            WHERE date = ? AND cours = ? AND salle = ? AND heureDebut = ? AND heureFin = ?
            ORDER BY evenementId ASC
            LIMIT 1
          `;

          db.query(findSql, [date, cours, salle, heureDebut, heureFin], (findErr, rows) => {
            if (findErr) {
              return res.status(500).json({
                message: "Erreur lors de la recherche du cours planifié.",
                details: findErr.sqlMessage || findErr.message
              });
            }

            const assignToEvent = (eventId) => {
              const updateSql = `UPDATE ajoutEvenement SET \`${professeurColumn}\` = ? WHERE evenementId = ?`;
              db.query(updateSql, [professeur, eventId], (updateErr) => {
                if (updateErr) {
                  return res.status(500).json({
                    message: "Erreur lors de l'enregistrement de l'affectation du professeur.",
                    details: updateErr.sqlMessage || updateErr.message
                  });
                }
                res.status(200).json({ message: 'Professeur affecté avec succès !' });
              });
            };

            if (rows && rows.length > 0) {
              assignToEvent(rows[0].evenementId);
              return;
            }

            const fallbackSql = `
              SELECT evenementId
              FROM ajoutEvenement
              WHERE date = ? AND cours = ?
              ORDER BY
                CASE WHEN salle = ? THEN 0 ELSE 1 END,
                CASE WHEN heureDebut = ? AND heureFin = ? THEN 0 ELSE 1 END,
                evenementId ASC
              LIMIT 1
            `;

            db.query(fallbackSql, [date, cours, salle, heureDebut, heureFin], (fallbackErr, fallbackRows) => {
              if (fallbackErr) {
                return res.status(500).json({
                  message: "Erreur lors de la recherche de secours du cours planifié.",
                  details: fallbackErr.sqlMessage || fallbackErr.message
                });
              }

              if (!fallbackRows || fallbackRows.length === 0) {
                return res.status(404).json({
                  message: "Aucun cours planifié correspondant n'a été trouvé pour affecter ce professeur."
                });
              }

              assignToEvent(fallbackRows[0].evenementId);
            });
          });
        };

        const professeurColumn = preferredOrder.find((col) => existingColumns.includes(col));
        if (professeurColumn) {
          assignProfessorToMatchingEvent(professeurColumn);
          return;
        }

        const addProfessorColumnSql = "ALTER TABLE ajoutEvenement ADD COLUMN professeur VARCHAR(255) NULL";
        db.query(addProfessorColumnSql, (alterErr) => {
          if (alterErr) {
            return res.status(500).json({
              message: "La table des événements ne contient aucune colonne d'affectation de professeur compatible, et la création automatique de la colonne a échoué.",
              details: alterErr.sqlMessage || alterErr.message,
              sqlSuggestion: "ALTER TABLE ajoutEvenement ADD COLUMN professeur VARCHAR(255) NULL;"
            });
          }

          assignProfessorToMatchingEvent('professeur');
        });
      });

      return;
    }

    // Cas 2: Creation d'un nouveau cours dans l'emploi du temps
    const toDateOnly = (value) => {
      const [year, month, day] = String(value).split('-').map(Number);
      if (!year || !month || !day) return null;
      return new Date(year, month - 1, day);
    };

    const formatDateOnly = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDate = toDateOnly(date);
    if (!startDate) {
      return res.status(400).json({ message: 'Format de date invalide.' });
    }

    const recurrenceEnabled = Boolean(isRecurrent);
    if (!recurrenceEnabled) {
      const insertSql = "INSERT INTO ajoutEvenement (date, cours, salle, heureDebut, heureFin) VALUES (?, ?, ?, ?, ?)";
      db.query(insertSql, [date, cours, salle, heureDebut, heureFin], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: 'Événement ajouté !' });
      });
      return;
    }

    const endDate = dateFinRecurrence ? toDateOnly(dateFinRecurrence) : null;
    if (dateFinRecurrence && !endDate) {
      return res.status(400).json({ message: 'Format de date de fin de récurrence invalide.' });
    }

    const effectiveEndDate = endDate || new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
    if (effectiveEndDate < startDate) {
      return res.status(400).json({ message: 'La date de fin de récurrence doit être postérieure ou égale à la date de début.' });
    }

    const values = [];
    const cursor = new Date(startDate);
    while (cursor <= effectiveEndDate) {
      values.push([formatDateOnly(cursor), cours, salle, heureDebut, heureFin]);
      cursor.setDate(cursor.getDate() + 7);
    }

    if (values.length === 0) {
      return res.status(400).json({ message: 'Aucune occurrence hebdomadaire à créer.' });
    }

    const insertRecurringSql = "INSERT INTO ajoutEvenement (date, cours, salle, heureDebut, heureFin) VALUES ?";
    db.query(insertRecurringSql, [values], (err) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ message: `${values.length} événements hebdomadaires ajoutés !` });
    });
});

// Récupérer tous les événements d'un professeur par matricule
app.get('/api/evenements/professeur/:matricule', (req, res) => {
    const { matricule } = req.params;

    const resolveSql = `
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'ajoutEvenement'
          AND COLUMN_NAME IN ('professeur', 'idProfesseur', 'matriculeProfesseur', 'professeurId')
    `;

    db.query(resolveSql, (resolveErr, cols) => {
        if (resolveErr) return res.status(500).json({ message: 'Erreur serveur', details: resolveErr.message });

        const preferredOrder = ['professeur', 'idProfesseur', 'matriculeProfesseur', 'professeurId'];
        const existing = (cols || []).map(r => r.COLUMN_NAME);
        const col = preferredOrder.find(c => existing.includes(c));

        if (!col) return res.json([]);

        const sql = `SELECT * FROM ajoutEvenement WHERE \`${col}\` = ? ORDER BY date ASC, heureDebut ASC`;
        db.query(sql, [matricule], (err, results) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur', details: err.message });
            res.json(results);
        });
    });
});

// Récupérer tous les événements (pour l'emploi du temps des professeurs)
app.get('/api/evenements/tous', (req, res) => {
    const sql = "SELECT * FROM ajoutEvenement ORDER BY date ASC, heureDebut ASC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Erreur lors de la récupération de tous les événements.",
                details: err.sqlMessage || err.message
            });
        }
        res.json(results);
    });
});

// Récupérer les événements pour une date précise
app.get('/api/evenements/:date', (req, res) => {
    const { date } = req.params;
    const sql = "SELECT * FROM ajoutEvenement WHERE date = ? ORDER BY heureDebut ASC";
    
    db.query(sql, [date], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de la récupération des événements.",
            details: err.sqlMessage || err.message
          });
        }
        res.json(results);
    });
});

// Supprimer un événement
app.delete('/api/evenements/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM ajoutEvenement WHERE evenementId = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Événement non trouvé.' });
        res.status(200).json({ message: 'Événement supprimé.' });
    });
});

/*Changer l'affichage dépendemment à l'authentification de l'utilisateur./
//Dans ce cas-ci, on renvoit l'utilisateur vers la page d'acceuil

app.get ('/', (request, response) => {
  response.render('/', {
    title: 'Page dacceuil', 
    styles: ['pages/acceuil/Acceuil.module.css'], 
    scripts: ['pages/acceuil/Acceuil.jsx'], 
    user: request.user, 
    idAdmin: request.session && request.session.utilisateur && request.session.utilisateur.role === "administrateur"
  });
});
*/

//route pour que l'administrateur crée un responsable avec des modules spécifiques
app.post("/api/admin/create-user", async (req, res) => {
  const { nom, email, motDePasse, modules } = req.body;
  if (!nom || !email || !motDePasse) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
  }
  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    db.query(
      "INSERT INTO utilisateurinscription (nom, email, motDePasse, modules) VALUES (?, ?, ?, ?)",
      [nom, email, hashedPassword, modules],
      (err, result) => {
        if (err) {
          console.error("Erreur SQL :", err);
          return res.status(500).json({ success: false, message: "Erreur lors de la création de l'utilisateur." });
        }
        res.json({ success: true, message: "Utilisateur créé avec succès !" });
      }
    );
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error);
    return res.status(500).json({ success: false, message: "Erreur lors de la création de l'utilisateur." });
  }
});
//

//faire la mise à jour du rôle d'un utilisateur grâce à l'email et le mot de passe (ex: responsable -> admin)
app.put("/api/admin/update-user-role/:email", async (req, res) => {
  const { email } = req.params;
  const { role } = req.body;
  //constante pour le mot de passe
  const {motDePasse} = req.body;

  if (!email || !role || !motDePasse) {
    return res.status(400).json({ success: false, message: "Email, rôle et mot de passe sont requis" });
  }

  try {
    db.query(
      "UPDATE utilisateurinscription SET role = ? WHERE email = ? AND motDePasse = ?",
      [role, email, motDePasse],
      (err, result) => {
        if (err) {
          console.error("Erreur SQL :", err);
          return res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du rôle." });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }
        res.json({ success: true, message: "Rôle mis à jour avec succès !" });
      }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle :", error);
    return res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du rôle." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));