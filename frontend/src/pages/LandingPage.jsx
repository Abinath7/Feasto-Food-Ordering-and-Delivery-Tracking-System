import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import HeroBg from "../assets/background.png";
import Dishes1 from "../assets/dishes1.jpg";
import Noodle from "../assets/noodle.jpg";
import Kebab from "../assets/beyti-kebab-served-with-ayran-pickles.jpg";
import Chicken from "../assets/chicken_wings.jpg";


const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of hero images
  const heroImages = [HeroBg, Dishes1, Noodle, Kebab, Chicken];

  useEffect(() => {
    // Redirect admin and delivery staff to their dashboards
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'delivery') {
        navigate('/delivery/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Auto-change images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50">
      {/* Hero Section */}
      <div id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
       
        <div 
          className="relative bg-cover bg-center bg-no-repeat py-24 transition-all duration-1000 ease-in-out rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
        >
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 25px rgba(0,0,0,0.5)' }}>
            Delicious Food,
            <span className="text-red-500"> Delivered Fast</span>
          </h1>
          <p className="text-xl font-semibold text-white mb-10 max-w-2xl mx-auto drop-shadow-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)' }}>
            Order from your favorite restaurants and track your delivery in real-time. 
            Fresh, hot, and delivered right to your door.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/menu">
              <Button className="px-8 py-3 text-lg">Browse Menu</Button>
            </Link>
            <Link to="/register">
              <Button className="px-8 py-3 text-lg">Sign Up</Button>
            </Link>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-primary-600 w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">🍕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Wide Selection</h3>
            <p className="text-gray-600">
              Browse through our extensive menu of delicious cuisines from pizza to burgers and more.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
            <p className="text-gray-600">
              Track your order in real-time and enjoy quick delivery straight to your doorstep.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Food</h3>
            <p className="text-gray-600">
              We ensure every meal is prepared fresh with the highest quality ingredients.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Account</h4>
              <p className="text-gray-600 text-sm">Sign up in seconds</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Browse Menu</h4>
              <p className="text-gray-600 text-sm">Choose your favorites</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Place Order</h4>
              <p className="text-gray-600 text-sm">Quick checkout process</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enjoy!</h4>
              <p className="text-gray-600 text-sm">Track and receive</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers enjoying delicious meals
          </p>
          <Link to="/register">
            <Button className="bg-white !text-black hover:bg-gray-100 px-8 py-3 text-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your Trusted Food Delivery Partner
              </h3>
              <p className="text-gray-600 mb-4">
                Feasto is more than just a food delivery service. We're a passionate team dedicated to 
                bringing delicious meals from your favorite restaurants right to your doorstep. Since our 
                inception, we've been committed to quality, speed, and customer satisfaction.
              </p>
              <p className="text-gray-600 mb-4">
                Our platform connects hungry customers with top-rated restaurants and reliable delivery 
                partners, ensuring every meal arrives fresh, hot, and on time. We use cutting-edge 
                technology to provide real-time tracking and seamless ordering experience.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">5000+</div>
                  <div className="text-gray-600 text-sm">Orders Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">500+</div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-gray-600 text-sm">Menu Items</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-6 rounded-xl">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-gray-900 mb-2">Our Mission</h4>
                <p className="text-gray-700 text-sm">
                  To make food delivery simple, fast, and enjoyable for everyone.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl mt-8">
                <div className="text-4xl mb-3">👥</div>
                <h4 className="font-bold text-gray-900 mb-2">Our Team</h4>
                <p className="text-gray-700 text-sm">
                  Dedicated professionals working 24/7 to serve you better.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl">
                <div className="text-4xl mb-3">🌟</div>
                <h4 className="font-bold text-gray-900 mb-2">Our Values</h4>
                <p className="text-gray-700 text-sm">
                  Quality, integrity, and customer satisfaction above all.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl mt-8">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-gray-700 text-sm">
                  Using technology to enhance your dining experience.
                </p>
              </div>
            </div>
          </div>

          {/* Menu Categories */}
          <div className="mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-bold text-red-900 mb-6">
                  EXPLORE OUR MENU
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Discover a wide variety of delicious dishes crafted with the finest ingredients. 
                  From classic pizzas and hearty burgers to fresh salads and authentic pasta, our menu 
                  offers something for every craving. Each dish is prepared fresh to order by our 
                  expert chefs, ensuring you get the perfect meal every time. Browse our popular 
                  categories and find your next favorite dish.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
                    alt="Burgers"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h4 className="text-white text-2xl font-bold">BURGERS</h4>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
                  <img
                    src="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
                    alt="Salads"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h4 className="text-white text-2xl font-bold">SALADS</h4>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
                  <img
                    src="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop"
                    alt="Pasta"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h4 className="text-white text-2xl font-bold">PASTA</h4>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
                  <img
                    src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop"
                    alt="Pizza"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h4 className="text-white text-2xl font-bold">PIZZA</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link to="/menu">
                <Button className="px-8 py-3 text-lg bg-pink-500 hover:bg-pink-600">
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div id="contact" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button className="w-full">Send Message</Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Our Location</h3>
                    <p className="text-gray-600">
                      123 Food Street, Culinary District<br />
                      Sri Lanka, 12000
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">
                      Customer Service: +94 11 234 5678<br />
                      Support: +94 77 123 4567
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">
                      General: info@feasto.com<br />
                      Support: support@feasto.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 10:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
