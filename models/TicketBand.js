// Import mongoose ORM
const mongoose = require("mongoose");

// Create ticket model
const TicketBandModel = new mongoose.Schema(
  {
    ticket_code: {
      type: String,
      required: true,
      unique: true,
      max: 43,
      min: 41,
    },

    status: {
      type: String,
      enum: ["Used", "New", "Scanned1", "Scanned2"],
      default: "New",
    },
  },
  { timestamps: true }
);

// Export this model for import in the routes that will need to use it
module.exports = mongoose.model("TicketBand", TicketBandModel);
