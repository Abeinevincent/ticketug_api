// Import mongoose ORM
const mongoose = require("mongoose");

// Create ticket model
const TicketModel = new mongoose.Schema(
  {
    ticket_code: {
      type: String,
      required: true,
      unique: true,
      max: 43,
      min: 41,
    },

    backup_code: {
      type: String,
      max: 7,
      min: 5,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Used", "New"],
      default: "New",
    },

    ticket_class: {
      type: String,
      enum: ["VIP", "ORDINARY"],
    },
  },
  { timestamps: true }
);

// Export this model for import in the routes that will need to use it
module.exports = mongoose.model("Ticket", TicketModel);
