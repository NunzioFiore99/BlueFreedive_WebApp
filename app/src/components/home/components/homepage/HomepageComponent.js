import React, { useState, useEffect } from 'react';
import './HomepageComponent.css';
import { 
  Box, Typography, Paper, Grid2, CircularProgress, 
  Select, MenuItem, InputLabel, FormControl, Container, OutlinedInput
} from '@mui/material';

const getWeather = async (city) => {
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

function HomepageComponent() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Bari');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (city) {
        setLoading(true);
        try {
          const data = await getWeather(city);
          setWeather(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeather();
  }, [city]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!weather) {
    return (
      <Box sx={{ textAlign: 'center', padding: 3 }}>
        <Typography variant="h6">No weather data available</Typography>
      </Box>
    );
  }

  const { main, weather: weatherInfo, wind, clouds, sys, name } = weather;
  const temperature = Math.round(main.temp);
  const humidity = main.humidity;
  const windSpeed = wind.speed;
  const windDirection = wind.deg;
  const cloudCoverage = clouds.all;
  const description = weatherInfo[0]?.description || 'N/A';
  const icon = weatherInfo[0]?.icon || '01d';

  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', padding: 3 }}>
      <Typography variant="h3" sx={{ marginBottom: 5, fontWeight: 'bold', color: 'black' }}>
        Blue Freedive
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel>Select City</InputLabel>
        <Select value={city} onChange={handleCityChange} input={<OutlinedInput label="Select City" />}>
          <MenuItem value="Bari">Bari</MenuItem>
          <MenuItem value="Naples">Naples</MenuItem>
          <MenuItem value="Palermo">Palermo</MenuItem>
          <MenuItem value="Cagliari">Cagliari</MenuItem>
          <MenuItem value="Genoa">Genoa</MenuItem>
          <MenuItem value="Venice">Venice</MenuItem>
          <MenuItem value="La Spezia">La Spezia</MenuItem>
          <MenuItem value="Ancona">Ancona</MenuItem>
          <MenuItem value="Livorno">Livorno</MenuItem>
          <MenuItem value="Trieste">Trieste</MenuItem>
        </Select>
      </FormControl>

      {/* Weather Section */}
      <Paper elevation={3} sx={{ padding: 4, marginBottom: 5, background: "lightBlue" }}>
        <Typography variant="h4" gutterBottom fontWeight={"bold"}>
          Weather Forecast for {name}
        </Typography>

        <Grid2 container spacing={3} alignItems="center" justifyContent="center">
          <Grid2 item xs={12} sm={4}>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              width={120}
              height={120}
            />
            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
              {description}
            </Typography>
          </Grid2>

          <Grid2 item xs={12} sm={4}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {temperature}°C
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      <Grid2 container spacing={3} sx={{justifyContent: "center"}}>
        <Grid2 item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 3, background: "lightBlue" }}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              Atmosphere
            </Typography>
            <Typography variant="body1">Humidity: {humidity}%</Typography>
            <Typography variant="body1">Cloud Coverage: {cloudCoverage}%</Typography>
          </Paper>
        </Grid2>

        <Grid2 item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 3, background: "lightBlue" }}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              Wind and Sun
            </Typography>
            <Typography variant="body1">Wind Speed: {windSpeed} m/s</Typography>
            <Typography variant="body1">Wind Direction: {windDirection}°</Typography>
            <Typography variant="body1">Sunrise: {sunrise}</Typography>
            <Typography variant="body1">Sunset: {sunset}</Typography>
          </Paper>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default HomepageComponent;