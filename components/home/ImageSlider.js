import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Container,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const ImageSlider = () => {
  const theme = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([
    {
      id: 1,
      image: 'https://cdn.pixabay.com/photo/2024/08/01/08/17/dahlia-8936439_960_720.jpg',
      title: 'Welcome to Planto',
      subtitle: 'Your one-stop shop for all gardening needs',
    },
    {
      id: 2,
      image: 'https://wallpaperaccess.com/full/5943817.jpg',
      title: 'Discover Beautiful Plants',
      subtitle: 'Transform your space with our collection',
    },
    {
      id: 3,
      image: 'https://wallpapercave.com/wp/wp7401475.jpg',
      title: 'Expert Gardening Services',
      subtitle: 'Professional gardeners at your service',
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '300px', md: '600px' },
        overflow: 'hidden',
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transition: 'opacity 0.5s ease-in-out',
            opacity: index === activeSlide ? 1 : 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: theme.spacing(3),
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="h3" component="h1" gutterBottom>
                {slide.title}
              </Typography>
              <Typography variant="h6">{slide.subtitle}</Typography>
            </Container>
          </Box>
        </Box>
      ))}
      <IconButton
        sx={{
          position: 'absolute',
          left: theme.spacing(2),
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
        }}
        onClick={handlePrevSlide}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        sx={{
          position: 'absolute',
          right: theme.spacing(2),
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
        }}
        onClick={handleNextSlide}
      >
        <ArrowForward />
      </IconButton>
    </Paper>
  );
};

export default ImageSlider;
