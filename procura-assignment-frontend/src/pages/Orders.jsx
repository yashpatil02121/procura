import { useNavigate } from 'react-router-dom';

export default function Orders() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ← Back to Home
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>
                    <p className="text-lg text-gray-600">Order details</p>
                </div>
            </div>
        </div>
    );
}
