import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { updateMission, deleteMission } from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const getStatutInfo = (statut) => {
  const statutMap = {
    'brouillon': { label: 'Brouillon', color: '#BDBDBD', emoji: '⚪' },
    'envoyee': { label: 'Envoyée', color: '#2196F3', emoji: '🔵' },
    'confirmee': { label: 'Confirmée', color: '#FFC107', emoji: '🟡' },
    'pec': { label: 'En cours', color: '#F44336', emoji: '🔴' },
    'terminee': { label: 'Terminée', color: '#4CAF50', emoji: '🟢' },
  };
  return statutMap[statut] || statutMap['brouillon'];
};

function PopupDetails({ open, onClose, mission, chauffeurs, editMode, onEditModeChange, onSuccess, onDelete }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mission) {
      setFormData({
        // ✅ CORRECTION : Extraire seulement YYYY-MM-DD de la date ISO
        date_mission: mission.date_mission ? mission.date_mission.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
        // ✅ CORRECTION : Extraire seulement HH:MM de l'heure (sans les secondes)
        heure_prevue: mission.heure_prevue ? mission.heure_prevue.substring(0, 5) : '08:00',
        client: mission.client || '',
        type: mission.type || 'CPAM',
        adresse_depart: mission.adresse_depart || '',
        adresse_arrivee: mission.adresse_arrivee || '',
        chauffeur_id: mission.chauffeur_id || '',
        notes: mission.notes || '',
      });
    }
  }, [mission]);

  if (!mission) return null;

  const statutInfo = getStatutInfo(mission.statut);
  const canModify = mission.statut !== 'pec' && mission.statut !== 'terminee';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        date_mission: formData.date_mission ? formData.date_mission.split('T')[0] : formData.date_mission,
        chauffeur_id: formData.chauffeur_id ? parseInt(formData.chauffeur_id) : null,
      };
      await updateMission(mission.id, updateData);
      onSuccess();
    } catch (error) {
      console.error('Erreur modification mission:', error);
      alert(error.response?.data?.error || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteMission(mission.id);
      onDelete();
    } catch (error) {
      console.error('Erreur suppression mission:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        📋 Détails de la Mission
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Chip
            label={`${statutInfo.emoji} ${statutInfo.label}`}
            sx={{
              bgcolor: statutInfo.color,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 2,
            }}
          />
        </Box>

        {editMode ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de la mission"
                name="date_mission"
                type="date"
                value={formData.date_mission}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heure prévue"
                name="heure_prevue"
                type="time"
                value={formData.heure_prevue}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <MenuItem value="CPAM">CPAM</MenuItem>
                <MenuItem value="Privé">Privé</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse de départ"
                name="adresse_depart"
                value={formData.adresse_depart}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse d'arrivée"
                name="adresse_arrivee"
                value={formData.adresse_arrivee}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Chauffeur"
                name="chauffeur_id"
                value={formData.chauffeur_id}
                onChange={handleChange}
              >
                <MenuItem value="">Non assigné</MenuItem>
                {chauffeurs.map((chauffeur) => (
                  <MenuItem key={chauffeur.id} value={chauffeur.id}>
                    {chauffeur.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {(() => {
                    try {
                      const date = mission.date_mission;
                      
                      // ✅ CORRECTION : Vérifier le type et la validité AVANT d'utiliser la date
                      if (!date || 
                          typeof date !== 'string' || 
                          date === 'null' || 
                          date === 'undefined' || 
                          date.trim() === '') {
                        return 'Date non définie';
                      }
                      
                      // ✅ Extraire seulement YYYY-MM-DD avant d'ajouter l'heure
                      const dateOnly = date.split('T')[0];
                      const dateObj = new Date(dateOnly + 'T00:00:00');
                      
                      if (isNaN(dateObj.getTime())) {
                        return 'Date invalide';
                      }
                      
                      return format(dateObj, 'EEEE dd MMMM yyyy', { locale: fr });
                    } catch (e) {
                      console.error('Erreur date popup:', mission.date_mission, e);
                      return 'Date invalide';
                    }
                  })()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Heure prévue
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {mission.heure_prevue}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Typography variant="body2" color="text.secondary">
                  Client
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {mission.client}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Chip
                  label={mission.type}
                  size="small"
                  color={mission.type === 'CPAM' ? 'info' : 'default'}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Adresse de départ
                </Typography>
                <Typography variant="body1">
                  📍 {mission.adresse_depart}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Adresse d'arrivée
                </Typography>
                <Typography variant="body1">
                  📍 {mission.adresse_arrivee}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Chauffeur
                </Typography>
                <Typography variant="body1" fontWeight="600" color="primary">
                  👤 {mission.chauffeur_nom || 'Non assigné'}
                </Typography>
              </Grid>

              {mission.notes && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {mission.notes}
                  </Typography>
                </Grid>
              )}

              {(mission.heure_pec || mission.heure_depose) && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  {mission.heure_pec && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Heure de prise en charge
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {format(new Date(mission.heure_pec), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </Typography>
                    </Grid>
                  )}

                  {mission.heure_depose && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Heure de dépose
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {format(new Date(mission.heure_depose), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </Typography>
                    </Grid>
                  )}

                  {mission.duree_minutes && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Durée
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {Math.round(mission.duree_minutes)} minutes
                      </Typography>
                    </Grid>
                  )}
                </>
              )}

              {mission.commentaire_chauffeur && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Commentaire du chauffeur
                  </Typography>
                  <Typography variant="body1" color="warning.main" fontStyle="italic">
                    💬 {mission.commentaire_chauffeur}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        {editMode ? (
          <>
            <Button onClick={() => onEditModeChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              💾 Enregistrer
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={loading}
            >
              🗑️ Supprimer
            </Button>
            {canModify && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => onEditModeChange(true)}
              >
                ✏️ Modifier
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default PopupDetails;
