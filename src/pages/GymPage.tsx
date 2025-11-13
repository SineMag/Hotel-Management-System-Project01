import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert, Chip } from '@mui/material';
import { getGymMemberships, createGymMembership, GymMembership, getTrainers, createTrainer, Trainer } from '../services/gymApiService';

const GymPage: React.FC = () => {
  const [memberships, setMemberships] = useState<GymMembership[]>([]);
  const [newMembership, setNewMembership] = useState<Omit<GymMembership, '_id'>>({
    member: '',
    membershipType: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [newTrainer, setNewTrainer] = useState<Omit<Trainer, '_id'>>({
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
      const membershipsData = await getGymMemberships();
      setMemberships(membershipsData);
      const trainersData = await getTrainers();
      setTrainers(trainersData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch gym data:', err);
      setError('Failed to load gym data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMembership((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGymMembership(newMembership as GymMembership);
      setNewMembership({ member: '', membershipType: '', startDate: new Date(), endDate: new Date() });
      fetchData(); // Refresh all data
      setError(null);
    } catch (err) {
      console.error('Failed to create gym membership:', err);
      setError('Failed to create membership. Please check your input and backend connection.');
    }
  };

  const handleTrainerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrainer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTrainerAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewTrainer((prev) => ({
      ...prev,
      availability: value.split(',').map(day => day.trim()), // Split by comma and trim whitespace
    }));
  };

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrainer(newTrainer as Trainer);
      setNewTrainer({ name: '', specialty: '', availability: [] });
      fetchData(); // Refresh all data
      setError(null);
    } catch (err) {
      console.error('Failed to create Trainer:', err);
      setError('Failed to create trainer. Please check your input and backend connection.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gym & Fitness Center Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Add New Gym Membership Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Gym Membership
        </Typography>
        <Box component="form" onSubmit={handleMembershipSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Member Name"
            name="member"
            value={newMembership.member}
            onChange={handleMembershipInputChange}
            required
          />
          <TextField
            label="Membership Type"
            name="membershipType"
            value={newMembership.membershipType}
            onChange={handleMembershipInputChange}
            required
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={newMembership.startDate.toISOString().split('T')[0]}
            onChange={handleMembershipInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={newMembership.endDate.toISOString().split('T')[0]}
            onChange={handleMembershipInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Membership
          </Button>
        </Box>
      </Box>

      {/* Active Gym Memberships Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Active Gym Memberships
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : memberships.length === 0 ? (
          <Typography>No gym memberships available. Add one above!</Typography>
        ) : (
          <List>
            {memberships.map((membership) => (
              <ListItem key={membership._id} divider>
                <ListItemText
                  primary={membership.member}
                  secondary={`Type: ${membership.membershipType} | Start: ${new Date(membership.startDate).toLocaleDateString()} | End: ${new Date(membership.endDate).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add New Trainer Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Trainer
        </Typography>
        <Box component="form" onSubmit={handleTrainerSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Trainer Name"
            name="name"
            value={newTrainer.name}
            onChange={handleTrainerInputChange}
            required
          />
          <TextField
            label="Specialty"
            name="specialty"
            value={newTrainer.specialty}
            onChange={handleTrainerInputChange}
            required
          />
          <TextField
            label="Availability (comma-separated days, e.g., Mon, Tue)"
            name="availability"
            value={newTrainer.availability.join(', ')}
            onChange={handleTrainerAvailabilityChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Trainer
          </Button>
        </Box>
      </Box>

      {/* Available Trainers Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Trainers
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : trainers.length === 0 ? (
          <Typography>No trainers available. Add one above!</Typography>
        ) : (
          <List>
            {trainers.map((trainer) => (
              <ListItem key={trainer._id} divider>
                <ListItemText
                  primary={trainer.name}
                  secondary={
                    <Box component="span">
                      Specialty: {trainer.specialty} <br />
                      Availability: {trainer.availability.map((day, index) => (
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

export default GymPage;
