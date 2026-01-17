import React, { useMemo } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function ChauffeursView({ missions, chauffeurs, onMissionClick }) {
  const missionsByDriver = useMemo(() => {
    const grouped = {};
    
    missions.forEach(mission => {
      const driverId = mission.chauffeur_id || 'unassigned';
      if (!grouped[driverId]) {
        grouped[driverId] = [];
      }
      grouped[driverId].push(mission);
    });
    
    Object.keys(grouped).forEach(driverId => {
      grouped[driverId].sort((a, b) => {
        const dateCompare = a.date_mission.localeCompare(b.date_mission);
        if (dateCompare !== 0) return dateCompare;
        return a.heure_prevue.localeCompare(b.heure_prevue);
      });
    });
    
    return grouped;
  }, [missions]);

  const getDriverName = (driverId) => {
    if (driverId === 'unassigned') return 'Non assigné';
    const driver = chauffeurs.find(c => c.id === parseInt(driverId));
    return driver ? driver.nom : 'Chauffeur inconnu';
  };

  const getStatusColor = (statut) => {
    const colors = {
      'brouillon': '#FF9800',
      'envoyee': '#2196F3',
      'confirmee': '#03f488',
      'pec': '#F44336',
      'terminee': '#4CAF50'
    };
    return colors[statut] || '#9e9e9e';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'brouillon': 'Brouillon',
      'envoyee': 'Envoyée',
      'confirmee': 'Confirmée',
      'pec': 'En cours',
      'terminee': 'Terminée'
    };
    return labels[statut] || statut;
  };

  const driverIds = Object.keys(missionsByDriver).sort((a, b) => {
    if (a === 'unassigned') return 1;
    if (b === 'unassigned') return -1;
    return getDriverName(a).localeCompare(getDriverName(b));
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Missions par chauffeur
      </Typography>

      {driverIds.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Aucune mission
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {driverIds.map(driverId => {
            const driverMissions = missionsByDriver[driverId];
            const driverName = getDriverName(driverId);
            
            return (
              <Accordion key={driverId} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>👤</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                      {driverName}
                    </Typography>
                    <Chip
                      label={`${driverMissions.length} mission(s)`}
                      color={driverId === 'unassigned' ? 'warning' : 'primary'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {driverMissions.map((mission, index) => (
                      <Box key={mission.id}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 3,
                              bgcolor: 'action.hover',
                            },
                          }}
                          onClick={() => onMissionClick(mission)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography sx={{ fontWeight: 'bold', color: 'primary.main', minWidth: '120px' }}>
                              {format(parseISO(mission.date_mission), 'EEE d MMM', { locale: fr })} • {mission.heure_prevue}
                            </Typography>
                            <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>
                              {mission.client}
                            </Typography>
                            <Chip
                              label={getStatusLabel(mission.statut)}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(mission.statut),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label={mission.type}
                              size="small"
                              color={mission.type === 'CPAM' ? 'info' : 'default'}
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📍 {mission.adresse_depart} → {mission.adresse_arrivee}
                          </Typography>
                        </Paper>
                        {index < driverMissions.length - 1 && <Divider sx={{ my: 1 }} />}
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default ChauffeursView;
