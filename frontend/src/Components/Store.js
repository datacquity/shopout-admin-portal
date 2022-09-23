import React, { useState, useEffect } from "react";
// import classes from "./Store.module.css";
import "./Store.css";
import { Form } from "react-bootstrap";
import { TimePickerComponent } from "@syncfusion/ej2-react-calendars";

function Store() {
	const [storeName, setStoreName] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessList, setBusinessList] = useState();
	const [city, setCity] = useState("");
	const [citiesList, setCitiesList] = useState();
	const [email, setEmail] = useState("");
	const [description, setDescription] = useState("");
	const [businessId, setBusinessId] = useState("");
	const [tags, setTags] = useState("");
	const [phoneNo, setPhoneNo] = useState("");
	const [password, setPassword] = useState("shopout@123");
	const [virtuallyAvailable, setIsVirtuallyAvailable] = useState(false);
	const [physicallyAvailable, setIsPhysicallyAvailable] = useState(false);
	const [capacity, setCapacity] = useState();
	const [address, setAddress] = useState("");
	const [longitude, setLongitude] = useState();
	const [latitude, setLatitude] = useState();
	const [monday, setMonday] = useState(false);
	const [tuesday, setTuesday] = useState(false);
	const [wednesday, setWednesday] = useState(false);
	const [thursday, setThursday] = useState(false);
	const [friday, setFriday] = useState(false);
	const [saturday, setSaturday] = useState(false);
	const [sunday, setSunday] = useState(false);
	const [isFashion, setIsFashion] = useState(false);
	const [days, setDays] = useState([]);

	const [start, setStart] = useState(new Date());
	const [end, setEnd] = useState(new Date());

	const [value, setValue] = useState(new Date());
	const [value1, setValue1] = useState("09:00 AM");
	const [value2, setValue2] = useState("05:00 PM");

	const newDate = new Date();

	var newDay = new Date(
		newDate.getFullYear(),
		newDate.getMonth(),
		newDate.getDate(),
		newDate.getHours(),
		newDate.getMinutes(),
	);
	newDay = newDay.toString().trim().substring(0, 24);
	// console.log(newDay);

	useEffect(() => {
		async function fetchData() {
			try {
				const business = await fetch("/business/getBusiness/all")
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						const businessLength = data.business.length;
						const businesses = data.business;
						var businessList1 =
							businessLength > 0 &&
							businesses.map((business, index) => {
								return (
									<option key={index} value={business.name}>
										{business.display_name}
										{/* :- {business._id}{" "} */}
									</option>
								);
							});
						setBusinessList(businessList1);
					});
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		const cities = [
			{ id: "mumbai", name: "Mumbai" },
			{ id: "pune", name: "Pune" },
			{ id: "bangalore", name: "Bangalore" },
			{ id: "delhi", name: "Delhi" },
			{ id: "hyderabad", name: "Hyderabad" },
		];

		let citiesList1 = cities.map((city, i) => {
			return (
				<option key={i} value={city.id}>
					{city.name}
				</option>
			);
		}, this);
		setCitiesList(citiesList1);
	}, []);

	async function submitHandler(e) {
		e.preventDefault();
		
		console.log(isFashion)

		const startMain = start.toString().substring(16, 21);
		const endMain = end.toString().substring(16, 21);

		if (
			monday &&
			tuesday &&
			wednesday &&
			thursday &&
			friday &&
			saturday &&
			sunday
		) {
			const days1 = [1, 2, 3, 4, 5, 6, 7];
			setDays(days1);
		} else if (
			monday &&
			tuesday &&
			wednesday &&
			thursday &&
			friday &&
			saturday
		) {
			const days1 = [1, 2, 3, 4, 5, 6];
			setDays(days1);
		} else {
			alert("Atleast 6 working days should be selected.");
			return;
		}

		const start0 = startMain.substring(0, 2);

		const start1 = startMain.substring(3, 5);

		const end0 = endMain.substring(0, 2);

		const end1 = endMain.substring(3, 5);

		const start2 = parseInt(start0);

		const start3 = parseInt(start1);

		const end2 = parseInt(end0);

		const end3 = parseInt(end1);


		if (end2 == start2) {
			if (end3 == start3) {
				alert("Start and End time Cannot be a same.");
				return;
			} else if (end3 < start3) {
				alert("Start time cannot be greater than End time.");
				return;
			}
		} else if (end2 < start2) {
			alert("Start time cannot be greater than End time.");
			return;
		} else if (phoneNo.length !== 10) {
			alert("Please enter valid Phone Number.");
			return;
		}

		try {
			const res = await fetch("/store/create/store", {
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					storeData: {
						business: businessName,
						working_days: days,
						name: storeName,
						phone: phoneNo,
						email: email,
						physical_enabled: physicallyAvailable,
						virtual_enabled: virtuallyAvailable,
						capacity: capacity,
						location_desc: address,
						long: longitude,
						lat: latitude,
						city: city,
						start: startMain,
						end: endMain,
						password: password,
						startTime: newDay,
						isFashion
					},
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					if (data) {
						// console.log(data.store.name);
						alert(`Saved a store.`);
					}
				});
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className="Store">
			<h1>Create a Store</h1>
			<div className="content">
				<form action="submit">
					<label htmlFor="business">Business Name</label>
					<select
						name="business"
						id="business"
						onChange={(e) => {
							console.log(e.target.value);
							setBusinessName(e.target.value);
						}}
					>
						<option value="" defaultChecked disabled>
							Choose One
						</option>
						{businessList}
					</select>
					<label htmlFor="storeName">Store Name</label>
					<input
						type="text"
						name="storeName"
						id="storeName"
						placeholder="Title Name"
						onChange={(e) => {
							setStoreName(e.target.value);
						}}
						required 
					/>
					<label htmlFor="fashion">Is Fashion</label>
					<input
						type="checkbox"
						name="fashion"
						id="fashion"
						checked={isFashion}
						onChange={(e) => {
						setIsFashion(!isFashion)
						}}
						required
					/>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						name="email"
						id="email"
						placeholder="example@gmail.com"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						required
					/>
					<label htmlFor="phoneNo">Phone Number</label>
					<input
						type="text"
						name="phoneNo"
						id="phoneNo"
						placeholder="8314567895"
						onChange={(e) => {
							setPhoneNo(e.target.value);
						}}
						required
					/>
					<label htmlFor="password">Password</label>
					<input
						type="text"
						name="password"
						id="password"
						placeholder="shopout@123"
						value={password}
						contentEditable="false"
						onChange={(e) => {
							// setPass(e.target.value);
						}}
						required
					/>
					<label htmlFor="description">Description</label>
					<textarea
						cols="30"
						rows="30"
						type="text"
						name="description"
						id="description"
						placeholder="Describe the business."
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						required
					></textarea>
					{/* <label htmlFor="businessId">Business ID (Object ID) (Optional)</label>
          <input
            type="text"
            name="businessId"
            id="businessId"
            placeholder="For e.g. "
            onChange={(e) => {
                setBusinessId(e.target.value);
            }}
          />
          <label htmlFor="tags">Tags (Comma Seperated) (Optional)</label>
          <input
            type="text"
            name="tags"
            id="tags"
            placeholder="For e.g. clothes , fashion , fashion style , men fashion , women fashion"
            onChange={(e) => {
                setTags(e.target.value);
            }}
          /> */}
					{/* <label htmlFor="brands">Brands (Comma Seperated)</label>
          <input
            type="text"
            name="brands"
            id="brands"
            placeholder="For e.g. YWC , Nike , H&M , Adidas , Zara"
            required
            onChange={(e) => {
                // setBrands(e.target.value);
            }}
          /> */}
					<div className="hasCallNow">
						<label htmlFor="physical">
							Is your Store Physically Available?
						</label>
						<Form>
							{["radio"].map((type) => (
								<div key={`inline-${type}`} className="mb">
									<Form.Check
										className="form"
										inline
										value={true}
										label="Yes"
										name="group1"
										type={type}
										id={`inline-${type}-1`}
										onChange={(e) => {
											console.log(e.target.value);
											setIsPhysicallyAvailable(e.target.value);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="No"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setIsPhysicallyAvailable(e.target.value);
										}}
									/>
								</div>
							))}
						</Form>
						<label htmlFor="physical">Is your Store Virtually Available?</label>
						<Form>
							{["radio"].map((type) => (
								<div key={`inline-${type}`} className="mb">
									<Form.Check
										className="form"
										inline
										value={true}
										label="Yes"
										name="group1"
										type={type}
										id={`inline-${type}-1`}
										onChange={(e) => {
											console.log(e.target.value);
											setIsVirtuallyAvailable(e.target.value);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="No"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setIsVirtuallyAvailable(e.target.value);
										}}
									/>
								</div>
							))}
						</Form>
					</div>
					<label htmlFor="capacity">Capacity</label>
					<input
						type="text"
						name="capacity"
						id="capacity"
						placeholder="For e.g. 1000"
						required
						onChange={(e) => {
							setCapacity(e.target.value);
						}}
					/>
					<label htmlFor="address">Address</label>
					<input
						type="text"
						name="address"
						id="address"
						placeholder="Enter the address of your store."
						required
						onChange={(e) => {
							setAddress(e.target.value);
						}}
					/>
					<label htmlFor="locationCoordinates">Location Co-Ordinates</label>
					<label htmlFor="longitude">Longitude</label>
					<input
						type="text"
						name="longitude"
						id="longitude"
						required
						onChange={(e) => {
							setLongitude(e.target.value);
						}}
					/>
					<label htmlFor="latitude">Latitude</label>
					<input
						type="text"
						name="latitude"
						id="latitiude"
						required
						onChange={(e) => {
							setLatitude(e.target.value);
						}}
					/>
					<label htmlFor="city">City</label>
					<select
						name="city"
						id="city"
						onChange={(e) => {
							console.log(e.target.value);
							setCity(e.target.value);
						}}
					>
						{citiesList}
					</select>
					<label htmlFor="rating">Average Rating</label>
					<input
						type="text"
						name="rating"
						id="rating"
						onChange={(e) => {
							// setDisplayName(e.target.value);
						}}
					/>
					<label htmlFor="working_days">Working Days</label>
					<div className="hasCallNow">
						<Form>
							{["checkbox"].map((type) => (
								<div key={`inline-${type}`} className="mb">
									<Form.Check
										className="form"
										inline
										value={false}
										label="Monday"
										name="group1"
										type={type}
										id={`inline-${type}-1`}
										onChange={(e) => {
											console.log(e.target.value);
											setMonday((prev) => !prev);
											setDays([]);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="Tuesday"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setTuesday((prev) => !prev);
											setDays([]);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="Wednesday"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setWednesday((prev) => !prev);
											setDays([]);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="Thursday"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setThursday((prev) => !prev);
											setDays([]);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="Friday"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setFriday((prev) => !prev);
											setDays([]);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="Saturday"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setSaturday((prev) => !prev);
											setDays([]);
										}}
									/>
									<Form.Check
										className="form"
										inline
										value={false}
										label="Sunday"
										name="group1"
										type={type}
										id={`inline-${type}-2`}
										onChange={(e) => {
											console.log(e.target.value);
											setSunday((prev) => !prev);
											setDays([]);
										}}
									/>
								</div>
							))}
						</Form>
					</div>
					<label htmlFor="active_hours">Active Hours</label>
					<label htmlFor="start">Start</label>
					{/* <input
            type="time"
            step="1800"
            onChange={(e) => {
              // console.log(e.target.value);
              setStart(e.target.value);
            }}
          /> */}
					<TimePickerComponent
						placeholder="Select Start Timing"
						id="time"
						value={value1}
						onChange={(date) => {
							setStart(date.target.value);
						}}
					/>
					<label htmlFor="end">End</label>
					{/* <input
            type="time"
            onChange={(e) => {
              // console.log(e.target.value);
              setEnd(e.target.value);
            }}
          /> */}
					<TimePickerComponent
						placeholder="Select End Timing"
						id="time"
						value={value2}
						onChange={(date) => {
							setEnd(date.target.value);
						}}
					/>
					<button className="blueButton" onClick={submitHandler}>
						Next
					</button>
				</form>
			</div>
		</div>
	);
}

export default Store;
