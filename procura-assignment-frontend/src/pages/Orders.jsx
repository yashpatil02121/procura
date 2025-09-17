import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const styles = {
        container: {
            minHeight: '100vh',
            minWidth: '100vw',
            background: 'linear-gradient(to bottom right, #bae6fd, #3b82f6)',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif',
        },
        contentContainer: {
            maxWidth: '72rem',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '2rem',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        headerTitle: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
        },
        button: {
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#3b82f6',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        buttonHover: {
            transform: 'scale(1.05)',
            backgroundColor: '#f0f9ff',
        },
        backButton: {
            backgroundColor: '#6b7280',
            color: 'white',
        },
        logoutButton: {
            backgroundColor: '#ef4444',
            color: 'white',
        },
        errorMessage: {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
        },
        loadingContainer: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #bae6fd, #3b82f6)',
        },
        loadingText: {
            fontSize: '1.25rem',
            color: 'white',
        },
        orderCard: {
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        orderTitle: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem',
        },
        orderDetails: {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
        },
        orderTotal: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#10b981',
        },
        noOrdersMessage: {
            textAlign: 'center',
            color: '#6b7280',
            padding: '2rem',
        }
    };

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
            <div style={styles.loadingContainer}>
                <div style={styles.loadingText}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.contentContainer}>
                <div style={styles.header}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            ...styles.button,
                            ...styles.backButton,
                            ':hover': styles.buttonHover
                        }}
                    >
                        ← Back to Home
                    </button>
                    <button 
                        onClick={handleLogout}
                        style={{
                            ...styles.button,
                            ...styles.logoutButton,
                            ':hover': styles.buttonHover
                        }}
                    >
                        Logout
                    </button>
                </div>

                <h1 style={styles.headerTitle}>Orders</h1>
                
                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <p style={styles.noOrdersMessage}>No orders found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map((order) => (
                            <div key={order.id} style={styles.orderCard}>
                                <h3 style={styles.orderTitle}>Order #{order.id}</h3>
                                <p style={styles.orderDetails}>
                                    Customer: {order.customer.name} ({order.customer.phone})
                                </p>
                                <p style={styles.orderTotal}>
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
