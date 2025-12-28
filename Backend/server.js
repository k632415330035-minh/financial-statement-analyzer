const express = require("express");
// const morgan = require("morgan");
const cors = require("cors");
const app = express();
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");


// Đường dẫn tới các trang liên quan
const userRoute = require("./routes/userRoute");
const residentRoute = require("./routes/residentRoute");
const registerRoute = require("./routes/registerResidentRoute");
const petitionRoute = require("./routes/petitionRoute");
const absentRoute = require("./routes/absentRoute");
const feedbackRouter = require("./routes/feedbackRoute");
const historyRoute = require("./routes/historyRoute");
const newresidentRoute = require("./routes/newresidentRoute");
const extendRoute = require("./routes/extendRoute");
const statisticRoute = require("./routes/statisticRoute");
const householdsManagerRoute = require("./routes/householdsManagerRoute");
const manageabsentRoute = require('./routes/manageabsentRoute');
const residentManageRoute = require('./routes/residentManageRoute');
const temporaryRoute = require("./routes/temporaryRoute");
const PORT = process.env.PORT || 3000; // Cổng lắng nghe

// Allow Authorization header in CORS so frontend can send Bearer tokens
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use(morgan("dev"));
app.use(express.json());

// API routes
app.use("/api", userRoute);
app.use("/api", residentRoute);
app.use("/api", petitionRoute);
app.use("/api", absentRoute);
app.use("/api", feedbackRouter);
app.use("/api", historyRoute);
app.use("/api", extendRoute);
app.use("/api/statistics", statisticRoute);
app.use("/api", householdsManagerRoute);
app.use('/api/residentManage', residentManageRoute);
app.use('/api/manageabsent', manageabsentRoute);
// Tuyến cần authMiddleware
app.use("/api", authMiddleware, registerRoute);
app.use("/api", authMiddleware, newresidentRoute);

// Temporary routes (was required earlier but not mounted)
app.use("/api", temporaryRoute);

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
