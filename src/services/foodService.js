import { mockFoodItems } from '../utils/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const foodService = {
  // Get all food items
  getAllFoodItems: async () => {
    await delay(300);
    return [...mockFoodItems];
  },

  // Get food item by ID
  getFoodItemById: async (id) => {
    await delay(300);
    const item = mockFoodItems.find(item => item.id === id);
    if (!item) {
      throw new Error('Food item not found');
    }
    return item;
  },

  // Add food item (admin only)
  addFoodItem: async (foodData) => {
    await delay(500);
    const newItem = {
      id: mockFoodItems.length + 1,
      ...foodData,
      available: true,
    };
    mockFoodItems.push(newItem);
    return newItem;
  },

  // Update food item (admin only)
  updateFoodItem: async (id, foodData) => {
    await delay(500);
    const index = mockFoodItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Food item not found');
    }
    mockFoodItems[index] = { ...mockFoodItems[index], ...foodData };
    return mockFoodItems[index];
  },

  // Delete food item (admin only)
  deleteFoodItem: async (id) => {
    await delay(500);
    const index = mockFoodItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Food item not found');
    }
    mockFoodItems.splice(index, 1);
    return { message: 'Food item deleted successfully' };
  },

  // Toggle availability
  toggleAvailability: async (id) => {
    await delay(300);
    const item = mockFoodItems.find(item => item.id === id);
    if (!item) {
      throw new Error('Food item not found');
    }
    item.available = !item.available;
    return item;
  },
};

export default foodService;
