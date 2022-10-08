import React, { useEffect, useState } from "react";
import "./Product.css";

const Product = () => {
	const [eventList, setEventList] = useState();
	const [eventName, setEventName] = useState("");
	const [productName, setProductName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [quantity, setQuantity] = useState();
	const [variants, setVariants] = useState([]);
	const [beforePrice, setBeforePrice] = useState([]);
	const [afterPrice, setAfterPrice] = useState([]);
	// const [discount, setDiscount] = useState([]);
	const [deliveryCharge, setDeliveryCharge] = useState([]);
	const [sgst, setSgst] = useState();
	const [cgst, setCgst] = useState();
	const [isFashion, setIsFashion] = useState(false)

	const discount = [];

	for (let i = 0; i < beforePrice.length; i++) {
		let value = ((1 - afterPrice[i] / beforePrice[i]) * 100).toFixed(2);
		discount.push(value);
	}
	// console.log(discount);

	const total = [];
	const payTotal = [];
	const discount1 = [];
	const tax = [];
	for (let i = 0; i < beforePrice.length; i++) {
		const beforeDiscountPrice = beforePrice[i];
		const discountAmount =
			(((beforeDiscountPrice * 0.01 * discount[i]).toFixed(2) / 10) * 10).toFixed(2);
		const discountedPrice = (beforeDiscountPrice - discountAmount);
		const taxAmount = (discountedPrice * 0.01 * sgst).toFixed(2);
		const finalAmount =
			(((discountedPrice + 2 * taxAmount + deliveryCharge[i]) / 100).toFixed(2) *
			10).toFixed(2);

		tax.push((2 * taxAmount).toFixed(2));
		total.push(discountedPrice.toFixed(2));
		discount1.push(discountAmount);
		payTotal.push(finalAmount);
	}

	function convert_date(s) {
		var newdate = new Date(Date.parse(s));

		return newdate.toLocaleString();
	}

	useEffect(() => {
		async function fetchData() {
			try {
				const event = await fetch("/user/demoBooking/get/all-demo-booking")
					.then((res) => res.json())
					.then((data) => {
						const eventLength = data.demoBookings.length;
						const events = data.demoBookings;
						var eventList1 =
							eventLength > 0 &&
							events.map((event, index) => {
								return (
									<option key={index} value={event._id}>
										{event.demoName}
										:- {convert_date(event.demoDate)}
									</option>
								);
							});
						setEventList(eventList1);
					});
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);

	const toDataURL = (blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});

	async function imageToBase64(e) {
		if (e.target.files[0]) {
			const resTitle = (await toDataURL(e.target.files[0]))
				.replace("data:", "")
				.replace(/^.+,/, "");
			setImage(resTitle);
		}
	}

	async function submitHandler(e) {
		e.preventDefault();

		const product = await fetch("/user/product/create", {
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			method: "Post",
			body: JSON.stringify({
				productData: {
					event: eventName,
					price: beforePrice,
					// name: productName,
					// desc: description,
					image,
					quantity,
					variants,
					discount,
					deliveryCharge,
					sgst,
					cgst,
					isFashion
				},
			}),
		})
			.then((res) => {
				
				if (res.status === 413) {
					alert("Display image size should be less than 70kbs.");
				} else if (res.status === 400) {
					alert("Please add data according to the variants");
				} else if (res.status === 200) {
					alert("New Product is Created.");
				} else if (res.status === 500) {
					alert("Please refresh the page an select the event carefully.");
				}
				return res.json();
			})
			.then((data) => {
				if (data) {
					alert(`Saved a new product`);
				}
			});
	}

	return (
		<div className="Product">
			<h1>Create a Product</h1>

			<div className="content">
				<form action="submit" onSubmit={submitHandler}>
					<label htmlFor="event">Event Name-Date</label>
					<select
						name="event"
						id="event"
						onChange={(e) => {
							setEventName(e.target.value);
						}}
						required
					>
						<option value="">Choose One</option>
						{eventList}
					</select>
					<label htmlFor="fashion">Is Beauty</label>
					<input
						type="checkbox"
						name="fashion"
						id="fashion"
						checked={isFashion}
						onChange={(e) => {
						setIsFashion(!isFashion)
						}}
					/>


					<label htmlFor="Image">Image</label>
					<input
						type="file"
						name="Image"
						id="Image"
						onChange={(e) => {
							console.log(e.target.files[0]);
							setImage([]);
							imageToBase64(e);
						}}
						/>

					<label htmlFor="quantity">Quantity</label>
					<input
						type="number"
						name="quantity"
						id="quantity"
						placeholder="For e.g. 1000"
						required
						onChange={(e) => {
							setQuantity(e.target.value);
						}}
					/>

					<label htmlFor="variants">Variants</label>
					<input
						type="text"
						name="variants"
						id="variants"
						placeholder="For e.g. clothes , fashion , fashion style"
						onChange={(e) => {
							var variantsArray = e.target.value.split(",");
							setVariants(variantsArray);
						}}
						required
					/>

					<label htmlFor="bprice">Price Before Discount</label>
					<input
						type="text"
						name="bprice"
						id="bprice"
						placeholder="For e.g. 50000 , 60000 , 90000"
						onChange={(e) => {
							var beforepriceArray = e.target.value.split(",");
							setBeforePrice(beforepriceArray);
						}}
						required
					/>

					<label htmlFor="aprice">Price After Discount</label>
					<input
						type="text"
						name="aprice"
						id="aprice"
						placeholder="For e.g. 50000 , 60000 , 90000"
						onChange={(e) => {
							var afterpriceArray = e.target.value.split(",");
							setAfterPrice(afterpriceArray);
						}}
						required
					/>

					<label htmlFor="deliverycharge">Delivery Charge</label>
					<input
						type="text"
						name="deliverycharge"
						id="deliverycharge"
						placeholder="For e.g. 10, 12, 20"
						required
						onChange={(e) => {
							var deliverChargeArray = e.target.value.split(",");
							setDeliveryCharge(deliverChargeArray);
						}}
						// onChange={(e) => { setDeliveryCharge(e.target.value); }}
						/>

					<label htmlFor="sgst">SGST</label>
					<input
						type="number"
						name="sgst"
						id="sgst"
						placeholder="For e.g. 12"
						required
						onChange={(e) => {
							setSgst(e.target.value);
						}}
					/>

					<label htmlFor="cgst">CGST</label>
					<input
						type="number"
						name="cgst"
						id="cgst"
						placeholder="For e.g. 12"
						required
						onChange={(e) => {
							setCgst(e.target.value);
						}}
					/>

					<label htmlFor="discount">Discount</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="discount"
						id="discount"
						value={discount}
						contentEditable="false"
						readOnly
						// onChange={(e) => {
							//   var discountArray = e.target.value.split(",");
							//   setDiscount(discountArray);
							// }}
							required
							/>

					<label htmlFor="actualprice">Actual Price</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="actualprice"
						id="actualprice"
						value={beforePrice}
						contentEditable="false"
						readOnly
						required
						/>

					<label htmlFor="discountprice">Discount Price</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="discountprice"
						id="discountprice"
						value={discount1}
						contentEditable="false"
						readOnly
						required
						/>

					<label htmlFor="totalpricewithouttax">Total Price without Tax</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="totalpricewithouttax"
						id="totalpricewithouttax"
						value={total}
						contentEditable="false"
						readOnly
						required
						/>

					<label htmlFor="totaltax">Total Tax</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="totaltax"
						id="totaltax"
						value={tax}
						contentEditable="false"
						readOnly
						required
						/>

					<label htmlFor="deliverycharge">Delivery Charge</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="deliverycharge"
						id="deliverycharge"
						value={deliveryCharge}
						contentEditable="false"
						readOnly
						required
					/>

					<label htmlFor="paytotalprice">Final Price of Product with Tax</label>
					<input
						className="onlyreadable_data"
						type="text"
						name="paytotalprice"
						id="paytotalprice"
						value={payTotal}
						contentEditable="false"
						readOnly
						required
						/>

					<button className="blueButton">
						Next
					</button>
				</form>
			</div>
		</div>
	);
};

export default Product;

{/* <label htmlFor="productName">Product Name</label>
<input
type="text"
name="productName"
id="productName"
placeholder="Product Name"
onChange={(e) => { setProductName(e.target.value); }}
required
/>

<label htmlFor="description">Description</label>
<textarea
cols="30"
rows="30"
type="text"
name="description"
id="description"
placeholder="Describe the Product."
onChange={(e) => { setDescription(e.target.value); }}
required
></textarea> */}