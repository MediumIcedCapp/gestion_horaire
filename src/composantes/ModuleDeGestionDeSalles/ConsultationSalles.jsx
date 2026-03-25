//Danick A: Consulter les salles avec filtres par code et type.
import React, { useEffect, useState } from 'react';
import styles from './ConsultationSalles.module.css';

export default function ConsultationSalles({ onClose }) {
    const [salles, setSalles] = useState([]);

    //fetch toutes les salles
    useEffect(() => {
        fetch('http://localhost:5000/api/salles')
            .then(res => res.json())
            .then(data => setSalles(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={styles.consultation_salles_page}>
            <div className={styles.consultation_salles_container}>
                
                <div className={styles.close_btn} onClick={onClose}>
                    x
                </div>

                <h2>Liste des salles</h2>

                <table className={styles.salles_table}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Capacité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salles.map((salle) => (
                            <tr key={salle.idSalle}>
                                <td>{salle.code}</td>
                                <td>{salle.type}</td>
                                <td>{salle.capacite}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}