const express = require("express");
const Attendance = require("../models/Attendance");

const { protect, managerOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// ------------------ EMPLOYEE ENDPOINTS ----------------------

// POST /api/attendance/checkin - Check in
router.post("/checkin", protect, async (req, res) => {
  try {
    const today = getStartOfDay();
    let record = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });

    if (record && record.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    if (!record) {
      record = new Attendance({ userId: req.user._id, date: today });
    }

    record.checkInTime = new Date();
    record.status = "present"; // simple rule

    await record.save();

    return res.json({ message: "Checked in successfully", record });
  } catch (error) {
    console.error("Checkin error:", error);
    return res.status(500).json({ message: "Server error in checkin" });
  }
});

// POST /api/attendance/checkout - Check out
router.post("/checkout", protect, async (req, res) => {
  try {
    const today = getStartOfDay();
    const record = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });

    if (!record || !record.checkInTime) {
      return res
        .status(400)
        .json({ message: "You have not checked in today" });
    }

    if (record.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    record.checkOutTime = new Date();
    const diffMs = record.checkOutTime - record.checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    record.totalHours = Number(diffHours.toFixed(2));

    await record.save();

    return res.json({ message: "Checked out successfully", record });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Server error in checkout" });
  }
});

// GET /api/attendance/my-history - employee history
router.get("/my-history", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id }).sort({
      date: -1,
    });
    return res.json(records);
  } catch (error) {
    console.error("My history error:", error);
    return res.status(500).json({ message: "Server error in history" });
  }
});

// GET /api/attendance/my-summary?month=&year=
router.get("/my-summary", protect, async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1; // 1-12
    const year = Number(req.query.year) || now.getFullYear();

    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    const summary = {
      month,
      year,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    records.forEach((r) => {
      if (r.status === "present") summary.present += 1;
      if (r.status === "absent") summary.absent += 1;
      if (r.status === "late") summary.late += 1;
      if (r.status === "half-day") summary.halfDay += 1;
      summary.totalHours += r.totalHours || 0;
    });

    summary.totalHours = Number(summary.totalHours.toFixed(2));
    return res.json(summary);
  } catch (error) {
    console.error("My summary error:", error);
    return res.status(500).json({ message: "Server error in summary" });
  }
});

// GET /api/attendance/today - employee today's status
router.get("/today", protect, async (req, res) => {
  try {
    const today = getStartOfDay();
    const record = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });
    return res.json(record || null);
  } catch (error) {
    console.error("Today status error:", error);
    return res.status(500).json({ message: "Server error in today status" });
  }
});

// ------------------ MANAGER ENDPOINTS ----------------------

// GET /api/attendance/all - all employees attendance (with filters)
router.get("/all", protect, managerOnly, async (req, res) => {
  try {
   const { employeeId, status, date } = req.query;
const filter = {};

if (status) {
  filter.status = status;
}

if (date) {
  const d = new Date(date);
  filter.date = { $gte: getStartOfDay(d), $lte: getEndOfDay(d) };
}

if (employeeId) {
  // case-insensitive search for employeeId (EMP002, emp002, Emp002 all work)
  const user = await User.findOne({
    employeeId: { $regex: `^${employeeId}$`, $options: "i" },
  });

  if (!user) {
    return res.json([]); // no such employee
  }
  filter.userId = user._id;
}






    const records = await Attendance.find(filter)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    return res.json(records);
  } catch (error) {
    console.error("All attendance error:", error);
    return res.status(500).json({ message: "Server error in all attendance" });
  }
});

// GET /api/attendance/employee/:id - specific employee history
router.get("/employee/:id", protect, managerOnly, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.params.id }).sort({
      date: -1,
    });
    return res.json(records);
  } catch (error) {
    console.error("Employee history error:", error);
    return res.status(500).json({ message: "Server error in employee history" });
  }
});

// GET /api/attendance/summary - team summary
router.get("/summary", protect, managerOnly, async (req, res) => {
  try {
    const today = getStartOfDay();
    const totalEmployees = await User.countDocuments({ role: "employee" });

    const todayRecords = await Attendance.find({
      date: today,
    }).populate("userId", "employeeId");

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
    console.error("Team summary error:", error);
    return res.status(500).json({ message: "Server error in team summary" });
  }
});

// GET /api/attendance/today-status - who's present today
router.get("/today-status", protect, managerOnly, async (req, res) => {
  try {
    const today = getStartOfDay();
    const records = await Attendance.find({ date: today }).populate(
      "userId",
      "name email employeeId department"
    );
    return res.json(records);
  } catch (error) {
    console.error("Today-status error:", error);
    return res
      .status(500)
      .json({ message: "Server error in today status for manager" });
  }
});

// GET /api/attendance/export - export CSV
router.get("/export", protect, managerOnly, async (req, res) => {
  try {
    const records = await Attendance.find({})
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    let csv =
      "EmployeeId,Name,Email,Department,Date,CheckIn,CheckOut,Status,TotalHours\n";

    records.forEach((r) => {
      const u = r.userId || {};
      csv += [
        u.employeeId || "",
        `"${u.name || ""}"`,
        u.email || "",
        u.department || "",
        r.date ? new Date(r.date).toISOString().split("T")[0] : "",
        r.checkInTime ? new Date(r.checkInTime).toISOString() : "",
        r.checkOutTime ? new Date(r.checkOutTime).toISOString() : "",
        r.status || "",
        r.totalHours || 0,
      ].join(",");
      csv += "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance-report.csv"
    );
    return res.send(csv);
  } catch (error) {
    console.error("Export CSV error:", error);
    return res.status(500).json({ message: "Server error in export" });
  }
});

module.exports = router;
