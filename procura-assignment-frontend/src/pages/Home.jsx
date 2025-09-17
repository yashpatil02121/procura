import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4">
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user.name}!</span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Procura Assignment 🚀</h1>
            <div className="space-x-4">
                <button 
                    onClick={() => navigate('/products')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Products
                </button>
                <button 
                    onClick={() => navigate('/orders')}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Orders
                </button>
            </div>
        </div>
    );
}
  