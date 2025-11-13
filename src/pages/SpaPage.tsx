import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert, Chip, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getSpaServices, createSpaService, SpaService, getTherapists, createTherapist, Therapist, getSpaBookings, createSpaBooking, SpaBooking } from '../services/spaApiService';

const SpaPage: React.FC = () => {
  const [services, setServices] = useState<SpaService[]>([]);
  const [newService, setNewService] = useState<Omit<SpaService, '_id'>>({ name: '', description: '', price: 0, duration: 0 });
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [newTherapist, setNewTherapist] = useState<Omit<Therapist, '_id'>>({ name: '', specialty: '', availability: [] });
  const [bookings, setBookings] = useState<SpaBooking[]>([]);
  const [newBooking, setNewBooking] = useState<Omit<SpaBooking, '_id'>>({ customer: '', service: '', therapist: '', startTime: new Date(), endTime: new Date() });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      fetchData();
    } catch (err) {
      setError('Failed to create service.');
    }
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Book a New Appointment
        </Typography>
        <Box component="form" onSubmit={handleBookingSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Customer Name" name="customer" value={newBooking.customer} onChange={(e) => setNewBooking(p => ({ ...p, customer: e.target.value }))} required />
          <FormControl fullWidth>
            <InputLabel>Service</InputLabel>
            <Select name="service" value={newBooking.service} label="Service" onChange={(e) => setNewBooking(p => ({ ...p, service: e.target.value }))} required>
              {services.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Therapist</InputLabel>
            <Select name="therapist" value={newBooking.therapist} label="Therapist" onChange={(e) => setNewBooking(p => ({ ...p, therapist: e.target.value }))} required>
              {therapists.map(t => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Start Time" name="startTime" type="datetime-local" value={newBooking.startTime.toISOString().substring(0, 16)} onChange={(e) => setNewBooking(p => ({ ...p, startTime: new Date(e.target.value) }))} InputLabelProps={{ shrink: true }} required />
          <TextField label="End Time" name="endTime" type="datetime-local" value={newBooking.endTime.toISOString().substring(0, 16)} onChange={(e) => setNewBooking(p => ({ ...p, endTime: new Date(e.target.value) }))} InputLabelProps={{ shrink: true }} required />
          <Button type="submit" variant="contained" color="primary">Book Appointment</Button>
        </Box>
      </Box>

      {/* Scheduled Appointments Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Scheduled Appointments
        </Typography>
        {loading ? <CircularProgress /> : bookings.length === 0 ? <Typography>No appointments booked.</Typography> : (
          <List>
            {bookings.map((booking) => (
              <ListItem key={booking._id} divider>
                <ListItemText
                  primary={`Appointment for ${booking.customer}`}
                  secondary={`Service: ${services.find(s => s._id === booking.service)?.name || 'N/A'} | Therapist: ${therapists.find(t => t._id === booking.therapist)?.name || 'N/A'} | Time: ${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleTimeString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

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
          <List>
            {services.map((service) => (
              <ListItem key={service._id} divider>
                <ListItemText primary={service.name} secondary={`Description: ${service.description} | Price: $${service.price.toFixed(2)} | Duration: ${service.duration} mins`} />
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
          <TextField label="Therapist Name" name="name" value={newTherapist.name} onChange={(e) => setNewTherapist(p => ({ ...p, name: e.target.value }))} required />
          <TextField label="Specialty" name="specialty" value={newTherapist.specialty} onChange={(e) => setNewTherapist(p => ({ ...p, specialty: e.target.value }))} required />
          <TextField label="Availability (comma-separated)" name="availability" value={newTherapist.availability.join(', ')} onChange={(e) => setNewTherapist(p => ({ ...p, availability: e.target.value.split(',').map(d => d.trim()) }))} required />
          <Button type="submit" variant="contained" color="primary">Add Therapist</Button>
        </Box>
      </Box>

      {/* Available Therapists Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Therapists
        </Typography>
        {loading ? <CircularProgress /> : therapists.length === 0 ? <Typography>No therapists available.</Typography> : (
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
