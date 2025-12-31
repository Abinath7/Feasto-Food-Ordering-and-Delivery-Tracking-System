from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth import login, logout
from django.utils import timezone
from .models import User, FoodItem, Order, OrderItem, CustomerEnquiry
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    ChangePasswordSerializer, FoodItemSerializer, OrderSerializer,
    OrderCreateSerializer, CustomerEnquirySerializer
)


# Authentication Views
@api_view(['POST'])
def register_view(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    """Login user"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def change_password_view(request):
    """Change user password"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        if not request.user.check_password(serializer.validated_data['old_password']):
            return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'destroy']:
            permission_classes = [IsAdminUser]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


# Food Item ViewSet
class FoodItemViewSet(viewsets.ModelViewSet):
    """ViewSet for FoodItem model"""
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [AllowAny]  # Allow all for development
    
    def get_queryset(self):
        queryset = FoodItem.objects.all()
        available = self.request.query_params.get('available', None)
        if available is not None:
            queryset = queryset.filter(available=available.lower() == 'true')
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model"""
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Order.objects.all()
        user = self.request.user
        
        # Filter based on user role
        if user.role == 'customer':
            queryset = queryset.filter(customer=user)
        elif user.role == 'delivery':
            queryset = queryset.filter(delivery_staff=user) | queryset.filter(status='ready')
        # Admins see all orders
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset.select_related('customer', 'delivery_staff').prefetch_related('items')
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        if new_status == 'delivered':
            order.delivered_at = timezone.now()
        order.save()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def assign_delivery(self, request, pk=None):
        """Assign delivery staff to order"""
        order = self.get_object()
        staff_id = request.data.get('delivery_staff_id')
        
        try:
            staff = User.objects.get(id=staff_id, role='delivery')
            order.delivery_staff = staff
            order.status = 'out_for_delivery'
            order.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid delivery staff'}, status=status.HTTP_400_BAD_REQUEST)


# Customer Enquiry ViewSet
class CustomerEnquiryViewSet(viewsets.ModelViewSet):
    """ViewSet for CustomerEnquiry model"""
    queryset = CustomerEnquiry.objects.all().order_by('-created_at')
    serializer_class = CustomerEnquirySerializer
    permission_classes = [AllowAny]  # Allow all for development


# Dashboard Statistics View
@api_view(['GET'])
def dashboard_stats(request):
    """Get dashboard statistics for admin"""
    if not request.user.is_authenticated or request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='pending').count()
    total_customers = User.objects.filter(role='customer').count()
    total_revenue = sum(order.total for order in Order.objects.filter(status='delivered'))
    
    return Response({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'total_customers': total_customers,
        'total_revenue': float(total_revenue),
    }, status=status.HTTP_200_OK)
