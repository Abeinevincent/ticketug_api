// const Ticket = require("../models/Ticket");
// const express = require("express");
// const TicketBand = require("../models/TicketBand");
// const router = express.Router();

// // get all tickets
// router.get("/find/all", async (req, res) => {
//   try {
//     const tickets = await Ticket.find();
//     const ticket_bands = await TicketBand.find();

//     return res.status(200).json([...ticket_bands]);
//     // return res.status(200).json(tickets);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// });

// router.get("/findbycode/:code", async (req, res) => {
//   const { code } = req.params;
//   try {
//     const ticket = await Ticket.findOne({
//       ticket_code: code,
//     });

//     const ticketband = await TicketBand.findOne({
//       ticket_code: code,
//     });

//     if (ticket) {
//       return res.status(200).json(ticket);
//     } else if (ticketband) {
//       return res.status(200).json(ticketband);
//     } else {
//       return res.status(404).json("Ticket not found!");
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// });

// router.put("/updatebycode/:code", async (req, res) => {
//   try {
//     const code = req.params.code;

//     const tickett = await Ticket.findOne({
//       ticket_code: code,
//     });

//     const ticketbandd = await TicketBand.findOne({
//       ticket_code: code,
//     });

//     if (!tickett && !ticketbandd) {
//       console.log("no ticket/ticket band found!");
//       return res.status(404).json("No ticket/ticket band found");
//     } else if (tickett) {
//       const ticket = await Ticket.findOneAndUpdate(
//         {
//           ticket_code: req.params.code,
//           status: "New",
//         },
//         {
//           $set: { status: "Used" },
//         },
//         { new: true }
//       );

//       return res.status(200).json({ message: "Updated successflly", ticket });
//     } else if (ticketbandd) {
//       console.log("ticket band status", ticketbandd.status);

//       if (ticketbandd.status === "New") {
//         // set it to scanned 1
//         const ticket_band = await TicketBand.findOneAndUpdate(
//           {
//             // status: { $in: ["new", "used"] },
//             ticket_code: code,
//           },
//           {
//             $set: { status: "Scanned1" },
//           },
//           { new: true }
//         );
//         console.log("status is New!", ticket_band?.status);

//         return res
//           .status(200)
//           .json({ message: "Updated successflly", ticket_band });
//       } else if (ticketbandd.status === "Scanned1") {
//         // set it to scanned 2
//         const ticket_band = await TicketBand.findOneAndUpdate(
//           {
//             // status: { $in: ["new", "used"] },
//             ticket_code: code,
//           },
//           {
//             $set: { status: "Scanned2" },
//           },
//           { new: true }
//         );
//         console.log("status is New!", ticket_band?.status);

//         return res
//           .status(200)
//           .json({ message: "Updated successflly", ticket_band });
//       } else if (ticketbandd.status === "Scanned2") {
//         // set it to used
//         const ticket_band = await TicketBand.findOneAndUpdate(
//           {
//             // status: { $in: ["new", "used"] },
//             ticket_code: code,
//           },
//           {
//             $set: { status: "Used" },
//           },
//           { new: true }
//         );
//         console.log("status is New!", ticket_band?.status);

//         return res
//           .status(200)
//           .json({ message: "Updated successflly", ticket_band });
//       } else if (ticketbandd.status === "Used") {
//         // return error
//         return res
//           .status(400)
//           .json({ message: "Ticket already used", ststus: 400 });
//       }
//       // if its New, set it to used
//     }
//   } catch (err) {
//     console.log(err, "internal error");
//     return res.status(500).json(err);
//   }
// });

// module.exports = router;

const { Ticket, TicketNewDB } = require("../models/Ticket"); // Updated import
const express = require("express");
const TicketBand = require("../models/TicketBand");
const router = express.Router();

// Get all tickets from both databases
router.get("/find/all", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const ticketsNewDB = await TicketNewDB.find(); // From second database
    const ticket_bands = await TicketBand.find();
    
    // Combine all tickets with source information
    const allTickets = [
      ...tickets.map(ticket => ({ ...ticket.toObject(), source: 'main_db' })),
      ...ticketsNewDB.map(ticket => ({ ...ticket.toObject(), source: 'new_new_tickets' })),
      ...ticket_bands.map(band => ({ ...band.toObject(), source: 'main_db', type: 'band' }))
    ];
    
    return res.status(200).json(allTickets);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Find ticket by code in both databases
router.get("/findbycode/:code", async (req, res) => {
  const { code } = req.params;
  try {
    // Search in both databases simultaneously
    const [ticket, ticketNewDB, ticketband] = await Promise.all([
      Ticket.findOne({ ticket_code: code }),
      TicketNewDB.findOne({ ticket_code: code }),
      TicketBand.findOne({ ticket_code: code })
    ]);

    if (ticket) {
      return res.status(200).json({ ...ticket.toObject(), source: 'main_db' });
    } else if (ticketNewDB) {
      return res.status(200).json({ ...ticketNewDB.toObject(), source: 'new_new_tickets' });
    } else if (ticketband) {
      return res.status(200).json({ ...ticketband.toObject(), source: 'main_db', type: 'band' });
    } else {
      return res.status(404).json("Ticket not found!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Update ticket by code in both databases
router.put("/updatebycode/:code", async (req, res) => {
  try {
    const code = req.params.code;
    
    // Check in both databases
    const [tickett, tickettNewDB, ticketbandd] = await Promise.all([
      Ticket.findOne({ ticket_code: code }),
      TicketNewDB.findOne({ ticket_code: code }),
      TicketBand.findOne({ ticket_code: code })
    ]);

    if (!tickett && !tickettNewDB && !ticketbandd) {
      console.log("no ticket/ticket band found!");
      return res.status(404).json("No ticket/ticket band found");
    }

    // Handle main database ticket
    if (tickett) {
      const ticket = await Ticket.findOneAndUpdate(
        {
          ticket_code: code,
          status: "New",
        },
        {
          $set: { status: "Used" },
        },
        { new: true }
      );
      return res.status(200).json({ 
        message: "Updated successfully", 
        ticket,
        source: 'main_db' 
      });
    }

    // Handle new database ticket
    if (tickettNewDB) {
      const ticket = await TicketNewDB.findOneAndUpdate(
        {
          ticket_code: code,
          status: "New",
        },
        {
          $set: { status: "Used" },
        },
        { new: true }
      );
      return res.status(200).json({ 
        message: "Updated successfully", 
        ticket,
        source: 'new_new_tickets' 
      });
    }

    // Handle ticket band (existing logic)
    if (ticketbandd) {
      console.log("ticket band status", ticketbandd.status);
      
      if (ticketbandd.status === "New") {
        const ticket_band = await TicketBand.findOneAndUpdate(
          { ticket_code: code },
          { $set: { status: "Scanned1" } },
          { new: true }
        );
        console.log("status is New!", ticket_band?.status);
        return res.status(200).json({ 
          message: "Updated successfully", 
          ticket_band,
          source: 'main_db' 
        });
      } else if (ticketbandd.status === "Scanned1") {
        const ticket_band = await TicketBand.findOneAndUpdate(
          { ticket_code: code },
          { $set: { status: "Scanned2" } },
          { new: true }
        );
        console.log("status is Scanned1!", ticket_band?.status);
        return res.status(200).json({ 
          message: "Updated successfully", 
          ticket_band,
          source: 'main_db' 
        });
      } else if (ticketbandd.status === "Scanned2") {
        const ticket_band = await TicketBand.findOneAndUpdate(
          { ticket_code: code },
          { $set: { status: "Used" } },
          { new: true }
        );
        console.log("status is Scanned2!", ticket_band?.status);
        return res.status(200).json({ 
          message: "Updated successfully", 
          ticket_band,
          source: 'main_db' 
        });
      } else if (ticketbandd.status === "Used") {
        return res.status(400).json({ 
          message: "Ticket already used", 
          status: 400 
        });
      }
    }
  } catch (err) {
    console.log(err, "internal error");
    return res.status(500).json(err);
  }
});

module.exports = router;
