require("dotenv").config({ path: "ENV_FILENAME" });
const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const { DB_TEST_DATA } = process.env;
		await mongoose.connect(
			DB_TEST_DATA,
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
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
