import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        rate: '',
        image: ''
    });

    // Order creation state
    const [selectedProducts, setSelectedProducts] = useState(new Map()); // Map of productId -> quantity
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderCustomer, setOrderCustomer] = useState({
        name: '',
        phone: ''
    });
    const [creatingOrder, setCreatingOrder] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Products useEffect - Token check:', token ? 'Token exists' : 'No token');
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            console.log('Fetching products with token:', token ? 'Token exists' : 'No token');
            console.log('Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'N/A');
            
            if (!token) {
                console.log('No token available for API call');
                navigate('/login');
                return;
            }
            
            const response = await axios.get('http://localhost:3000/products', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProducts(response.data);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Fetch products error:', err);
            console.error('Error response:', err.response);
            
            const errorMessage = err.response?.data?.message || 'Failed to fetch products';
            setError(errorMessage);
            
            if (err.response?.status === 401) {
                console.log('401 error - clearing storage and redirecting');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = { ...formData, rate: parseFloat(formData.rate) };
            console.log('Submitting product data:', data);
            console.log('Using token:', token ? 'Token exists' : 'No token');
            
            if (!token) {
                navigate('/login');
                return;
            }
            
            if (editingProduct) {
                await axios.patch(`http://localhost:3000/products/${editingProduct.id}`, data, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post('http://localhost:3000/products', data, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            fetchProducts();
            resetForm();
        } catch (err) {
            console.error('Submit product error:', err);
            console.error('Error response:', err.response);
            
            const errorMessage = err.response?.data?.message || 'Failed to save product';
            setError(errorMessage);
            
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            code: product.code,
            name: product.name,
            description: product.description || '',
            rate: product.rate.toString(),
            image: product.image || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                await axios.delete(`http://localhost:3000/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
            } catch (err) {
                setError('Failed to delete product');
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        }
    };

    const resetForm = () => {
        setFormData({ code: '', name: '', description: '', rate: '', image: '' });
        setEditingProduct(null);
        setShowForm(false);
        setError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Product selection functions
    const handleProductSelect = (productId, isChecked) => {
        const newSelected = new Map(selectedProducts);
        if (isChecked) {
            newSelected.set(productId, 1); // Default quantity of 1
        } else {
            newSelected.delete(productId);
        }
        setSelectedProducts(newSelected);
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity > 0) {
            const newSelected = new Map(selectedProducts);
            newSelected.set(productId, parseInt(quantity));
            setSelectedProducts(newSelected);
        }
    };

    const getSelectedProductsTotal = () => {
        let total = 0;
        selectedProducts.forEach((quantity, productId) => {
            const product = products.find(p => p.id === productId);
            if (product) {
                total += product.rate * quantity;
            }
        });
        return total;
    };

    const handleCreateOrder = async () => {
        if (selectedProducts.size === 0) {
            setError('Please select at least one product');
            return;
        }

        if (!orderCustomer.name.trim() || !orderCustomer.phone.trim()) {
            setError('Please fill in customer name and phone');
            return;
        }

        try {
            setCreatingOrder(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            // Prepare order items
            const orderItems = [];
            selectedProducts.forEach((quantity, productId) => {
                const product = products.find(p => p.id === productId);
                if (product) {
                    orderItems.push({
                        product_id: productId,
                        quantity: quantity,
                        price: parseFloat(product.rate)
                    });
                }
            });

            const orderData = {
                customer: {
                    name: orderCustomer.name.trim(),
                    phone: orderCustomer.phone.trim()
                },
                orderItems: orderItems
            };

            console.log('Creating order with data:', orderData);

            const response = await axios.post('http://localhost:3000/orders', orderData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Order created successfully:', response.data);
            
            // Reset form and selections
            setSelectedProducts(new Map());
            setOrderCustomer({ name: '', phone: '' });
            setShowOrderForm(false);
            setError('');
            
            // Show success message
            alert(`Order created successfully! Order ID: ${response.data.id}`);

        } catch (err) {
            console.error('Create order error:', err);
            console.error('Error response:', err.response);
            
            const errorMessage = err.response?.data?.message || 'Failed to create order';
            setError(errorMessage);
            
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setCreatingOrder(false);
        }
    };

    const resetOrderForm = () => {
        setSelectedProducts(new Map());
        setOrderCustomer({ name: '', phone: '' });
        setShowOrderForm(false);
        setError('');
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
                {/* Header */}
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

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                        <div className="flex space-x-3">
                            {selectedProducts.size > 0 && (
                                <button
                                    onClick={() => setShowOrderForm(true)}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    Create Order ({selectedProducts.size} items)
                                </button>
                            )}
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Product Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Code</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rate</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.rate}
                                            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
                                        >
                                            {editingProduct ? 'Update' : 'Create'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Order Creation Modal */}
                    {showOrderForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Create Order
                                </h3>

                                {/* Selected Products Summary */}
                                <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <h4 className="font-medium text-gray-700 mb-2">Selected Products:</h4>
                                    {Array.from(selectedProducts.entries()).map(([productId, quantity]) => {
                                        const product = products.find(p => p.id === productId);
                                        return product ? (
                                            <div key={productId} className="flex justify-between text-sm">
                                                <span>{product.name} x {quantity}</span>
                                                <span>${(product.rate * quantity).toFixed(2)}</span>
                                            </div>
                                        ) : null;
                                    })}
                                    <div className="border-t mt-2 pt-2 font-bold">
                                        Total: ${getSelectedProductsTotal().toFixed(2)}
                                    </div>
                                </div>

                                {/* Customer Information Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={orderCustomer.name}
                                            onChange={(e) => setOrderCustomer({ ...orderCustomer, name: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Customer Phone *</label>
                                        <input
                                            type="tel"
                                            value={orderCustomer.phone}
                                            onChange={(e) => setOrderCustomer({ ...orderCustomer, phone: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Enter customer phone"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleCreateOrder}
                                        disabled={creatingOrder}
                                        className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded flex-1"
                                    >
                                        {creatingOrder ? 'Creating...' : 'Confirm Order'}
                                    </button>
                                    <button
                                        onClick={resetOrderForm}
                                        disabled={creatingOrder}
                                        className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded flex-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products List */}
                    {products.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No products found. Create your first product!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.has(product.id)}
                                                    onChange={(e) => handleProductSelect(product.id, e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {product.description || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${parseFloat(product.rate).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                                ) : (
                                                    'No image'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {selectedProducts.has(product.id) ? (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={selectedProducts.get(product.id) || 1}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
