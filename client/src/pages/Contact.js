import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, Paper, Alert, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate a submit process
    setTimeout(() => {
      setLoading(false);
      if (name && email && message) {
        setSuccess('Message sent successfully!');
      } else {
        setError('Please fill in all the fields.');
      }
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Contact Us
      </Typography>
      
      <Grid container spacing={3}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Your Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Your Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Your Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </form>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </Paper>
        </Grid>

        {/* Contact Details and Map */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Our Office
            </Typography>
            <Typography variant="body1" paragraph>
              Planto Headquarters
              <br />
              123 Green Street, Suite 101
              <br />
              EcoCity, Plantland 12345
            </Typography>
            <Typography variant="body1" paragraph>
              Email: contact@planto.com
              <br />
              Phone: (123) 456-7890
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Find Us on the Map
              </Typography>
              <iframe
                title="Planto Office Location"
                width="100%"
                height="300"
                src="https://www.google.com/maps/embed/v1/place?q=EcoCity,+Plantland&key=YOUR_GOOGLE_MAPS_API_KEY"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
