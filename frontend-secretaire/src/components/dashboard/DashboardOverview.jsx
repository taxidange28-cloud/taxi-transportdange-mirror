import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import StatCards from './StatCards';
import MissionsModal from './MissionsModal';
import {
  filterMissionsEnAttente,
  filterMissionsEnCours,
  filterMissionsPEC,
} from '../../utils/missionHelpers';

function DashboardOverview({ missions, chauffeurs, onMissionClick, loading }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleStatCardClick = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const getFilteredMissions = () => {
    switch (modalType) {
      case 'brouillon':
        return filterMissionsEnAttente(missions);
      case 'en_cours':
        return filterMissionsEnCours(missions);
      case 'pec':
        return filterMissionsPEC(missions);
      case 'terminee':
        return missions.filter(m => m.statut === 'terminee');
      default:
        return [];
    }
  };

  const getModalInfo = () => {
    switch (modalType) {
      case 'brouillon':
        return { title: 'Missions en attente', color: '#FF9800', icon: '🟠' };
      case 'en_cours':
        return { title: 'Missions en cours', color: '#03f488', icon: '🔵' };
      case 'pec':
        return { title: 'Missions en prise en charge', color: '#F44336', icon: '🔴' };
      case 'terminee':
        return { title: 'Missions terminées', color: '#4CAF50', icon: '🟢' };
      default:
        return { title: '', color: '#000', icon: '' };
    }
  };

  const modalInfo = getModalInfo();
  const filteredMissions = getFilteredMissions();

  return (
    <Box sx={{ mb: 4 }}>
      <StatCards missions={missions} onStatCardClick={handleStatCardClick} />
      <MissionsModal
        open={modalOpen}
        onClose={handleCloseModal}
        missions={filteredMissions}
        chauffeurs={chauffeurs}
        title={modalInfo.title}
        color={modalInfo.color}
        icon={modalInfo.icon}
        onMissionClick={onMissionClick}
        type={modalType}
      />
    </Box>
  );
}

export default DashboardOverview;
