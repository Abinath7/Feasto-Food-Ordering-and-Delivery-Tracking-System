from rest_framework import serializers
from .models import User, FoodItem, Order, OrderItem, CustomerEnquiry
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                  'phone', 'address', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 
                  'first_name', 'last_name', 'phone', 'address', 'role']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data


class FoodItemSerializer(serializers.ModelSerializer):
    """Serializer for FoodItem model"""
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'description', 'price', 'category', 
                  'image', 'image_url', 'available', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_image(self, obj):
        """Return image_url if available, otherwise return image file URL"""
        if obj.image_url:
            return obj.image_url
        elif obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'food_item', 'name', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)
    delivery_staff_details = UserSerializer(source='delivery_staff', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_name', 'customer_details', 
                  'delivery_address', 'phone_number', 'special_instructions',
                  'payment_method', 'total', 'status', 'delivery_staff', 
                  'delivery_staff_details', 'items', 'created_at', 'updated_at', 
                  'delivered_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['customer', 'customer_name', 'delivery_address', 'phone_number',
                  'special_instructions', 'payment_method', 'total', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class CustomerEnquirySerializer(serializers.ModelSerializer):
    """Serializer for CustomerEnquiry model"""
    subject = serializers.CharField(required=False, allow_blank=True, default='Contact Form Submission')
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = CustomerEnquiry
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 
                  'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
