import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaProductHunt, FaDollarSign, FaBoxes, FaBarcode } from "react-icons/fa"; // Import icons
import './EditProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [productId, setProductId] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://nec-server-ten.vercel.app/api/products/${id}`);
                if (response.data.Status) {
                    const product = response.data.Result;
                    setName(product.name);
                    setPrice(product.price);
                    setStock(product.stock);
                    setProductId(product.product_id);
                    setPreview(product.image_url); // Assuming your API provides an image URL
                } else {
                    setMessage(`Error: ${response.data.Error}`);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setMessage('Error fetching product. Please try again.');
            }
        };
        fetchProduct();
    }, [id]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Show a preview of the newly selected image
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('product_id', productId);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put(`https://nec-server-ten.vercel.app/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.Status) {
                setMessage('Product updated successfully!');
                navigate('/Component/Branch1/ProductList/ProductList'); // Navigate to the ProductList component
            } else {
                setMessage(`Error: ${response.data.Error}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setMessage('Error updating product. Please try again.');
        }
    };

    return (
        <div className="product-form-overlay">
            <div id="product-form-container">
            <h1 id="product-form-heading">Edit Product</h1>
                {/* <div className="product-form-content"> */}
                <div className="form-row">
                    {/* <div className="form-inputs"> */}
                        {/* <h1 id="product-form-heading">Edit Product</h1> */}
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="product-name">
                                        <FaProductHunt /> Product Name
                                    </label>
                                    <input
                                        type="text"
                                        id="product-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="product-price">
                                        <FaDollarSign /> Price
                                    </label>
                                    <input
                                        type="number"
                                        id="product-price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="product-stock">
                                        <FaBoxes /> Stock
                                    </label>
                                    <input
                                        type="number"
                                        id="product-stock"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="product-id">
                                        <FaBarcode /> Product ID
                                    </label>
                                    <input
                                        type="text"
                                        id="product-id"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" id="product-form-submit-button">
                                Update Product
                            </button>
                        </form>
                    {/* </div> */}
                </div>
                {message && (
                    <p
                        id="product-form-message"
                        className={
                            message.includes("Error") ? "error-message" : "success-message"
                        }
                    >
                        {message}
                    </p>
                )}
            </div>
     </div>
    );
};

export default EditProduct;
