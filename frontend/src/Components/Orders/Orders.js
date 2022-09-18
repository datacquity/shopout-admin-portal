import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DownloadCSV from "../UI/DownloadCSV";
import "./Orders.css";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/user/order/orders/all");
			const data = await res.json();
			setOrders(data.orders);
		};
		fetchData();
	}, []);

	const filterEvents = () => {
		const filteredOrders =
			!startDate || !endDate
				? orders
				: orders.filter((order) => {
						const date = new Date(order.date);
						return date <= endDate && date >= startDate;
				  });
		console.log(filteredOrders);
		setFiltered(filteredOrders);
	};

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
									<tr key={i}>
										<td>{`${order.user.firstName} ${order.user.lastName}`}</td>
										<td>{order.email}</td>
										<td>{order.date.toString().slice(0, 10)}</td>
										<td>{order.address}</td>
										<td>{order.amount}</td>
										<td>{order.status}</td>
									</tr>
								);
						  })
						: orders.map((order, i) => (
								<tr key={i}>
									<td>{`${order.user.firstName} ${order.user.lastName}`}</td>
									<td>{order.email}</td>
									<td>{order.date.toString().slice(0, 10)}</td>
									<td>{order.address}</td>
									<td>{order.amount}</td>
									<td>{order.status}</td>
								</tr>
						  ))}
				</tbody>
				{/* <DownloadCSV /> */}
			</div>
		</div>
	);
};

export default Orders;