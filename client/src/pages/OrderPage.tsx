import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Shipping</h2>
          <p>
            <strong>Name:</strong> {order.user.name}
          </p>
          <p>
            <strong>Email:</strong> {order.user.email}
          </p>
          <p>
            <strong>Address:</strong> {order.shippingAddress.address},{' '}
            {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
            {order.shippingAddress.country}
          </p>
          {order.isDelivered ? (
            <p className="text-green-600">Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}</p>
          ) : (
            <p className="text-red-600">Not Delivered</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p>
            <strong>Method:</strong> {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <p className="text-green-600">Paid on {new Date(order.paidAt!).toLocaleDateString()}</p>
          ) : (
            <p className="text-red-600">Not Paid</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.product._id} className="flex items-center border-b pb-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{item.product.name}</h3>
                <p>
                  {item.quantity} x ${item.product.price} = ${item.quantity * item.product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p className="text-lg">
          <strong>Total:</strong> ${order.totalPrice}
        </p>
      </div>
    </div>
  );
};

export default OrderPage; 