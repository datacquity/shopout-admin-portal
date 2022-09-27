import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parse } from "json2csv";
import DownloadCSV from "../UI/DownloadCSV";
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
		const fetchData = async () => {
			try {
				const res = await fetch(`/user/demoBooking/get/single-demo/${id}`)
				const data = await res.json();
				
				const customers = data.demobooking.customers.map((customer) => {
					const {firstName, lastName, phone} = customer.user;
					return { firstName, lastName, phone};
				});
				setEventDetails({ customers, eventName: data.demobooking.demoName });
				setLoading(false);
				console.log(customers)
			}catch (error) {
				console.log(error);
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const convertToCSV = () => {
		const columnNames = Object.keys(eventDetails.customers[0]);
		// columnNames.unshift()
		const opts = { fields: columnNames };
		console.log(opts);
		try {
			const csv = parse(eventDetails.customers, opts);
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
						const {phone, firstName, lastName} = customer;
						
						let name = "No name found!";
						if(firstName && lastName){
							name = `${firstName} ${lastName}`;
						}else if(firstName && !lastName){
							name = firstName;
						}else if(!firstName && lastName){
							name = lastName;
						}

						return (
							<tr key={i}>
								<td>{i + 1}. </td>
								<td>{name}</td>
								<td>{phone ? phone : "Number not found!"} </td>
							</tr>
						);
					})}
					<DownloadCSV
						convertToCSV={convertToCSV}
						csv={csv}
						details={eventDetails}
					/>
				</tbody>
			) : (
				""
			)}
		</div>
	);
};

export default EventUsers;
