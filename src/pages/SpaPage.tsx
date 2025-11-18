import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, Box, CircularProgress, Alert, Chip, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getSpaServices, createSpaService, deleteSpaService, updateSpaService, SpaService, getTherapists, createTherapist, Therapist, getSpaBookings, createSpaBooking, SpaBooking } from '../services/spaApiService';

const SpaPage: React.FC = () => {
  const [services, setServices] = useState<SpaService[]>([]);
  const [newService, setNewService] = useState<Omit<SpaService, '_id'>>({ name: '', description: '', price: 0, duration: 0 });
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [newTherapist, setNewTherapist] = useState<Omit<Therapist, '_id'>>({ name: '', specialty: '', availability: [] });
  const [bookings, setBookings] = useState<SpaBooking[]>([]);
  const [newBooking, setNewBooking] = useState<Omit<SpaBooking, '_id'>>({ customer: '', service: '', therapist: '', startTime: new Date(), endTime: new Date() });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<SpaService | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesData, therapistsData, bookingsData] = await Promise.all([
        getSpaServices(),
        getTherapists(),
        getSpaBookings(),
      ]);
      setServices(servicesData);
      setTherapists(therapistsData);
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch SPA data:', err);
      setError('Failed to load SPA data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSpaService(newService as SpaService);
      setNewService({ name: '', description: '', price: 0, duration: 0 });
      fetchData(); // Refetch to get the new list
    } catch (err) {
      setError('Failed to create service.');
    }
  };
  
  const handleServiceDelete = async (id: string) => {
    try {
      await deleteSpaService(id);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      setError('Failed to delete service.');
    }
  };

  const handleServiceEdit = (service: SpaService) => {
    setEditingService({ ...service });
  };

  const handleServiceUpdate = async () => {
    if (!editingService) return;
    try {
      await updateSpaService(editingService._id!, editingService);
      setEditingService(null);
      fetchData();
    } catch (err) {
      setError('Failed to update service.');
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const handleTherapistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTherapist(newTherapist as Therapist);
      setNewTherapist({ name: '', specialty: '', availability: [] });
      fetchData();
    } catch (err) {
      setError('Failed to create therapist.');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSpaBooking(newBooking as SpaBooking);
      setNewBooking({ customer: '', service: '', therapist: '', startTime: new Date(), endTime: new Date() });
      fetchData();
    } catch (err) {
      setError('Failed to create appointment.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        SPA & Wellness Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Appointment Booking Section */}
      {/* ... existing booking form ... */}

      {/* Scheduled Appointments Section */}
      {/* ... existing appointments list ... */}

      {/* Add New SPA Service Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New SPA Service
        </Typography>
        <Box component="form" onSubmit={handleServiceSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Service Name" name="name" value={newService.name} onChange={(e) => setNewService(p => ({ ...p, name: e.target.value }))} required />
          <TextField label="Description" name="description" value={newService.description} onChange={(e) => setNewService(p => ({ ...p, description: e.target.value }))} multiline rows={2} required />
          <TextField label="Price" name="price" type="number" value={newService.price} onChange={(e) => setNewService(p => ({ ...p, price: parseFloat(e.target.value) }))} required inputProps={{ step: "0.01" }} />
          <TextField label="Duration (minutes)" name="duration" type="number" value={newService.duration} onChange={(e) => setNewService(p => ({ ...p, duration: parseInt(e.target.value, 10) }))} required />
          <Button type="submit" variant="contained" color="primary">Add Service</Button>
        </Box>
      </Box>

      {/* Available SPA Services Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available SPA Services
        </Typography>
        {loading ? <CircularProgress /> : services.length === 0 ? <Typography>No SPA services available.</Typography> : (
          <Box>
            {services.map((service) => (
              <Box key={service._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
                {editingService?._id === service._id ? (
                  <>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <TextField
                        label="Service Name"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        label="Description"
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        label="Price"
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                        sx={{ mb: 1, mr: 1 }}
                      />
                      <TextField
                        label="Duration"
                        type="number"
                        value={editingService.duration}
                        onChange={(e) => setEditingService({ ...editingService, duration: parseInt(e.target.value, 10) })}
                      />
                    </Box>
                    <Box>
                      <Button onClick={handleServiceUpdate} variant="contained" color="primary" sx={{ mr: 1 }}>Save</Button>
                      <Button onClick={handleCancelEdit} variant="outlined">Cancel</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Typography variant="h6">{service.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                      <Typography variant="body1">Price: ${service.price.toFixed(2)} | Duration: {service.duration} minutes</Typography>
                    </Box>
                    <Box>
                      <IconButton aria-label="edit" onClick={() => handleServiceEdit(service)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleServiceDelete(service._id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Add New Therapist Section */}
      {/* ... existing therapist form ... */}
      
      {/* Available Therapists Section */}
      {/* ... existing therapists list ... */}
    </Container>
  );
};

export default SpaPage;
