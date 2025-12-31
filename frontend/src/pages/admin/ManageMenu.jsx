import React, { useState, useEffect } from 'react';
import foodService from '../../services/foodService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import { formatCurrency } from '../../utils/helpers';

const ManageMenu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      const items = await foodService.getAllFoodItems();
      setFoodItems(items);
    } catch (error) {
      console.error('Error loading food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await foodService.updateFoodItem(editingItem.id, itemData);
      } else {
        await foodService.addFoodItem(itemData);
      }

      loadFoodItems();
      resetForm();
    } catch (error) {
      console.error('Error saving food item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await foodService.deleteFoodItem(id);
      loadFoodItems();
    } catch (error) {
      console.error('Error deleting food item:', error);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await foodService.toggleAvailability(id);
      loadFoodItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
    });
    setEditingItem(null);
    setShowModal(false);
    setErrors({});
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Menu</h1>
          <p className="text-gray-600 mt-2">Add, edit, or remove food items</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Add New Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems.map(item => (
          <Card key={item.id}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
            <p className="text-2xl font-bold text-primary-600 mb-4">
              {formatCurrency(item.price)}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(item)} className="flex-1">
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleToggleAvailability(item.id)}
                className="flex-1"
              >
                {item.available ? 'Disable' : 'Enable'}
              </Button>
              <Button variant="danger" onClick={() => handleDelete(item.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Margherita Pizza"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Classic pizza with tomato sauce..."
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                  placeholder="12.99"
                  required
                />
                <Input
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                  placeholder="Pizza, Burgers, Salads, etc."
                  required
                />
                <Input
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  error={errors.image}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <div className="flex gap-3 pt-4">
                  <Button type="submit" fullWidth>
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
                  <Button type="button" variant="secondary" fullWidth onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
