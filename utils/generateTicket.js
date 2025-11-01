const {
  generateRandomString,
  randomSixDigitNumber,
} = require("./generateRandomChars");
const qr = require("qr-image");
const { createCanvas, loadImage } = require("canvas");
const Ticket = require("../models/Ticket");
const TicketBand = require("../models/TicketBand");

// Create a function to generate the ticket image
const generateTicket = async () => {
  // Create a canvas for the ticket
  const canvas = createCanvas(567, 156);
  const ctx = canvas.getContext("2d");

  // Draw a background color (optional)
  ctx.fillStyle = "#ffffff"; // white
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // final ticket code
  const finalTicketCode = generateRandomString();

  // random 6 character backup number
  // const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  // console.log(finalTicketCode, randomSixDigitNumber);

  await Ticket.create({
    ticket_code: finalTicketCode,
    // backup_code: randomSixDigitNumber,
    ticket_class: "ORDINARY",
  });

  // await TicketBand.create({
  //   ticket_code: finalTicketCode,
  // });

  // Generate QR code
  const qrImage = qr.imageSync(finalTicketCode, {
    type: "png",
    size: 10,
  });

  // Load QR code image onto the canvas
  const qrCodeImage = await loadImage(qrImage);
  const qrSize = 150;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = (canvas.height - qrSize) / 2;
  ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

  // Convert the canvas to a PNG buffer
  const buffer = canvas.toBuffer("image/png");

  return buffer;
};

module.exports = { generateTicket };
