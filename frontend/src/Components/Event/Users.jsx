import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parse } from "json2csv";
import "./Users.css";

const EventUsers = () => {
	const [eventDetails, setEventDetails] = useState({
		customers: [],
		eventName: "",
	});
	const [loading, setLoading] = useState(true);
	const [csv, setCSV] = useState("");

	const {
		state: { id },
	} = useLocation();

	useEffect(() => {
		fetch(`/user/demoBooking/get/single-demo/${id}`)
			.then((res) => res.json())
			.then((data) => {
				const customers = data.demobooking.customers.map((customer) => {
					return { ...customer.user };
				});
				setEventDetails({ customers, eventName: data.demobooking.demoName });
				setLoading(false);
			})
			.catch((e) => {
				console.log(e);
				setLoading(false);
			});
	}, []);

	const convertToCSV = () => {
		console.log(eventDetails);
		const columnNames = Object.keys(eventDetails.customers[0]);
		const opts = { fields: columnNames };
		console.log(opts);
		try {
			const csv = parse(eventDetails.customers, opts);
			console.log(csv);
			setCSV(csv);
		} catch (error) {
			console.log(error);
		}
	};

	const { customers } = eventDetails;

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div className="userTableContainer">
			<h2>
				{customers.length
					? `Users who attended the event ${eventDetails.eventName}!`
					: "No Users Found!"}
			</h2>
			{customers.length ? (
				<tbody>
					<tr>
						<th>Sr. No.</th>
						<th>User Name</th>
						<th>Phone Number</th>
					</tr>
					{customers.map((customer, i) => {
						return (
							<tr key={i}>
								<td>{i + 1}. </td>
								<td>{customer.firstName + " " + customer.lastName}</td>
								<td>{customer.phone} </td>
							</tr>
						);
					})}
					<a
						href={`data:text/csv;charset=utf-8,${csv}`}
						className="csv-download-btn"
						onClick={convertToCSV}
						download={`${eventDetails.eventName}.csv`}
					>
						Download CSV
					</a>
				</tbody>
			) : (
				""
			)}
		</div>
	);
};

export default EventUsers;
