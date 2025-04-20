import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Button,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LatestArticles = () => {
  const navigate = useNavigate();
  // Mock data - will be replaced with API call
  const [articles] = useState([
    {
      id: 1,
      title: '10 Easy-to-Grow Indoor Plants',
      description:
        'Discover the best low-maintenance plants perfect for beginners...',
      image: 'https://source.unsplash.com/400x300/?indoor-plants',
      date: '2025-03-28',
    },
    {
      id: 2,
      title: 'Spring Gardening Tips',
      description:
        'Essential tips and tricks to prepare your garden for the spring season...',
      image: 'https://source.unsplash.com/400x300/?spring-garden',
      date: '2025-03-27',
    },
    {
      id: 3,
      title: 'Sustainable Gardening Practices',
      description:
        'Learn how to create an eco-friendly garden that helps the environment...',
      image: 'https://source.unsplash.com/400x300/?sustainable-garden',
      date: '2025-03-26',
    },
  ]);

  const handleReadMore = (articleId) => {
    navigate(`/blog/article/${articleId}`);
  };

  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ textAlign: 'center', mb: 4 }}
        >
          Latest Articles & Gardening Tips
        </Typography>
        <Grid container spacing={4}>
          {articles.map((article) => (
            <Grid item xs={12} md={4} key={article.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="h3">
                    {article.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {article.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleReadMore(article.id)}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestArticles;
