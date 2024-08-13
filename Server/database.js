const express = require("express");
const app = express();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
const port = 5000;
const url =
  "mongodb://mongoadmin:mongoadmin@localhost:27017/share_&_hub?authSource=admin";
const router = require("./workspace/routes/userRoutes");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require('path')

mongoose
  .connect(url)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("somethin went wrong " + err));
server.listen(port, () => {
  console.log(`Server is runnign on port ${port}`);
});

app.use(bodyparser.json());
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", router);
const donationForm = require('./workspace/routes/DonationRoute')
app.use('/api',donationForm)
