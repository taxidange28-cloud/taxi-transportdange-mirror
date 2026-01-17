import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { dismissReminderForToday } from '../services/reminderService';

function ReminderModal({ open, onClose, missions, date, onSendNow }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      dismissReminderForToday();
    }
    onClose();
  };

  const handleSendNow = () => {
    if (dontShowAgain) {
      dismissReminderForToday();
    }
    onSendNow(date);
  };

  const formattedDate = date ? format(parseISO(date), 'EEEE d MMMM yyyy', { locale: fr }) : '';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderTop: '4px solid #FF9800',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1,
        }}
      >
        <WarningIcon sx={{ color: '#FF9800', fontSize: '2rem' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          ⚠️ Rappel : Missions de demain
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
            Vous avez <strong>{missions.length} mission(s)</strong> en brouillon pour demain ({formattedDate}).
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            N'oubliez pas de les envoyer aux chauffeurs !
          </Typography>

          <Box
            sx={{
              bgcolor: '#FFF3E0',
              p: 2,
              borderRadius: 1,
              borderLeft: '4px solid #FF9800',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              📋 Missions concernées :
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              {missions.slice(0, 5).map(mission => (
                <li key={mission.id}>
                  <Typography variant="body2">
                    {mission.heure_prevue} • {mission.client} • {mission.adresse_depart}
                  </Typography>
                </li>
              ))}
              {missions.length > 5 && (
                <li>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    ... et {missions.length - 5} autre(s)
                  </Typography>
                </li>
              )}
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="Ne plus me rappeler aujourd'hui"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Plus tard
        </Button>
        <Button
          onClick={handleSendNow}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Envoyer maintenant
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReminderModal;
