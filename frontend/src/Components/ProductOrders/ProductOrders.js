import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DownloadCSV from "../UI/DownloadCSV";
import { parse } from "json2csv";

const ProductOrders = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [csv, setCSV] = useState("");

  const grandTotal = 0;
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/user/order/single/${params.id}`);
      const data = await res.json();
      const finalProducts = data.products.map((product, index) => {
        const {
          cgst,
          sgst,
          price,
          quantity,
          name,
          discount,
          deliveryCharge,
          _id,
        } = product.product;
        const totalPrice = quantity * price;
        const discountedPrice = totalPrice - (discount / 100) * totalPrice;
        const finalPriceWithDelivery =
          discountedPrice + parseInt(deliveryCharge);
        const finalPrice =
          finalPriceWithDelivery +
          ((cgst + sgst) / 100) * finalPriceWithDelivery;

        return {
          id: _id,
          srNo: index + 1,
          cgst,
          sgst,
          name,
          quantity,
          discount: discount[0],
          deliveryCharge: deliveryCharge[0],
          price: price[0],
          total: finalPrice,
        };
      });
      setProducts(finalProducts);
      console.log(finalProducts);
      return products;
    };
    fetchData();
  }, []);

  const convertToCSV = () => {
    try {
      const customisedProducts = products.map((product) => {
        const {
          quantity,
          price,
          discount,
          cgst,
          sgst,
          deliveryCharge,
          name,
          srNo,
          total,
        } = product;
        return {
          srNo,
          name,
          price,
          quantity,
          discount,
          deliveryCharge,
          sgst,
          cgst,
          total,
        };
      });
      const columnNames = Object.keys(customisedProducts[0]);
      const opts = { fields: columnNames };
      const csv = parse(customisedProducts, opts);
      setCSV(csv);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Product Orders</h1>
      <DownloadCSV />
      <div className="event-table">
        <tbody>
          <tr>
            <th>Sr No.</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Delivery</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>Total</th>
          </tr>

          {products.map((product, i) => {
            const {
              quantity,
              price,
              discount,
              cgst,
              sgst,
              deliveryCharge,
              name,
              id,
              srNo,
              total,
            } = product;

            return (
              <tr key={id}>
                <td>{`${srNo}`}</td>
                <td>{name}</td>
                <td>{quantity}</td>
                <td>{price}</td>
                <td>{discount}</td>
                <td>{deliveryCharge}</td>
                <td>{cgst}</td>
                <td>{sgst}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
        <DownloadCSV
          convertToCSV={convertToCSV}
          csv={csv}
          details={{ eventName: "ProductOrdersReport" }}
        />
      </div>
    </>
  );
};

export default ProductOrders;
