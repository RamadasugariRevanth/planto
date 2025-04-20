import React from 'react';
import { Box } from '@mui/material';
import ImageSlider from '../components/home/ImageSlider';
import TopProducts from '../components/home/TopProducts';
import LatestArticles from '../components/home/LatestArticles';

const HomePage = () => {
  return (
    <Box>
      <ImageSlider />
      <TopProducts />
      <LatestArticles />
    </Box>
  );
};

export default HomePage;
