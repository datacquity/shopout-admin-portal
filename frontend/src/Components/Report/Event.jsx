import React, { useEffect, useState } from "react";
import "./Event.css";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
// import { Button, Container, Table } from "react-bootstrap";

const Event = () => {
	const [data, setData] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	const navigate = useNavigate();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await fetch("/user/demoBooking/get/all-demo-booking")
			.then((res) => res.json())
			.then((response) => {
				setData(response.demoBookings);
			});
	};

	function convert_date(s) {
		var newdate = new Date(Date.parse(s));
		return newdate.toLocaleString();
	}

	const filterEvents = () => {
		const filtered =
			!startDate || !endDate
				? data
				: data.filter((event) => {
						const date = new Date(event.demoDate);
						return date <= endDate && date >= startDate;
				  });

		setFiltered(filtered);
	};

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
				<button onClick={filterEvents}>Filter</button>
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

					{filtered.length
						? filtered.map((item, i) => {
								return (
									<tr key={i} onClick={() => handleEventClick(item._id)}>
										<td>{item.business}</td>
										<td>{item.demoName}</td>
										<td>{convert_date(item.demoDate)}</td>
										<td>{item.customers.length}</td>
										<td>Upcoming</td>
									</tr>
								);
						  })
						: data.map((item, i) => (
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