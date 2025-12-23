import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const deliveryOrders = await orderService.getOrdersByDeliveryStaffId(user.id);
      setOrders(deliveryOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));

      setStats({
        total: deliveryOrders.length,
        pending: deliveryOrders.filter(o => 
          o.status === ORDER_STATUS.READY || o.status === ORDER_STATUS.PICKED_UP
        ).length,
        completed: deliveryOrders.filter(o => o.status === ORDER_STATUS.DELIVERED).length,
      });
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.name}! 🚚
        </h1>
        <p className="text-gray-600 mt-2">Manage your delivery assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Assignments</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Deliveries</p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            </div>
            <div className="text-5xl opacity-20">⏳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-2">{stats.completed}</p>
            </div>
            <div className="text-5xl opacity-20">✅</div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Deliveries</h2>
      </div>

      {orders.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No delivery assignments yet
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(order.orderDate)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Total</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">📍 Delivery Address:</p>
                    <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-medium text-gray-700 mb-2">Order Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  {order.status === ORDER_STATUS.READY && (
                    <Button
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.PICKED_UP)}
                      fullWidth
                    >
                      Mark as Picked Up
                    </Button>
                  )}
                  {order.status === ORDER_STATUS.PICKED_UP && (
                    <Button
                      variant="success"
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.DELIVERED)}
                      fullWidth
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  {order.status === ORDER_STATUS.DELIVERED && (
                    <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
