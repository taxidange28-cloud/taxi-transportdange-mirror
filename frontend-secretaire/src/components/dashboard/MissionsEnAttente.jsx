import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Fade,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {
  filterMissionsEnAttente,
  sortMissionsByDateTime,
  isMissionRecente,
  isMissionAssignee,
  getChauffeurName,
} from '../../utils/missionHelpers';

/**
 * Liste des missions en attente (brouillon)
 * Scrollable avec max-height 400px
 */
function MissionsEnAttente({ missions, chauffeurs, onMissionClick, onEnvoyer }) {
  // Filtrer et trier les missions en attente
  const missionsEnAttente = sortMissionsByDateTime(
    filterMissionsEnAttente(missions)
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Titre */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          color: '#FF9800',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        🟠 Missions en attente
        <Chip
          label={missionsEnAttente.length}
          size="small"
          sx={{
            bgcolor: '#FF9800',
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Typography>

      {/* Liste scrollable */}
      <Box
        sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF9800',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#F57C00',
          },
        }}
      >
        {missionsEnAttente.length === 0 ? (
          // Message si vide
          <Alert severity="info" sx={{ mt: 1 }}>
            Aucune mission en attente
          </Alert>
        ) : (
          // Liste des missions
          missionsEnAttente.map((mission, index) => {
            const estRecente = isMissionRecente(mission);
            const estAssignee = isMissionAssignee(mission);
            const chauffeurNom = getChauffeurName(mission, chauffeurs);

            return (
              <Fade in={true} timeout={300} key={mission.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: '4px solid #FF9800',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => onMissionClick(mission)}
                >
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    {/* Heure et Client */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {mission.heure_prevue} • {mission.client}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          📅 {new Date(mission.date_mission).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </Typography>
                      </Box>

                      {/* Badge NOUVEAU */}
                      {estRecente && (
                        <Chip
                          label="🆕 NOUVEAU"
                          size="small"
                          sx={{
                            bgcolor: '#FF5722',
                            color: 'white',
                            fontWeight: 'bold',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.7 },
                            },
                          }}
                        />
                      )}
                    </Box>

                    {/* Type */}
                    <Chip
                      label={mission.type}
                      size="small"
                      color={mission.type === 'CPAM' ? 'info' : 'default'}
                      sx={{ mb: 1 }}
                    />

                    {/* Adresses */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
                      📍 {mission.adresse_depart}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.85rem' }}>
                      📍 {mission.adresse_arrivee}
                    </Typography>

                    {/* Chauffeur ou alerte */}
                    {!estAssignee ? (
                      <Alert severity="error" sx={{ py: 0, mb: 1 }}>
                        🔴 Mission non assignée
                      </Alert>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                        👤 {chauffeurNom}
                      </Typography>
                    )}

                    {/* Bouton Envoyer */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fullWidth
                      startIcon={<SendIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnvoyer(mission.id);
                      }}
                      disabled={!estAssignee}
                      sx={{ mt: 1 }}
                    >
                      {estAssignee ? '📲 Envoyer la mission' : '⚠️ Assigner d\'abord'}
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            );
          })
        )}
      </Box>
    </Box>
  );
}

export default MissionsEnAttente;
