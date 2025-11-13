import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert } from '@mui/material';
import { getSpaServices, createSpaService, SpaService } from '../services/spaApiService';

const SpaPage: React.FC = () => {
  const [services, setServices] = useState<SpaService[]>([]);
  const [newService, setNewService] = useState<Omit<SpaService, '_id'>>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getSpaServices();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch SPA services:', err);
      setError('Failed to load SPA services. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSpaService(newService as SpaService); // Cast to SpaService as _id is optional
      setNewService({ name: '', description: '', price: 0, duration: 0 });
      fetchServices(); // Refresh the list
      setError(null);
    } catch (err) {
      console.error('Failed to create SPA service:', err);
      setError('Failed to create service. Please check your input and backend connection.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        SPA & Wellness Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New SPA Service
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Service Name"
            name="name"
            value={newService.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={newService.description}
            onChange={handleInputChange}
            multiline
            rows={2}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newService.price}
            onChange={handleInputChange}
            required
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={newService.duration}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Service
          </Button>
        </Box>
      </Box>

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
    </Container>
  );
};

export default SpaPage;
