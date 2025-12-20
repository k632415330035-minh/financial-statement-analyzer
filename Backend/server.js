const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const statisticRoute = require("./routes/statisticRoute");

// Đường dẫn tới các trang liên quan
const userRoute = require("./routes/userRoute");
const residentRoute = require("./routes/residentRoute");
const registerRoute = require("./routes/registerResidentRoute");
const petitionRoute = require("./routes/petitionRoute");
const absentRoute = require("./routes/absentRoute");
const feedbackRouter = require("./routes/feedbackRoute");
const historyRoute = require("./routes/historyRoute");


const PORT = process.env.PORT || 3000; // Cổng lắng nghe
app.use("/api/statistics", statisticRoute);
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", userRoute);
app.use("/api", residentRoute);
app.use("/api", petitionRoute);
app.use("/api", absentRoute);
app.use("/api", feedbackRouter);
app.use("/api", historyRoute);

// Tuyến cần authMiddleware
app.use("/api", authMiddleware, registerRoute);

// Serve static files từ thư mục Frontend
app.use(express.static(path.join(__dirname, "..", "Frontend")));



// Route bắt tất cả các request khác để phục vụ index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Frontend", "index.html"));
});





// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


