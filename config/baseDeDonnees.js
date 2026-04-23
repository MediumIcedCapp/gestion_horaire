//Importations
import mysql from "mysql2";

const baseDeDonnees = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", 
  database: "gestion_horaire",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const gererErreurConnexion = (err) => {
  console.error("Erreur connexion MySQL:", err);
};

baseDeDonnees.on("connection", (connection) => {
  connection.on("error", gererErreurConnexion);
});

baseDeDonnees.getConnection((err, connection) => {
  if (err) {
    console.error("Une erreur s'est produite: ", err);
  } else {
    console.log("Connexion à la base de données réussite");
    connection.on("error", gererErreurConnexion);
    connection.release();
  }
});

baseDeDonnees.on("error", (err) => {
  console.error("Erreur pool MySQL:", err);
});

export default baseDeDonnees;