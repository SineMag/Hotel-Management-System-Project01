import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Box, CircularProgress, Alert, Chip, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { 
  getGymMemberships, createGymMembership, deleteGymMembership, updateGymMembership, GymMembership, 
  getTrainers, createTrainer, deleteTrainer, updateTrainer, Trainer, 
  getGymBookings, createGymBooking, GymBooking, 
  getAccessLogs, createAccessLog, AccessLog 
} from '../services/gymApiService';

const GymPage: React.FC = () => {
  const [memberships, setMemberships] = useState<GymMembership[]>([]);
  const [newMembership, setNewMembership] = useState<Omit<GymMembership, '_id'>>({
    member: '',
    membershipType: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [editingMembership, setEditingMembership] = useState<GymMembership | null>(null);

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [newTrainer, setNewTrainer] = useState<Omit<Trainer, '_id'>>({
    name: '',
    specialty: '',
    availability: [],
  });
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  
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

  // Membership Handlers
  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGymMembership(newMembership as GymMembership);
      setNewMembership({ member: '', membershipType: '', startDate: new Date(), endDate: new Date() });
      fetchData();
    } catch (err) {
      setError('Failed to create membership.');
    }
  };

  const handleMembershipDelete = async (id: string) => {
    try {
      await deleteGymMembership(id);
      setMemberships(memberships.filter(m => m._id !== id));
    } catch (err) {
      setError('Failed to delete membership.');
    }
  };

  const handleMembershipEdit = (membership: GymMembership) => {
    setEditingMembership({ ...membership });
  };

  const handleMembershipUpdate = async () => {
    if (!editingMembership) return;
    try {
      await updateGymMembership(editingMembership._id!, editingMembership);
      setEditingMembership(null);
      fetchData();
    } catch (err) {
      setError('Failed to update membership.');
    }
  };

  // Trainer Handlers
  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrainer(newTrainer as Trainer);
      setNewTrainer({ name: '', specialty: '', availability: [] });
      fetchData();
    } catch (err) {
      setError('Failed to create trainer.');
    }
  };

  const handleTrainerDelete = async (id: string) => {
    try {
      await deleteTrainer(id);
      setTrainers(trainers.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete trainer.');
    }
  };

  const handleTrainerEdit = (trainer: Trainer) => {
    setEditingTrainer({ ...trainer });
  };

  const handleTrainerUpdate = async () => {
    if (!editingTrainer) return;
    try {
      await updateTrainer(editingTrainer._id!, editingTrainer);
      setEditingTrainer(null);
      fetchData();
    } catch (err) {
      setError('Failed to update trainer.');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingMembership(null);
    setEditingTrainer(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGymBooking(newBooking as GymBooking);
      setNewBooking({ sessionName: '', trainer: '', member: '', startTime: new Date(), endTime: new Date() });
      fetchData();
    } catch (err) {
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
    } catch (err) {
      setError('Failed to log access.');
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
          <TextField label="Session Name" name="sessionName" value={newBooking.sessionName} onChange={(e) => setNewBooking(p => ({ ...p, sessionName: e.target.value }))} required />
          <FormControl fullWidth>
            <InputLabel>Member</InputLabel>
            <Select name="member" value={newBooking.member} label="Member" onChange={(e) => setNewBooking(p => ({ ...p, member: e.target.value }))} required>
              {memberships.map(m => <MenuItem key={m._id} value={m._id}>{m.member}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Trainer</InputLabel>
            <Select name="trainer" value={newBooking.trainer} label="Trainer" onChange={(e) => setNewBooking(p => ({ ...p, trainer: e.target.value }))} required>
              {trainers.map(t => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Start Time" name="startTime" type="datetime-local" value={new Date(newBooking.startTime).toISOString().substring(0, 16)} onChange={(e) => setNewBooking(p => ({ ...p, startTime: new Date(e.target.value) }))} InputLabelProps={{ shrink: true }} required />
          <TextField label="End Time" name="endTime" type="datetime-local" value={new Date(newBooking.endTime).toISOString().substring(0, 16)} onChange={(e) => setNewBooking(p => ({ ...p, endTime: new Date(e.target.value) }))} InputLabelProps={{ shrink: true }} required />
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
          <TextField label="Member Name" name="member" value={newMembership.member} onChange={(e) => setNewMembership(p => ({ ...p, member: e.target.value }))} required />
          <TextField label="Membership Type" name="membershipType" value={newMembership.membershipType} onChange={(e) => setNewMembership(p => ({ ...p, membershipType: e.target.value }))} required />
          <TextField label="Start Date" name="startDate" type="date" value={newMembership.startDate.toISOString().split('T')[0]} onChange={(e) => setNewMembership(p => ({ ...p, startDate: new Date(e.target.value) }))} InputLabelProps={{ shrink: true }} required />
          <TextField label="End Date" name="endDate" type="date" value={newMembership.endDate.toISOString().split('T')[0]} onChange={(e) => setNewMembership(p => ({ ...p, endDate: new Date(e.target.value) }))} InputLabelProps={{ shrink: true }} required />
          <Button type="submit" variant="contained" color="primary">Add Membership</Button>
        </Box>
      </Box>

      {/* Active Gym Memberships Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Active Gym Memberships
        </Typography>
        {loading ? <CircularProgress /> : memberships.length === 0 ? <Typography>No gym memberships available.</Typography> : (
          <Box>
            {memberships.map((membership) => (
              <Box key={membership._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
                {editingMembership?._id === membership._id ? (
                  <>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <TextField label="Member Name" value={editingMembership.member} onChange={(e) => setEditingMembership({ ...editingMembership, member: e.target.value })} fullWidth sx={{ mb: 1 }} />
                      <TextField label="Membership Type" value={editingMembership.membershipType} onChange={(e) => setEditingMembership({ ...editingMembership, membershipType: e.target.value })} fullWidth sx={{ mb: 1 }} />
                      <TextField label="Start Date" type="date" value={new Date(editingMembership.startDate).toISOString().split('T')[0]} onChange={(e) => setEditingMembership({ ...editingMembership, startDate: new Date(e.target.value) })} sx={{ mb: 1, mr: 1 }} />
                      <TextField label="End Date" type="date" value={new Date(editingMembership.endDate).toISOString().split('T')[0]} onChange={(e) => setEditingMembership({ ...editingMembership, endDate: new Date(e.target.value) })} />
                    </Box>
                    <Box>
                      <Button onClick={handleMembershipUpdate} variant="contained" color="primary" sx={{ mr: 1 }}>Save</Button>
                      <Button onClick={handleCancelEdit} variant="outlined">Cancel</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Typography variant="h6">{membership.member}</Typography>
                      <Typography variant="body2" color="text.secondary">Type: {membership.membershipType}</Typography>
                      <Typography variant="body1">Duration: {new Date(membership.startDate).toLocaleDateString()} - {new Date(membership.endDate).toLocaleDateString()}</Typography>
                    </Box>
                    <Box>
                      <IconButton aria-label="edit" onClick={() => handleMembershipEdit(membership)}><EditIcon /></IconButton>
                      <IconButton aria-label="delete" onClick={() => handleMembershipDelete(membership._id!)}><DeleteIcon /></IconButton>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Add New Trainer Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Trainer
        </Typography>
        <Box component="form" onSubmit={handleTrainerSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Trainer Name" name="name" value={newTrainer.name} onChange={(e) => setNewTrainer(p => ({...p, name: e.target.value}))} required />
          <TextField label="Specialty" name="specialty" value={newTrainer.specialty} onChange={(e) => setNewTrainer(p => ({...p, specialty: e.target.value}))} required />
          <TextField label="Availability (comma-separated)" name="availability" value={newTrainer.availability.join(', ')} onChange={(e) => setNewTrainer(p => ({...p, availability: e.target.value.split(',').map(d => d.trim())}))} required />
          <Button type="submit" variant="contained" color="primary">Add Trainer</Button>
        </Box>
      </Box>

      {/* Available Trainers Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Trainers
        </Typography>
        {loading ? <CircularProgress /> : trainers.length === 0 ? <Typography>No trainers available.</Typography> : (
          <Box>
            {trainers.map((trainer) => (
              <Box key={trainer._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
                {editingTrainer?._id === trainer._id ? (
                  <>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <TextField label="Trainer Name" value={editingTrainer.name} onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })} fullWidth sx={{ mb: 1 }} />
                      <TextField label="Specialty" value={editingTrainer.specialty} onChange={(e) => setEditingTrainer({ ...editingTrainer, specialty: e.target.value })} fullWidth sx={{ mb: 1 }} />
                      <TextField label="Availability (comma-separated)" value={editingTrainer.availability.join(', ')} onChange={(e) => setEditingTrainer({ ...editingTrainer, availability: e.target.value.split(',').map(d => d.trim())})} fullWidth />
                    </Box>
                    <Box>
                      <Button onClick={handleTrainerUpdate} variant="contained" color="primary" sx={{ mr: 1 }}>Save</Button>
                      <Button onClick={handleCancelEdit} variant="outlined">Cancel</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Typography variant="h6">{trainer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Specialty: {trainer.specialty}</Typography>
                      <Box>
                        {trainer.availability.map((day, index) => (
                          <Chip key={index} label={day} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton aria-label="edit" onClick={() => handleTrainerEdit(trainer)}><EditIcon /></IconButton>
                      <IconButton aria-label="delete" onClick={() => handleTrainerDelete(trainer._id!)}><DeleteIcon /></IconButton>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GymPage;
