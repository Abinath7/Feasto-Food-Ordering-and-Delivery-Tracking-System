import { USER_ROLES, ORDER_STATUS } from './constants';

// Mock users database
export const mockUsers = [
  {
    id: 1,
    email: 'customer@feasto.com',
    password: 'customer123',
    role: USER_ROLES.CUSTOMER,
    name: 'John Doe',
    phone: '123-456-7890',
    address: '123 Main St, City, State 12345',
  },
  {
    id: 2,
    email: 'admin@feasto.com',
    password: 'admin123',
    role: USER_ROLES.ADMIN,
    name: 'Admin User',
    phone: '098-765-4321',
  },
  {
    id: 3,
    email: 'delivery@feasto.com',
    password: 'delivery123',
    role: USER_ROLES.DELIVERY,
    name: 'Mike Driver',
    phone: '555-123-4567',
    vehicleNumber: 'ABC-1234',
  },
];

// Mock food items
export const mockFoodItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    available: true,
  },
  {
    id: 2,
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with lettuce, tomato, and special sauce',
    price: 8.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    available: true,
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 7.49,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    available: true,
  },
  {
    id: 4,
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon and parmesan cheese',
    price: 14.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    available: true,
  },
  {
    id: 5,
    name: 'Beef Tacos',
    description: 'Three soft tacos with seasoned beef and toppings',
    price: 9.99,
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    available: true,
  },
  {
    id: 6,
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake with chocolate frosting',
    price: 6.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    available: true,
  },
];

// Mock orders
export const mockOrders = [
  {
    id: 1001,
    customerId: 1,
    customerName: 'John Doe',
    customerEmail: 'customer@feasto.com',
    items: [
      { foodId: 1, name: 'Margherita Pizza', quantity: 2, price: 12.99 },
      { foodId: 6, name: 'Chocolate Cake', quantity: 1, price: 6.99 },
    ],
    total: 32.97,
    status: ORDER_STATUS.READY,
    deliveryAddress: '123 Main St, City, State 12345',
    orderDate: new Date('2025-12-30T10:30:00'),
    deliveryStaffId: 3,
    deliveryStaffName: 'Mike Driver',
  },
  {
    id: 1002,
    customerId: 1,
    customerName: 'John Doe',
    customerEmail: 'customer@feasto.com',
    items: [
      { foodId: 2, name: 'Chicken Burger', quantity: 1, price: 8.99 },
    ],
    total: 8.99,
    status: ORDER_STATUS.DELIVERED,
    deliveryAddress: '123 Main St, City, State 12345',
    orderDate: new Date('2025-12-29T14:15:00'),
    deliveryStaffId: 3,
    deliveryStaffName: 'Mike Driver',
  },
  {
    id: 1003,
    customerId: 1,
    customerName: 'John Doe',
    customerEmail: 'customer@feasto.com',
    items: [
      { foodId: 4, name: 'Spaghetti Carbonara', quantity: 1, price: 14.99 },
      { foodId: 3, name: 'Caesar Salad', quantity: 1, price: 7.49 },
    ],
    total: 22.48,
    status: ORDER_STATUS.PICKED_UP,
    deliveryAddress: '456 Oak Avenue, City, State 12345',
    orderDate: new Date('2025-12-30T11:45:00'),
    deliveryStaffId: 3,
    deliveryStaffName: 'Mike Driver',
  },
  {
    id: 1004,
    customerId: 1,
    customerName: 'John Doe',
    customerEmail: 'customer@feasto.com',
    items: [
      { foodId: 5, name: 'Beef Tacos', quantity: 3, price: 9.99 },
    ],
    total: 29.97,
    status: ORDER_STATUS.PENDING,
    deliveryAddress: '789 Elm Street, City, State 12345',
    orderDate: new Date('2025-12-30T12:00:00'),
    deliveryStaffId: null,
    deliveryStaffName: null,
  },
];

// Mock delivery staff
export const mockDeliveryStaff = [
  {
    id: 3,
    name: 'Mike Driver',
    email: 'delivery@feasto.com',
    phone: '555-123-4567',
    vehicleNumber: 'ABC-1234',
    available: true,
  },
  {
    id: 4,
    name: 'Sarah Speed',
    email: 'sarah@feasto.com',
    phone: '555-987-6543',
    vehicleNumber: 'XYZ-9876',
    available: true,
  },
];
