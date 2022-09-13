/* eslint-disable vars-on-top */
const fs = require("fs");
const json2xls = require("json2xls");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const Orders = require("../../models/operations/order-schema");
const Payment = require("../../models/operations/payment-schema");
const archiveDemoBookings = require("../../models/operations/archive-demo-booking-schema");
const users = require("../../models/entities/user-schema");
const demoBookings = require("../../models/operations/demo-booking-schema");
const Users = require("../../models/entities/user-schema");
const Booking = require("../../models/operations/booking-schema");
const Product = require("../../models/entities/product-schema");
const Store = require("../../models/entities/store-schema");
const Business = require("../../models/entities/business-schema");

async function sendMail() {
	const gt = new Date();
	gt.setHours(0, 0, 0, 0);
	const lt = gt.getTime() + 24 * 60 * 60 * 1000;
	console.log(new Date(gt), new Date(lt));
	const payments = await Payment.find({
		payment_date: { $gte: new Date(gt), $lte: new Date(lt) },
	});
	const orders = await Promise.all(
		payments.map((payment) =>
			Orders.findOne({ paymentId: payment.razorpay_payment_id }).then(),
		),
	);
	console.log(orders);
	const combined = [];
	const combined3 = [];
	for (let i = 0; i < payments.length; i++) {
		console.log(payments[i]);
		combined[i] = {};
	}
	for (let i = 0; i < payments.length; i++) {
		const order = orders[i];
		const payment = payments[i];
		if (order != null) {
			combined[i].paymentId = order.paymentId;
			combined[i].status = order.status;
			combined[i].product = order.product;
			combined[i].user = order.user;
			const user = await users.findOne({ _id: order.user });
			const userName = `${user.firstName} ${user.lastName}`;
			combined[i].userName = userName;
			combined[i].quantity = order.quantity;
			combined[i].address = order.address;
			combined[i].variant = order.variant;
			combined[i].amount = order.amount;
			var date = new Date(order.date).toLocaleString(undefined, {
				timeZone: "Asia/Kolkata",
			});
			combined[i].date = date;
			combined[i].email = order.email;
		}
		const event = await archiveDemoBookings.findOne({
			_id: payment.event_id,
		});
		combined[i].eventName = " ";
		if (event != null) {
			const eventName = event.demoName;
			combined[i].eventName = eventName;
		}
		if (payment != null) {
			combined[i].razorpay_signature = payment.razorpay_signature;
			combined[i].razorpay_order_id = payment.razorpay_order_id;
			combined[i].razorpay_payment_id = payment.razorpay_payment_id;
			combined[i].shopout_transaction_id = payment.shopout_transaction_id;
			combined[i].user_id = payment.user_id;
			combined[i].event_id = payment.event_id;
			var date = new Date(payment.payment_date).toLocaleString(undefined, {
				timeZone: "Asia/Kolkata",
			});
			combined[i].payment_date = date;
		}
	}

	var xls = json2xls(combined);
	fs.writeFileSync(
		`${__dirname}/reports/Payment_Report.xlsx`,
		xls,
		"binary",
		(err) => {
			if (err) {
				console.log(err);
			}
		},
	);
	// res.status(201).sendFile("Report/report.xlsx",{ root: __dirname });

	const combined2 = {};
	const events = await demoBookings.find();
	const eventNames = await events.map(
		(event) => `${event.demoName} ${new Date(event.demoDate).toDateString()}`,
	);

	const final = await Promise.all(
		events.map(async (event) => {
			const users = event.customers.map((element) => element.user);
			const userIds = await Promise.all(
				users.map((user) => Users.findById(user)),
			);
			const Names = userIds.map((user) => `${user.firstName} ${user.lastName}`);
			return Names;
		}),
	);
	for (let i = 0; i < eventNames.length; i++) {
		combined2[`${eventNames[i]}`] = final[i];
	}
	// for (var i = 0; i < eventNames.length; i++) {
	//   combined2.push(eventNames[i]);
	//   combined2.push("Users : {" + final[i] + "}");
	// }
	console.log(combined2);
	var xls = json2xls(combined2);
	fs.writeFileSync(
		`${__dirname}/reports/Registered_Users.xlsx`,
		xls,
		"binary",
		(err) => {
			if (err) {
				console.log(err);
			}
		},
	);

	const bookings = await Booking.find({ start: { $gt: gt, $lt: lt } })
		.populate({
			path: "store",
			select: "name phone business",
			populate: {
				path: "business",
				select: "name",
			},
		})
		.populate("user", "firstName lastName phone");

	for (let i = 0; i < bookings.length; i++) {
		combined3[i] = {};
		const booking = bookings[i];
		if (booking != null) {
			combined3[
				i
			].userName = `${booking.user.firstName} ${booking.user.lastName}`;
			combined3[i].userPhone = booking.user.phone;
			combined3[i].storeName = booking.store.name;
			combined3[i].storePhone = booking.store.phone;
			combined3[i].businessName = booking.store.business.name;
			const startTime = new Date(booking.start).toTimeString(undefined, {
				timeZone: "Asia/Kolkata",
			});
			const endTime = new Date(booking.end).toTimeString(undefined, {
				timeZone: "Asia/Kolkata",
			});
			combined3[i].startTime = startTime;
			combined3[i].endTime = endTime;
		}
	}
	var xls = json2xls(combined3);
	fs.writeFileSync(
		`${__dirname}/reports/Admin_Booking.xlsx`,
		xls,
		"binary",
		(err) => {
			if (err) {
				console.log(err);
			}
		},
	);

	const mailOptions = {
		from: "support@shopout.co.in",
		to: ["amey.bhattad72@gmail.com", "yogesh@shopout.co.in"],
		subject: `Reports for ${new Date(gt).toDateString()}`,
		text: "Reports are attached to mail!",
		attachments: [
			{
				filename: "Payment_Report.xlsx",
				content: fs.createReadStream(
					"utils/Report/reports/Payment_Report.xlsx",
				),
			},
			{
				filename: "Registered_Users.xlsx",
				content: fs.createReadStream(
					"utils/Report/reports/Registered_Users.xlsx",
				),
			},
			{
				filename: "Admin_Booking.xlsx",
				content: fs.createReadStream("utils/Report/reports/Admin_Booking.xlsx"),
			},
		],
	};
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "support@shopout.co.in",
			pass: "znvvfhehseoezplb",
		},
	});

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log(`Email sent : ${info.response}`);
		}
	});
}

const reportScript = () => {
	schedule.scheduleJob("25 18 * * *", () => {
		console.log("Scheduler called!");
		sendMail();
	});
};

module.exports = reportScript;
