# 🍔 Feasto - Food Ordering & Delivery Tracking System

A modern, responsive food ordering and delivery tracking system built with React.js and Tailwind CSS. Features role-based authentication and dashboards for customers, admins, and delivery staff.

## ✨ Features

### 🔐 Authentication System
- **Login/Register** - Secure user authentication
- **Password Management** - Change password and forgot password functionality
- **Role-Based Access Control** - Three user types with different permissions
- **Form Validation** - Client-side validation with helpful error messages

### 👤 Customer Dashboard
- **Browse Menu** - View available food items with images and descriptions
- **Shopping Cart** - Add/remove items, adjust quantities
- **Place Orders** - Order food with delivery address
- **Track Orders** - View order history and real-time status updates

### 👑 Admin Dashboard
- **Analytics** - View stats (total orders, revenue, pending orders)
- **Manage Menu** - Add, edit, delete food items
- **Toggle Availability** - Enable/disable food items
- **Manage Orders** - View all orders, update status
- **Assign Delivery** - Assign delivery staff to orders

### 🚚 Delivery Staff Dashboard
- **View Assignments** - See all assigned deliveries
- **Update Status** - Mark orders as picked up or delivered
- **Delivery Stats** - Track completed and pending deliveries

## 🛠️ Tech Stack

- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client (configured for mock API)
- **Context API** - State management

## 📁 Project Structure

```
feasto/
├── src/
│   ├── assets/              # Images, icons, logos
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Navbar.jsx
│   │   ├── Loading.jsx
│   │   └── OrderStatusBadge.jsx
│   ├── pages/
│   │   ├── auth/           # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── customer/       # Customer pages
│   │   │   ├── CustomerDashboard.jsx
│   │   │   └── MyOrders.jsx
│   │   ├── admin/          # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageMenu.jsx
│   │   │   └── ManageOrders.jsx
│   │   └── delivery/       # Delivery pages
│   │       └── DeliveryDashboard.jsx
│   ├── layouts/            # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── CustomerLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── DeliveryLayout.jsx
│   ├── routes/             # Route guards
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── services/           # API services (mock)
│   │   ├── authService.js
│   │   ├── foodService.js
│   │   └── orderService.js
│   ├── context/            # React Context
│   │   └── AuthContext.jsx
│   ├── utils/              # Utilities & helpers
│   │   ├── constants.js
│   │   ├── mockData.js
│   │   └── helpers.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory:**
   ```bash
   cd feasto
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:5173`

## 🔑 Demo Accounts

Use these credentials to test different user roles:

### Customer Account
- **Email:** customer@feasto.com
- **Password:** customer123

### Admin Account
- **Email:** admin@feasto.com
- **Password:** admin123

### Delivery Staff Account
- **Email:** delivery@feasto.com
- **Password:** delivery123

## 🎨 Features Overview

### Customer Features
1. **Browse Menu** - View all available food items
2. **Add to Cart** - Build your order with quantity controls
3. **Place Order** - Submit orders with delivery information
4. **Order History** - Track all your past and current orders
5. **Order Status** - Real-time order status tracking

### Admin Features
1. **Dashboard Analytics** - View business metrics
2. **Food Management** - CRUD operations for menu items
3. **Order Management** - View and update all orders
4. **Delivery Assignment** - Assign orders to delivery staff
5. **Status Updates** - Update order status throughout the process

### Delivery Features
1. **View Assignments** - See all assigned deliveries
2. **Order Details** - View complete order and customer information
3. **Status Updates** - Mark orders as picked up or delivered
4. **Delivery Stats** - Track performance metrics

## 🎯 Functional Requirements

✅ Role-based login system (customer, admin, delivery)  
✅ Customer: View menu, place orders, track status  
✅ Admin: Manage food items, view orders, assign delivery  
✅ Delivery: View assignments, update delivery status  
✅ Authentication: Login, logout, password change/reset  
✅ Navigation: Role-based routing after login  
✅ Form validations and error handling  
✅ Responsive design with Tailwind CSS  

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## 🔒 Security Features

- Protected routes with role-based access control
- Password validation (minimum 6 characters)
- Email validation
- Phone number validation
- Token-based authentication (localStorage)
- Automatic logout on token expiration

## 🛣️ Routing Structure

```
/ (or /login)              → Login page
/register                  → Registration page
/forgot-password           → Password reset page
/change-password           → Change password (protected)

Customer Routes:
/customer/dashboard        → Menu & ordering
/customer/orders           → Order history

Admin Routes:
/admin/dashboard           → Analytics & stats
/admin/menu                → Manage food items
/admin/orders              → Manage all orders

Delivery Routes:
/delivery/dashboard        → Delivery assignments
```

## 🎨 UI Components

Reusable components built with Tailwind CSS:
- **Button** - Multiple variants (primary, secondary, danger, success, outline)
- **Input** - Form input with validation and error display
- **Card** - Container component with optional title and footer
- **Navbar** - Responsive navigation with role-based links
- **Loading** - Loading spinner component
- **OrderStatusBadge** - Color-coded order status indicator

## 📊 Order Status Flow

```
PENDING → PREPARING → READY → PICKED_UP → DELIVERED
                           ↓
                       CANCELLED
```

## 🔄 State Management

- **AuthContext** - Global authentication state
- **Local State** - Component-level state with React hooks
- **localStorage** - Persistent user sessions

## 🧪 Mock Data

The application uses mock data for demonstration:
- Pre-populated food items with images
- Sample orders with different statuses
- Mock delivery staff members
- Demo user accounts

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌟 Future Enhancements

- Real-time order tracking with maps
- Payment gateway integration
- Push notifications
- Rating and review system
- Advanced search and filters
- Order scheduling
- Multi-language support

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using React.js and Tailwind CSS

---

**Enjoy using Feasto! 🍕🍔🍟**
