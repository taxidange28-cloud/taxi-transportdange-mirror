import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMission, ajouterCommentaire, confirmerMission, prendreMission, terminerMission } from '../../services/api';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { ArrowLeft, CheckCircle, PlayCircle, StopCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const DetailMission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [commentaireLoading, setCommentaireLoading] = useState(false);

  useEffect(() => {
    loadMission();
  }, [id]);

  const loadMission = async () => {
    try {
      const response = await getMission(id);
      setMission(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement mission:', error);
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    
    try {
      switch (action) {
        case 'confirmer':
          await confirmerMission(id);
          break;
        case 'pec':
          await prendreMission(id);
          break;
        case 'terminer':
          await terminerMission(id);
          break;
        default:
          break;
      }
      
      // Recharger la mission
      await loadMission();
    } catch (error) {
      console.error('Erreur action mission:', error);
      alert('Erreur lors de l\'action');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!commentaire.trim()) {
      return;
    }

    setCommentaireLoading(true);
    
    try {
      await ajouterCommentaire(id, commentaire);
      setCommentaire('');
      alert('Commentaire ajouté avec succès');
      await loadMission();
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire');
    } finally {
      setCommentaireLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      envoyee: { label: 'Envoyée', color: 'bg-blue-500 text-white', emoji: '🔵' },
      confirmee: { label: 'Confirmée', color: 'bg-yellow-500 text-white', emoji: '🟡' },
      pec: { label: 'En cours', color: 'bg-red-500 text-white', emoji: '🔴' },
      terminee: { label: 'Terminée', color: 'bg-green-500 text-white', emoji: '🟢' },
    };
    return badges[statut] || badges.envoyee;
  };

  const getActionButtons = () => {
    if (!mission) return null;

    switch (mission.statut) {
      case 'envoyee':
        return (
          <Button
            variant="success"
            onClick={() => handleAction('confirmer')}
            disabled={actionLoading}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirmer la réception</span>
          </Button>
        );
      case 'confirmee':
        return (
          <Button
            variant="primary"
            onClick={() => handleAction('pec')}
            disabled={actionLoading}
            className="flex items-center space-x-2"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Prendre en charge</span>
          </Button>
        );
      case 'pec':
        return (
          <Button
            variant="danger"
            onClick={() => handleAction('terminer')}
            disabled={actionLoading}
            className="flex items-center space-x-2"
          >
            <StopCircle className="w-5 h-5" />
            <span>Terminer la mission</span>
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!mission) {
    return (
      <Card>
        <p className="text-center text-gray-500">Mission non trouvée</p>
      </Card>
    );
  }

  const statutBadge = getStatutBadge(mission.statut);

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="outline"
        onClick={() => navigate('/chauffeur/missions')}
        className="mb-6 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux missions</span>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Détails de la mission</h2>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statutBadge.color}`}>
          {statutBadge.emoji} {statutBadge.label}
        </span>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations client</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nom du client</p>
            <p className="text-base font-medium text-gray-800">{mission.client}</p>
          </div>
          {mission.telephone && (
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="text-base font-medium text-gray-800">
                <a href={`tel:${mission.telephone}`} className="text-primary hover:underline">
                  {mission.telephone}
                </a>
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Date et heure</p>
            <p className="text-base font-medium text-gray-800">
              {format(new Date(mission.date_mission + 'T' + mission.heure_prevue), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type de véhicule</p>
            <p className="text-base font-medium text-gray-800">{mission.type}</p>
          </div>
          {mission.prix && (
            <div>
              <p className="text-sm text-gray-600">Prix</p>
              <p className="text-base font-medium text-gray-800">{mission.prix} €</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Itinéraire</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">📍 Départ</p>
            <p className="text-base font-medium text-gray-800">{mission.adresse_depart}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">📍 Arrivée</p>
            <p className="text-base font-medium text-gray-800">{mission.adresse_arrivee}</p>
          </div>
        </div>
      </Card>

      {mission.notes && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
          <p className="text-gray-600">{mission.notes}</p>
        </Card>
      )}

      {mission.statut !== 'terminee' && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
          {getActionButtons()}
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter un commentaire</h3>
        <form onSubmit={handleAddComment}>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
            placeholder="Votre commentaire..."
          />
          <Button
            type="submit"
            disabled={commentaireLoading || !commentaire.trim()}
            className="flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer le commentaire</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DetailMission;
