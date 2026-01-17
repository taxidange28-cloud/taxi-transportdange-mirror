import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Button,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PlanningTabs from '../components/planning/PlanningTabs';
import FormulaireMission from '../components/FormulaireMission';
import PopupDetails from '../components/PopupDetails';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import GestionChauffeurs from '../components/GestionChauffeurs';
import { getMissions, getChauffeurs, exportExcel, envoyerMissionsParDate } from '../services/api';
import socketService from '../services/socket';
import { format } from 'date-fns';
import ReminderModal from '../components/ReminderModal';
import { checkShouldShowReminder } from '../services/reminderService';

function Dashboard() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderMissions, setReminderMissions] = useState([]);
  const [reminderDate, setReminderDate] = useState(null);
  const [openGestionChauffeurs, setOpenGestionChauffeurs] = useState(false);
  const [filters, setFilters] = useState({
    date_debut: format(new Date(), 'yyyy-MM-dd'),
    date_fin: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadMissions = useCallback(async () => {
    try {
      const response = await getMissions(filters);
      setMissions(response.data);
    } catch (error) {
      console.error('Error loading missions:', error);
    }
  }, [filters]);

  const handleMissionUpdate = useCallback((mission) => {
    setMissions((prev) => {
      const index = prev.findIndex((m) => m.id === mission.id);
      if (index >= 0) {
        const newMissions = [...prev];
        newMissions[index] = mission;
        return newMissions;
      }
      return [mission, ...prev];
    });

    setSelectedMission((prev) => {
      if (prev?.id === mission.id) {
        return mission;
      }
      return prev;
    });
  }, []);

  const handleMissionsUpdate = useCallback((updatedMissions) => {
    loadMissions();
    showSnackbar(`${updatedMissions.length} mission(s) envoyée(s)`, 'success');
  }, [loadMissions, showSnackbar]);

  const handleMissionDelete = useCallback((data) => {
    setMissions((prev) => prev.filter((m) => m.id !== data.id));
    setSelectedMission((prev) => {
      if (prev?.id === data.id) {
        setOpenDetails(false);
        return null;
      }
      return prev;
    });
  }, []);

  const setupSocketListeners = useCallback(() => {
    socketService.on('mission:nouvelle', handleMissionUpdate);
    socketService.on('mission:envoyee', handleMissionUpdate);
    socketService.on('missions:envoyees', handleMissionsUpdate);
    socketService.on('mission:modifiee', handleMissionUpdate);
    socketService.on('mission:supprimee', handleMissionDelete);
    socketService.on('mission:confirmee', handleMissionUpdate);
    socketService.on('mission:pec', handleMissionUpdate);
    socketService.on('mission:terminee', handleMissionUpdate);
    socketService.on('mission:commentaire', handleMissionUpdate);
  }, [handleMissionUpdate, handleMissionsUpdate, handleMissionDelete]);

  const removeSocketListeners = useCallback(() => {
    socketService.off('mission:nouvelle', handleMissionUpdate);
    socketService.off('mission:envoyee', handleMissionUpdate);
    socketService.off('missions:envoyees', handleMissionsUpdate);
    socketService.off('mission:modifiee', handleMissionUpdate);
    socketService.off('mission:supprimee', handleMissionDelete);
    socketService.off('mission:confirmee', handleMissionUpdate);
    socketService.off('mission:pec', handleMissionUpdate);
    socketService.off('mission:terminee', handleMissionUpdate);
    socketService.off('mission:commentaire', handleMissionUpdate);
  }, [handleMissionUpdate, handleMissionsUpdate, handleMissionDelete]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'secretaire') {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [missionsRes, chauffeursRes] = await Promise.all([
          getMissions(filters),
          getChauffeurs(),
        ]);
        setMissions(missionsRes.data);
        setChauffeurs(chauffeursRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        showSnackbar('Erreur de chargement', 'error');
        setLoading(false);
      }
    };

    loadData();
    setupSocketListeners();

    return () => {
      removeSocketListeners();
    };
  }, [navigate, setupSocketListeners, removeSocketListeners, showSnackbar]);

  useEffect(() => {
    if (!loading) {
      loadMissions();
    }
  }, [filters, loadMissions, loading]);

  useEffect(() => {
    if (!loading && missions.length > 0) {
      const result = checkShouldShowReminder(missions);
      if (result.show) {
        setReminderMissions(result.missions);
        setReminderDate(result.date);
        setReminderOpen(true);
      }
    }
  }, [missions, loading]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMissionCreated = () => {
    loadMissions();
    setOpenForm(false);
    showSnackbar('Mission créée avec succès', 'success');
  };

  const handleMissionUpdated = () => {
    loadMissions();
    setOpenDetails(false);
    setEditMode(false);
    setSelectedMission(null);
    showSnackbar('Mission modifiée avec succès', 'success');
  };

  const handleMissionDeleted = () => {
    loadMissions();
    setOpenDetails(false);
    setSelectedMission(null);
    showSnackbar('Mission supprimée', 'info');
  };

  const handleOpenDetails = (mission) => {
    setSelectedMission(mission);
    setOpenDetails(true);
    setEditMode(false);
  };

  const handleExport = async () => {
    try {
      const response = await exportExcel(filters.date_debut, filters.date_fin);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `missions_${filters.date_debut}_${filters.date_fin}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSnackbar('Export Excel réussi', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showSnackbar('Erreur lors de l\'export', 'error');
    }
  };

  const handleSendTomorrowMissions = async (date) => {
    try {
      await envoyerMissionsParDate({ date });
      showSnackbar(`${reminderMissions.length} mission(s) envoyée(s)`, 'success');
      setReminderOpen(false);
      loadMissions();
    } catch (error) {
      console.error('Error sending missions:', error);
      showSnackbar('Erreur lors de l\'envoi', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onLogout={handleLogout} />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <DashboardOverview
          missions={missions}
          chauffeurs={chauffeurs}
          onMissionClick={handleOpenDetails}
          loading={loading}
        />

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenForm(true)}
            size="large"
          >
            ➕ Nouvelle Mission
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenGestionChauffeurs(true)}
              startIcon={<span>👤</span>}
            >
              Gestion Chauffeurs
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleExport}
            >
              📊 Export Excel
            </Button>
          </Box>
        </Box>

        <PlanningTabs
          missions={missions}
          chauffeurs={chauffeurs}
          loading={loading}
          onMissionClick={handleOpenDetails}
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={loadMissions}
        />
      </Container>

      <FormulaireMission
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleMissionCreated}
        chauffeurs={chauffeurs}
      />

      <PopupDetails
        open={openDetails}
        onClose={() => {
          setOpenDetails(false);
          setEditMode(false);
          setSelectedMission(null);
        }}
        mission={selectedMission}
        chauffeurs={chauffeurs}
        editMode={editMode}
        onEditModeChange={setEditMode}
        onSuccess={handleMissionUpdated}
        onDelete={handleMissionDeleted}
      />

      <GestionChauffeurs
        open={openGestionChauffeurs}
        onClose={() => setOpenGestionChauffeurs(false)}
        onSuccess={(message) => showSnackbar(message, 'success')}
      />

      <ReminderModal
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        missions={reminderMissions}
        date={reminderDate}
        onSendNow={handleSendTomorrowMissions}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
