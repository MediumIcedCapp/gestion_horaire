import express from "express";
import cors from "cors";
import db from "./baseDeDonnees.js";
import bcrypt from "bcrypt";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SIGNUP

app.post("/api/signup", async (req, res) => {
  console.log("SIGNUP BODY:", req.body);

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
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: err.message });
        }

        res.json({ success: true, message: "Compte créé !" });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//  LOGIN

app.post("/api/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const { email, motDePasse } = req.body;
  console.log("Mot de passe entré:", motDePasse);

  if (!email || !motDePasse) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
  }

  try {
    db.query(
        "SELECT * FROM utilisateurinscription WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
            }

            const user = results[0];

            const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);

            if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
            }

            res.json({
            success: true,
            message: "Connexion réussie",
            user: { email: user.email, nom: user.nom, prenom: user.prenom }
            });
        }
    );
  } 
  
  catch (err) {
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

// 
app.listen(5000, () => console.log("Server running on port 5000"));