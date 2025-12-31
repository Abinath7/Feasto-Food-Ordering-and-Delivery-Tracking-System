import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from "../assets/logo.png";

const MainLayout = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={Logo} alt="Feasto Logo" className="h-20 w-auto" />
                <span className="text-2xl font-bold text-white">Feasto</span>
              </div>

              <p className="text-gray-400">
                Your favorite food,
              </p>
              <p className="text-gray-400">
                delivered with care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-primary-400 transition cursor-pointer">About Us</li>
                <li className="hover:text-primary-400 transition cursor-pointer">Careers</li>
                <li className="hover:text-primary-400 transition cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-primary-400 transition cursor-pointer">Help Center</li>
                <li className="hover:text-primary-400 transition cursor-pointer">Terms of Service</li>
                <li className="hover:text-primary-400 transition cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Download App</h4>
              <p className="text-gray-400 text-sm">Coming soon to iOS and Android</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Feasto - Food Ordering & Delivery System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
