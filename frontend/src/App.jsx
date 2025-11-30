import { useState } from "react";

// ----- DUMMY DATA -----
const employeeProfile = {
  name: "Sakshi Mane",
  employeeId: "EMP002",
  department: "Software Development",
};

const todayAttendance = {
  date: "2025-11-30",
  status: "Present",
  checkIn: "09:12 AM",
  checkOut: "06:04 PM",
  totalHours: 8.9,
  remark: "On time",
};

const monthlyStats = {
  month: "November 2025",
  workingDays: 22,
  presentDays: 20,
  absentDays: 1,
  lateDays: 1,
  totalHours: 176.5,
  avgHours: 8.0,
};

const employeeHistory = [
  {
    date: "2025-11-30",
    day: "Sun",
    checkIn: "09:12 AM",
    checkOut: "06:04 PM",
    status: "Present",
    hours: 8.9,
  },
  {
    date: "2025-11-29",
    day: "Sat",
    checkIn: "09:31 AM",
    checkOut: "06:00 PM",
    status: "Late",
    hours: 8.3,
  },
  {
    date: "2025-11-28",
    day: "Fri",
    checkIn: "09:05 AM",
    checkOut: "05:58 PM",
    status: "Present",
    hours: 8.2,
  },
  {
    date: "2025-11-27",
    day: "Thu",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    hours: 0,
  },
];

const employeesSummary = [
  {
    employeeId: "EMP002",
    name: "Sakshi Mane",
    department: "Software Development",
    daysRecorded: 20,
    totalHours: 160.5,
    lastActive: "2025-11-30",
    statusToday: "Present",
  },
  {
    employeeId: "EMP003",
    name: "Rohit Sharma",
    department: "QA",
    daysRecorded: 18,
    totalHours: 142.0,
    lastActive: "2025-11-30",
    statusToday: "Present",
  },
  {
    employeeId: "EMP004",
    name: "Priya Verma",
    department: "HR",
    daysRecorded: 19,
    totalHours: 150.0,
    lastActive: "2025-11-29",
    statusToday: "Absent",
  },
  {
    employeeId: "EMP005",
    name: "Aman Gupta",
    department: "Support",
    daysRecorded: 16,
    totalHours: 126.5,
    lastActive: "2025-11-30",
    statusToday: "Late",
  },
];

const allAttendanceRecords = [
  {
    id: 1,
    employeeId: "EMP002",
    name: "Sakshi Mane",
    department: "Software Development",
    date: "2025-11-30",
    status: "Present",
    checkIn: "09:12 AM",
    checkOut: "06:04 PM",
    hours: 8.9,
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Sakshi Mane",
    department: "Software Development",
    date: "2025-11-29",
    status: "Late",
    checkIn: "09:31 AM",
    checkOut: "06:00 PM",
    hours: 8.3,
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Rohit Sharma",
    department: "QA",
    date: "2025-11-30",
    status: "Present",
    checkIn: "09:05 AM",
    checkOut: "05:58 PM",
    hours: 8.2,
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Priya Verma",
    department: "HR",
    date: "2025-11-30",
    status: "Absent",
    checkIn: "-",
    checkOut: "-",
    hours: 0,
  },
  {
    id: 5,
    employeeId: "EMP005",
    name: "Aman Gupta",
    department: "Support",
    date: "2025-11-30",
    status: "Late",
    checkIn: "09:48 AM",
    checkOut: "06:10 PM",
    hours: 8.1,
  },
];

// ----- SMALL UI HELPERS -----
const card = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "14px 16px",
  boxShadow: "0 1px 4px rgba(15,23,42,0.12)",
};

const chipColors = {
  Present: "#22c55e",
  Late: "#f97316",
  Absent: "#ef4444",
};

const filterInputStyle = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #374151",
  background: "#020617",
  color: "#e5e7eb",
  fontSize: 14,
};

// ----- LOGIN SCREEN (DUMMY AUTH) -----
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Hardcoded demo credentials
    if (
      role === "employee" &&
      email === "emp1@example.com" &&
      password === "Emp12345"
    ) {
      onLogin("employee");
    } else if (
      role === "manager" &&
      email === "manager1@example.com" &&
      password === "Manager123"
    ) {
      onLogin("manager");
    } else {
      setError("Invalid email or password for selected role (demo login).");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0f172a, #020617)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#020617",
          padding: "24px",
          borderRadius: "14px",
          boxShadow: "0 20px 45px rgba(0,0,0,0.7)",
          border: "1px solid #1f2937",
        }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: 600, marginBottom: 4 }}>
          Smart Attendance
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
          Demo login — choose role and use sample credentials.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, marginBottom: 4, display: "block" }}>
              Role
            </label>
            <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
              <label>
                <input
                  type="radio"
                  value="employee"
                  checked={role === "employee"}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginRight: 4 }}
                />
                Employee
              </label>
              <label>
                <input
                  type="radio"
                  value="manager"
                  checked={role === "manager"}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginRight: 4 }}
                />
                Manager
              </label>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, marginBottom: 4, display: "block" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder={
                role === "employee"
                  ? "emp1@example.com"
                  : "manager1@example.com"
              }
            />
          </div>

          <div>
            <label style={{ fontSize: 13, marginBottom: 4, display: "block" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder={role === "employee" ? "Emp12345" : "Manager123"}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#7f1d1d",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 12,
                color: "#fecaca",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: 4,
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background:
                "linear-gradient(to right, rgb(56,189,248), rgb(168,85,247))",
              color: "#0b1120",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 11, color: "#9ca3af" }}>
          Demo credentials:
          <ul style={{ marginTop: 4, paddingLeft: 16, lineHeight: 1.4 }}>
            <li>Employee: emp1@example.com / Emp12345</li>
            <li>Manager: manager1@example.com / Manager123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ----- EMPLOYEE DASHBOARD -----
function EmployeeDashboardDemo() {
  return (
    <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1100px", display: "grid", gap: "16px" }}>
        {/* Header */}
        <div
          style={{
            ...card,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>Employee Dashboard</div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a" }}>
              Welcome, {employeeProfile.name}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              ID: {employeeProfile.employeeId} • Department: {employeeProfile.department}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Today</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
              {todayAttendance.date}
            </div>
            <span
              style={{
                marginTop: "6px",
                display: "inline-block",
                padding: "3px 8px",
                borderRadius: "999px",
                fontSize: "11px",
                color: "#ffffff",
                background: chipColors[todayAttendance.status] || "#0ea5e9",
              }}
            >
              {todayAttendance.status}
            </span>
          </div>
        </div>

        {/* Today overview + Monthly stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
            gap: "16px",
          }}
        >
          {/* Today card */}
          <div style={card}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Today&apos;s Attendance
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "13px",
              }}
            >
              <div>
                <div style={{ color: "#64748b" }}>Check-in</div>
                <div style={{ fontWeight: 500 }}>{todayAttendance.checkIn}</div>
              </div>
              <div>
                <div style={{ color: "#64748b" }}>Check-out</div>
                <div style={{ fontWeight: 500 }}>{todayAttendance.checkOut}</div>
              </div>
              <div>
                <div style={{ color: "#64748b" }}>Total hours</div>
                <div style={{ fontWeight: 500 }}>
                  {todayAttendance.totalHours.toFixed(1)} hrs
                </div>
              </div>
              <div>
                <div style={{ color: "#64748b" }}>Remark</div>
                <div style={{ fontWeight: 500 }}>{todayAttendance.remark}</div>
              </div>
            </div>
          </div>

          {/* Monthly stats */}
          <div style={card}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Monthly Summary — {monthlyStats.month}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "10px",
                fontSize: "12px",
              }}
            >
              <SummaryMiniCard label="Working Days" value={monthlyStats.workingDays} />
              <SummaryMiniCard
                label="Present"
                value={monthlyStats.presentDays}
                color="#16a34a"
              />
              <SummaryMiniCard
                label="Absent"
                value={monthlyStats.absentDays}
                color="#ef4444"
              />
              <SummaryMiniCard
                label="Late"
                value={monthlyStats.lateDays}
                color="#f97316"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1.0fr))",
                gap: "10px",
                marginTop: "10px",
                fontSize: "12px",
              }}
            >
              <SummaryMiniCard
                label="Total Hours"
                value={`${monthlyStats.totalHours.toFixed(1)} h`}
              />
              <SummaryMiniCard
                label="Avg / Day"
                value={`${monthlyStats.avgHours.toFixed(1)} h`}
              />
            </div>
          </div>
        </div>

        {/* History table */}
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600 }}>
              My Attendance History
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              Last {employeeHistory.length} days
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Day</Th>
                  <Th>Check-in</Th>
                  <Th>Check-out</Th>
                  <Th>Status</Th>
                  <Th>Hours</Th>
                </tr>
              </thead>
              <tbody>
                {employeeHistory.map((row) => (
                  <tr key={row.date}>
                    <Td>{row.date}</Td>
                    <Td>{row.day}</Td>
                    <Td>{row.checkIn}</Td>
                    <Td>{row.checkOut}</Td>
                    <Td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          color: "#ffffff",
                          background:
                            chipColors[row.status] || "rgba(15,23,42,0.85)",
                        }}
                      >
                        {row.status}
                      </span>
                    </Td>
                    <Td>{row.hours.toFixed(1)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- MANAGER DASHBOARD -----
function ManagerDashboardDemo() {
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredRecords = allAttendanceRecords.filter((rec) => {
    if (
      employeeFilter &&
      !rec.employeeId.toLowerCase().includes(employeeFilter.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter && rec.status !== statusFilter) {
      return false;
    }
    if (dateFilter && rec.date !== dateFilter) {
      return false;
    }
    return true;
  });

  const presentToday = employeesSummary.filter((e) => e.statusToday === "Present").length;
  const absentToday = employeesSummary.filter((e) => e.statusToday === "Absent").length;
  const lateToday = employeesSummary.filter((e) => e.statusToday === "Late").length;

  return (
    <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1200px", display: "grid", gap: "16px" }}>
        {/* Header */}
        <div style={{ ...card, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>Manager Dashboard</div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a" }}>
              Team Attendance Overview
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              Monitor daily presence, performance and late patterns.
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b" }}>
            Demo data • No live backend
          </div>
        </div>

        {/* Top summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          <SummaryCard title="Total Employees" value={employeesSummary.length} />
          <SummaryCard title="Present Today" value={presentToday} accent="#16a34a" />
          <SummaryCard title="Absent Today" value={absentToday} accent="#ef4444" />
          <SummaryCard title="Late Today" value={lateToday} accent="#f97316" />
        </div>

        {/* Team overview */}
        <div style={card}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
            Team Summary (Per Employee)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr>
                  <Th>Emp ID</Th>
                  <Th>Name</Th>
                  <Th>Department</Th>
                  <Th>Days Recorded</Th>
                  <Th>Total Hours</Th>
                  <Th>Last Active</Th>
                  <Th>Status Today</Th>
                </tr>
              </thead>
              <tbody>
                {employeesSummary.map((e) => (
                  <tr key={e.employeeId}>
                    <Td>{e.employeeId}</Td>
                    <Td>{e.name}</Td>
                    <Td>{e.department}</Td>
                    <Td>{e.daysRecorded}</Td>
                    <Td>{e.totalHours.toFixed(1)}</Td>
                    <Td>{e.lastActive}</Td>
                    <Td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          color: "#ffffff",
                          background:
                            chipColors[e.statusToday] || "rgba(15,23,42,0.85)",
                        }}
                      >
                        {e.statusToday}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filters + detailed records */}
        <div style={card}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
            Detailed Attendance Records
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <input
              placeholder="Filter by Employee ID (e.g. EMP002)"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              style={filterInputStyle}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={filterInputStyle}
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={filterInputStyle}
            />
            <button
              onClick={() => {
                setEmployeeFilter("");
                setStatusFilter("");
                setDateFilter("");
              }}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Clear Filters
            </button>
          </div>

          {/* Table */}
          {filteredRecords.length === 0 ? (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              No records match the selected filters.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr>
                    <Th>Emp ID</Th>
                    <Th>Name</Th>
                    <Th>Dept</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Check-in</Th>
                    <Th>Check-out</Th>
                    <Th>Hours</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r.id}>
                      <Td>{r.employeeId}</Td>
                      <Td>{r.name}</Td>
                      <Td>{r.department}</Td>
                      <Td>{r.date}</Td>
                      <Td>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            color: "#ffffff",
                            background:
                              chipColors[r.status] || "rgba(15,23,42,0.85)",
                          }}
                        >
                          {r.status}
                        </span>
                      </Td>
                      <Td>{r.checkIn}</Td>
                      <Td>{r.checkOut}</Td>
                      <Td>{r.hours.toFixed(1)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- SMALL COMPONENTS -----
function SummaryMiniCard({ label, value, color }) {
  return (
    <div
      style={{
        borderRadius: "10px",
        padding: "8px 10px",
        background: "#f9fafb",
      }}
    >
      <div style={{ fontSize: "11px", color: "#6b7280" }}>{label}</div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: color || "#0f172a",
          marginTop: "2px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, accent }) {
  return (
    <div style={card}>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: "22px", fontWeight: 600, marginTop: "4px" }}>
        {value}
      </div>
      {accent && (
        <div
          style={{
            marginTop: "6px",
            width: "40px",
            height: "3px",
            borderRadius: "999px",
            background: accent,
          }}
        />
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "6px 8px",
        borderBottom: "1px solid #e5e7eb",
        whiteSpace: "nowrap",
        background: "#f9fafb",
        fontWeight: 500,
        color: "#4b5563",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td
      style={{
        padding: "6px 8px",
        borderBottom: "1px solid #f3f4f6",
        whiteSpace: "nowrap",
        color: "#111827",
      }}
    >
      {children}
    </td>
  );
}

// ----- MAIN APP -----
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRole] = useState("employee");
  const [view, setView] = useState("employee");

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setActiveRole(role);
    setView(role); // default view = role
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveRole("employee");
    setView("employee");
  };

  return (
    <>
      {/* Global CSS override so app uses full page */}
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        #root {
          max-width: 100% !important;
          padding: 0 !important;
        }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #0f172a;
        }
      `}</style>

      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #0f172a, #020617)",
            color: "#0f172a",
          }}
        >
          {/* Top bar */}
          <header
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(148,163,184,0.2)",
              background: "rgba(15,23,42,0.9)",
              backdropFilter: "blur(10px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#e5e7eb",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px" }}>
                  Smart Attendance
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                  Logged in as {activeRole === "employee" ? "Employee" : "Manager"}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "inline-flex",
                    background: "rgba(15,23,42,0.85)",
                    borderRadius: "999px",
                    padding: "3px",
                    border: "1px solid rgba(148,163,184,0.4)",
                  }}
                >
                  <button
                    onClick={() => setView("employee")}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      background: view === "employee" ? "#e5e7eb" : "transparent",
                      color: view === "employee" ? "#0f172a" : "#e5e7eb",
                    }}
                  >
                    Employee View
                  </button>
                  <button
                    onClick={() => setView("manager")}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      background: view === "manager" ? "#e5e7eb" : "transparent",
                      color: view === "manager" ? "#0f172a" : "#e5e7eb",
                    }}
                  >
                    Manager View
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    fontSize: "11px",
                    padding: "5px 10px",
                    borderRadius: "999px",
                    border: "1px solid #f97373",
                    background: "#7f1d1d",
                    color: "#fee2e2",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main
            style={{
              padding: "16px",
              minHeight: "calc(100vh - 60px)",
              color: "#0f172a",
            }}
          >
            <div
              style={{
                maxWidth: "1300px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  borderRadius: "18px",
                  padding: "14px 14px 20px",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.9))",
                  marginBottom: "14px",
                  color: "#e5e7eb",
                  boxShadow: "0 20px 45px rgba(15,23,42,0.7)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#cbd5f5",
                    marginBottom: "4px",
                  }}
                >
                  Presentation Hint
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  Show how employees see their own data, and how managers see the full
                  team.
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#cbd5f5",
                    marginTop: "4px",
                  }}
                >
                  You can say: &quot;This prototype uses sample data on the frontend. The
                  backend APIs are under development but will follow the same data model
                  and flows.&quot;
                </div>
              </div>

              <div
                style={{
                  borderRadius: "18px",
                  padding: "12px",
                  background: "#e5e7eb",
                }}
              >
                {view === "employee" ? (
                  <EmployeeDashboardDemo />
                ) : (
                  <ManagerDashboardDemo />
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
