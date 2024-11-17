import React, { useEffect, useState } from 'react';
import './DiveSessionComponent.css';
import { Grid, Button, Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import moment from 'moment';
import { createDiveSessionMe, retrieveDiveSessionsMe, updateDiveSessionMe, deleteDiveSessionMe } from '../../../../services/DiveSessionClient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceIcon from '@mui/icons-material/Place';

const DiveSessionComponent = () => {
  
  const [diveSessions, setDiveSessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDive, setCurrentDive] = useState(null);
  const [formData, setFormData] = useState({
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
    { field: 'date', headerName: 'Date and Time', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'location', headerName: 'Location', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'gpsCoordinates', headerName: 'GPS Coordinates', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table', 
      valueGetter: (params) => {
        return `${params.lat}, ${params.lng}`;
      },
    },
    { field: 'waterType', headerName: 'Water Type', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'temperature', headerName: 'Temperature (°C)', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'diveCount', headerName: 'Dive Count', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'maxDepth', headerName: 'Max Depth (m)', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'maxDiveTime', headerName: 'Max Dive Time (sec)', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'notes', headerName: 'Notes', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center', 
      align: 'center', 
      headerClassName: 'header-table',
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              const { lat, lng } = params.row.gpsCoordinates;
              const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
              window.open(googleMapsUrl, '_blank');
            }}
            color="secondary"
          >
            <PlaceIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dive Sessions Management
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 4 }}
        onClick={() => handleOpen()}
      >
        Add New Dive
      </Button>
  
      <Box sx={{ height: "25rem", width: "100%", mb: 4 }}>
        <DataGrid
          rows={diveSessions}
          columns={columns.map((column) => ({
            ...column,
            flex: 1,
          }))}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
        />
      </Box>
  
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            margin: 'auto',
            width: '80%',
            maxWidth: '900px',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {editMode ? 'Edit Dive Session' : 'Add New Dive Session'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date and Time"
                  value={formData.date ? dayjs(formData.date) : null}
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      date: newValue ? newValue.toISOString() : '',
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="GPS Latitude"
                name="gpsCoordinates.lat"
                value={formData.gpsCoordinates.lat}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="GPS Longitude"
                name="gpsCoordinates.lng"
                value={formData.gpsCoordinates.lng}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Water Type</InputLabel>
                <Select
                  value={formData.waterType}
                  label="Water Type"
                  name="waterType"
                  onChange={handleInputChange}
                >
                  <MenuItem value="SEA">Sea</MenuItem>
                  <MenuItem value="LAKE">Lake</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Temperature (°C)"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Dive Count"
                type="number"
                name="diveCount"
                value={formData.diveCount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Max Depth (m)"
                name="maxDepth"
                value={formData.maxDepth}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editMode ? 'Update Dive' : 'Add Dive'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
               
};

export default DiveSessionComponent;