// // Import mongoose ORM
// const mongoose = require("mongoose");

// // Create ticket model
// const TicketModel = new mongoose.Schema(
//   {
//     ticket_code: {
//       type: String,
//       required: true,
//       unique: true,
//       max: 43,
//       min: 41,
//     },

//     backup_code: {
//       type: String,
//       max: 7,
//       min: 5,
//     },

//     status: {
//       type: String,
//       enum: ["Used", "New"],
//       default: "New",
//     },

//     ticket_class: {
//       type: String,
//       enum: ["VIP", "ORDINARY", "TABLE"],
//     },
//   },
//   { timestamps: true }
// );

// // Export this model for import in the routes that will need to use it
// module.exports = mongoose.model("Ticket", TicketModel);
// models/Ticket.js
const mongoose = require("mongoose");

// Create ticket schema (not model yet)
const TicketSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Used", "New"],
      default: "New",
    },
    ticket_class: {
      type: String,
      enum: ["VIP", "ORDINARY", "TABLE"],
    },
  },
  { timestamps: true }
);

// Create models for both databases
const mainDB = mongoose.connection; // Your current database
const newTicketsDB = mongoose.connection.useDb('new_new_tickets'); // Second database

const Ticket = mainDB.model("Ticket", TicketSchema);
const TicketNewDB = newTicketsDB.model("Ticket", TicketSchema);

module.exports = {
  Ticket,
  TicketNewDB,
  TicketSchema // Export schema in case you need it elsewhere
};
