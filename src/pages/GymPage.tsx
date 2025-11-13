import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert } from '@mui/material';
import { getGymMemberships, createGymMembership, GymMembership } from '../services/gymApiService';

const GymPage: React.FC = () => {
  const [memberships, setMemberships] = useState<GymMembership[]>([]);
  const [newMembership, setNewMembership] = useState<Omit<GymMembership, '_id'>>({
    member: '',
    membershipType: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const data = await getGymMemberships();
      setMemberships(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch gym memberships:', err);
      setError('Failed to load gym memberships. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMembership((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGymMembership(newMembership as GymMembership);
      setNewMembership({ member: '', membershipType: '', startDate: new Date(), endDate: new Date() });
      fetchMemberships(); // Refresh the list
      setError(null);
    } catch (err) {
      console.error('Failed to create gym membership:', err);
      setError('Failed to create membership. Please check your input and backend connection.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gym & Fitness Center Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Gym Membership
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Member Name"
            name="member"
            value={newMembership.member}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Membership Type"
            name="membershipType"
            value={newMembership.membershipType}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={newMembership.startDate.toISOString().split('T')[0]}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={newMembership.endDate.toISOString().split('T')[0]}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Membership
          </Button>
        </Box>
      </Box>

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
    </Container>
  );
};

export default GymPage;
