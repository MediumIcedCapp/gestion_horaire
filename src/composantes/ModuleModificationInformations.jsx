import { useState } from 'react'

export default function ModuleModificationInformations({ cours, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: cours?.nom || '',
    professeur: cours?.professeur || '',
    salle: cours?.salle || '',
    heureDebut: cours?.heureDebut || '',
    heureFin: cours?.heureFin || '',
    jour: cours?.jour || '',
    description: cours?.description || ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nom.trim()) newErrors.nom = 'Le nom du cours est requis'
    if (!formData.professeur.trim()) newErrors.professeur = 'Le professeur est requis'
    if (!formData.salle.trim()) newErrors.salle = 'La salle est requise'
    if (!formData.heureDebut) newErrors.heureDebut = "L'heure de debut est requise"
    if (!formData.heureFin) newErrors.heureFin = "L'heure de fin est requise"
    if (!formData.jour) newErrors.jour = 'Le jour est requis'
    
    // Verifier que l'heure de fin est apres l'heure de debut
    if (formData.heureDebut && formData.heureFin && formData.heureDebut >= formData.heureFin) {
      newErrors.heureFin = "L'heure de fin doit etre apres l'heure de debut"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({ ...cours, ...formData, dateModification: new Date().toISOString() })
    }
  }

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  return (
    <div className="module-modification">
      <div className="module-overlay" onClick={onCancel}></div>
      <div className="module-content">
        <div className="module-header">
          <h2>Modifier les informations du cours</h2>
          <button className="btn-close" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="module-form">
          <div className="form-group">
            <label htmlFor="nom">Nom du cours *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={errors.nom ? 'error' : ''}
            />
            {errors.nom && <span className="error-message">{errors.nom}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="professeur">Professeur *</label>
            <input
              type="text"
              id="professeur"
              name="professeur"
              value={formData.professeur}
              onChange={handleChange}
              className={errors.professeur ? 'error' : ''}
            />
            {errors.professeur && <span className="error-message">{errors.professeur}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="salle">Salle *</label>
            <input
              type="text"
              id="salle"
              name="salle"
              value={formData.salle}
              onChange={handleChange}
              className={errors.salle ? 'error' : ''}
            />
            {errors.salle && <span className="error-message">{errors.salle}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="heureDebut">Heure de debut *</label>
              <input
                type="time"
                id="heureDebut"
                name="heureDebut"
                value={formData.heureDebut}
                onChange={handleChange}
                className={errors.heureDebut ? 'error' : ''}
              />
              {errors.heureDebut && <span className="error-message">{errors.heureDebut}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="heureFin">Heure de fin *</label>
              <input
                type="time"
                id="heureFin"
                name="heureFin"
                value={formData.heureFin}
                onChange={handleChange}
                className={errors.heureFin ? 'error' : ''}
              />
              {errors.heureFin && <span className="error-message">{errors.heureFin}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jour">Jour *</label>
            <select
              id="jour"
              name="jour"
              value={formData.jour}
              onChange={handleChange}
              className={errors.jour ? 'error' : ''}
            >
              <option value="">Selectionnez un jour</option>
              {jours.map(jour => (
                <option key={jour} value={jour}>{jour}</option>
              ))}
            </select>
            {errors.jour && <span className="error-message">{errors.jour}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="module-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
