import express from "express";
import cors from "cors";
import db from "./baseDeDonnees.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.json(err);
    res.json({ message: "La base de donnee fonctionne" });
  });
});

app.listen(5000, () => {
  console.log("Le server est connecte au port 5000");
});