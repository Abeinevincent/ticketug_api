const { generateTicket } = require("./utils/generateTicket");

const express = require("express");
const fs = require("fs");
// Import all dependencies and dev-dependencies
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const ticketRoute = require("./routes/ticket");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected to the backend successfully");
  })
  .catch((err) => console.log(err));

// Endpoint to generate and save the ticket
// app.get("/generate-ticket", async (req, res) => {

const genTicketAtInterval = async () => {
  try {
    // Generate the ticket image
    const ticketImage = await generateTicket();

    // Save the ticket image to the public folder
    fs.writeFileSync(`./public/ticket${new Date().getTime()}.png`, ticketImage);

    console.log("Ticket generated successfully!");
  } catch (error) {
    console.error("Error generating ticket:", error);
    // res.status(500).send("Internal Server Error");
  }
};
// });
// setInterval(() => {
//   genTicketAtInterval();
// }, 1500);

// Serve static files from the public folder
app.use(express.static("public"));

app.use("/tickets/", ticketRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
