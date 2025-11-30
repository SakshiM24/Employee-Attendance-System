import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  // you can leave these prefilled for demo, or set "" if you want blank
  const [email, setEmail] = useState("emp1@example.com");
  const [password, setPassword] = useState("Emp12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const user = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        employeeId: res.data.employeeId,
        department: res.data.department,
      };

      setAuth(user, res.data.token);

      if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #111827 100%)",
      }}
    >
      {/* LEFT PANEL – branding */}
      <div
        style={{
          flex: 1,
          minWidth: "320px",
          padding: "40px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "12px", fontWeight: 700 }}>
          Smart Attendance
        </h1>
        <p style={{ fontSize: "15px", marginBottom: "16px", color: "#d1d5db" }}>
          A full-stack employee attendance system with real-time dashboards for
          employees and managers.
        </p>
        <ul style={{ fontSize: "13px", color: "#e5e7eb", lineHeight: 1.8 }}>
          <li>✔ Role-based access (Employee / Manager)</li>
          <li>✔ Daily Check-In / Check-Out tracking</li>
          <li>✔ Monthly summary & attendance history</li>
          <li>✔ Manager analytics with filters & CSV export</li>
        </ul>
        <p style={{ fontSize: "12px", marginTop: "24px", color: "#9ca3af" }}>
          Use demo accounts:
          <br />
          Employee: emp1@example.com / Emp12345
          <br />
          Manager: (your manager email) / (password)
        </p>
      </div>

      {/* RIGHT PANEL – login form */}
      <div
        style={{
          flex: 1,
          minWidth: "340px",
          maxWidth: "420px",
          background: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            padding: "24px",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "6px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Login to your account
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "18px",
            }}
          >
            Enter your email and password to access the dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div
                style={{
                  marginBottom: "8px",
                  color: "red",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "4px",
                fontSize: "14px",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
