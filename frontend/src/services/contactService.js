// API Base URL - Django Backend
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.detail || 'Request failed');
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { success: true };
  }

  return response.json();
};

const contactService = {
  // Submit a contact enquiry
  submitEnquiry: async (enquiryData) => {
    try {
      const payload = {
        name: enquiryData.name,
        email: enquiryData.email,
        phone: enquiryData.phone || '',
        subject: enquiryData.subject || 'Contact Form Submission',
        message: enquiryData.message,
      };
      
      const response = await apiRequest('/enquiries/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      throw error;
    }
  },

  // Get all enquiries (admin only)
  getAllEnquiries: async () => {
    try {
      const response = await apiRequest('/enquiries/');
      return response.results || response;
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }
  },

  // Update enquiry status (admin only)
  updateEnquiryStatus: async (id, status) => {
    try {
      const response = await apiRequest(`/enquiries/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      throw error;
    }
  },
};

export default contactService;
