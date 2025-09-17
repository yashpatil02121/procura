import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Orders useEffect - Token check:', token ? 'Token exists' : 'No token');
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');
            
            if (!token) {
                console.log('No token available for API call');
                navigate('/login');
                return;
            }
            
            const response = await axios.get('http://localhost:3000/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (err) {
            console.error('Fetch orders error:', err);
            setError('Failed to fetch orders');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ← Back to Home
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {orders.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No orders found.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-600">
                                        Customer: {order.customer.name} ({order.customer.phone})
                                    </p>
                                    <p className="text-lg font-bold">${parseFloat(order.total_amount).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
