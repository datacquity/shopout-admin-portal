import React, { useEffect, useState } from "react";
import "./Booking.css";
import DatePicker from "react-datepicker";

const Booking = () => {
	const [data, setData] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	// console.log(startDate);
	// console.log(endDate);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await fetch("/admin/bookings/get")
			.then((res) => res.json())
			.then((response) => {
				console.log(response);
				console.log(response.demobookings);
				setData(response.bookings);
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
					var date = new Date(a.start);
					return date >= startDate && date <= endDate;
			  });
	console.log(filtered);

	return (
		<>
			<div className="Bookings">
				<h1>Bookings Report</h1>
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

			<div className="booking-table">
				<tbody>
					<tr>
						<th>Business Name</th>
						<th>Event Date & Time</th>
						<th>Number of attendees</th>
						<th>Event Status</th>
					</tr>

					{filtered.map((item, i) => {
						return (
							<tr key={i}>
								<td>{item.store.business.name}</td>
								<td>{convert_date(item.start)}</td>
								<td>{item.visitors}</td>
								<td>{item.status}</td>
							</tr>
						);
					})}

					{/* {data.map((item, i) => (
            <tr key={i}>
              <td>{item.store.business.name}</td>
              <td>{convert_date(item.start)}</td>
              <td>{item.visitors}</td>
              <td>{item.status}</td>
            </tr>
          ))} */}
				</tbody>
			</div>
		</>
	);
};

export default Booking;
