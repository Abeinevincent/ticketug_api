const Ticket = require("../models/Ticket");
const express = require("express");
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
    if (ticket) {
      return res.status(200).json(ticket);
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
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
