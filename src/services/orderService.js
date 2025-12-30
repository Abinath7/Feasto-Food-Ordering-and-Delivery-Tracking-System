import { mockOrders } from '../utils/mockData';
import { ORDER_STATUS } from '../utils/constants';
import { generateOrderId } from '../utils/helpers';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize orders in localStorage if not exists
const initializeOrders = () => {
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(mockOrders));
  }
};

const getOrders = () => {
  initializeOrders();
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

const saveOrders = (orders) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

const orderService = {
  // Get all orders (admin only)
  getAllOrders: async () => {
    await delay(300);
    return getOrders();
  },

  // Get orders by customer ID
  getOrdersByCustomerId: async (customerId) => {
    await delay(300);
    const orders = getOrders();
    return orders.filter(order => order.customerId === customerId);
  },

  // Get orders by delivery staff ID
  getOrdersByDeliveryStaffId: async (staffId) => {
    await delay(300);
    const orders = getOrders();
    return orders.filter(order => order.deliveryStaffId === staffId);
  },

  // Create order
  createOrder: async (orderData) => {
    await delay(500);
    const orders = getOrders();
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      status: ORDER_STATUS.PENDING,
      orderDate: new Date().toISOString(),
      deliveryStaffId: null,
      deliveryStaffName: null,
    };
    orders.push(newOrder);
    saveOrders(orders);
    return newOrder;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    await delay(300);
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    saveOrders(orders);
    return order;
  },

  // Assign delivery staff
  assignDeliveryStaff: async (orderId, staffId, staffName) => {
    await delay(300);
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.deliveryStaffId = staffId;
    order.deliveryStaffName = staffName;
    order.status = ORDER_STATUS.READY;
    saveOrders(orders);
    return order;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    await delay(300);
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },
};

export default orderService;
