const express = require("express");
const { AllTransaction } = require("../controller/TransactionController");
const Pagination = require("../Middleware/Pagination");
const router = express.Router();

router.get("/AllTrasnaction", Pagination, AllTransaction);
module.exports = router;
