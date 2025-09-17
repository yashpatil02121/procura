import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationDialog from '../components/ConfirmationDialog';

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

    // Delete confirmation state
    const [productToDelete, setProductToDelete] = useState(null);

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
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        tableHeader: {
            backgroundColor: '#f9fafb',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            color: '#6b7280',
            fontWeight: 'bold',
            padding: '0.75rem',
            textAlign: 'left',
        },
        tableRow: {
            borderBottom: '1px solid #e5e7eb',
        },
        tableCell: {
            padding: '0.75rem',
            fontSize: '0.875rem',
            color: '#111827',
        },
        actionButton: {
            marginRight: '0.5rem',
            color: '#3b82f6',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
        },
        actionButtonHover: {
            color: '#1d4ed8',
        },
        deleteButton: {
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
        },
        deleteButtonHover: {
            color: '#b91c1c',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50,
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            width: '24rem',
            maxWidth: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
        modalTitle: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#111827',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            marginTop: '0.25rem',
            transition: 'all 0.3s ease',
        },
        inputFocus: {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            color: '#4b5563',
            marginBottom: '0.5rem',
        },
        submitButton: {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        submitButtonHover: {
            backgroundColor: '#2563eb',
        },
        cancelButton: {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        cancelButtonHover: {
            backgroundColor: '#4b5563',
        },
    };

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

    const confirmDeleteProduct = (product) => {
        setProductToDelete(product);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            await axios.delete(`http://localhost:3000/products/${productToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
            setProductToDelete(null);
        } catch (err) {
            setError('Failed to delete product');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    const cancelDelete = () => {
        setProductToDelete(null);
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

                <div style={styles.header}>
                    <h1 style={styles.headerTitle}>Products</h1>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {selectedProducts.size > 0 && (
                            <button
                                onClick={() => setShowOrderForm(true)}
                                style={{
                                    ...styles.button,
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    ':hover': {
                                        ...styles.buttonHover,
                                        backgroundColor: '#059669'
                                    }
                                }}
                            >
                                Create Order ({selectedProducts.size} items)
                            </button>
                        )}
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                ...styles.button,
                                ':hover': styles.buttonHover
                            }}
                        >
                            Add Product
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {/* Product Form Modal */}
                {showForm && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <h3 style={styles.modalTitle}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Form inputs with inline styles */}
                                <div>
                                    <label style={styles.label}>Code</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus
                                        }}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus,
                                            minHeight: '6rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Rate</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            ...styles.submitButton,
                                            ':hover': styles.submitButtonHover
                                        }}
                                    >
                                        {editingProduct ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        style={{
                                            ...styles.cancelButton,
                                            ':hover': styles.cancelButtonHover
                                        }}
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
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <h3 style={styles.modalTitle}>
                                Create Order
                            </h3>

                            {/* Selected Products Summary */}
                            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>Selected Products:</h4>
                                {Array.from(selectedProducts.entries()).map(([productId, quantity]) => {
                                    const product = products.find(p => p.id === productId);
                                    return product ? (
                                        <div key={productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                            <span>{product.name} x {quantity}</span>
                                            <span>${(product.rate * quantity).toFixed(2)}</span>
                                        </div>
                                    ) : null;
                                })}
                                <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 'bold' }}>
                                    Total: ${getSelectedProductsTotal().toFixed(2)}
                                </div>
                            </div>

                            {/* Customer Information Form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={styles.label}>Customer Name *</label>
                                    <input
                                        type="text"
                                        value={orderCustomer.name}
                                        onChange={(e) => setOrderCustomer({ ...orderCustomer, name: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus
                                        }}
                                        placeholder="Enter customer name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Customer Phone *</label>
                                    <input
                                        type="tel"
                                        value={orderCustomer.phone}
                                        onChange={(e) => setOrderCustomer({ ...orderCustomer, phone: e.target.value })}
                                        style={{
                                            ...styles.input,
                                            ':focus': styles.inputFocus
                                        }}
                                        placeholder="Enter customer phone"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button
                                    onClick={handleCreateOrder}
                                    disabled={creatingOrder}
                                    style={{
                                        ...styles.submitButton,
                                        backgroundColor: '#10b981',
                                        ':hover': {
                                            ...styles.submitButtonHover,
                                            backgroundColor: '#059669'
                                        },
                                        ':disabled': {
                                            backgroundColor: '#93c5bd',
                                            cursor: 'not-allowed'
                                        }
                                    }}
                                >
                                    {creatingOrder ? 'Creating...' : 'Confirm Order'}
                                </button>
                                <button
                                    onClick={resetOrderForm}
                                    disabled={creatingOrder}
                                    style={{
                                        ...styles.cancelButton,
                                        ':hover': styles.cancelButtonHover,
                                        ':disabled': {
                                            backgroundColor: '#93c5bd',
                                            cursor: 'not-allowed'
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products List */}
                {products.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                        No products found. Create your first product!
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {['Select', 'Code', 'Name', 'Description', 'Rate', 'Image', 'Quantity', 'Actions'].map((header) => (
                                        <th key={header} style={styles.tableHeader}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} style={styles.tableRow}>
                                        {/* Table cells with inline styles */}
                                        <td style={styles.tableCell}>
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.has(product.id)}
                                                onChange={(e) => handleProductSelect(product.id, e.target.checked)}
                                                style={{ width: '1rem', height: '1rem', color: '#3b82f6' }}
                                            />
                                        </td>
                                        <td style={styles.tableCell}>{product.code}</td>
                                        <td style={styles.tableCell}>{product.name}</td>
                                        <td style={styles.tableCell}>{product.description || 'N/A'}</td>
                                        <td style={styles.tableCell}>${parseFloat(product.rate).toFixed(2)}</td>
                                        <td style={styles.tableCell}>
                                            {product.image ? (
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover', borderRadius: '0.25rem' }} 
                                                />
                                            ) : (
                                                'No image'
                                            )}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {selectedProducts.has(product.id) ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={selectedProducts.get(product.id) || 1}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    style={{
                                                        width: '5rem',
                                                        padding: '0.25rem',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '0.25rem',
                                                        textAlign: 'center'
                                                    }}
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td style={styles.tableCell}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{
                                                    ...styles.actionButton,
                                                    ':hover': styles.actionButtonHover
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDeleteProduct(product)}
                                                style={{
                                                    ...styles.deleteButton,
                                                    ':hover': styles.deleteButtonHover
                                                }}
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

            {/* Confirmation Dialog for Delete */}
            {productToDelete && (
                <ConfirmationDialog
                    isOpen={!!productToDelete}
                    onClose={cancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the product "${productToDelete.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}
        </div>
    );
}
