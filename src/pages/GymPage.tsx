import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert, Chip, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getGymMemberships, createGymMembership, GymMembership, getTrainers, createTrainer, Trainer, getGymBookings, createGymBooking, GymBooking, getAccessLogs, createAccessLog, AccessLog } from '../services/gymApiService';

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
  const [bookings, setBookings] = useState<GymBooking[]>([]);
  const [newBooking, setNewBooking] = useState<Omit<GymBooking, '_id'>>({
    sessionName: '',
    trainer: '',
    member: '',
    startTime: new Date(),
    endTime: new Date(),
  });
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [selectedMemberForLog, setSelectedMemberForLog] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membershipsData, trainersData, bookingsData, accessLogsData] = await Promise.all([
        getGymMemberships(),
        getTrainers(),
        getGymBookings(),
        getAccessLogs(),
      ]);
      setMemberships(membershipsData);
      setTrainers(trainersData);
      setBookings(bookingsData);
      setAccessLogs(accessLogsData);
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
    setNewMembership((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGymMembership(newMembership as GymMembership);
      setNewMembership({ member: '', membershipType: '', startDate: new Date(), endDate: new Date() });
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Failed to create gym membership:', err);
      setError('Failed to create membership.');
    }
  };

  const handleTrainerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrainerAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewTrainer((prev) => ({ ...prev, availability: value.split(',').map(day => day.trim()) }));
  };

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrainer(newTrainer as Trainer);
      setNewTrainer({ name: '', specialty: '', availability: [] });
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Failed to create Trainer:', err);
      setError('Failed to create trainer.');
    }
  };

  const handleBookingInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGymBooking(newBooking as GymBooking);
      setNewBooking({ sessionName: '', trainer: '', member: '', startTime: new Date(), endTime: new Date() });
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Failed to create Gym Booking:', err);
      setError('Failed to create booking.');
    }
  };

  const handleLogAccess = async () => {
    if (!selectedMemberForLog) {
      setError('Please select a member to log access.');
      return;
    }
    try {
      await createAccessLog({ member: selectedMemberForLog });
      setSelectedMemberForLog('');
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Failed to log access:', err);
      setError('Failed to log access. Please ensure the backend is running.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gym & Fitness Center Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Log Access Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Log Member Access
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select Member</InputLabel>
            <Select
              value={selectedMemberForLog}
              label="Select Member"
              onChange={(e) => setSelectedMemberForLog(e.target.value as string)}
              required
            >
              {memberships.map(m => <MenuItem key={m._id} value={m._id}>{m.member}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleLogAccess} disabled={!selectedMemberForLog}>
            Log Access
          </Button>
        </Box>
      </Box>

      {/* Recent Access Logs Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Access Logs
        </Typography>
        {loading ? <CircularProgress /> : accessLogs.length === 0 ? <Typography>No access logs yet.</Typography> : (
          <List>
            {accessLogs.map((log) => (
              <ListItem key={log._id} divider>
                <ListItemText
                  primary={`Member: ${memberships.find(m => m._id === log.member)?.member || 'N/A'}`}
                  secondary={`Time: ${new Date(log.timestamp).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Session Booking Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Book a New Session
        </Typography>
        <Box component="form" onSubmit={handleBookingSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Session Name" name="sessionName" value={newBooking.sessionName} onChange={handleBookingInputChange} required />
          <FormControl fullWidth>
            <InputLabel>Member</InputLabel>
            <Select name="member" value={newBooking.member} label="Member" onChange={handleBookingInputChange} required>
              {memberships.map(m => <MenuItem key={m._id} value={m._id}>{m.member}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Trainer</InputLabel>
            <Select name="trainer" value={newBooking.trainer} label="Trainer" onChange={handleBookingInputChange} required>
              {trainers.map(t => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Start Time" name="startTime" type="datetime-local" value={newBooking.startTime.toISOString().substring(0, 16)} onChange={handleBookingInputChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="End Time" name="endTime" type="datetime-local" value={newBooking.endTime.toISOString().substring(0, 16)} onChange={handleBookingInputChange} InputLabelProps={{ shrink: true }} required />
          <Button type="submit" variant="contained" color="primary">Book Session</Button>
        </Box>
      </Box>

      {/* Booked Sessions Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Scheduled Sessions
        </Typography>
        {loading ? <CircularProgress /> : bookings.length === 0 ? <Typography>No sessions booked.</Typography> : (
          <List>
            {bookings.map((booking) => (
              <ListItem key={booking._id} divider>
                <ListItemText
                  primary={booking.sessionName}
                  secondary={`Member: ${memberships.find(m => m._id === booking.member)?.member || 'N/A'} | Trainer: ${trainers.find(t => t._id === booking.trainer)?.name || 'N/A'} | Time: ${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleTimeString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add New Gym Membership Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Gym Membership
        </Typography>
        <Box component="form" onSubmit={handleMembershipSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Member Name" name="member" value={newMembership.member} onChange={handleMembershipInputChange} required />
          <TextField label="Membership Type" name="membershipType" value={newMembership.membershipType} onChange={handleMembershipInputChange} required />
          <TextField label="Start Date" name="startDate" type="date" value={newMembership.startDate.toISOString().split('T')[0]} onChange={handleMembershipInputChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="End Date" name="endDate" type="date" value={newMembership.endDate.toISOString().split('T')[0]} onChange={handleMembershipInputChange} InputLabelProps={{ shrink: true }} required />
          <Button type="submit" variant="contained" color="primary">Add Membership</Button>
        </Box>
      </Box>

      {/* Active Gym Memberships Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Active Gym Memberships
        </Typography>
        {loading ? <CircularProgress /> : memberships.length === 0 ? <Typography>No gym memberships available.</Typography> : (
          <List>
            {memberships.map((membership) => (
              <ListItem key={membership._id} divider>
                <ListItemText primary={membership.member} secondary={`Type: ${membership.membershipType} | Start: ${new Date(membership.startDate).toLocaleDateString()} | End: ${new Date(membership.endDate).toLocaleDateString()}`} />
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
          <TextField label="Trainer Name" name="name" value={newTrainer.name} onChange={handleTrainerInputChange} required />
          <TextField label="Specialty" name="specialty" value={newTrainer.specialty} onChange={handleTrainerInputChange} required />
          <TextField label="Availability (comma-separated)" name="availability" value={newTrainer.availability.join(', ')} onChange={handleTrainerAvailabilityChange} required />
          <Button type="submit" variant="contained" color="primary">Add Trainer</Button>
        </Box>
      </Box>

      {/* Available Trainers Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Trainers
        </Typography>
        {loading ? <CircularProgress /> : trainers.length === 0 ? <Typography>No trainers available.</Typography> : (
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
