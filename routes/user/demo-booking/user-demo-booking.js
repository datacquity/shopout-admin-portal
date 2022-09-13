const router = require("express").Router();

const actions = require("./actions");
const fetch = require("./fetch");
const fetchDemo = require("./fetch-demo-booking");
const fetchDemoById = require("./fetch-single-demo-booking");

router.use("/fetch", fetch);
router.use("/actions", actions);
router.use("/get", fetchDemo);
router.use("/get", fetchDemoById);

module.exports = router;
