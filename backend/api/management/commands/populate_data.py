from django.core.management.base import BaseCommand
from api.models import User, FoodItem, Order, OrderItem
from decimal import Decimal


class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create users
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@feasto.com',
            password='admin123',
            role='admin',
            first_name='Admin',
            last_name='User',
            phone='1234567890',
            address='123 Admin St'
        )
        self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_user.username}'))

        customer_user = User.objects.create_user(
            username='customer1',
            email='customer@example.com',
            password='customer123',
            role='customer',
            first_name='John',
            last_name='Doe',
            phone='9876543210',
            address='456 Customer Ave'
        )
        self.stdout.write(self.style.SUCCESS(f'Created customer user: {customer_user.username}'))

        delivery_user = User.objects.create_user(
            username='delivery1',
            email='delivery@feasto.com',
            password='delivery123',
            role='delivery',
            first_name='Mike',
            last_name='Rider',
            phone='5555555555',
            address='789 Delivery Rd'
        )
        self.stdout.write(self.style.SUCCESS(f'Created delivery user: {delivery_user.username}'))

        # Create food items
        food_items_data = [
            {
                'name': 'Margherita Pizza',
                'description': 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
                'price': Decimal('12.99'),
                'category': 'Pizza',
                'available': True
            },
            {
                'name': 'Cheeseburger',
                'description': 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
                'price': Decimal('9.99'),
                'category': 'Burgers',
                'available': True
            },
            {
                'name': 'Chicken Noodles',
                'description': 'Stir-fried noodles with chicken and vegetables',
                'price': Decimal('11.99'),
                'category': 'Asian',
                'available': True
            },
            {
                'name': 'Caesar Salad',
                'description': 'Fresh romaine lettuce with Caesar dressing and croutons',
                'price': Decimal('7.99'),
                'category': 'Salads',
                'available': True
            },
            {
                'name': 'Spaghetti Carbonara',
                'description': 'Creamy pasta with bacon and parmesan cheese',
                'price': Decimal('13.99'),
                'category': 'Pasta',
                'available': True
            },
            {
                'name': 'Fish and Chips',
                'description': 'Crispy battered fish with golden french fries',
                'price': Decimal('14.99'),
                'category': 'Seafood',
                'available': True
            },
            {
                'name': 'Chicken Wings',
                'description': 'Spicy buffalo wings with ranch dipping sauce',
                'price': Decimal('10.99'),
                'category': 'Appetizers',
                'available': True
            },
            {
                'name': 'Chocolate Brownie',
                'description': 'Warm chocolate brownie with vanilla ice cream',
                'price': Decimal('6.99'),
                'category': 'Desserts',
                'available': True
            },
        ]

        food_items = []
        for item_data in food_items_data:
            food_item = FoodItem.objects.create(**item_data)
            food_items.append(food_item)
            self.stdout.write(self.style.SUCCESS(f'Created food item: {food_item.name}'))

        # Create sample orders
        order1 = Order.objects.create(
            customer=customer_user,
            customer_name=customer_user.get_full_name(),
            delivery_address='456 Customer Ave',
            phone_number='9876543210',
            payment_method='cash',
            total=Decimal('24.98'),
            status='pending'
        )
        OrderItem.objects.create(
            order=order1,
            food_item=food_items[0],
            name=food_items[0].name,
            quantity=1,
            price=food_items[0].price
        )
        OrderItem.objects.create(
            order=order1,
            food_item=food_items[1],
            name=food_items[1].name,
            quantity=1,
            price=food_items[1].price
        )
        self.stdout.write(self.style.SUCCESS(f'Created order: Order #{order1.id}'))

        order2 = Order.objects.create(
            customer=customer_user,
            customer_name=customer_user.get_full_name(),
            delivery_address='456 Customer Ave',
            phone_number='9876543210',
            payment_method='card',
            total=Decimal('27.98'),
            status='delivered',
            delivery_staff=delivery_user
        )
        OrderItem.objects.create(
            order=order2,
            food_item=food_items[4],
            name=food_items[4].name,
            quantity=2,
            price=food_items[4].price
        )
        self.stdout.write(self.style.SUCCESS(f'Created order: Order #{order2.id}'))

        self.stdout.write(self.style.SUCCESS('\n=== Sample Data Created Successfully ==='))
        self.stdout.write(self.style.SUCCESS('\nLogin Credentials:'))
        self.stdout.write(self.style.SUCCESS('Admin: username=admin, password=admin123'))
        self.stdout.write(self.style.SUCCESS('Customer: username=customer1, password=customer123'))
        self.stdout.write(self.style.SUCCESS('Delivery: username=delivery1, password=delivery123'))
