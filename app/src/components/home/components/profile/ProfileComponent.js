import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  MenuItem,
  InputLabel,
  Select
} from '@mui/material';
import { useAuth } from '../../../../context/AuthContext';
import { retrieveUserProfileMe, updateUserProfileMe } from '../../../../services/UserProfileClient';
import { updateUserMe } from '../../../../services/UserClient';

const ProfileComponent = () => {
  const { user } = useAuth();

  // Stati per le sezioni
  const [profileData, setProfileData] = useState(null); // Dati personali
  const [password, setPassword] = useState(''); // Nuova password
  const [loadingProfile, setLoadingProfile] = useState(true); // Loading per i dati personali
  const [loadingPassword, setLoadingPassword] = useState(false); // Loading per la password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Recupera i dati personali
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await retrieveUserProfileMe(); // API per recuperare i dati
        setProfileData(response);
        setLoadingProfile(false);
      } catch (err) {
        setError('Errore nel caricamento dei dati del profilo.');
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // Gestisce il salvataggio della password
  const handlePasswordUpdate = async () => {
    setLoadingPassword(true);
    setError('');
    setSuccess(false);

    try {
        const body = {
            'email': user?.email,
            'password': password
        }
        await updateUserMe(body);
        setPassword('');
        setSuccess(true);
    } catch (err) {
        setError('Errore durante l\'aggiornamento della password.');
    } finally {
        setLoadingPassword(false);
    }
  };

  // Gestisce il salvataggio dei dati personali
  const handleProfileUpdate = async () => {
    setLoadingProfile(true);
    setError('');
    setSuccess(false);

    try {
        const body = {
            "gender": profileData.gender,
            "birthdate": profileData.birthdate,
            "firstName": profileData.firstName,
            "lastName": profileData.lastName,
            "weight": profileData.weight,
            "height": profileData.height
        }
        await updateUserProfileMe(body);
        setSuccess(true);
    } catch (err) {
      setError('Errore durante l\'aggiornamento dei dati personali.');
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loadingProfile && !profileData) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Profilo Utente
      </Typography>

      {/* Sezione Username, Email e Password */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Credenziali Utente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              value={user?.username || ''}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={user?.email || ''}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nuova Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordUpdate}
            disabled={loadingPassword || !password}
          >
            {loadingPassword ? <CircularProgress size={20} /> : 'Aggiorna Password'}
          </Button>
        </Box>
      </Paper>

      {/* Sezione Dati Personali */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Informazioni Personali
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome"
              value={profileData?.firstName || ''}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cognome"
              value={profileData?.lastName || ''}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
                <InputLabel id="gender-label">Genere</InputLabel>
                <Select
                    labelId="gender-label"
                    value={profileData?.gender || ''}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                >
                    <MenuItem value="MALE">Maschio</MenuItem>
                    <MenuItem value="FEMALE">Femmina</MenuItem>
                </Select>
            </FormControl>
            </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data di Nascita"
              type="date"
              value={profileData?.birthdate ? profileData.birthdate.slice(0, 10) : ''}
              onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Peso (kg)"
              type="number"
              value={profileData?.weight || ''}
              onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Altezza (cm)"
              type="number"
              value={profileData?.height || ''}
              onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProfileUpdate}
            disabled={loadingProfile}
          >
            {loadingProfile ? <CircularProgress size={20} /> : 'Aggiorna Informazioni'}
          </Button>
        </Box>
      </Paper>

      {/* Feedback per l'utente */}
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 3 }}>Aggiornamento avvenuto con successo!</Alert>}
    </Box>
  );
};

export default ProfileComponent;