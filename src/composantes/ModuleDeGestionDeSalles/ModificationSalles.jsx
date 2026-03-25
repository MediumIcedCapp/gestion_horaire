//Danick A: Modifier le type ou la capacité d’une salle.
import React, { useState, useEffect } from 'react';
import styles from './ModificationSalles.module.css';

export default function ModificationSalles({ onClose }) {
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [code, setCode] = useState('');
    const [salles, setSalles] = useState([]);
    const [selectedSalleId, setSelectedSalleId] = useState('');
    const [ancienCode, setAncienCode] = useState('');
    

    //fetch toutes les salles
    useEffect(() => {
        fetch('http://localhost:5000/api/salles')
            .then(res => res.json())
            .then(data => {
                console.log("Salles:", data);
                setSalles(data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Alert si aucune salle est sélectionner
        if (!selectedSalleId) {
            alert("Veuillez sélectionner une salle");
            return;
        }

        //fetch la salle avec le code spécifier
        try {
            const response = await fetch(`http://localhost:5000/api/salles`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ancienCode: ancienCode,
                nouveauCode: code,
                type: type,
                capacite: Number(capacity) })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Salle modifiée avec succès !');
                onClose();
            } else {
                alert('Erreur: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            
        }
    };

    return (
        <div className={styles.modification_salles_page}>
            <div className={styles.modification_salles_container}>
                <div className={styles.close_btn} onClick={onClose}>
                    x
                </div>
                <div className={styles.modification_salle_box}>
                    <h2>Modifier une salle</h2>
                <select
                    value={selectedSalleId}
                    onChange={(e) => {
                        const selected = salles.find(s => s.idSalle == e.target.value);
                        setSelectedSalleId(e.target.value);

                        if (selected) {
                            setCode(selected.code || "");
                            setAncienCode(selected.code || ""); 
                            setType(selected.type || "");
                            setCapacity(selected.capacite || "");
                        } else {
                            console.log("Salle non trouvée");
                        }
                    }}
                    >
                    <option value="">-- Choisir une salle --</option>

                    {salles.map((salle) => (
                        <option key={salle.idSalle} value={salle.idSalle}>
                        {salle.code}
                        </option>
                    ))}
                </select>
                    {selectedSalleId && (
                    <form onSubmit={handleSubmit}>
                        <div className={styles.form_group}>
                            <label htmlFor="code">Code de la salle:</label>
                            <input type="text" id="code" value={code} onChange={e => setCode(e.target.value)} min="1" required />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="type">Type de la salle:</label>
                            <input type="text" id="type" value={type} onChange={e => setType(e.target.value)} required />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="capacity">Capacité de la salle:</label>
                            <input type="number" id="capacity" value={capacity} onChange={e => setCapacity(e.target.value)} min="1" required />
                        </div>
                        <button className={styles.modifier_btn} type="submit">Modifier la salle</button>
                    </form>
                    )}
                </div>
            </div>
        </div>
    )
};