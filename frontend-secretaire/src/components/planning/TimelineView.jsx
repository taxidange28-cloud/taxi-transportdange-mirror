import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function TimelineView({ missions, onMissionClick, filters }) {
  const availableDates = useMemo(() => {
    const dates = new Set();
    missions.forEach(mission => {
      dates.add(mission.date_mission);
    });
    return Array.from(dates).sort();
  }, [missions]);

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const filteredMissions = useMemo(() => {
    if (!selectedDate) return [];
    return missions
      .filter(m => m.date_mission === selectedDate)
      .sort((a, b) => a.heure_prevue.localeCompare(b.heure_prevue));
  }, [missions, selectedDate]);

  const getStatusColor = (statut) => {
    const colors = {
      'brouillon': '#FF9800',
      'envoyee': '#2196F3',
      'confirmee': '#FFC107',
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

  const calculateBarWidth = (heure) => {
    const [h] = heure.split(':');
    const hour = parseInt(h);
    return Math.max(15, (24 - hour) * 3);
  };

  if (availableDates.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Aucune mission dans la période sélectionnée
        </Typography>
      </Paper>
    );
  }

  if (!selectedDate) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Chargement...
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Date</InputLabel>
          <Select
            value={selectedDate}
            label="Date"
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {availableDates.map(date => (
              <MenuItem key={date} value={date}>
                {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: fr })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          {filteredMissions.length} mission(s)
        </Typography>
      </Box>

      {filteredMissions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Aucune mission pour cette date
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredMissions.map(mission => (
            <Paper
              key={mission.id}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateX(4px)',
                },
              }}
              onClick={() => onMissionClick(mission)}
            >
              <Typography
                sx={{
                  minWidth: '80px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'primary.main',
                }}
              >
                {mission.heure_prevue}
              </Typography>

              <Box
                sx={{
                  height: '40px',
                  backgroundColor: getStatusColor(mission.statut),
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  minWidth: `${calculateBarWidth(mission.heure_prevue)}%`,
                  maxWidth: '100%',
                  flexGrow: 1,
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {mission.chauffeur_nom || 'Non assigné'} • {mission.client} • {mission.adresse_depart} → {mission.adresse_arrivee}
                </Typography>
              </Box>

              <Chip
                label={getStatusLabel(mission.statut)}
                size="small"
                sx={{
                  bgcolor: getStatusColor(mission.statut),
                  color: 'white',
                  fontWeight: 600,
                  minWidth: '100px',
                }}
              />

              <Chip
                label={mission.type}
                size="small"
                color={mission.type === 'CPAM' ? 'info' : 'default'}
                sx={{ minWidth: '80px' }}
              />
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TimelineView;
