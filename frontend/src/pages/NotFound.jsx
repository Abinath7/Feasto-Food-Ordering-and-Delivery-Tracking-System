import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full">
              🏠 Back to Home
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="w-full">
              🍕 Browse Menu
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Lost? Try using the navigation menu above.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
