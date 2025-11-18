import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to our hotel management application. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
        </Typography>
      </Box>
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect personal information that you voluntarily provide to us when you register for the Spa & Wellness services or the Gym & Fitness Center. The personal information that we collect depends on the context of your interactions with us and the modules, the choices you make and the products and features you use.
        </Typography>
        <Typography variant="body1" paragraph>
          The personal information we collect may include the following: Name, Contact Information (email, phone number), Membership Details, and Booking Information.
        </Typography>
      </Box>
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </Typography>
        <Typography variant="body1" paragraph>
          We use the information we collect or receive to facilitate account creation, manage user accounts, send administrative information, manage your bookings, and respond to user inquiries.
        </Typography>
      </Box>
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Will Your Information Be Shared With Anyone?
        </Typography>
        <Typography variant="body1" paragraph>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell or trade your personal information.
        </Typography>
      </Box>
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have questions or comments about this notice, you may email us at privacy@hotelmgmtsystem.example.com.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PrivacyPolicy;
