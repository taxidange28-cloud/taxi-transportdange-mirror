import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { 
  getChauffeursManage, 
  createChauffeur, 
  updateChauffeur, 
  updateChauffeurPassword, 
  deleteChauffeur 
} from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function GestionChauffeurs({ open, onClose, onSuccess }) {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', nom: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (open) {
      loadChauffeurs();
    }
  }, [open]);

  const loadChauffeurs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getChauffeursManage();
      setChauffeurs(response.data.chauffeurs);
    } catch (err) {
      console.error('Erreur chargement chauffeurs:', err);
      setError('Erreur lors du chargement des chauffeurs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ username: '', password: '', nom: '' });
    setEditMode(false);
    setOpenForm(true);
  };

  const handleOpenEdit = (chauffeur) => {
    setFormData({ username: chauffeur.username, nom: chauffeur.nom, password: '' });
    setSelectedChauffeur(chauffeur);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleOpenPassword = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setNewPassword('');
    setOpenPasswordForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({ username: '', password: '', nom: '' });
    setSelectedChauffeur(null);
    setError('');
  };

  const handleClosePasswordForm = () => {
    setOpenPasswordForm(false);
    setNewPassword('');
    setSelectedChauffeur(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editMode) {
        await updateChauffeur(selectedChauffeur.id, {
          username: formData.username,
          nom: formData.nom,
        });
        onSuccess('Chauffeur modifié avec succès');
      } else {
        if (!formData.password || formData.password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères');
          return;
        }
        await createChauffeur(formData);
        onSuccess('Chauffeur créé avec succès');
      }
      handleCloseForm();
      loadChauffeurs();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'opération');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await updateChauffeurPassword(selectedChauffeur.id, newPassword);
      onSuccess('Mot de passe modifié avec succès');
      handleClosePasswordForm();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors du changement de mot de passe');
    }
  };

  const handleDelete = async (chauffeur) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${chauffeur.nom} ?`)) {
      return;
    }

    try {
      await deleteChauffeur(chauffeur.id);
      onSuccess('Chauffeur supprimé avec succès');
      loadChauffeurs();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">👤 Gestion des Chauffeurs</Typography>
            <Chip label={`${chauffeurs.length} chauffeur(s)`} color="primary" size="small" />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              fullWidth
            >
              Créer un nouveau chauffeur
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nom</strong></TableCell>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Créé le</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Chargement...</TableCell>
                  </TableRow>
                ) : chauffeurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Aucun chauffeur</TableCell>
                  </TableRow>
                ) : (
                  chauffeurs.map((chauffeur) => (
                    <TableRow key={chauffeur.id} hover>
                      <TableCell>{chauffeur.nom}</TableCell>
                      <TableCell>{chauffeur.username}</TableCell>
                      <TableCell>
                        {format(new Date(chauffeur.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(chauffeur)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleOpenPassword(chauffeur)}
                          title="Changer le mot de passe"
                        >
                          <KeyIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(chauffeur)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editMode ? 'Modifier le chauffeur' : 'Créer un nouveau chauffeur'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Nom complet"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
              sx={{ mb: 2, mt: 1 }}
            />

            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              sx={{ mb: 2 }}
            />

            {!editMode && (
              <TextField
                fullWidth
                type="password"
                label="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                helperText="Minimum 8 caractères"
                sx={{ mb: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Annuler</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openPasswordForm} onClose={handleClosePasswordForm} maxWidth="sm" fullWidth>
        <form onSubmit={handlePasswordSubmit}>
          <DialogTitle>
            Changer le mot de passe de {selectedChauffeur?.nom}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              helperText="Minimum 8 caractères"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordForm}>Annuler</Button>
            <Button type="submit" variant="contained">
              Modifier
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default GestionChauffeurs;
