import { useEffect, useState } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [allRecords, setAllRecords] = useState([]);   // all data from DB
  const [records, setRecords] = useState([]);         // filtered view
  const [employeeSummary, setEmployeeSummary] = useState([]); // per-employee stats
  const [topSummary, setTopSummary] = useState(null); // cards data
  const [loading, setLoading] = useState(false);

  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ---- helpers ----
  const computeSummaries = (data) => {
    const map = {};
    const employeeIdSet = new Set();
    const todayStr = new Date().toDateString();

    let presentToday = 0;
    let lateToday = 0;

    data.forEach((r) => {
      if (!r.userId) return;
      const empId = r.userId.employeeId;
      const name = r.userId.name;
      const dept = r.userId.department;

      employeeIdSet.add(empId);

      if (!map[empId]) {
        map[empId] = {
          employeeId: empId,
          name,
          department: dept,
          days: 0,
          totalHours: 0,
          lastDate: null,
        };
      }

      map[empId].days += 1;
      map[empId].totalHours += r.totalHours || 0;

      if (!map[empId].lastDate || new Date(r.date) > new Date(map[empId].lastDate)) {
        map[empId].lastDate = r.date;
      }

      // Today stats
      if (r.date) {
        const recDateStr = new Date(r.date).toDateString();
        if (recDateStr === todayStr) {
          if (r.status === "present") presentToday += 1;
          if (r.status === "late") lateToday += 1;
        }
      }
    });

    const totalEmployees = employeeIdSet.size;
    const absentToday = totalEmployees - presentToday;

    setEmployeeSummary(Object.values(map));
    setTopSummary({
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
    });
  };

  const loadAllRecords = async () => {
    setLoading(true);
    try {
      // no filters -> get everything
      const res = await api.get("/attendance/all");
      const data = res.data || [];
      setAllRecords(data);
      setRecords(data);
      computeSummaries(data);
    } catch (err) {
      console.error("Error loading attendance data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllRecords();
  }, []);

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (employeeIdFilter) params.employeeId = employeeIdFilter;
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await api.get("/attendance/all", { params });
      setRecords(res.data || []);
      // for filters we keep topSummary / employeeSummary based on all data
    } catch (err) {
      console.error("Error loading filtered records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setEmployeeIdFilter("");
    setStatusFilter("");
    setDateFilter("");
    // restore full view without calling backend again
    setRecords(allRecords);
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/attendance/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error", err);
      alert("Failed to export CSV");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "";
  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString() : "-";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "12px 24px",
          background: "#0f172a",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            Manager Dashboard
          </div>
          <div style={{ fontSize: "12px", color: "#cbd5f5" }}>
            {user?.name} ({user?.email})
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Logout
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          {/* TOP SUMMARY CARDS */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ fontSize: "14px", marginBottom: "6px" }}>
                Total Employees
              </h3>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                {topSummary?.totalEmployees ?? 0}
              </div>
            </div>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ fontSize: "14px", marginBottom: "6px" }}>
                Present Today
              </h3>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                {topSummary?.presentToday ?? 0}
              </div>
            </div>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ fontSize: "14px", marginBottom: "6px" }}>
                Absent Today
              </h3>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                {topSummary?.absentToday ?? 0}
              </div>
            </div>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ fontSize: "14px", marginBottom: "6px" }}>
                Late Today
              </h3>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                {topSummary?.lateToday ?? 0}
              </div>
            </div>
          </section>

          {/* TEAM OVERVIEW (per employee stats) */}
          <section
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>
              Team Overview (per Employee)
            </h3>
            {employeeSummary.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                No attendance records yet. When employees start using the system,
                their summary will appear here.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Employee ID
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Name
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Department
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Days Recorded
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Total Hours
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeSummary.map((e) => (
                      <tr key={e.employeeId}>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {e.employeeId}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {e.name}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {e.department}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {e.days}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {e.totalHours.toFixed(2)}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {formatDate(e.lastDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* FILTERS + DETAILED RECORDS */}
          <section
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>
              Detailed Attendance Records (with Filters)
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <input
                placeholder="Employee ID (e.g. EMP002)"
                value={employeeIdFilter}
                onChange={(e) => setEmployeeIdFilter(e.target.value)}
                style={{
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  minWidth: "180px",
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  padding: "6px 8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />

              <button
                onClick={handleApplyFilters}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>

              <button
                onClick={handleExport}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "auto",
                }}
              >
                Export CSV
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : records.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                No records found for the selected filters.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Emp ID
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Name
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Dept
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Date
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Check In
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Check Out
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Status
                      </th>
                      <th style={{ borderBottom: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>
                        Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r._id}>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {r.userId?.employeeId}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {r.userId?.name}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {r.userId?.department}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {formatDate(r.date)}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {formatTime(r.checkInTime)}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {formatTime(r.checkOutTime)}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px", textTransform: "capitalize" }}>
                          {r.status}
                        </td>
                        <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px" }}>
                          {r.totalHours?.toFixed
                            ? r.totalHours.toFixed(2)
                            : r.totalHours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;
