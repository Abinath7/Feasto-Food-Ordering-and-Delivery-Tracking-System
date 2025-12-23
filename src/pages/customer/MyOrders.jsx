import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const customerOrders = await orderService.getOrdersByCustomerId(user.id);
      setOrders(customerOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track your order history and status</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            You haven't placed any orders yet. Start ordering from the menu!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Order Items:</h4>
                <div className="space-y-2">
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

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address:</p>
                    <p className="text-gray-900">{order.deliveryAddress}</p>
                    {order.deliveryStaffName && (
                      <p className="text-sm text-gray-600 mt-2">
                        Delivery by: <span className="font-medium">{order.deliveryStaffName}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
