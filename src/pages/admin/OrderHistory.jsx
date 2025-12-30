import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const OrderHistory = () => {
  const getInitialOrders = () => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  };

  const [orders] = useState(getInitialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivering':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50">
          <p className="text-sm text-gray-600 mb-1">Delivered Orders</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
        </Card>
        <Card className="bg-blue-50">
          <p className="text-sm text-gray-600 mb-1">Active Orders</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)).length}
          </p>
        </Card>
        <Card className="bg-red-50">
          <p className="text-sm text-gray-600 mb-1">Cancelled Orders</p>
          <p className="text-2xl font-bold text-red-600">
            {orders.filter(o => o.status === 'cancelled').length}
          </p>
        </Card>
        <Card className="bg-purple-50">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(getTotalRevenue())}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.map(order => (
            <Card
              key={order.id}
              className={`cursor-pointer hover:shadow-lg transition ${
                selectedOrder?.id === order.id ? 'border-2 border-primary-600' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.customerName || order.customerEmail}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {order.items?.length || 0} item(s)
              </p>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found.</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <Card className="sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Order ID</label>
                  <p className="text-gray-900">#{selectedOrder.id}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedOrder.customerName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Delivery Address</label>
                  <p className="text-gray-900">{selectedOrder.deliveryAddress || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Order Date</label>
                  <p className="text-gray-900">{formatDate(selectedOrder.orderDate)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Order Items</label>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>

                {selectedOrder.deliveryStaff && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Delivery Staff</label>
                    <p className="text-gray-900">{selectedOrder.deliveryStaff}</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="sticky top-4">
              <p className="text-gray-500 text-center py-8">
                Select an order to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
