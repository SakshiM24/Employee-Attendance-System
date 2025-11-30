const express = require("express");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { protect, managerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// GET /api/dashboard/employee
router.get("/employee", protect, async (req, res) => {
  try {
    const today = getStartOfDay();

    const now = new Date();
    const month = now.getMonth(); // 0-11
    const year = now.getFullYear();
    const monthStart = new Date(year, month, 1, 0, 0, 0, 0);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const [todayRecord, monthRecords] = await Promise.all([
      Attendance.findOne({ userId: req.user._id, date: today }),
      Attendance.find({
        userId: req.user._id,
        date: { $gte: monthStart, $lte: monthEnd },
      }).sort({ date: -1 }),
    ]);

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    monthRecords.forEach((r) => {
      if (r.status === "present") summary.present += 1;
      if (r.status === "absent") summary.absent += 1;
      if (r.status === "late") summary.late += 1;
      if (r.status === "half-day") summary.halfDay += 1;
      summary.totalHours += r.totalHours || 0;
    });
    summary.totalHours = Number(summary.totalHours.toFixed(2));

    const recent7 = monthRecords.slice(0, 7);

    return res.json({
      todayStatus: todayRecord || null,
      summary,
      recent7,
    });
  } catch (error) {
    console.error("Employee dashboard error:", error);
    return res
      .status(500)
      .json({ message: "Server error in employee dashboard" });
  }
});

// GET /api/dashboard/manager
router.get("/manager", protect, managerOnly, async (req, res) => {
  try {
    const today = getStartOfDay();
    const totalEmployees = await User.countDocuments({ role: "employee" });

    const todayRecords = await Attendance.find({
      date: today,
    }).populate("userId", "employeeId department");

    const presentToday = todayRecords.filter(
      (r) => r.status === "present"
    ).length;
    const lateToday = todayRecords.filter((r) => r.status === "late").length;
    const absentToday = totalEmployees - presentToday;

    return res.json({
      totalEmployees,
      presentToday,
      lateToday,
      absentToday,
    });
  } catch (error) {
    console.error("Manager dashboard error:", error);
    return res
      .status(500)
      .json({ message: "Server error in manager dashboard" });
  }
});

module.exports = router;
