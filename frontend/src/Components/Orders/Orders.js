import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DownloadCSV from "../UI/DownloadCSV";
import { parse } from "json2csv";
import {useNavigate} from 'react-router-dom'
import OrderRow from './OrderRow/OrderRow'
import "./Orders.css";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [csv, setCSV] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/user/order/orders/all");
			const data = await res.json();
			setOrders(data.orders);
			console.log(data.orders)
		};
		fetchData();
	}, []);

	const filterEvents = () => {
		const filteredOrders = !startDate || !endDate ? orders : orders.filter((order) => {
						const date = new Date(order.date);
						return date <= endDate && date >= startDate;
				  });
		setFiltered(filteredOrders);
	};

	const convertToCSV = () => {
		try {
			const customisedOrders = orders.map(order => {
				const {paymentId, amount, email, status, user: {firstName, lastName, phone}, date, address} = order;
				return {firstName, lastName, email, phone, paymentId, date, address, amount, status}
			})
			const columnNames = Object.keys(customisedOrders[0]);
			const opts = { fields: columnNames };
			const csv = parse(customisedOrders, opts);
			setCSV(csv);
		} catch (error) {
			console.log(error);
		}
	};

	const goToProductOrders = (orderID) => {
		navigate(`/product-orders/${orderID}`)
	}

	return (
		<div className="orders">
			<div className="order-filter">
				<label htmlFor="date">From</label>
				<DatePicker
					// showTimeSelect
					className="datepicker"
					selected={startDate}
					onChange={(date) => setStartDate(date)}
					dateFormat="MMMM d, yyyy"
				/>

				<label htmlFor="date">To</label>
				<DatePicker
					// showTimeSelect
					className="datepicker"
					selected={endDate}
					onChange={(date) => setEndDate(date)}
					dateFormat="MMMM d, yyyy"
				/>
				<button onClick={filterEvents}>Filter</button>
			</div>
			<div className="event-table">
				<tbody>
					<tr>
						<th>UserName</th>
						<th>Email</th>
						<th>Order Date</th>
						<th>Address</th>
						<th>Amount</th>
						<th>Status</th>
					</tr>

					{filtered.length
						? filtered.map((order, i) => {
								return (
									<OrderRow goToProductOrders={goToProductOrders} order={order}/>
								);
						  })
						: orders.map((order, i) => (
							<OrderRow goToProductOrders={goToProductOrders} order={order}/>
						  ))}
				</tbody>
				<DownloadCSV convertToCSV={convertToCSV} csv={csv} details={{eventName: "Orders"}}/>
			</div>
		</div>
	);
};

export default Orders;
