import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const CustomerEnquiries = () => {
  const getInitialEnquiries = () => {
    const saved = localStorage.getItem('customerEnquiries');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock data for demonstration
    const mockEnquiries = [
      {
        id: 1,
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        subject: 'Delivery Issue',
        message: 'My order was delayed by 30 minutes. Please ensure better delivery times.',
        date: new Date().toISOString(),
        status: 'new',
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94 11 234 5678',
        subject: 'Food Quality',
        message: 'The pizza I ordered was cold when it arrived. Can you improve packaging?',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'reviewed',
      },
      {
        id: 3,
        customerName: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+94 77 987 6543',
        subject: 'Payment Problem',
        message: 'I was charged twice for the same order. Please refund the duplicate charge.',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'new',
      },
    ];
    localStorage.setItem('customerEnquiries', JSON.stringify(mockEnquiries));
    return mockEnquiries;
  };

  const [enquiries, setEnquiries] = useState(getInitialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const markAsReviewed = (id) => {
    const updated = enquiries.map(enq =>
      enq.id === id ? { ...enq, status: 'reviewed' } : enq
    );
    setEnquiries(updated);
    localStorage.setItem('customerEnquiries', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Enquiries</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 space-y-4">
          {enquiries.map(enquiry => (
            <Card
              key={enquiry.id}
              className={`cursor-pointer hover:shadow-lg transition ${
                selectedEnquiry?.id === enquiry.id ? 'border-2 border-primary-600' : ''
              }`}
              onClick={() => setSelectedEnquiry(enquiry)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{enquiry.subject}</h3>
                  <p className="text-sm text-gray-600">{enquiry.customerName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  enquiry.status === 'new'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {enquiry.status === 'new' ? 'New' : 'Reviewed'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{enquiry.message}</p>
              <p className="text-xs text-gray-500">{formatDate(enquiry.date)}</p>
            </Card>
          ))}

          {enquiries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customer enquiries yet.</p>
            </div>
          )}
        </div>

        {/* Enquiry Details */}
        <div className="lg:col-span-1">
          {selectedEnquiry ? (
            <Card className="sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enquiry Details</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <p className="text-gray-900">{selectedEnquiry.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                  <p className="text-gray-900">{selectedEnquiry.customerName}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedEnquiry.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedEnquiry.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <p className="text-gray-900">{formatDate(selectedEnquiry.date)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>

                {selectedEnquiry.status === 'new' && (
                  <Button
                    onClick={() => markAsReviewed(selectedEnquiry.id)}
                    className="w-full mt-4"
                  >
                    Mark as Reviewed
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="sticky top-4">
              <p className="text-gray-500 text-center py-8">
                Select an enquiry to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerEnquiries;
