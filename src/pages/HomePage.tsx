import React from 'react';
import { Typography, Container } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Hotel Management System
      </Typography>
      <Typography variant="body1">
        Use the navigation bar above to explore the SPA & Wellness and Gym & Fitness modules.
      </Typography>
    </Container>
  );
};

export default HomePage;
