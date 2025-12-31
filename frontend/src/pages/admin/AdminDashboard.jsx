import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import foodService from '../../services/foodService';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import { formatCurrency } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalMenuItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orders, foodItems] = await Promise.all([
        orderService.getAllOrders(),
        foodService.getAllFoodItems(),
      ]);

      const totalRevenue = orders
        .filter(order => order.status === ORDER_STATUS.DELIVERED)
        .reduce((sum, order) => sum + order.total, 0);

      const pendingOrders = orders.filter(
        order => order.status === ORDER_STATUS.PENDING
      ).length;

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        totalMenuItems: foodItems.length,
      });

      setRecentOrders(
        orders
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your restaurant operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="text-5xl opacity-20">⏳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Menu Items</p>
              <p className="text-3xl font-bold mt-2">{stats.totalMenuItems}</p>
            </div>
            <div className="text-5xl opacity-20">🍽️</div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card title="Recent Orders">
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.items.length} items</td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
