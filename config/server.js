import express from "express";
import cors from "cors";
import db from "./baseDeDonnees.js";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

// Création d'un compte
app.post("/api/signup", async (req, res) => {
  const { email, motDePasse, prenom, nom, nomUtilisateur, confirmationMotDePasse } = req.body;

  if (!email || !motDePasse || !prenom || !nom || !nomUtilisateur || !confirmationMotDePasse) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
  }

  if (motDePasse !== confirmationMotDePasse) {
    return res.status(400).json({ success: false, message: "Mot de passe différent" });
  }

  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    db.query(
      "INSERT INTO utilisateurinscription (nom, nomUtilisateur, prenom, email, motDePasse) VALUES (?, ?, ?, ?, ?)",
      [nom, nomUtilisateur, prenom, email, hashedPassword],
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

      res.json({
        success: true,
        user: {
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          nomUtilisateur: user.nomUtilisateur
        }
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Récupérer les infos d'un utilisateur
app.get("/api/utilisateur/:email", (req, res) => {
  const email = req.params.email;

  db.query(
    "SELECT nom, prenom, nomUtilisateur, email FROM utilisateurinscription WHERE email = ?",
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

// Ajouter un cours
app.post('/api/cours', (req, res) => {
  const { nom, code, duree, programme, etape, typeSalle } = req.body;
    console.log('Received data:', req.body);

  const query = `
    INSERT INTO module_gestion_cours 
    (nomDuCours, code, duree, programme, etapeEtude, typeSalle)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nom, code, duree, programme, etape, typeSalle],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'ajout du cours."
        });
      }

      res.json({
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
    SET nomDuCours = ?, code = ?, duree = ?, programme = ?, etapeEtude = ?, typeSalle = ?
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

// Enregistrer un nouvel événement
app.post('/api/evenements', (req, res) => {
    const { date, cours, salle, heureDebut, heureFin } = req.body;
    const sql = "INSERT INTO ajoutEvenement (date, cours, salle, heureDebut, heureFin) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [date, cours, salle, heureDebut, heureFin], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Événement ajouté !" });
    });
});

// Récupérer les événements pour une date précise
app.get('/api/evenements/:date', (req, res) => {
    const { date } = req.params;
    const sql = "SELECT * FROM ajoutEvenement WHERE date = ? ORDER BY heureDebut ASC";
    
    db.query(sql, [date], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Ajouter un professeur
app.post('/api/professeurs', (req, res) => {
    console.log("POST /api/professeurs reçu avec:", req.body);
    
    const { matricule, nom, prenom, specialite, disponibilite, email } = req.body;

    // Validation des champs requis
    if (!matricule || !nom || !prenom || !specialite) {
        console.error("Validation échouée - champs manquants");
        return res.status(400).json({
            message: "Les champs matricule, nom, prénom et spécialité sont requis."
        });
    }

    const query = 'INSERT INTO module_gestion_professeur (nom, prenom, specialite, disponibilite, email, matricule) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [ nom, prenom, specialite, disponibilite || 'Disponible', email || '', matricule], (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({
                message: "Erreur lors de l'ajout du professeur: " + err.message
            });
        }

        console.log("Professeur ajouté avec succès - ID:", result.insertId);
        res.status(201).json({
            message: "Professeur ajouté avec succès !",
            id: result.insertId
        });
    });
});

// Lister les professeurs (avec filtres optionnels)
app.get('/api/professeurs', (req, res) => {
    const { specialite = '', disponibilite = '' } = req.query;

    let query = `
      SELECT idProfesseur, matricule, nom, prenom, specialite, disponibilite, email
      FROM module_gestion_professeur
    `;

    const conditions = [];
    const params = [];

    if (specialite && specialite.trim() !== '') {
      conditions.push('specialite LIKE ?');
      params.push(`%${specialite.trim()}%`);
    }

    if (disponibilite && disponibilite.trim() !== '') {
      conditions.push('disponibilite = ?');
      params.push(disponibilite.trim());
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY nom ASC, prenom ASC';

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Erreur SQL (liste professeurs) :', err);
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json(results);
    });
});

// Récupérer un professeur par son identifiant
app.get('/api/professeurs/:id', (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT idProfesseur, matricule, nom, prenom, specialite, disponibilite, email
      FROM module_gestion_professeur
      WHERE idProfesseur = ?
    `;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erreur SQL (professeur par id) :', err);
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ success: false, message: 'Professeur non trouve.' });
      }

      res.json({ success: true, data: results[0] });
    });
});

// Modifier un professeur
app.put('/api/professeurs/:id', (req, res) => {
    const { id } = req.params;
    const { matricule, nom, prenom, specialite, disponibilite, email } = req.body;

    if (!matricule || !nom || !prenom || !specialite) {
      return res.status(400).json({
        success: false,
        message: 'Les champs matricule, nom, prenom et specialite sont requis.'
      });
    }

    const query = `
      UPDATE module_gestion_professeur
      SET matricule = ?, nom = ?, prenom = ?, specialite = ?, disponibilite = ?, email = ?
      WHERE idProfesseur = ?
    `;

    db.query(
      query,
      [matricule, nom, prenom, specialite, disponibilite || 'Disponible', email || '', id],
      (err, result) => {
        if (err) {
          console.error('Erreur SQL (modification professeur) :', err);
          return res.status(500).json({ success: false, message: err.message });
        }

        if (!result || result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Professeur non trouve.' });
        }

        const selectQuery = `
          SELECT idProfesseur, matricule, nom, prenom, specialite, disponibilite, email
          FROM module_gestion_professeur
          WHERE idProfesseur = ?
        `;

        db.query(selectQuery, [id], (selectErr, selectResults) => {
          if (selectErr) {
            console.error('Erreur SQL (lecture apres modification) :', selectErr);
            return res.status(500).json({ success: false, message: selectErr.message });
          }

          res.json({
            success: true,
            message: 'Professeur modifie avec succes.',
            data: selectResults && selectResults[0] ? selectResults[0] : null
          });
        });
      }
    );
});

// Verifier si un professeur peut etre supprime
app.get('/api/professeurs/:id/verification-suppression', (req, res) => {
    const { id } = req.params;

    const checkProfQuery = 'SELECT idProfesseur FROM module_gestion_professeur WHERE idProfesseur = ?';

    db.query(checkProfQuery, [id], (profErr, profRows) => {
      if (profErr) {
        console.error('Erreur SQL (verification professeur) :', profErr);
        return res.status(500).json({ success: false, message: profErr.message });
      }

      if (!profRows || profRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Professeur non trouve.' });
      }

      const linkedRowsQuery = `
        SELECT DISTINCT c.TABLE_NAME
        FROM INFORMATION_SCHEMA.COLUMNS c
        JOIN INFORMATION_SCHEMA.TABLES t
          ON t.TABLE_SCHEMA = c.TABLE_SCHEMA
          AND t.TABLE_NAME = c.TABLE_NAME
        WHERE c.TABLE_SCHEMA = DATABASE()
          AND c.COLUMN_NAME = 'idProfesseur'
          AND c.TABLE_NAME <> 'module_gestion_professeur'
          AND t.TABLE_TYPE = 'BASE TABLE'
      `;

      db.query(linkedRowsQuery, (linkedErr, linkedTables) => {
        if (linkedErr) {
          console.error('Erreur SQL (verification dependances) :', linkedErr);
          return res.status(500).json({ success: false, message: linkedErr.message });
        }

        const tables = Array.isArray(linkedTables) ? linkedTables : [];

        if (tables.length === 0) {
          return res.json({
            success: true,
            data: {
              canDelete: true,
              disponibilites: 0,
              message: 'Aucune dependance detectee. La suppression est autorisee.'
            }
          });
        }

        const countPromises = tables.map((tableInfo) => {
          return new Promise((resolve) => {
            const tableName = tableInfo.TABLE_NAME;
            const countQuery = `SELECT COUNT(*) AS total FROM \`${tableName}\` WHERE idProfesseur = ?`;

            db.query(countQuery, [id], (countErr, countRows) => {
              if (countErr) {
                console.error(`Erreur SQL (count ${tableName}) :`, countErr);
                return resolve(0);
              }

              const total = countRows && countRows[0] ? Number(countRows[0].total) : 0;
              resolve(total);
            });
          });
        });

        Promise.all(countPromises)
          .then((counts) => {
            const linkedCount = counts.reduce((sum, value) => sum + value, 0);
            const canDelete = linkedCount === 0;

            return res.json({
              success: true,
              data: {
                canDelete,
                disponibilites: linkedCount,
                message: canDelete
                  ? 'Aucune dependance detectee. La suppression est autorisee.'
                  : 'Ce professeur est encore lie a des donnees. Supprimez d abord ces references.'
              }
            });
          })
          .catch((promiseErr) => {
            console.error('Erreur (verification dependances async) :', promiseErr);
            return res.status(500).json({ success: false, message: 'Erreur lors de la verification de suppression.' });
          });
      });
    });
});

// Supprimer un professeur
app.delete('/api/professeurs/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM module_gestion_professeur WHERE idProfesseur = ?';

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Erreur SQL (suppression professeur) :', err);

        // Message plus explicite pour les erreurs de contrainte (foreign key)
        if (err && (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451)) {
          return res.status(409).json({
            success: false,
            message: 'Suppression impossible: ce professeur est lie a d autres enregistrements.'
          });
        }

        return res.status(500).json({ success: false, message: err.message });
      }

      if (!result || result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Professeur non trouve.' });
      }

      return res.json({ success: true, message: 'Professeur supprime avec succes.' });
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

app.listen(5000, () => console.log("Server running on port 5000"));