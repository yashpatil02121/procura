import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const styles = {
        container: {
            minHeight: '100vh',
            minWidth: '100vw',
            background: 'linear-gradient(to bottom right, #bae6fd, #3b82f6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center',
            textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        buttonContainer: {
            display: 'flex',
            gap: '1rem',
        },
        button: {
            padding: '0.75rem 1.5rem',
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
        userInfo: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
        },
        welcomeText: {
            color: 'white',
            fontWeight: 'bold',
        },
        logoutButton: {
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        logoutButtonHover: {
            backgroundColor: '#dc2626',
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {user && (
                <div style={styles.userInfo}>
                    <span style={styles.welcomeText}>Welcome, {user.name}!</span>
                    <button 
                        onClick={handleLogout}
                        style={{
                            ...styles.logoutButton,
                            ':hover': styles.logoutButtonHover
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
            
            <h1 style={styles.header}>Welcome to Procura Assignment 🚀</h1>
            <div style={styles.buttonContainer}>
                <button 
                    onClick={() => navigate('/products')}
                    style={{
                        ...styles.button,
                        ':hover': styles.buttonHover
                    }}
                >
                    Products
                </button>
                <button 
                    onClick={() => navigate('/orders')}
                    style={{
                        ...styles.button,
                        ':hover': styles.buttonHover
                    }}
                >
                    Orders
                </button>
            </div>
        </div>
    );
}
  