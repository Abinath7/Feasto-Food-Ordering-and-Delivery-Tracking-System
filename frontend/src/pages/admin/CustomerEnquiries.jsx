import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import contactService from '../../services/contactService';

const CustomerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error('Error loading enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const markAsReviewed = async (id) => {
    try {
      setUpdating(true);
      await contactService.updateEnquiryStatus(id, 'reviewed');
      setEnquiries(enquiries.map(enq =>
        enq.id === id ? { ...enq, status: 'reviewed' } : enq
      ));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: 'reviewed' });
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;

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
                  <h3 className="text-lg font-semibold text-gray-900">{enquiry.subject || 'No Subject'}</h3>
                  <p className="text-sm text-gray-600">{enquiry.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  enquiry.status === 'new' || enquiry.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {enquiry.status === 'new' || enquiry.status === 'pending' ? 'New' : 'Reviewed'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{enquiry.message}</p>
              <p className="text-xs text-gray-500">{formatDate(enquiry.created_at)}</p>
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
                  <p className="text-gray-900">{selectedEnquiry.subject || 'No Subject'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                  <p className="text-gray-900">{selectedEnquiry.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedEnquiry.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedEnquiry.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <p className="text-gray-900">{formatDate(selectedEnquiry.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>

                {(selectedEnquiry.status === 'new' || selectedEnquiry.status === 'pending') && (
                  <Button
                    onClick={() => markAsReviewed(selectedEnquiry.id)}
                    disabled={updating}
                    className="w-full mt-4"
                  >
                    {updating ? 'Updating...' : 'Mark as Reviewed'}
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
