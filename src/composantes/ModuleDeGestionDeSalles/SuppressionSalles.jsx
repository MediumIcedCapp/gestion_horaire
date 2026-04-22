//Danick A: Supprimer une salle après vérification de son occupation.

import React, { useState, useEffect } from 'react';
import styles from './SuppressionSalles.module.css';
import Swal from 'sweetalert2';

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
            Swal.fire({
                title: 'Erreur',
                text: 'Veuillez sélectionner une salle',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#ffffff',
                color: '#333',
                iconColor: '#e4e8d6',
                customClass: {
                    popup: 'pop-up-toast',
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            return;
        }

        //Method delete sur la salle specifier
        try {
            const response = await fetch(`http://localhost:5000/api/salles/${selectedSalleId}`, {
                method: 'DELETE'
            }); 

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Suppression réussie',
                    text: 'Salle supprimée avec succès !',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#ffffff',
                    color: '#333',
                    iconColor: '#e4e8d6',
                    customClass: {
                        popup: 'pop-up-toast',
                    },
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                onClose();

            } else {
                Swal.fire({
                    title: 'Erreur',
                    text: 'Erreur lors de la suppression de la salle.',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#ffffff',
                    color: '#333',
                    iconColor: '#e4e8d6',
                    customClass: {
                        popup: 'pop-up-toast',
                    },
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Erreur',
                text: 'Erreur de connexion au serveur',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#ffffff',
                color: '#333',
                iconColor: '#e4e8d6',
                customClass: {
                    popup: 'pop-up-toast',
                },
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
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
                            {salle.code} - {salle.type} - Capacité: {salle.capacite}
                        </option>
                    ))}
                </select>
                <button className={styles.supprimer_btn} onClick={handleDelete}>Supprimer la salle</button>
            </div>
        </div>
    );
}
