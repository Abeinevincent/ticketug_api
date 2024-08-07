const Ticket = require("../models/Ticket");
const express = require("express");
const TicketBand = require("../models/TicketBand");
const router = express.Router();

// get all tickets
router.get("/find/all", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    return res.status(200).json(tickets);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/findbycode/:code", async (req, res) => {
  const { code } = req.params;
  // const code = req.params.code
  try {
    const ticket = await Ticket.findOne({
      ticket_code: code,
    });
    // console.log(ticket);

    const ticketband = await TicketBand.findOne({
      ticket_code: code,
    });
    // console.log(ticketband);

    if (ticket || ticketband) {
      return res.status(200).json(ticket ? ticket : ticketband);
    } else {
      return res.status(404).json("Ticket not found!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.put("/updatebycode/:code", async (req, res) => {
  try {
    const code = req.params.code;

    const tickett = await Ticket.findOne({
      ticket_code: code,
    });

    // const ticketbandd = await TicketBand.findOne({
    //   ticket_code: code,
    // });

    if (!tickett) {
      console.log("no ticket/ticket band found!");
      return res.status(404).json("No ticket found");
    } else if (tickett) {
      const ticket = await Ticket.findOneAndUpdate(
        {
          ticket_code: req.params.code,
          status: "New",
        },
        {
          $set: { status: "Used" },
        },
        { new: true }
      );

      return res.status(200).json({ message: "Updated successflly", ticket });
    }
    // else if (ticketbandd) {
    //   console.log("ticket band status", ticketbandd.status);

    //   // if its New, set it to used
    //   const ticket = await TicketBand.findOneAndUpdate(
    //     {
    //       status: { $in: ["new", "used"] },
    //       ticket_code: code,
    //     },
    //     {
    //       $set: { status: "Used" },
    //     },
    //     { new: true }
    //   );
    //   console.log("status is New!", ticket?.status);

    //   return res.status(200).json({ message: "Updated successflly", ticket });
    // }
  } catch (err) {
    console.log(err, "internal error");
    return res.status(500).json(err);
  }
});

module.exports = router;
