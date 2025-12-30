import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { mockDeliveryStaff } from '../../utils/mockData';

const ManageDeliveryStaff = () => {
  const getInitialStaff = () => {
    const saved = localStorage.getItem('deliveryStaff');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('deliveryStaff', JSON.stringify(mockDeliveryStaff));
    return mockDeliveryStaff;
  };

  const [deliveryStaff, setDeliveryStaff] = useState(getInitialStaff);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleNumber: '',
    status: 'available',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!editingStaff && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!editingStaff && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingStaff) {
      // Update existing staff
      const updated = deliveryStaff.map(staff =>
        staff.id === editingStaff.id
          ? { ...staff, ...formData, password: formData.password || staff.password }
          : staff
      );
      setDeliveryStaff(updated);
      localStorage.setItem('deliveryStaff', JSON.stringify(updated));
    } else {
      // Add new staff
      const staffId = crypto.randomUUID();
      const newStaff = {
        id: staffId,
        ...formData,
        role: 'delivery',
        activeOrders: 0,
      };
      const updated = [...deliveryStaff, newStaff];
      setDeliveryStaff(updated);
      localStorage.setItem('deliveryStaff', JSON.stringify(updated));

      // Also add to users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        password: newStaff.password,
        phone: newStaff.phone,
        role: 'delivery',
        vehicleNumber: newStaff.vehicleNumber,
      });
      localStorage.setItem('users', JSON.stringify(users));
    }

    resetForm();
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '',
      phone: staff.phone,
      vehicleNumber: staff.vehicleNumber,
      status: staff.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery staff?')) {
      const updated = deliveryStaff.filter(staff => staff.id !== id);
      setDeliveryStaff(updated);
      localStorage.setItem('deliveryStaff', JSON.stringify(updated));
    }
  };

  const handleStatusToggle = (id) => {
    const updated = deliveryStaff.map(staff =>
      staff.id === id
        ? { ...staff, status: staff.status === 'available' ? 'unavailable' : 'available' }
        : staff
    );
    setDeliveryStaff(updated);
    localStorage.setItem('deliveryStaff', JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      vehicleNumber: '',
      status: 'available',
    });
    setErrors({});
    setEditingStaff(null);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Delivery Staff</h1>
        <Button onClick={() => setShowAddModal(true)}>
          + Add Delivery Staff
        </Button>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryStaff.map(staff => (
          <Card key={staff.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{staff.name}</h3>
                <p className="text-sm text-gray-600">{staff.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                staff.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {staff.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Phone:</span> {staff.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Vehicle:</span> {staff.vehicleNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Active Orders:</span> {staff.activeOrders || 0}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(staff)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant={staff.status === 'available' ? 'outline' : 'primary'}
                onClick={() => handleStatusToggle(staff.id)}
                className="flex-1"
              >
                {staff.status === 'available' ? 'Set Unavailable' : 'Set Available'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(staff.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {deliveryStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No delivery staff added yet.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingStaff ? 'Edit Delivery Staff' : 'Add Delivery Staff'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="delivery@feasto.com"
                required
              />

              <Input
                label={editingStaff ? 'Password (leave empty to keep current)' : 'Password'}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter password"
                required={!editingStaff}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="555-123-4567"
                required
              />

              <Input
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                error={errors.vehicleNumber}
                placeholder="ABC-1234"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDeliveryStaff;
