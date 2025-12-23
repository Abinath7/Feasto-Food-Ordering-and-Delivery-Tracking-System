import { mockOrders } from '../utils/mockData';
import { ORDER_STATUS } from '../utils/constants';
import { generateOrderId } from '../utils/helpers';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const orderService = {
  // Get all orders (admin only)
  getAllOrders: async () => {
    await delay(300);
    return [...mockOrders];
  },

  // Get orders by customer ID
  getOrdersByCustomerId: async (customerId) => {
    await delay(300);
    return mockOrders.filter(order => order.customerId === customerId);
  },

  // Get orders by delivery staff ID
  getOrdersByDeliveryStaffId: async (staffId) => {
    await delay(300);
    return mockOrders.filter(order => order.deliveryStaffId === staffId);
  },

  // Create order
  createOrder: async (orderData) => {
    await delay(500);
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      status: ORDER_STATUS.PENDING,
      orderDate: new Date(),
      deliveryStaffId: null,
      deliveryStaffName: null,
    };
    mockOrders.push(newOrder);
    return newOrder;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    await delay(300);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return order;
  },

  // Assign delivery staff
  assignDeliveryStaff: async (orderId, staffId, staffName) => {
    await delay(300);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.deliveryStaffId = staffId;
    order.deliveryStaffName = staffName;
    order.status = ORDER_STATUS.READY;
    return order;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    await delay(300);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },
};

export default orderService;
