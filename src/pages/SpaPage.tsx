import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert, Chip } from '@mui/material';
import { getSpaServices, createSpaService, SpaService, getTherapists, createTherapist, Therapist } from '../services/spaApiService';

const SpaPage: React.FC = () => {
  const [services, setServices] = useState<SpaService[]>([]);
  const [newService, setNewService] = useState<Omit<SpaService, '_id'>>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
  });
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [newTherapist, setNewTherapist] = useState<Omit<Therapist, '_id'>>({
    name: '',
    specialty: '',
    availability: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const servicesData = await getSpaServices();
      setServices(servicesData);
      const therapistsData = await getTherapists();
      setTherapists(therapistsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch SPA data:', err);
      setError('Failed to load SPA data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? parseFloat(value) : value,
    }));
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSpaService(newService as SpaService);
      setNewService({ name: '', description: '', price: 0, duration: 0 });
      fetchData(); // Refresh all data
      setError(null);
    } catch (err) {
      console.error('Failed to create SPA service:', err);
      setError('Failed to create service. Please check your input and backend connection.');
    }
  };

  const handleTherapistInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTherapist((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTherapistAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewTherapist((prev) => ({
      ...prev,
      availability: value.split(',').map(day => day.trim()), // Split by comma and trim whitespace
    }));
  };

  const handleTherapistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTherapist(newTherapist as Therapist);
      setNewTherapist({ name: '', specialty: '', availability: [] });
      fetchData(); // Refresh all data
      setError(null);
    } catch (err) {
      console.error('Failed to create Therapist:', err);
      setError('Failed to create therapist. Please check your input and backend connection.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        SPA & Wellness Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Add New SPA Service Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New SPA Service
        </Typography>
        <Box component="form" onSubmit={handleServiceSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Service Name"
            name="name"
            value={newService.name}
            onChange={handleServiceInputChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={newService.description}
            onChange={handleServiceInputChange}
            multiline
            rows={2}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newService.price}
            onChange={handleServiceInputChange}
            required
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={newService.duration}
            onChange={handleServiceInputChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Service
          </Button>
        </Box>
      </Box>

      {/* Available SPA Services Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available SPA Services
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : services.length === 0 ? (
          <Typography>No SPA services available. Add one above!</Typography>
        ) : (
          <List>
            {services.map((service) => (
              <ListItem key={service._id} divider>
                <ListItemText
                  primary={service.name}
                  secondary={`Description: ${service.description} | Price: $${service.price.toFixed(2)} | Duration: ${service.duration} mins`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add New Therapist Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Therapist
        </Typography>
        <Box component="form" onSubmit={handleTherapistSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Therapist Name"
            name="name"
            value={newTherapist.name}
            onChange={handleTherapistInputChange}
            required
          />
          <TextField
            label="Specialty"
            name="specialty"
            value={newTherapist.specialty}
            onChange={handleTherapistInputChange}
            required
          />
          <TextField
            label="Availability (comma-separated days, e.g., Mon, Tue)"
            name="availability"
            value={newTherapist.availability.join(', ')}
            onChange={handleTherapistAvailabilityChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Therapist
          </Button>
        </Box>
      </Box>

      {/* Available Therapists Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Therapists
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : therapists.length === 0 ? (
          <Typography>No therapists available. Add one above!</Typography>
        ) : (
          <List>
            {therapists.map((therapist) => (
              <ListItem key={therapist._id} divider>
                <ListItemText
                  primary={therapist.name}
                  secondary={
                    <Box component="span">
                      Specialty: {therapist.specialty} <br />
                      Availability: {therapist.availability.map((day, index) => (
                        <Chip key={index} label={day} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default SpaPage;
