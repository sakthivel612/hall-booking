const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const data = [
  {
    id: "1",
    numberOfSeats: 100,
    amenities: ["Ac", "chairs", "discolights"],
    price: 5000,
    ifBooked: "true",
    customerName: "Sakthivel",
    date: "30-oct-2023",
    startTime: "30-oct-2023 at 12PM",
    endTime: "31-oct-2023 at 11am",
    RoomId: 201,
    RoomName: "Duplex",
  },
  {
    id: "2",
    numberOfSeats: 100,
    amenities: ["Ac", "chairs", "discolights"],
    price: 5000,
    ifBooked: "false",
    customerName: "vijay",
    date: "01-nov-2023",
    startTime: "01-nov-2023 at 10pm",
    endTime: "02-nov-2023 at 10am",
    RoomId: 202,
    RoomName: "Duplex",
  },
  {
    id: "3",
    numberOfSeats: 80,
    amenities: ["Ac", "chairs", "discolights"],
    price: 4000,
    ifBooked: "true",
    customerName: "mathavan",
    date: "15-march-2022",
    startTime: "15-march-2022 at 1pm",
    endTime: "16-march-2022 at 12am",
    RoomId: 202,
    RoomName: "Duplex",
  },
  {
    id: "4",
    numberOfSeats: 70,
    amenities: ["Ac", "chairs", "discolights"],
    price: 3500,
    ifBooked: "false",
    customerName: "kumar",
    date: "20-june-2021",
    startTime: "20-june-2021 at 4pm",
    endTime: "21-june-2023 at 3am",
    RoomId: 202,
    RoomName: "Duplex",
  },
];


// 1. Create a room
app.post("/createRoom", (req, res) => {
  const { numberOfSeats, amenities, price, RoomName } = req.body;
  const newRoom = {
    id: String(data.length + 1),
    numberOfSeats,
    amenities,
    price,
    ifBooked: false,
    RoomName,
  };
  data.push(newRoom);
  res.json({
    success: true,
    message: "Room created successfully",
    room: newRoom,
  });
});



// 2. Book a room
app.post("/bookRoom", (req, res) => {
  const { customerName, date, startTime, endTime, RoomId } = req.body;

  // Check if the room is already booked for the given date and time
  const isAlreadyBooked = data.some(
    (booking) =>
      booking.RoomId === RoomId &&
      booking.date === date &&
      ((startTime >= booking.startTime && startTime <= booking.endTime) ||
        (endTime >= booking.startTime && endTime <= booking.endTime))
  );

  if (isAlreadyBooked) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Room already booked for the given date and time",
      });
  }


  // Find the room and update booking details
  const room = data.find((room) => room.RoomId === RoomId);
  if (room) {
    room.ifBooked = true;
    room.customerName = customerName;
    room.date = date;
    room.startTime = startTime;
    room.endTime = endTime;
    res.json({
      success: true,
      message: "Room booked successfully",
      booking: room,
    });
  } else {
    res.status(404).json({ success: false, message: "Room not found" });
  }
});



// 3. List all rooms with booked data
app.get("/listAllRooms", (req, res) => {
  const bookedRooms = data.filter((room) => room.ifBooked);
  res.json(bookedRooms);
});



// 4. List all customers with booked data
app.get("/listAllCustomers", (req, res) => {
  const bookedCustomers = data.filter((room) => room.ifBooked);
  res.json(bookedCustomers);
});



// 5. List how many times a customer has booked a room
app.get("/customerBookingHistory/:customerName", (req, res) => {
  const customerName = req.params.customerName;
  const customerBookingHistory = data.filter(
    (room) => room.customerName === customerName && room.ifBooked
  );
  res.json(customerBookingHistory);
});


// server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
