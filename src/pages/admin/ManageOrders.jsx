import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import { mockDeliveryStaff } from '../../utils/mockData';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDelivery = async (staffId, staffName) => {
    if (!selectedOrder) return;

    try {
      await orderService.assignDeliveryStaff(selectedOrder.id, staffId, staffName);
      loadOrders();
      setShowAssignModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error assigning delivery staff:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-gray-600 mt-2">View and manage all customer orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No orders yet</p>
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
                      <p className="text-sm text-gray-600">Delivery Address</p>
                      <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
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
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  {order.deliveryStaffName && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="text-sm text-gray-600">Assigned to:</p>
                      <p className="font-medium text-gray-900">{order.deliveryStaffName}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  {order.status === ORDER_STATUS.PENDING && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
                        fullWidth
                      >
                        Mark as Preparing
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowAssignModal(true);
                        }}
                        fullWidth
                      >
                        Assign Delivery
                      </Button>
                    </>
                  )}
                  {order.status === ORDER_STATUS.PREPARING && (
                    <Button
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.READY)}
                      fullWidth
                    >
                      Mark as Ready
                    </Button>
                  )}
                  {order.status !== ORDER_STATUS.DELIVERED && 
                   order.status !== ORDER_STATUS.CANCELLED && (
                    <Button
                      variant="danger"
                      onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CANCELLED)}
                      fullWidth
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Assign Delivery Staff
              </h2>
              <p className="text-gray-600 mb-6">
                Select a delivery staff member for Order #{selectedOrder?.id}
              </p>
              <div className="space-y-3">
                {mockDeliveryStaff.map(staff => (
                  <div
                    key={staff.id}
                    className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer"
                    onClick={() => handleAssignDelivery(staff.id, staff.name)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.phone}</p>
                        <p className="text-sm text-gray-600">Vehicle: {staff.vehicleNumber}</p>
                      </div>
                      {staff.available && (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
