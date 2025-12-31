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
  const [filterStatus, setFilterStatus] = useState('all');
  const [ setSelectedOrder] = useState(null);
  const [ setShowStatusModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    pickedUp: 0,
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
        pending: deliveryOrders.filter(o => o.status === ORDER_STATUS.READY).length,
        pickedUp: deliveryOrders.filter(o => o.status === ORDER_STATUS.PICKED_UP).length,
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
      setShowStatusModal(false);
      setSelectedOrder(null);
      loadOrders();
      
      // Show success notification
      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getAvailableStatusUpdates = (currentStatus) => {
    switch (currentStatus) {
      case ORDER_STATUS.READY:
        return [
          { status: ORDER_STATUS.PICKED_UP, label: 'Mark as Picked Up', color: 'bg-blue-600' }
        ];
      case ORDER_STATUS.PICKED_UP:
        return [
          { status: ORDER_STATUS.DELIVERED, label: 'Mark as Delivered', color: 'bg-green-600' }
        ];
      default:
        return [];
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return [ORDER_STATUS.READY, ORDER_STATUS.PICKED_UP].includes(order.status);
    return order.status === filterStatus;
  });

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-yellow-100 text-sm">Ready to Pick</p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            </div>
            <div className="text-5xl opacity-20">⏳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Picked Up</p>
              <p className="text-3xl font-bold mt-2">{stats.pickedUp}</p>
            </div>
            <div className="text-5xl opacity-20">🚚</div>
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
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Deliveries</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Orders</option>
          <option value="active">Active Deliveries</option>
          <option value={ORDER_STATUS.READY}>Ready to Pick</option>
          <option value={ORDER_STATUS.PICKED_UP}>Picked Up</option>
          <option value={ORDER_STATUS.DELIVERED}>Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            {filterStatus === 'all' ? 'No delivery assignments yet' : 'No orders found with this filter'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const availableUpdates = getAvailableStatusUpdates(order.status);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition">
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
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Total</p>
                        <p className="text-xl font-bold text-primary-600">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-600 mb-1">📍 Delivery Address:</p>
                      <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">Order Items:</h4>
                        <span className="text-sm text-gray-500">{order.items?.length || 0} items</span>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">
                              <span className="font-medium">{item.name}</span> x {item.quantity}
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
                    {availableUpdates.length > 0 ? (
                      availableUpdates.map((update, index) => (
                        <Button
                          key={index}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to mark this order as ${update.status}?`)) {
                              handleUpdateStatus(order.id, update.status);
                            }
                          }}
                          className={update.color}
                          fullWidth
                        >
                          {update.label}
                        </Button>
                      ))
                    ) : order.status === ORDER_STATUS.DELIVERED ? (
                      <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                        ✓ Completed
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-lg text-center text-sm">
                        No actions available
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
