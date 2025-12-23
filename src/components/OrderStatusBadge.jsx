import React from 'react';
import { ORDER_STATUS } from '../utils/constants';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    [ORDER_STATUS.PENDING]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    [ORDER_STATUS.PREPARING]: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Preparing',
    },
    [ORDER_STATUS.READY]: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      label: 'Ready',
    },
    [ORDER_STATUS.PICKED_UP]: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      label: 'Picked Up',
    },
    [ORDER_STATUS.DELIVERED]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Delivered',
    },
    [ORDER_STATUS.CANCELLED]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status] || statusConfig[ORDER_STATUS.PENDING];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
