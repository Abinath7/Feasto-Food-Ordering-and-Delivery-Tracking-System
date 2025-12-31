# API Testing Guide

## Test the API with PowerShell

### 1. Register a New User
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "test123"
    confirm_password = "test123"
    first_name = "Test"
    last_name = "User"
    phone = "1234567890"
    address = "123 Test St"
    role = "customer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/register/" -Method POST -Body $body -ContentType "application/json"
```

### 2. Login
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login/" -Method POST -Body $body -ContentType "application/json" -SessionVariable session

# Save session for future requests
$global:session = $session
```

### 3. Get All Food Items
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/food/" -Method GET
```

### 4. Get Available Food Items Only
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/food/?available=true" -Method GET
```

### 5. Create an Order (Requires Login)
```powershell
$orderBody = @{
    customer = 2
    customer_name = "John Doe"
    delivery_address = "456 Customer Ave"
    phone_number = "9876543210"
    payment_method = "cash"
    special_instructions = "Ring the doorbell"
    total = 24.98
    items = @(
        @{
            food_item = 1
            name = "Margherita Pizza"
            quantity = 1
            price = 12.99
        },
        @{
            food_item = 2
            name = "Cheeseburger"
            quantity = 1
            price = 9.99
        }
    )
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:8000/api/orders/" -Method POST -Body $orderBody -ContentType "application/json" -WebSession $session
```

### 6. Get All Orders (Admin/Authenticated)
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/orders/" -Method GET -WebSession $session
```

### 7. Update Order Status
```powershell
$statusBody = @{
    status = "confirmed"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/orders/1/update_status/" -Method POST -Body $statusBody -ContentType "application/json" -WebSession $session
```

### 8. Get Dashboard Stats (Admin Only)
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/dashboard/stats/" -Method GET -WebSession $session
```

### 9. Logout
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/auth/logout/" -Method POST -WebSession $session
```

## Using cURL (Alternative)

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","confirm_password":"test123","first_name":"Test","last_name":"User","phone":"1234567890","address":"123 Test St","role":"customer"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Food Items
```bash
curl -X GET http://localhost:8000/api/food/
```

### Create Order (with session)
```bash
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"customer":2,"customer_name":"John Doe","delivery_address":"456 Customer Ave","phone_number":"9876543210","payment_method":"cash","total":24.98,"items":[{"food_item":1,"name":"Margherita Pizza","quantity":1,"price":12.99}]}'
```

## Admin Panel

Access Django Admin at: http://localhost:8000/admin/

Login with:
- Username: `admin`
- Password: `admin123`

## Sample Data

The database has been populated with:
- 3 Users (Admin, Customer, Delivery)
- 8 Food Items
- 2 Sample Orders

### Test Credentials:
- **Admin**: username=`admin`, password=`admin123`
- **Customer**: username=`customer1`, password=`customer123`
- **Delivery**: username=`delivery1`, password=`delivery123`
