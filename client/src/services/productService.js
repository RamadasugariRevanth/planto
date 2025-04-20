import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const productService = {
  getAllProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange[0]);
        params.append('maxPrice', filters.priceRange[1]);
      }
      if (filters.searchQuery) params.append('search', filters.searchQuery);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
  
      const response = await axios.get(`${API_URL}/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
};

export default productService;
