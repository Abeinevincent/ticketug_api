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

    const ticketbandd = await TicketBand.findOne({
      ticket_code: code,
    });

    if (!tickett && !ticketbandd) {
      console.log("no ticket/ticket band found!");
      return res.status(404).json("No ticket found");
    } else if (tickett) {
      console.log("ticket");
      const ticket = await Ticket.findOneAndUpdate(
        {
          status: "New",
          ticket_code: req.params.code,
        },
        {
          $set: { status: "Used" },
        },
        { new: true }
      );

      res.status(200).json({ message: "Updated successflly", ticket });
    } else if (ticketbandd) {
      console.log("there is ticketband!");
      if (ticketbandd.status === "New") {
        // if its New, set it to used
        const ticket = await TicketBand.findOneAndUpdate(
          {
            status: "New",
            ticket_code: req.params.code,
          },
          {
            $set: { status: "Used" },
          },
          { new: true }
        );
        res.status(200).json({ message: "Updated successflly", ticket });
      } else if (ticketbandd.status === "Used") {
        // if its Used, set it to expired
        const ticket = await TicketBand.findOneAndUpdate(
          {
            status: "Used",
            ticket_code: req.params.code,
          },
          {
            $set: { status: "Expired" },
          },
          { new: true }
        );
        res.status(200).json({ message: "Updated successflly", ticket });
      } else if (ticketbandd.status === "Expired") {
        return res.status(401).json("Ticket expired!");
      } else {
        return res.status(400).json("Ticket status available not supported!");
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
