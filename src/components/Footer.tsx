import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Grid, Link } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.secondary',
        py: 3,
        mt: 'auto', // Pushes footer to the bottom
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              <SpaIcon sx={{ mr: 1 }} />
              SPA & Wellness
            </Typography>
            <Typography variant="body2">
              Service Catalog | Therapist Scheduling | Room Booking | Billing | Appointments
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              <FitnessCenterIcon sx={{ mr: 1 }} />
              Gym & Fitness
            </Typography>
            <Typography variant="body2">
              Membership Management | Trainer Scheduling | Session Booking | Access Control
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <IconButton color="inherit" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Hotel Management System. All rights reserved. | '}
            <Link component={RouterLink} to="/privacy" color="inherit">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
