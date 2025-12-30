import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-red-600 mb-3">
            About Feasto 🍔
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fast, fresh, and delicious food delivered straight to your doorstep.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Feasto is a modern fast food ordering and delivery platform designed
              to connect hungry customers with their favorite meals quickly and
              conveniently.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              From juicy burgers 🍔 and crispy fries 🍟 to refreshing beverages 🥤,
              we ensure every order is prepared fresh and delivered hot.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is simple — <strong>great food, fast delivery, happy customers.</strong>
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl mb-2">⚡</p>
              <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
              <p className="text-sm text-gray-500 mt-2">
                Hot food delivered in minutes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl mb-2">🍔</p>
              <h3 className="font-semibold text-gray-800">Quality Food</h3>
              <p className="text-sm text-gray-500 mt-2">
                Fresh ingredients, great taste.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl mb-2">📱</p>
              <h3 className="font-semibold text-gray-800">Easy Ordering</h3>
              <p className="text-sm text-gray-500 mt-2">
                Simple & user-friendly app.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl mb-2">🚚</p>
              <h3 className="font-semibold text-gray-800">Live Tracking</h3>
              <p className="text-sm text-gray-500 mt-2">
                Track your order in real-time.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
