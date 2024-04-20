const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Port = process.env.PORT || 3000;
//Body Parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//routes
const TransactionRoute = require("./routes/TransactionRoutes");

//Db connection
require("./config/MongoDb");

// Health check Api
app.get("/health", (req, res) => {
  res.json({
    message: "Server is Running Fine from Roxiler Transaction",
    status: "Active",
    time: new Date(),
  });
});

app.use("/api/v1/GetTransactionData", TransactionRoute);
// Listening on port
app.listen(Port, () => {
  console.log("Port is active on ", Port);
});
