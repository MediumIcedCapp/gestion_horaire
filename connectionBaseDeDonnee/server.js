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

    const query = 'INSERT INTO module_gestion_salle (code, type, capacity) VALUES (?, ?, ?)';
    db.query(query, [code, type, capacity], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de l\'ajout de la salle.' });
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

app.put('/api/salles/:id', (req, res) => {
    const { id } = req.params;
    const { code, type, capacity } = req.body;

    const query = 'UPDATE module_gestion_salle SET code = ?, type = ?, capacity = ? WHERE idSalle = ?';
    db.query(query, [code, type, capacity, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de la modification de la salle.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Salle non trouvée.' });
        }
        res.json({ message: 'Salle modifiée avec succès !' });
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

app.listen(5000, () => console.log("Server running on port 5000"));