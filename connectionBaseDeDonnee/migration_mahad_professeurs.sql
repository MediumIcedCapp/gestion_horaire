CREATE TABLE IF NOT EXISTS module_gestion_professeur (
  idProfesseur INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  matricule VARCHAR(20) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  specialite VARCHAR(80) NOT NULL,
  disponibilite VARCHAR(30) NOT NULL DEFAULT 'Disponible'
);

INSERT INTO module_gestion_professeur (matricule, nom, prenom, specialite, disponibilite)
SELECT * FROM (
  SELECT '1234567' AS matricule, 'Dupont' AS nom, 'Jean' AS prenom, 'Mathematiques' AS specialite, 'Disponible' AS disponibilite
  UNION ALL
  SELECT '7654321', 'Martin', 'Claire', 'Physique', 'Occupe'
  UNION ALL
  SELECT '2468135', 'Nguyen', 'Sophie', 'Informatique', 'Indisponible'
) AS seed_professeurs
WHERE NOT EXISTS (
  SELECT 1 FROM module_gestion_professeur
);
