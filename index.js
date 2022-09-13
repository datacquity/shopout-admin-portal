require("dotenv").config({ path: "ENV_FILENAME" });

// PACKAGE IMPORTS
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// ROUTE IMPORTS
const userRoute = require("./routes/user/user-route");
const storeRoute = require("./routes/store/store-route");
const supportRoute = require("./routes/user/application/features/support/support");
const rtcVideo = require("./routes/rtc-video/rtc-video");
const apiRoute = require("./apis");
const businessRoute = require("./routes/business/business-route");
const adminRoute = require("./routes/admin/admin-route");
// const reportRoute = require('./routes/store/report.js')
const notificationScript = require("./utils/notification-scheduler");
const {
	dispatchSingleNotification,
} = require("./utils/notification-dispatcher");
const reportScript = require("./utils/Report/report");

// Security and HTTP headers
app.use(helmet());

app.use(cors());
// Compress request and response
app.use(compression());

// PARSING PROTOCOLS
// should use express instead of bodyParser as bodyParser is now depracated.
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
// NoSQL injection sanitization
app.use(mongoSanitize());

// XSS sanitizing
app.use(xss());

// ROUTER VAR
app.use("/user", userRoute);
app.use("/store", storeRoute);
app.use("/rtc-video", rtcVideo);
app.use("/external", apiRoute);
app.use("/business", businessRoute);
app.use("/support", supportRoute);
app.use("/admin", adminRoute);

// ----------------- deloyment -----------------------

__dirname = path.resolve();

let node_env = "production";

if (node_env === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
	});
}

// ----------------- deloyment -----------------------

// app.use('/admin',reportRoute);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//cors to access port 5000 from your local
// const cors = require("cors");

// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

// app.use(
//   cors({
//     origin: "http://127.0.0.1:5500",
//     methods: ["GET","POST"],
//     credentials : true,
//     // allowedHeaders : 'Content-Type',
//   })
// )

// app.use(
//   cors({
//     origin: ["http://127.0.0.1:5500/EventForm.html" , "http://127.0.0.1:5500/EventForm.html"],
//     credentials: true,
//     allowedHeaders : 'Content-Type'
//   })
// );

const { DB_PRODUCTION } = process.env;
const PORT = process.env.PORT * 1 || 5000;

mongoose.connect(
	DB_PRODUCTION,
	{
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err) => {
		if (err) console.error(`Error!${err}`);
		else console.log("Database connection successful");
	},
);

notificationScript();

//dummy notification
app.post("/dummyNot", (req, res) => {
	const { token, title, body, bookingId, archive, type } = req.body;
	dispatchSingleNotification(token, title, body, {
		booking: bookingId,
		archived: archive,
		type: type,
	});
	res.status(200).json({ sent: true });
});

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});

//  reportScript();
