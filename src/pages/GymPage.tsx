import React from 'react';
import { Typography, Container } from '@mui/material';

const GymPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gym & Fitness Center Management
      </Typography>
      <Typography variant="body1">
        This section will manage gym memberships, trainer scheduling, session booking, and access control.
      </Typography>
      {/* Future Gym content will go here */}
    </Container>
  );
};

export default GymPage;
