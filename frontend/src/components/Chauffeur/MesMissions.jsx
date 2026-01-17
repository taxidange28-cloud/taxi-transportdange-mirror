import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMissionsChauffeur, confirmerMission, prendreMission, terminerMission } from '../../services/api';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { CheckCircle, PlayCircle, StopCircle, Eye, Filter } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const MesMissions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [filterStatut, setFilterStatut] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadMissions();
    }
  }, [user]);

  const loadMissions = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
      
      const response = await getMissionsChauffeur(user.id, {
        date_debut: today,
        date_fin: nextWeek,
      });
      setMissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement missions:', error);
      setLoading(false);
    }
  };

  const handleAction = async (missionId, action) => {
    setActionLoading({ ...actionLoading, [missionId]: true });
    
    try {
      switch (action) {
        case 'confirmer':
          await confirmerMission(missionId);
          break;
        case 'pec':
          await prendreMission(missionId);
          break;
        case 'terminer':
          await terminerMission(missionId);
          break;
        default:
          break;
      }
      
      // Recharger les missions
      await loadMissions();
    } catch (error) {
      console.error('Erreur action mission:', error);
      alert('Erreur lors de l\'action');
    } finally {
      setActionLoading({ ...actionLoading, [missionId]: false });
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

  const getActionButtons = (mission) => {
    const isLoading = actionLoading[mission.id];
    
    switch (mission.statut) {
      case 'envoyee':
        return (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleAction(mission.id, 'confirmer')}
            disabled={isLoading}
            className="flex items-center space-x-1"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirmer</span>
          </Button>
        );
      case 'confirmee':
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAction(mission.id, 'pec')}
            disabled={isLoading}
            className="flex items-center space-x-1"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Prendre en charge</span>
          </Button>
        );
      case 'pec':
        return (
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleAction(mission.id, 'terminer')}
            disabled={isLoading}
            className="flex items-center space-x-1"
          >
            <StopCircle className="w-4 h-4" />
            <span>Terminer</span>
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredMissions = filterStatut
    ? missions.filter(m => m.statut === filterStatut)
    : missions;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Missions</h2>

      {/* Filtre */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par statut
            </label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="envoyee">Envoyée</option>
              <option value="confirmee">Confirmée</option>
              <option value="pec">En cours</option>
              <option value="terminee">Terminée</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des missions */}
      {filteredMissions.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">Aucune mission trouvée</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMissions.map((mission) => {
            const statutBadge = getStatutBadge(mission.statut);
            return (
              <Card key={mission.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statutBadge.color}`}>
                        {statutBadge.emoji} {statutBadge.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(mission.date_mission + 'T' + mission.heure_prevue), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {mission.client}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 <span className="font-medium">{mission.adresse_depart}</span>
                      <br />
                      📍 <span className="font-medium">{mission.adresse_arrivee}</span>
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {mission.type}</span>
                      {mission.prix && <span>Prix: {mission.prix} €</span>}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {getActionButtons(mission)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/chauffeur/missions/${mission.id}`)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Détails</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MesMissions;
