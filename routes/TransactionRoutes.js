const express = require("express");
const {
  AllTransaction,
  FetchAllData,
} = require("../controller/TransactionController");
const Pagination = require("../Middleware/Pagination");
const router = express.Router();

router.get("/AllTrasnaction", Pagination, AllTransaction);
router.get("/GetAllData", FetchAllData);
module.exports = router;
