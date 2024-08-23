import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./SaleDetails.css";
import kolo from "../../../assets/logo1.png";

const SaleDetails = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [customerEyeDetails, setCustomerEyeDetails] = useState({
    left_eye_addition: "",
    right_eye_addition: "",
  });
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/wala/shala/sale-details/${id}`
        );
        console.log("API Response:", response.data);

        const saleData = response.data;

        if (typeof saleData.product_details === "string") {
          saleData.products = JSON.parse(saleData.product_details);
        } else {
          saleData.products = saleData.product_details;
        }

        setSale(saleData);

        const customerResponse = await axios.get(
          `http://localhost:3000/shala/customers/${saleData.customer_id}`
        );
        setCustomerDetails({
          name: customerResponse.data.name,
          phone: customerResponse.data.phone,
          address: customerResponse.data.address,
        });

        setCustomerEyeDetails({
          left_eye_dv_spherical: customerResponse.data.left_eye_dv_spherical,
          left_eye_dv_cylindrical:
            customerResponse.data.left_eye_dv_cylindrical,
          left_eye_dv_axis: customerResponse.data.left_eye_dv_axis,
          left_eye_dv_vn: customerResponse.data.left_eye_dv_vn,
          left_eye_nv_spherical: customerResponse.data.left_eye_nv_spherical,
          left_eye_nv_cylindrical:
            customerResponse.data.left_eye_nv_cylindrical,
          left_eye_nv_axis: customerResponse.data.left_eye_nv_axis,
          left_eye_nv_vn: customerResponse.data.left_eye_nv_vn,
          right_eye_dv_spherical: customerResponse.data.right_eye_dv_spherical,
          right_eye_dv_cylindrical:
            customerResponse.data.right_eye_dv_cylindrical,
          right_eye_dv_axis: customerResponse.data.right_eye_dv_axis,
          right_eye_dv_vn: customerResponse.data.right_eye_dv_vn,
          right_eye_nv_spherical: customerResponse.data.right_eye_nv_spherical,
          right_eye_nv_cylindrical:
            customerResponse.data.right_eye_nv_cylindrical,
          right_eye_nv_axis: customerResponse.data.right_eye_nv_axis,
          right_eye_nv_vn: customerResponse.data.right_eye_nv_vn,

          left_eye_addition: customerResponse.data.left_eye_addition,
          right_eye_addition: customerResponse.data.right_eye_addition,
        });
      } catch (error) {
        console.error(
          "Error fetching sale details or customer details:",
          error
        );
      }
    };

    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  if (!sale) {
    return <div>Loading...</div>;
  }

  const finalTotal = sale.products.reduce((total, product) => {
    const productTotal = product.product_price * product.quantity;
    return total + productTotal;
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sale-details-container">
      <div className="bor">
        <header className="invoice-header">
          <div className="logo1">
            <img src={kolo} className="kolo" alt="Add Logo" />
          </div>
          <div className="company-details">
            <h2>New Eye Care</h2>
            <p>9922177297</p>
            <p className="slogan">"Your Vision, Our Mission"</p>{" "}
            {/* Slogan added */}
          </div>
          <div className="gst-number">
            <p>GSTIN:123456 </p>
          </div>
        </header>

        <hr />

        <div className="customer-info">
          <div className="customer-row">
            <p>
              <strong>Name:</strong> {customerDetails.name}
            </p>
            <p>
              <strong>Receipt Date:</strong>{" "}
              {new Date(sale.created_at).toLocaleDateString()}
              {/* <strong>Receipt No:</strong> {sale.sale_id} */}
            </p>
          </div>

          <div className="customer-row1">
            <p>
              <strong>Mobile No:</strong> {customerDetails.phone}
            </p>
            <p>
              <strong>Delivery Date:</strong>{" "}
              {new Date(sale.delivery_date).toLocaleDateString()}
            </p>
          </div>

          <div className="customer-row2">
            <p>
              <strong>Address:</strong> {customerDetails.address}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(sale.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="products-section">
          <table className="products-table">
            <thead>
              <tr>
                <th>Sn.</th>
                <th>Particulars</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Dis.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.products.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.product_name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.product_price}</td>
                  <td>{sale.order_discount}</td>
                  <td>
                    {(product.product_price * product.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr />

        {/* Payment and Other Details */}
        <div className="payment-details">
          <div className="left">
            <p>
              <strong>Payment Mode:</strong> {sale.payment_method}
            </p>
            <p>
              <strong>Referred By:</strong> {sale.referred_by}
            </p>
            <p>
              <strong>PD:</strong> {sale.pd}
            </p>
          </div>
          <div className="center">
            <p>
              <strong>Booked By:</strong> {sale.booked_by}
            </p>
          </div>
          <div className="right">
            <p>
              <strong>Total Amount:</strong> {finalTotal.toFixed(2)}
            </p>
            <p>
              <strong>Paid Amount:</strong> {sale.paid.toFixed(2)}
            </p>
            <p>
              <strong>Balance Amount:</strong>{" "}
              {(finalTotal - sale.paid).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="eye-details-container">
          <table className="eye-details-table">
            <caption>Right Eye</caption>
            <thead>
              <tr>
              <td></td>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DV</td>
                <td>{customerEyeDetails.right_eye_dv_spherical}</td>
                <td>{customerEyeDetails.right_eye_dv_cylindrical}</td>
                <td>{customerEyeDetails.right_eye_dv_axis}</td>
              </tr>
              <tr>
                <td>NV</td>
                <td>{customerEyeDetails.right_eye_nv_spherical}</td>
                <td>{customerEyeDetails.right_eye_nv_cylindrical}</td>
                <td>{customerEyeDetails.right_eye_nv_axis}</td>
              </tr>
              <tr>
              
                <td>Add</td>
                <td colSpan="3" className="add">
                  {customerEyeDetails.right_eye_addition}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="eye-details-table">
            <caption>Left Eye</caption>
            <thead>
              <tr>
                
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              
                <td>{customerEyeDetails.left_eye_dv_spherical}</td>
                <td>{customerEyeDetails.left_eye_dv_cylindrical}</td>
                <td>{customerEyeDetails.left_eye_dv_axis}</td>
              </tr>
              <tr>
            
                <td>{customerEyeDetails.left_eye_nv_spherical}</td>
                <td>{customerEyeDetails.left_eye_nv_cylindrical}</td>
                <td>{customerEyeDetails.left_eye_nv_axis}</td>
              </tr>
              <tr>
                
                <td>Add</td>
                <td colSpan="2" className="add">
                  {customerEyeDetails.left_eye_addition}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="invoice-footer">
          <div className="terms-and-conditions">
            <p>
              <strong>Terms and Conditions:</strong>
            </p>
            {/* Add any specific terms here */}
            <p className="Sign">New Eye Care</p>{" "}
            {/* Signature above the thank you note */}
          </div>
        </footer>
        {/* Technopulse info */}
      </div>
      <p className="Thankyounote">
        Thank you for choosing us for your eye care needs!
      </p>
      <p className="Technopulse">Technopulse Software| Contact- 8669048580 </p>
      <button className="print-button" onClick={handlePrint}>Print</button>
    </div>
  );
};

export default SaleDetails;