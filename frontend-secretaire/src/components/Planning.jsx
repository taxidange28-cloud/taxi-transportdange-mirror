import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format, addDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { envoyerMission, envoyerMissionsParDate, deleteMission } from '../services/api';

const getStatutInfo = (statut) => {
  const statutMap = {
    'brouillon': { label: 'Brouillon', color: '#BDBDBD', emoji: '⚪', textColor: '#424242' },
    'envoyee': { label: 'Envoyée', color: '#2196F3', emoji: '🔵', textColor: '#fff' },
    'confirmee':  { label: 'Confirmée', color: '#FFC107', emoji: '🟡', textColor: '#424242' },
    'pec': { label:  'En cours', color: '#F44336', emoji: '🔴', textColor: '#fff' },
    'terminee': { label:  'Terminée', color:  '#4CAF50', emoji:  '����', textColor:  '#fff' },
  };
  return statutMap[statut] || statutMap['brouillon'];
};

function Planning({ missions, chauffeurs, loading, onMissionClick, filters, onFiltersChange, onRefresh }) {
  const [sending, setSending] = useState({});

  const handleFilterChange = (type) => {
    const today = startOfDay(new Date());
    let date_debut, date_fin;

    switch (type) {
      case 'today': 
        date_debut = format(today, 'yyyy-MM-dd');
        date_fin = format(today, 'yyyy-MM-dd');
        break;
      case 'tomorrow': 
        const tomorrow = addDays(today, 1);
        date_debut = format(tomorrow, 'yyyy-MM-dd');
        date_fin = format(tomorrow, 'yyyy-MM-dd');
        break;
      case 'week':
        date_debut = format(today, 'yyyy-MM-dd');
        date_fin = format(addDays(today, 7), 'yyyy-MM-dd');
        break;
      default:
        date_debut = format(today, 'yyyy-MM-dd');
        date_fin = format(addDays(today, 7), 'yyyy-MM-dd');
    }

    onFiltersChange({ date_debut, date_fin });
  };

  const handleEnvoyerMission = async (e, missionId) => {
    e.stopPropagation();
    setSending({ ... sending, [missionId]: true });
    try {
      await envoyerMission(missionId);
      onRefresh();
    } catch (error) {
      console.error('Erreur envoi mission:', error);
      alert('Erreur lors de l\'envoi de la mission');
    }
    setSending({ ...sending, [missionId]: false });
  };

  const handleEnvoyerParDate = async (date) => {
    if (!window.confirm(`Envoyer toutes les missions du ${format(new Date(date), 'dd MMMM yyyy', { locale: fr })} ?`)) {
      return;
    }

    try {
      await envoyerMissionsParDate(date);
      onRefresh();
    } catch (error) {
      console.error('Erreur envoi missions par date:', error);
      alert('Erreur lors de l\'envoi des missions');
    }
  };

  const handleDeleteMission = async (e, missionId) => {
    e.stopPropagation();
    try {
      await deleteMission(missionId);
      onRefresh();
    } catch (error) {
      console.error('Erreur suppression mission:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Grouper les missions par date (en filtrant les dates invalides)
  const missionsByDate = missions.reduce((acc, mission) => {
    const date = mission.date_mission;
    
    if (!date || 
        typeof date !== 'string' || 
        date === 'null' || 
        date === 'undefined' || 
        date. trim() === '') {
      console.warn('⚠️ Mission sans date valide:', mission.id, mission. client, 'Date:', date);
      return acc;
    }
    
    if (! acc[date]) {
      acc[date] = [];
    }
    acc[date].push(mission);
    return acc;
  }, {});

  const sortedDates = Object.keys(missionsByDate).sort();
  const brouillonCount = missions.filter(m => m.statut === 'brouillon').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb:  3, display: 'flex', gap:  2, alignItems: 'center', justifyContent: 'space-between' }}>
        <ButtonGroup variant="outlined" color="primary">
          <Button onClick={() => handleFilterChange('today')}>Aujourd'hui</Button>
          <Button onClick={() => handleFilterChange('tomorrow')}>Demain</Button>
          <Button onClick={() => handleFilterChange('week')}>Semaine</Button>
        </ButtonGroup>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {brouillonCount > 0 && (
            <Chip
              label={`${brouillonCount} brouillon(s)`}
              color="default"
              size="medium"
            />
          )}
          <IconButton onClick={onRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {sortedDates.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Aucune mission pour cette période
            </Typography>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => {
          const dateMissions = missionsByDate[date];
          const brouillonMissions = dateMissions.filter(m => m. statut === 'brouillon');

          return (
            <Card key={date} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    📅 {(() => {
                      try {
                        if (! date) return 'Date non définie';
                        const dateOnly = date.split('T')[0];
                        const dateObj = new Date(dateOnly + 'T00:00:00');
                        if (isNaN(dateObj. getTime())) return 'Date invalide';
                        return format(dateObj, 'EEEE dd MMMM yyyy', { locale: fr });
                      } catch (e) {
                        console.error('Erreur date:', date, e);
                        return 'Date invalide';
                      }
                    })()}
                  </Typography>
                  {brouillonMissions.length > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<SendIcon />}
                      onClick={() => handleEnvoyerParDate(date)}
                    >
                      ✉️ Envoyer toutes les missions ({brouillonMissions.length})
                    </Button>
                  )}
                </Box>

                <Grid container spacing={1.5}> {/* ✅ spacing: 2 → 1.5 */}
                  {dateMissions.map((mission) => {
                    const statutInfo = getStatutInfo(mission.statut);
                    const canModify = mission.statut !== 'pec' && mission.statut !== 'terminee';

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={mission.id}> {/* ✅ lg:  4 → 3 (cartes plus étroites) */}
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-1px)', // ✅ -2px → -1px
                              boxShadow: 2, // ✅ 3 → 2
                            },
                            borderLeft: `2px solid ${statutInfo.color}`,
                            maxHeight: '140px', // ✅ 220px → 140px (÷1.57)
                            maxWidth: '280px', // ✅ AJOUT :  Limite la largeur
                          }}
                          onClick={() => onMissionClick(mission)}
                        >
                          <CardContent sx={{ p: 0.75 }}> {/* ✅ 1.5 → 0.75 (÷2) */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.25 }}> {/* ✅ 0.5 → 0.25 */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}> {/* ✅ 0.5 → 0.25 */}
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}> {/* ✅ 1rem → 0.75rem */}
                                  {mission.heure_prevue}
                                </Typography>
                                <Chip
                                  label={`${statutInfo.emoji} ${statutInfo. label}`}
                                  size="small"
                                  sx={{
                                    bgcolor: statutInfo.color,
                                    color: statutInfo.textColor,
                                    fontWeight: 'bold',
                                    fontSize: '0.5rem', // ✅ 0.65rem → 0.5rem
                                    height: '16px', // ✅ 20px → 16px
                                    padding: '0 4px', // ✅ AJOUT
                                  }}
                                />
                              </Box>
                            </Box>

                            <Typography variant="body1" fontWeight="600" gutterBottom sx={{ fontSize: '0.7rem', mb: 0.25, lineHeight: 1.2 }}> {/* ✅ 0.875rem → 0.7rem */}
                              {mission.client}
                            </Typography>

                            <Chip
                              label={mission. type}
                              size="small"
                              color={mission.type === 'CPAM' ? 'info' : 'default'}
                              sx={{ mb: 0.25, height: '16px', fontSize: '0.6rem' }} // ✅ 20px → 16px, 0.7rem → 0.6rem
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.15, fontSize: '0.65rem', lineHeight: 1.1 }}> {/* ✅ 0.75rem → 0.65rem */}
                              📍 {mission.adresse_depart}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.65rem', lineHeight: 1.1 }}> {/* ✅ 0.75rem → 0.65rem */}
                              📍 {mission.adresse_arrivee}
                            </Typography>

                            <Typography variant="body2" color="primary" fontWeight="600" sx={{ fontSize: '0.65rem', mb: 0.25 }}> {/* ✅ 0.75rem → 0.65rem */}
                              👤 {mission.chauffeur_nom || 'Non assigné'}
                            </Typography>

                            {mission.commentaire_chauffeur && (
                              <Typography variant="body2" color="warning. main" sx={{ mt: 0.25, fontStyle: 'italic', fontSize:  '0.6rem' }}> {/* ✅ 0.7rem → 0.6rem */}
                                💬 {mission.commentaire_chauffeur}
                              </Typography>
                            )}

                            <Box sx={{ mt: 0.5, display: 'flex', gap:  0.25, justifyContent: 'flex-end' }}> {/* ✅ mt: 1 → 0.5, gap: 0.5 → 0.25 */}
                              {mission.statut === 'brouillon' && (
                                <Tooltip title="Envoyer">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => handleEnvoyerMission(e, mission.id)}
                                    disabled={sending[mission.id]}
                                    sx={{ padding: '2px' }} // ✅ 4px → 2px
                                  >
                                    <SendIcon sx={{ fontSize: '0.85rem' }} /> {/* ✅ 1rem → 0.85rem */}
                                  </IconButton>
                                </Tooltip>
                              )}
                              {canModify && (
                                <Tooltip title="Modifier">
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onMissionClick(mission);
                                    }}
                                    sx={{ padding: '2px' }} // ✅ 4px → 2px
                                  >
                                    <EditIcon sx={{ fontSize: '0.85rem' }} /> {/* ✅ 1rem → 0.85rem */}
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => handleDeleteMission(e, mission. id)}
                                  sx={{ padding: '2px' }} // ✅ 4px → 2px
                                >
                                  <DeleteIcon sx={{ fontSize: '0.85rem' }} /> {/* ✅ 1rem → 0.85rem */}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}

export default Planning;
