import React, { useEffect, useState } from 'react';
import { Grid, Button, Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import moment from 'moment';


// API calls
import { createDiveSessionMe, retrieveDiveSessionsMe, updateDiveSessionMe, deleteDiveSessionMe } from '../../../../services/DiveSessionClient';

// Icone
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DiveSessionComponent = () => {
  
  const [diveSessions, setDiveSessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDive, setCurrentDive] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    gpsCoordinates: { lat: '', lng: '' },
    waterType: 'SEA', // Default value
    temperature: '',
    diveCount: '',
    maxDepth: '',
    maxDiveTime: '',
    notes: ''
  });

  useEffect(() => {
    const fetchDiveSessions = async () => {
      try {
        const sessions = await retrieveDiveSessionsMe();
        setDiveSessions(sessionsWithLocalDate(sessions));
      } catch (error) {
        console.error('Error fetching dive sessions', error);
      }
    };
    fetchDiveSessions();
  }, []);

  const handleOpen = (dive = null) => {
    setEditMode(!!dive);
    setCurrentDive(dive);
    setFormData(dive || {
      date: '',
      location: '',
      gpsCoordinates: { lat: '', lng: '' },
      waterType: 'SEA',
      temperature: '',
      diveCount: '',
      maxDepth: '',
      maxDiveTime: '',
      notes: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('gpsCoordinates')) {
      setFormData({
        ...formData,
        gpsCoordinates: {
          ...formData.gpsCoordinates,
          [name.split('.')[1]]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
        const isoDate = new Date(formData.date).toISOString();

        const sessionData = {
            ...formData,
            date: isoDate,
        };

        if (editMode) {
            const body = {
              "date": sessionData.date,
              "location": sessionData.location,
              "gpsCoordinates": sessionData.gpsCoordinates,
              "waterType": sessionData.waterType,
              "temperature": sessionData.temperature,
              "diveCount": sessionData.diveCount,
              "maxDepth": sessionData.maxDepth,
              "maxDiveTime": sessionData.maxDiveTime,
              "notes": sessionData.notes
            }
            await updateDiveSessionMe(currentDive.id, body);
        } else {
            await createDiveSessionMe(formData);
        }
        const sessions = await retrieveDiveSessionsMe();
        setDiveSessions(sessionsWithLocalDate(sessions));
        handleClose();
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiveSessionMe(id);
      const sessions = await retrieveDiveSessionsMe();
      setDiveSessions(sessions);
    } catch (error) {
      console.error('Error deleting dive session', error);
    }
  };

  function sessionsWithLocalDate(sessions) {
    return sessions.map(session => {
      const localDate = moment(session.date).local();
      return {
          ...session,
          date: localDate.format('MM/DD/YYYY HH:mm:ss')
      };
    });
  }

  const columns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'waterType', headerName: 'Water Type', width: 150 },
    { field: 'maxDepth', headerName: 'Max Depth (m)', width: 150 },
    { field: 'maxDiveTime', headerName: 'Max Dive Time (sec)', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Dive Session Management</h1>
      <Button variant="contained" onClick={() => handleOpen()}>Add New Dive</Button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={diveSessions}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', width: '50%', marginTop: '10%' }}>
          <h2>{editMode ? 'Edit Dive Session' : 'Add New Dive Session'}</h2>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date and Time"
                value={formData.date ? dayjs(formData.date) : null}  // Usa dayjs per la gestione della data
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    date: newValue ? newValue.toISOString() : '',  // Converte il valore in formato ISO string
                  });
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="GPS Latitude"
                name="gpsCoordinates.lat"
                value={formData.gpsCoordinates.lat}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="GPS Longitude"
                name="gpsCoordinates.lng"
                value={formData.gpsCoordinates.lng}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Water Type</InputLabel>
                <Select
                  value={formData.waterType}
                  label="Water Type"
                  name="waterType"
                  onChange={handleInputChange}
                >
                  <MenuItem value="SEA">Mare</MenuItem>
                  <MenuItem value="LAKE">Lago</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Temperature (°C)"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Dive Count"
                type="number"
                name="diveCount"
                value={formData.diveCount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Depth (m)"
                name="maxDepth"
                value={formData.maxDepth}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Dive Time (sec)"
                name="maxDiveTime"
                value={formData.maxDiveTime}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            {editMode ? 'Update Dive' : 'Add Dive'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default DiveSessionComponent;