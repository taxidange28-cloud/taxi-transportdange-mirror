import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  Fade,
} from '@mui/material';
import {
  filterMissionsEnCours,
  sortMissionsByDateTime,
  isMissionRecente,
  getChauffeurName,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
} from '../../utils/missionHelpers';

/**
 * Liste des missions en cours (envoyée, confirmée, prise en charge)
 * Scrollable avec max-height 400px
 */
function MissionsEnCours({ missions, chauffeurs, onMissionClick }) {
  // Filtrer et trier les missions en cours
  const missionsEnCours = sortMissionsByDateTime(
    filterMissionsEnCours(missions)
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Titre */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          color: '#FFC107',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        🟡 Missions en cours
        <Chip
          label={missionsEnCours.length}
          size="small"
          sx={{
            bgcolor: '#FFC107',
            color: '#000',
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
            background: '#FFC107',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#FFA000',
          },
        }}
      >
        {missionsEnCours.length === 0 ? (
          // Message si vide
          <Alert severity="info" sx={{ mt: 1 }}>
            Aucune mission en cours
          </Alert>
        ) : (
          // Liste des missions
          missionsEnCours.map((mission, index) => {
            const estRecente = isMissionRecente(mission);
            const chauffeurNom = getChauffeurName(mission, chauffeurs);
            const statutColor = getStatusColor(mission.statut);
            const statutLabel = getStatusLabel(mission.statut);
            const statutIcon = getStatusIcon(mission.statut);

            return (
              <Fade in={true} timeout={300} key={mission.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: `4px solid ${statutColor}`,
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

                    {/* Statut avec badge coloré */}
                    <Chip
                      label={`${statutIcon} ${statutLabel}`}
                      size="small"
                      sx={{
                        bgcolor: statutColor,
                        color: mission.statut === 'confirmee' ? '#000' : '#fff',
                        fontWeight: 'bold',
                        mb: 1,
                      }}
                    />

                    {/* Chauffeur */}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      👤 {chauffeurNom}
                    </Typography>

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
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      📍 {mission.adresse_arrivee}
                    </Typography>

                    {/* Commentaire chauffeur si existe */}
                    {mission.commentaire_chauffeur && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: 'warning.light',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                          💬 {mission.commentaire_chauffeur}
                        </Typography>
                      </Box>
                    )}
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

export default MissionsEnCours;
