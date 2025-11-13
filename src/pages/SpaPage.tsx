import React from 'react';
import { Typography, Container } from '@mui/material';

const SpaPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        SPA & Wellness Management
      </Typography>
      <Typography variant="body1">
        This section will manage SPA services, therapist scheduling, spa room booking, and appointments.
      </Typography>
      {/* Future SPA content will go here */}
    </Container>
  );
};

export default SpaPage;
