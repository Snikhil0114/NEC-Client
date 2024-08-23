import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaProductHunt, FaDollarSign, FaBoxes, FaBarcode } from "react-icons/fa"; // Import icons
import "./AddProduct.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: name,
      price: price,
      stock: stock,
      product_id: productId,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.Status) {
        setMessage("Product added successfully!");
        setName("");
        setPrice("");
        setStock("");
        setProductId("");
        navigate("/Component/Branch1/ProductList/ProductList"); // Navigate to the ProductList component
      } else {
        setMessage(`Error: ${response.data.Error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product. Please try again.");
    }
  };

  return (
    <div className="product-form-overlay">
      <div id="product-form-container">
        <h1 id="product-form-heading">Add New Product</h1>
        <div className="form-row">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="product-name">
                <FaProductHunt /> Product Name
              </label>
              <input
                type="text"
                id="product-name"
                placeholder="Enter Name"
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
            Add Product
          </button>
        </form>
      </div>
      {message && (
        <p
          id="product-form-message"
          className={message.includes("Error") ? "error-message" : "success-message"}
        >
          {message}
        </p>
      )}
    </div>
    </div>
  );
};

export default AddProduct;
