import React, { useState } from 'react';
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
} from '@mui/material';
import { createMission } from '../services/api';
import { format } from 'date-fns';

function FormulaireMission({ open, onClose, onSuccess, chauffeurs }) {
  const [formData, setFormData] = useState({
    date_mission: format(new Date(), 'yyyy-MM-dd'),
    heure_prevue: '08:00',
    client: '',
    type: 'CPAM',
    adresse_depart: '',
    adresse_arrivee: '',
    chauffeur_id: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.client.trim()) {
      newErrors.client = 'Le nom du client est requis';
    }
    if (!formData.adresse_depart.trim()) {
      newErrors.adresse_depart = 'L\'adresse de départ est requise';
    }
    if (!formData.adresse_arrivee.trim()) {
      newErrors.adresse_arrivee = 'L\'adresse d\'arrivée est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (envoyer = false) => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const missionData = {
        ...formData,
        chauffeur_id: formData.chauffeur_id ? parseInt(formData.chauffeur_id) : null,
        statut: envoyer ? 'envoyee' : 'brouillon',
      };

      await createMission(missionData);
      setFormData({
        date_mission: format(new Date(), 'yyyy-MM-dd'),
        heure_prevue: '08:00',
        client: '',
        type: 'CPAM',
        adresse_depart: '',
        adresse_arrivee: '',
        chauffeur_id: '',
        notes: '',
      });
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error('Erreur création mission:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création de la mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        ➕ Nouvelle Mission
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
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
              error={!!errors.client}
              helperText={errors.client}
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
              error={!!errors.adresse_depart}
              helperText={errors.adresse_depart}
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
              error={!!errors.adresse_arrivee}
              helperText={errors.adresse_arrivee}
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
              label="Notes (optionnel)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleSubmit(false)}
          disabled={loading}
        >
          📥 Enregistrer (Brouillon)
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit(true)}
          disabled={loading}
        >
          📲 Envoyer Maintenant
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormulaireMission;
