import React, { useEffect, useState } from "react";
import "./Event.css";
import DatePicker from "react-datepicker";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Event = () => {
	const [data, setData] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	const navigate = useNavigate();

	console.log(startDate);
	console.log(endDate);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await fetch("/user/demoBooking/get/all-demo-booking")
			.then((res) => res.json())
			.then((response) => {
				console.log(response);
				console.log(response.demoBookings);
				setData(response.demoBookings);
			});
	};

	function convert_date(s) {
		var newdate = new Date(Date.parse(s));

		return newdate.toLocaleString();
	}

	const filtered =
		!startDate || !endDate
			? data
			: data.filter((a) => {
					var date = new Date(a.demoDate);
					return date >= startDate && date <= endDate;
			  });
	console.log(filtered);

	// var resultProductData = data.filter(a => {
	//   var date = new Date(a.demoDate);
	//   return (date >= startDate && date <= endDate);
	// });
	// console.log(resultProductData)

	const handleEventClick = (id) => {
		navigate("/users", { state: { id } });
	};

	return (
		<>
			<div className="Events">
				<h1>Events Report</h1>
				<div className="content">
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
				</div>
			</div>

			<div className="event-table">
				<tbody>
					<tr>
						<th>Business Name</th>
						<th>Event Name</th>
						<th>Event Date & Time</th>
						<th>Number of attendees</th>
						<th>Event Status</th>
					</tr>

					{/* {filtered.map((item, i) => {
						return (
							<tr key={i}>
								<td>{item.business}</td>
								<td>{item.demoName}</td>
								<td>{convert_date(item.demoDate)}</td>
								<td>{item.customers.length}</td>
								<td>Upcoming</td>
							</tr>
						);
					})} */}

					{data.map((item, i) => (
						<tr key={i} onClick={() => handleEventClick(item._id)}>
							<td>{item.business}</td>
							<td>{item.demoName}</td>
							<td>{convert_date(item.demoDate)}</td>
							<td>{item.customers.length}</td>
							<td>Upcoming</td>
						</tr>
					))}
				</tbody>
			</div>
		</>
	);
};

export default Event;
