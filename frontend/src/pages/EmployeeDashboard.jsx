import { useEffect, useState } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const [historyRes, summaryRes, todayRes] = await Promise.all([
        api.get("/attendance/my-history"),
        api.get("/attendance/my-summary"),
        api.get("/attendance/today"),
      ]);
      setHistory(historyRes.data || []);
      setSummary(summaryRes.data || null);
      setTodayStatus(todayRes.data || null);
    } catch (err) {
      console.error("Error loading employee data", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCheckIn = async () => {
    setActionMsg("");
    setActionLoading(true);
    try {
      const res = await api.post("/attendance/checkin");
      setActionMsg(res.data.message || "Checked in");
      await loadHistory();
    } catch (err) {
      console.error(err);
      setActionMsg(
        err.response?.data?.message || "Error while checking in."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionMsg("");
    setActionLoading(true);
    try {
      const res = await api.post("/attendance/checkout");
      setActionMsg(res.data.message || "Checked out");
      await loadHistory();
    } catch (err) {
      console.error(err);
      setActionMsg(
        err.response?.data?.message || "Error while checking out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const formatTime = (d) => (d ? new Date(d).toLocaleTimeString() : "-");

  const totalDays = history.length;
  const totalPresent = history.filter((h) => h.status === "present").length;
  const totalHours = history.reduce((sum, h) => sum + (h.totalHours || 0), 0);

  const todayLabel = (() => {
    if (!todayStatus) return "Not checked in today";
    if (todayStatus.checkInTime && !todayStatus.checkOutTime)
      return "Checked in, not checked out yet";
    if (todayStatus.checkInTime && todayStatus.checkOutTime)
      return "Checked in & checked out";
    return "Not checked in today";
  })();

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
          background: "#1e293b",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            Employee Dashboard
          </div>
          <div style={{ fontSize: "12px", color: "#cbd5f5" }}>
            {user?.name} ({user?.employeeId}) • {user?.department}
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

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1100px" }}>
          {/* Intro text */}
          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginBottom: "12px",
            }}
          >
            This dashboard shows your{" "}
            <strong>today&apos;s attendance status</strong> and{" "}
            <strong>monthly summary</strong>, along with a complete history of
            your check-in / check-out records.
          </p>

          {/* TOP ROW: Today + Summary + Actions */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* Today card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ fontSize: "15px", marginBottom: "6px" }}>
                Today&apos;s Status
              </h3>
              <p style={{ fontSize: "13px", color: "#4b5563" }}>
                {todayLabel}
              </p>
              {todayStatus && (
                <ul
                  style={{
                    fontSize: "12px",
                    marginTop: "8px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  <li>
                    Check In: {formatTime(todayStatus.checkInTime) || "-"}
                  </li>
                  <li>
                    Check Out: {formatTime(todayStatus.checkOutTime) || "-"}
                  </li>
                </ul>
              )}
            </div>

            {/* Summary card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ fontSize: "15px", marginBottom: "6px" }}>
                This Month Summary
              </h3>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>
                <div>Total days recorded: {totalDays}</div>
                <div>Present (status=present): {totalPresent}</div>
                <div>
                  Total hours (all records): {totalHours.toFixed(2)}
                </div>
                {summary && (
                  <div style={{ marginTop: "6px", fontSize: "12px" }}>
                    <div>Late days: {summary.late}</div>
                    <div>Half days: {summary.halfDay}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <h3 style={{ fontSize: "15px", marginBottom: "6px" }}>
                Mark Today&apos;s Attendance
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  style={{
                    padding: "8px 14px",
                    background: "#16a34a",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {actionLoading ? "Processing..." : "Check In"}
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  style={{
                    padding: "8px 14px",
                    background: "#f97316",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {actionLoading ? "Processing..." : "Check Out"}
                </button>
              </div>

              {actionMsg && (
                <span
                  style={{
                    marginTop: "4px",
                    fontSize: "13px",
                    color: "#2563eb",
                  }}
                >
                  {actionMsg}
                </span>
              )}

              <p
                style={{
                  marginTop: "6px",
                  fontSize: "11px",
                  color: "#6b7280",
                }}
              >
                Use these buttons once per day to record your work hours.
              </p>
            </div>
          </section>

          {/* HISTORY TABLE */}
          <section
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "10px", fontSize: "15px" }}>
              My Attendance History
            </h3>
            {loadingHistory ? (
              <p>Loading...</p>
            ) : history.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                No attendance records yet. Use the Check In / Check Out buttons
                above to mark your first attendance.
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
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Check In
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Check Out
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Total Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((rec) => (
                      <tr key={rec._id}>
                        <td
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            padding: "8px",
                          }}
                        >
                          {formatDate(rec.date)}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            padding: "8px",
                          }}
                        >
                          {formatTime(rec.checkInTime)}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            padding: "8px",
                          }}
                        >
                          {formatTime(rec.checkOutTime)}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            padding: "8px",
                            textTransform: "capitalize",
                          }}
                        >
                          {rec.status}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            padding: "8px",
                          }}
                        >
                          {rec.totalHours?.toFixed
                            ? rec.totalHours.toFixed(2)
                            : rec.totalHours}
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

export default EmployeeDashboard;
