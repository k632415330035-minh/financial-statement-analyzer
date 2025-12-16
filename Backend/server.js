const express = require("express");
const cors = require("cors");
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

// Đường dẫn tới các trang liên quan
const userRoute = require("./routes/userRoute");
const residentRoute = require("./routes/residentRoute");
const registerRoute = require("./routes/registerResidentRoute");
const petitionRoute = require("./routes/petitionRoute");
const absentRoute = require("./routes/absentRoute");
const testRouter = require("./routes/testRoute");

const app = express();
const PORT = process.env.PORT || 3000; // Cổng lắng nghe

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "..", "Frontend"));

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", userRoute);
app.use("/api", residentRoute);
app.use("/api", petitionRoute);
app.use("/api", absentRoute);
app.use("/api", testRouter);

// Tuyến cần authMiddleware
app.use("/api", authMiddleware, registerRoute);

// Serve static files từ thư mục Frontend
app.use(express.static(path.join(__dirname, "..", "Frontend")));

// Route bắt tất cả các request khác để phục vụ index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Frontend", "index.html"));
});
app.get("/manager", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/get/GetAllAcounts");
    const data = await response.json();
    res.render("manager/table.ejs", { data: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
