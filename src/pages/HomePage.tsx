import React from 'react';
import { Typography, Container, Box, Paper, Button, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <CardMedia
          component="img"
          image="/hotel.png" // Assuming hotel.png is in the public folder
          alt="Hotel Management System"
          sx={{
            width: '100%',
            maxWidth: 300,
            height: 'auto',
            borderRadius: '8px',
            mb: 3,
          }}
        />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Elevate Your Hotel Operations
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 3, color: 'text.secondary' }}>
          Seamlessly manage your SPA & Wellness and Gym & Fitness facilities with our intuitive Hotel Management System.
          Streamline bookings, track memberships, and enhance guest experience effortlessly.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" component={Link} to="/spa" size="large">
            Explore SPA & Wellness
          </Button>
          <Button variant="outlined" color="secondary" component={Link} to="/gym" size="large">
            Manage Gym & Fitness
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
