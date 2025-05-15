import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const gardeners = [
  {
    id: 1,
    name: 'John Doe',
    photo: '/path-to-image/john.jpg',
    experience: '5 years of gardening experience specializing in landscape design.',
    details: 'John is skilled in all aspects of gardening and can handle both residential and commercial projects.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    photo: '/path-to-image/jane.jpg',
    experience: '3 years of experience with flower gardening and indoor plants.',
    details: 'Jane specializes in flower arrangements and indoor plants, providing a personalized touch to your home.',
  },
  {
    id: 3,
    name: 'Alex Brown',
    photo: '/path-to-image/alex.jpg',
    experience: '7 years of experience with vegetable and fruit garden setups.',
    details: 'Alex has helped multiple clients create vegetable and fruit gardens, focusing on sustainability.',
  },
  // Add more gardeners as needed
];

const BookGardener = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [gardener, setGardener] = useState(null);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gardener) {
      setMessage('Please select a gardener.');
      setOpenSnackbar(true);
      return;
    }
    // Handle form submission (e.g., call API to save data)
    setMessage('Your booking is confirmed!');
    setOpenSnackbar(true);
    // Optionally, navigate to another page (e.g., the home page) after booking
    // navigate('/');
  };

  const handleSelectGardener = (selectedGardener) => {
    setGardener(selectedGardener);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Book a Gardener
      </Typography>

      {/* Displaying Available Gardeners */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Gardeners
        </Typography>
        <Grid container spacing={2}>
          {gardeners.map((gardenerItem) => (
            <Grid item xs={12} sm={6} md={4} key={gardenerItem.id}>
              <Card>
                <CardActionArea onClick={() => handleSelectGardener(gardenerItem)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={gardenerItem.photo}
                    alt={gardenerItem.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{gardenerItem.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {gardenerItem.experience}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Booking Form */}
      <Paper sx={{ padding: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </Grid>

            {/* Date Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Date"
                variant="outlined"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Time Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Time"
                variant="outlined"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Message Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Message"
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={4}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  padding: '10px 0',
                }}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar Confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookGardener;
