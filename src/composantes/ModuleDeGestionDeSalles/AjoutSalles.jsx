//Danick A: Ajouter une salle avec un code unique, un type et une capacité.
import React, { useState } from 'react';
import styles from './AjoutSalles.module.css';
import Swal from 'sweetalert2';


export default function AjoutSalles({ onClose }) {
    const [code, setCode] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

    // Cherche la salle dans la base de données pour vérifier l'unicité du code
    try {
        const response = await fetch('http://localhost:5000/api/salles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, type, capacity })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Salle ajoutée avec succès !');

            onClose();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Erreur de connexion au serveur');
    }
    };


    return (
        <div className={styles.ajout_salles_page}>
            <div className={styles.ajout_salles_container}>

                <div className={styles.close_btn} onClick={onClose}>
                    x
                </div>

                <div className={styles.ajout_salle_box}>
                    <h2>Ajouter une salle</h2>
                    <form onSubmit={handleSubmit}>

                        <div className={styles.form_group}>
                            <label htmlFor="code">Code de la salle:</label>
                            <input type="text" id="code" value={code} onChange={e => setCode(e.target.value)}  required />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="type">Type de la salle:</label>
                            <select id="type" value={type} className={styles.select_input} onChange={e => setType(e.target.value)} required>
                                <option value="">Sélectionnez un type</option>
                                <option value="Salle de cours">Salle de cours</option>
                                <option value="Laboratoire">Laboratoire</option>
                                <option value="Amphitheatre">Amphithéâtre</option>
                                <option value="Salle information">Salle information</option>
                            </select>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="capacite">Capacité de la salle:</label>
                            <input type="number" id="capacite" value={capacity} onChange={e => setCapacity(e.target.value)} min="1" required />
                        </div>
                        <button className={styles.ajouter_btn} type="submit">Ajouter la salle</button>
                    </form>
                </div>
            </div>
        </div>
    )
}