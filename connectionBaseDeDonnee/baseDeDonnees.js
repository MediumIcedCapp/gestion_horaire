import mysql from "mysql2";

const baseDeDonnees = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "gestion_horaire"
});

baseDeDonnees.connect((err) => {
  if (err) {
    console.log("Une erreur s'est produite: ", err);
  } else {
    console.log("Connexion à la base de données réussite");
  }
});

export default baseDeDonnees;