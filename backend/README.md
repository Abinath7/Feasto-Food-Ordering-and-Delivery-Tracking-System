# Feasto Backend - Django REST API

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 6. Run Development Server
```bash
 .\venv\Scripts\activate ; python manage.py runserver
python manage.py runserver
```

The API will be available at: http://localhost:8000/

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register new user
- POST `/api/auth/login/` - Login user
- POST `/api/auth/logout/` - Logout user
- POST `/api/auth/change-password/` - Change password

### Food Items
- GET `/api/food/` - Get all food items
- POST `/api/food/` - Create food item (Admin only)
- GET `/api/food/{id}/` - Get single food item
- PUT `/api/food/{id}/` - Update food item (Admin only)
- DELETE `/api/food/{id}/` - Delete food item (Admin only)

### Orders
- GET `/api/orders/` - Get all orders (Admin/Delivery)
- POST `/api/orders/` - Create new order (Customer)
- GET `/api/orders/{id}/` - Get single order
- PUT `/api/orders/{id}/` - Update order status
- GET `/api/orders/customer/{customer_id}/` - Get customer orders

### Users
- GET `/api/users/` - Get all users (Admin only)
- GET `/api/users/{id}/` - Get user details
- PUT `/api/users/{id}/` - Update user

## Project Structure
```
backend/
├── feasto/              # Main project directory
│   ├── settings.py      # Project settings
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py          # WSGI configuration
├── api/                 # Main API app
│   ├── models.py        # Database models
│   ├── views.py         # API views
│   ├── serializers.py   # DRF serializers
│   └── urls.py          # API URL routing
├── manage.py            # Django management script
└── requirements.txt     # Python dependencies
```

## MVT Architecture
- **Models**: Define database schema in `models.py`
- **Views**: Handle business logic in `views.py`
- **Templates**: JSON responses via Django REST Framework serializers
