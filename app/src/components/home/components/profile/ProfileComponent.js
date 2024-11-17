import React, { useEffect, useState } from 'react';
import './ProfileComponent.css';
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
  Select,
  OutlinedInput
} from '@mui/material';
import { useAuth } from '../../../../context/AuthContext';
import { retrieveUserProfileMe, updateUserProfileMe } from '../../../../services/UserProfileClient';
import { updateUserMe } from '../../../../services/UserClient';

const ProfileComponent = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [password, setPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await retrieveUserProfileMe();
        setProfileData(response);
        setLoadingProfile(false);
      } catch (err) {
        setError('Loading profile data error.');
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

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
        setError('Update password error.');
    } finally {
        setLoadingPassword(false);
    }
  };

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
      setError('Update personal data error.');
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loadingProfile && !profileData) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Sezione Username, Email e Password */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, mt:2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User Credentials
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              disabled
              value={user?.username || ''}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              disabled
              value={user?.email || ''}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
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
            {loadingPassword ? <CircularProgress size={20} /> : 'Update Password'}
          </Button>
        </Box>
      </Paper>

      {/* Sezione Dati Personali */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={profileData?.firstName || ''}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
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
                    input={<OutlinedInput label="Gender" />}
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
              label="Birthday"
              type="date"
              value={profileData?.birthdate ? profileData.birthdate.slice(0, 10) : ''}
              onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Weight (kg)"
              type="number"
              value={profileData?.weight || ''}
              onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Height (cm)"
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
            {loadingProfile ? <CircularProgress size={20} /> : 'Update Profile'}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 3 }}>Aggiornamento avvenuto con successo!</Alert>}
    </Box>
  );
};

export default ProfileComponent;