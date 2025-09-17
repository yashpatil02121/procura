import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
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
  