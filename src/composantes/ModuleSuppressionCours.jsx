import { useState } from 'react'

export default function ModuleSuppressionCours({ cours, onConfirm, onCancel, onArchive }) {
  const [step, setStep] = useState('confirmation') // 'confirmation' ou 'archivage'
  const [archiveReason, setArchiveReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDelete = async () => {
    setIsProcessing(true)
    try {
      // Archiver le cours avant suppression
      const archivedCours = {
        ...cours,
        dateArchivage: new Date().toISOString(),
        raisonArchivage: archiveReason || 'Suppression par administrateur',
        statut: 'archive'
      }
      
      // Appeler la fonction d'archivage
      if (onArchive) {
        await onArchive(archivedCours)
      }
      
      // Confirmer la suppression
      await onConfirm(cours.id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Une erreur est survenue lors de la suppression du cours.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmStep = () => {
    setStep('archivage')
  }

  return (
    <div className="module-suppression">
      <div className="module-overlay" onClick={onCancel}></div>
      <div className="module-content">
        <div className="module-header">
          <h2>Supprimer le cours</h2>
          <button className="btn-close" onClick={onCancel}>&times;</button>
        </div>

        {step === 'confirmation' && (
          <div className="module-body">
            <div className="warning-icon">
              <span role="img" aria-label="warning">&#9888;</span>
            </div>
            <p className="warning-text">
              Etes-vous sur de vouloir supprimer ce cours ?
            </p>
            <div className="cours-details">
              <p><strong>Nom:</strong> {cours?.nom}</p>
              <p><strong>Professeur:</strong> {cours?.professeur}</p>
              <p><strong>Salle:</strong> {cours?.salle}</p>
              <p><strong>Horaire:</strong> {cours?.jour} de {cours?.heureDebut} a {cours?.heureFin}</p>
            </div>
            <p className="info-text">
              Cette action archivera le cours avant de le supprimer. Vous pourrez retrouver les informations dans les archives.
            </p>
            <div className="module-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onCancel}
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleConfirmStep}
                disabled={isProcessing}
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 'archivage' && (
          <div className="module-body">
            <h3>Archivage du cours</h3>
            <p>Avant de supprimer le cours, veuillez indiquer la raison de la suppression (optionnel):</p>
            
            <div className="form-group">
              <label htmlFor="archiveReason">Raison de la suppression</label>
              <textarea
                id="archiveReason"
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="Ex: Cours annule, Professeur parti, Reorganisation..."
                rows="3"
              />
            </div>

            <div className="archive-info">
              <p><strong>Informations archivees:</strong></p>
              <ul>
                <li>Nom du cours: {cours?.nom}</li>
                <li>Professeur: {cours?.professeur}</li>
                <li>Salle: {cours?.salle}</li>
                <li>Horaire: {cours?.jour} de {cours?.heureDebut} a {cours?.heureFin}</li>
                <li>Date d'archivage: {new Date().toLocaleDateString('fr-FR')}</li>
              </ul>
            </div>

            <div className="module-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setStep('confirmation')}
                disabled={isProcessing}
              >
                Retour
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={isProcessing}
              >
                {isProcessing ? 'Suppression en cours...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
