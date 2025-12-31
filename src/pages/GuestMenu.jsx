import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import foodService from '../services/foodService';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/helpers';

const GuestMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Redirect admin and delivery staff to their dashboards
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      } else if (user.role === 'delivery') {
        navigate('/delivery/dashboard', { replace: true });
        return;
      }
    }
    loadMenu();
  }, [user, navigate]);

  const loadMenu = async () => {
    try {
      const items = await foodService.getAllFoodItems();
      setFoodItems(items.filter(item => item.available));
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    if (!user) {
      navigate('/register');
      return;
    }
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const categories = ['all', ...new Set(foodItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'all'
    ? foodItems
    : foodItems.filter(item => item.category === selectedCategory);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50">
      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Explore Our Delicious Menu 🍽️
          </h1>
          <p className="text-gray-600 mt-2">
            {user ? 'Browse our menu and add items to your cart' : 'Sign up to place orders and enjoy fast delivery'}
          </p>
        </div>

        {/* Sign Up Banner - Only show for non-logged-in users */}
        {!user && (
          <div className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Order?</h2>
                <p className="text-primary-100">
                  Create an account to add items to your cart and place orders
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/register">
                  <Button className="bg-white text !text-black hover:bg-gray-100">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-white text !text-black hover:bg-gray-100">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="hover:shadow-xl transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <p className="text-gray-600 text-sm my-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(item.price)}
                </span>
                {user ? (
                  <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                ) : (
                  <Link to="/register">
                    <Button>Sign Up to Order</Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category</p>
          </div>
        )}

        {/* Bottom CTA - Only show for non-logged-in users */}
        {!user && (
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Love What You See?
            </h2>
            <p className="text-gray-600 mb-6">
              Join Feasto today and start enjoying delicious meals delivered to your doorstep
            </p>
            <Link to="/register">
              <Button className="px-8 py-3 text-lg">
                Create Your Account
              </Button>
            </Link>
          </div>
        )}

        {/* Cart notification for logged-in users */}
        {user && cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-6 py-4 rounded-lg shadow-lg">
            <p className="font-semibold">{cart.length} item(s) in cart</p>
            <Link to="/customer/dashboard">
              <Button className="mt-2 bg-white text-primary-600 hover:bg-gray-100">
                View Cart
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestMenu;
