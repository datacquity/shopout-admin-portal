import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { parse } from "json2csv";
import DownloadCSV from "../UI/DownloadCSV";

const OrdersByDate = () => {
  const [orders, setOrders] = useState([]);
  const [curDate, setCurDate] = useState(new Date());
  const [csv, setCSV] = useState("");

  const getOrdersByDate = async () => {
    const res = await fetch("/user/order/orders/date", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        date: curDate,
      }),
    });
    const data = await res.json();
    console.log(data.orders);
    setOrders(data.orders);
  };

  const convertToCSV = () => {
    try {
      orders.sort(
        (order1, order2) => order2.product.length - order1.product.length
      );
      console.log(orders);
      const customisedOrders = orders.map((order) => {
        let { amount, status, date, address, product, email } = order;
        const { phone, firstName, lastName } = order.user;

        let obj = {};
        product.forEach((prod, idx) => {
          obj[`Quantity${idx + 1}`] = prod.quantity;
          obj[
            `Product${idx + 1}`
          ] = `${prod.product.name}(${prod.product.variants[0]})`;
        });

        address = address.replaceAll("\n", " ");
        return {
          name: (firstName && firstName) + (lastName && lastName),
          email,
          phone,
          address,
          date,
          amount,
          status,
          ...obj,
        };
      });
      const columnNames = Object.keys(customisedOrders[0]);
      const opts = { fields: columnNames };
      const csv = parse(customisedOrders, opts);
      setCSV(csv);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="Events">
        <h1>Events Report</h1>
        <div className="content">
          <label htmlFor="date">Select Date</label>
          <DatePicker
            className="datepicker"
            selected={curDate}
            onChange={(date) => setCurDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
        <button onClick={getOrdersByDate}>Get Orders</button>
      </div>

      <div className="event-table">
        <tbody>
          <tr>
            <th>Phone</th>
            <th>Date</th>
            <th>Address</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>

          {orders.map((order) => {
            return (
              <tr key={order._id}>
                <td>{order.user.phone}</td>
                <td>{order.date.toString().slice(0, 10)}</td>
                <td>{order.address}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
              </tr>
            );
          })}
        </tbody>
      </div>
      <DownloadCSV
        convertToCSV={convertToCSV}
        csv={csv}
        details={{ eventName: "Orders" }}
      />
    </>
  );
};

export default OrdersByDate;
