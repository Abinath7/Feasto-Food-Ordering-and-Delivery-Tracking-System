import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    const existingEnquiries = JSON.parse(localStorage.getItem('customerEnquiries') || '[]');
    const newEnquiry = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      status: 'new',
      subject: 'Contact Form Submission',
      phone: 'Not provided'
    };
    existingEnquiries.push(newEnquiry);
    localStorage.setItem('customerEnquiries', JSON.stringify(existingEnquiries));
    
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-red-600 mb-3">
            Contact Feasto 📞
          </h1>
          <p className="text-gray-600">
            We’d love to hear from you!
          </p>
        </div>

        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            ✓ Message sent successfully! We'll get back to you soon. 🍔
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-2">📍 Address</h3>
              <p className="text-gray-600">
                Feasto HQ,<br />
                Colombo, Sri Lanka
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-2">📞 Phone</h3>
              <p className="text-gray-600">+94 77 123 4567</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-2">✉️ Email</h3>
              <p className="text-gray-600">support@feasto.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-8 space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
