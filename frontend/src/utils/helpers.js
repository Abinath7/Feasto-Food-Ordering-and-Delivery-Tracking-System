// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password validation (minimum 6 characters)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Phone validation
export const validatePhone = (phone) => {
  const regex = /^[\d\s\-()]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Format currency
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Generate order ID
export const generateOrderId = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
