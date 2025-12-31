// API Base URL - Django Backend
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session auth
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.detail || 'Request failed');
  }

  // Handle empty responses (like DELETE which returns 204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { success: true };
  }

  return response.json();
};

const foodService = {
  // Get all food items from Django backend
  getAllFoodItems: async () => {
    try {
      const response = await apiRequest('/food/');
      // Handle paginated response from DRF
      const items = response.results || response;
      return items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category,
        image: item.image,
        available: item.available,
      }));
    } catch (error) {
      console.error('Error fetching food items:', error);
      throw new Error('Unable to fetch menu items. Please ensure the backend server is running.');
    }
  },

  // Get food item by ID
  getFoodItemById: async (id) => {
    try {
      const item = await apiRequest(`/food/${id}/`);
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category,
        image: item.image,
        available: item.available,
      };
    } catch (error) {
      console.error('Error fetching food item:', error);
      throw error;
    }
  },

  // Add food item (admin only)
  addFoodItem: async (foodData) => {
    try {
      // Map image to image_url for backend
      const payload = {
        name: foodData.name,
        description: foodData.description,
        price: foodData.price,
        category: foodData.category,
        image_url: foodData.image || foodData.image_url,
        available: foodData.available !== undefined ? foodData.available : true,
      };
      const response = await apiRequest('/food/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error('Error adding food item:', error);
      throw error;
    }
  },

  // Update food item (admin only)
  updateFoodItem: async (id, foodData) => {
    try {
      // Map image to image_url for backend
      const payload = {
        name: foodData.name,
        description: foodData.description,
        price: foodData.price,
        category: foodData.category,
        image_url: foodData.image || foodData.image_url,
        available: foodData.available !== undefined ? foodData.available : true,
      };
      const response = await apiRequest(`/food/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error('Error updating food item:', error);
      throw error;
    }
  },

  // Delete food item (admin only)
  deleteFoodItem: async (id) => {
    try {
      await apiRequest(`/food/${id}/`, {
        method: 'DELETE',
      });
      return { message: 'Food item deleted successfully' };
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  },

  // Toggle availability
  toggleAvailability: async (id) => {
    try {
      const item = await foodService.getFoodItemById(id);
      const response = await apiRequest(`/food/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ available: !item.available }),
      });
      return response;
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw error;
    }
  },
};

export default foodService;
