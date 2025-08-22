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
const Ticket = require("./models/Ticket");

const app = express();
const PORT = 4000;

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
    // res.status(500).json("Internal Server Error");
  }
};
// });
// setInterval(() => {
//   genTicketAtInterval();
// }, 1200);

// Serve static files from the public folder

app.use(express.static("public"));

app.use("/tickets/", ticketRoute);

app.post("/update-status", async (req, res) => {
  try {
    // Update all documents where status is 'used' to 'new'
    const result = await Ticket.updateMany(
      { status: "Used" },
      { $set: { status: "New" } }
    );
    console.log("Documents updated:", result.nModified);
  } catch (error) {
    console.error("Error updating documents:", error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
