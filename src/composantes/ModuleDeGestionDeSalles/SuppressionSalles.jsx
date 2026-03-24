//Danick A: Supprimer une salle après vérification de son occupation.

import React, { useState, useEffect } from 'react';
import styles from './SuppressionSalles.module.css';

export default function SuppressionSalles({ onClose }) {
    const [salles, setSalles] = useState([]);
    const [selectedSalleId, setSelectedSalleId] = useState('');

    //Cherche toutes les salles
    useEffect(() => {
        fetch('http://localhost:5000/api/salles')
            .then(res => res.json())
            .then(data => setSalles(data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async () => {
        //Alerte si aucune salle est selectionner
        if (!selectedSalleId) {
            alert("Veuillez sélectionner une salle");
            return;
        }

        //Method delete sur la salle specifier
        try {
            const response = await fetch(`http://localhost:5000/api/salles/${selectedSalleId}`, {
                method: 'DELETE'
            }); 

            const data = await response.json();
            if (response.ok) {
                alert('Salle supprimée avec succès !');
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
        <div className={styles.suppression_salles_page}>
            <div className={styles.suppression_salles_container}>
                <div className={styles.close_btn} onClick={onClose}>
                    x
                </div>

                <h2>Supprimer une salle</h2>
                <select
                    className={styles.salle_select}
                    value={selectedSalleId}
                    onChange={(e) => setSelectedSalleId(e.target.value)}    
                >
                    <option value="">Sélectionnez une salle</option>
                    {salles.map((salle) => (
                        <option key={salle.idSalle} value={salle.idSalle}>
                            {salle.code} - {salle.type} - Capacité: {salle.capacity}
                        </option>
                    ))}
                </select>
                <button className={styles.supprimer_btn} onClick={handleDelete}>Supprimer la salle</button>
            </div>
        </div>
    );
}
