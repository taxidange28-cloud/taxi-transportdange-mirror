import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  Collapse,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  DirectionsCar as CarIcon,
  Done as DoneIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { confirmerMission, priseEnCharge, terminerMission, ajouterCommentaire } from '../services/api';

const getStatutInfo = (statut) => {
  const statutMap = {
    'envoyee': { label: 'Envoyée', color: '#2196F3', emoji: '🔵' },
    'confirmee': { label: 'Confirmée', color: '#FFC107', emoji: '🟡' },
    'pec': { label: 'En cours', color: '#F44336', emoji: '🔴' },
    'terminee': { label: 'Terminée', color: '#4CAF50', emoji: '🟢' },
  };
  return statutMap[statut] || statutMap['envoyee'];
};

function CarteMission({ mission, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  const statutInfo = getStatutInfo(mission.statut);
  const isNouvelle = mission.statut === 'envoyee' && !mission.confirmee_le;

  const handleConfirmer = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmerMission(mission.id);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la confirmation');
    } finally {
      setLoading(false);
    }
  };

  const handlePEC = async () => {
    if (!window.confirm('Confirmer la prise en charge de cette mission ?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await priseEnCharge(mission.id);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la prise en charge');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminer = async () => {
    if (!window.confirm('Confirmer la fin de cette mission ?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await terminerMission(mission.id);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la terminaison');
    } finally {
      setLoading(false);
    }
  };

  const handleAjouterCommentaire = async () => {
    if (!commentaire.trim()) {
      setError('Veuillez saisir un commentaire');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await ajouterCommentaire(mission.id, commentaire);
      setCommentaire('');
      setShowCommentForm(false);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du commentaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        position: 'relative',
        borderLeft: `6px solid ${statutInfo.color}`,
      }}
    >
      <CardContent>
        {/* En-tête */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {mission.heure_prevue}
            </Typography>
            <Chip
              label={`${statutInfo.emoji} ${statutInfo.label}`}
              size="small"
              sx={{
                bgcolor: statutInfo.color,
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            {isNouvelle && (
              <Chip
                label="NOUVEAU"
                size="small"
                color="error"
                sx={{ fontWeight: 'bold', animation: 'pulse 2s infinite' }}
              />
            )}
          </Box>

          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {expanded ? 'Moins' : 'Plus'}
          </Button>
        </Box>

        {/* Informations principales */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {mission.client}
        </Typography>

        <Chip
          label={mission.type}
          size="small"
          color={mission.type === 'CPAM' ? 'info' : 'default'}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Départ:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            📍 {mission.adresse_depart}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Arrivée:</strong>
          </Typography>
          <Typography variant="body1">
            📍 {mission.adresse_arrivee}
          </Typography>
        </Box>

        {/* Détails supplémentaires (collapsible) */}
        <Collapse in={expanded} timeout="auto">
          <Divider sx={{ my: 2 }} />

          {mission.vehicule_immatriculation && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              🚗 Véhicule: {mission.vehicule_immatriculation} {mission.vehicule_modele && `(${mission.vehicule_modele})`}
            </Typography>
          )}

          {mission.notes && (
            <Box sx={{ my: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                📝 Notes: 
              </Typography>
              <Typography variant="body2">
                {mission.notes}
              </Typography>
            </Box>
          )}

          {(mission.heure_pec || mission.heure_depose) && (
            <Box sx={{ my: 2 }}>
              {mission.heure_pec && (
                <Typography variant="body2" color="text.secondary">
                  ⏰ Prise en charge: {
                    (() => {
                      try {
                        const date = new Date(mission.heure_pec);
                        if (isNaN(date.getTime())) throw new Error('Invalid date');
                        return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
                      } catch (e) {
                        return 'Date invalide';
                      }
                    })()
                  }
                </Typography>
              )}
              {mission.heure_depose && (
                <Typography variant="body2" color="text.secondary">
                  ⏰ Dépose: {
                    (() => {
                      try {
                        const date = new Date(mission.heure_depose);
                        if (isNaN(date.getTime())) throw new Error('Invalid date');
                        return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
                      } catch (e) {
                        return 'Date invalide';
                      }
                    })()
                  }
                </Typography>
              )}
              {mission.duree_minutes && (
                <Typography variant="body2" color="primary" fontWeight="bold">
                  ⏱️ Durée: {Math.round(mission.duree_minutes)} minutes
                </Typography>
              )}
            </Box>
          )}

          {mission.commentaire_chauffeur && (
            <Box sx={{ my: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                💬 Votre commentaire:
              </Typography>
              <Typography variant="body2">
                {mission.commentaire_chauffeur}
              </Typography>
            </Box>
          )}
        </Collapse>

        {/* Erreur */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Formulaire de commentaire */}
        <Collapse in={showCommentForm} timeout="auto">
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Ajouter un commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              disabled={loading}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleAjouterCommentaire}
                disabled={loading || !commentaire.trim()}
                size="small"
              >
                Envoyer
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowCommentForm(false);
                  setCommentaire('');
                }}
                disabled={loading}
                size="small"
              >
                Annuler
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Boutons d'action */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {mission.statut === 'envoyee' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleConfirmer}
              disabled={loading}
              fullWidth
              size="large"
            >
              ✓ Confirmer Réception
            </Button>
          )}

          {(mission.statut === 'envoyee' || mission.statut === 'confirmee') && (
            <Button
              variant="contained"
              color="error"
              startIcon={<CarIcon />}
              onClick={handlePEC}
              disabled={loading}
              fullWidth
              size="large"
            >
              🚗 Prise en Charge
            </Button>
          )}

          {mission.statut === 'pec' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<DoneIcon />}
              onClick={handleTerminer}
              disabled={loading}
              fullWidth
              size="large"
            >
              ✓ Mission Terminée
            </Button>
          )}

          {mission.statut !== 'terminee' && !showCommentForm && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CommentIcon />}
              onClick={() => setShowCommentForm(true)}
              disabled={loading}
              fullWidth={mission.statut === 'terminee'}
            >
              💬 Ajouter un Commentaire
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CarteMission;
