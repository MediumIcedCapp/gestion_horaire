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

app.get("/api/professeurs", (req, res) => {
  const specialite = req.query.specialite?.trim() || "";
  const disponibilite = req.query.disponibilite?.trim() || "";
  const conditions = [];
  const params = [];
  let query = "SELECT idProfesseur, matricule, nom, prenom, specialite, disponibilite FROM module_gestion_professeur";

  if (specialite !== "") {
    conditions.push("specialite LIKE ?");
    params.push(`%${specialite}%`);
  }

  if (disponibilite !== "") {
    conditions.push("disponibilite = ?");
    params.push(disponibilite);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += " ORDER BY nom ASC, prenom ASC";

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({
      success: true,
      data: results,
      count: results.length,
      filters: {
        specialite: specialite || null,
        disponibilite: disponibilite || null
      }
    });
  });
});

app.get("/api/professeurs/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT idProfesseur, matricule, nom, prenom, specialite, disponibilite FROM module_gestion_professeur WHERE idProfesseur = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Professeur non trouve" });
      }

      res.json({ success: true, data: results[0] });
    }
  );
});

app.put("/api/professeurs/:id", (req, res) => {
  const { id } = req.params;
  const { matricule, nom, prenom, specialite, disponibilite } = req.body;
  const updates = [];
  const params = [];

  if (typeof matricule === "string" && matricule.trim() !== "") {
    updates.push("matricule = ?");
    params.push(matricule.trim());
  }

  if (typeof nom === "string" && nom.trim() !== "") {
    updates.push("nom = ?");
    params.push(nom.trim());
  }

  if (typeof prenom === "string" && prenom.trim() !== "") {
    updates.push("prenom = ?");
    params.push(prenom.trim());
  }

  if (typeof specialite === "string" && specialite.trim() !== "") {
    updates.push("specialite = ?");
    params.push(specialite.trim());
  }

  if (typeof disponibilite === "string" && disponibilite.trim() !== "") {
    updates.push("disponibilite = ?");
    params.push(disponibilite.trim());
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: "Aucune donnee modifiable fournie" });
  }

  params.push(id);

  db.query(
    `UPDATE module_gestion_professeur SET ${updates.join(", ")} WHERE idProfesseur = ?`,
    params,
    (updateErr, result) => {
      if (updateErr) {
        return res.status(500).json({ success: false, message: updateErr.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Professeur non trouve" });
      }

      db.query(
        "SELECT idProfesseur, matricule, nom, prenom, specialite, disponibilite FROM module_gestion_professeur WHERE idProfesseur = ?",
        [id],
        (selectErr, results) => {
          if (selectErr) {
            return res.status(500).json({ success: false, message: selectErr.message });
          }

          res.json({
            success: true,
            message: "Professeur modifie avec succes",
            data: results[0]
          });
        }
      );
    }
  );
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
    
    db.query(sql, [date, cours, salle, heureDebut, heureFin], (err) => {
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

if (typeof globalThis.process === "undefined" || globalThis.process.env.NODE_ENV !== "test") {
  app.listen(5000, () => console.log("Server running on port 5000"));
}

export default app;
