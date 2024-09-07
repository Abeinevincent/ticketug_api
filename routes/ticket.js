const Ticket = require("../models/Ticket");
const express = require("express");
const TicketBand = require("../models/TicketBand");
const router = express.Router();

// get all tickets
router.get("/find/all", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const ticket_bands = await TicketBand.find();

    return res.status(200).json([...ticket_bands, ...tickets]);
    // return res.status(200).json(tickets);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/findbycode/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const ticket = await Ticket.findOne({
      ticket_code: code,
    });

    const ticketband = await TicketBand.findOne({
      ticket_code: code,
    });

    if (ticket) {
      return res.status(200).json(ticket);
    } else if (ticketband) {
      return res.status(200).json(ticketband);
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
      return res.status(404).json("No ticket/ticket band found");
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
    } else if (ticketbandd) {
      console.log("ticket band status", ticketbandd.status);

      if (ticketbandd.status === "New") {
        // set it to scanned 1
        const ticket_band = await TicketBand.findOneAndUpdate(
          {
            // status: { $in: ["new", "used"] },
            ticket_code: code,
          },
          {
            $set: { status: "Scanned1" },
          },
          { new: true }
        );
        console.log("status is New!", ticket_band?.status);

        return res
          .status(200)
          .json({ message: "Updated successflly", ticket_band });
      } else if (ticketbandd.status === "Scanned1") {
        // set it to scanned 2
        const ticket_band = await TicketBand.findOneAndUpdate(
          {
            // status: { $in: ["new", "used"] },
            ticket_code: code,
          },
          {
            $set: { status: "Scanned2" },
          },
          { new: true }
        );
        console.log("status is New!", ticket_band?.status);

        return res
          .status(200)
          .json({ message: "Updated successflly", ticket_band });
      } else if (ticketbandd.status === "Scanned2") {
        // set it to used
        const ticket_band = await TicketBand.findOneAndUpdate(
          {
            // status: { $in: ["new", "used"] },
            ticket_code: code,
          },
          {
            $set: { status: "Used" },
          },
          { new: true }
        );
        console.log("status is New!", ticket_band?.status);

        return res
          .status(200)
          .json({ message: "Updated successflly", ticket_band });
      } else if (ticketbandd.status === "Used") {
        // return error
        return res
          .status(400)
          .json({ message: "Ticket already used", ststus: 400 });
      }
      // if its New, set it to used
    }
  } catch (err) {
    console.log(err, "internal error");
    return res.status(500).json(err);
  }
});

module.exports = router;
