import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000/api/v1";

/* ----------------------- AuthPage (unchanged OTP flow) ----------------------- */
function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({ fname: "", lname: "", email: "", password: "", role: "Student" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // OTP related
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const goToRoleDashboard = (role) => {
    if (!role) return navigate("/auth");
    if (role === "Student") return navigate("/student/dashboard");
    if (role === "Admin") return navigate("/admin/dashboard");
    if (role === "Alumni" || role === "Alumini") return navigate("/alumni/dashboard");
    return navigate("/auth");
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.message || data.error || "Login failed" });
      } else {
        localStorage.setItem("id", data.data._id);
        const token = data.token || (data.user && data.user.token);
        const role = data.data.role ;
        if (token) localStorage.setItem("token", token);
        if (role) localStorage.setItem("role", role);
        setMessage({ type: "success", text: data.message || "Logged in" });
        setTimeout(() => goToRoleDashboard(role), 300);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setMessage(null);
    if (!form.email) {
      setMessage({ type: "error", text: "Please provide email to receive OTP." });
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.message || data.error || "Failed to send OTP" });
      } else {
        setOtpSent(true);
        setMessage({ type: "success", text: data.message || "OTP sent to your email" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyAndSignup = async () => {
    setVerifyingOtp(true);
    setMessage(null);
    if (!form.fname || !form.lname || !form.email || !form.password) {
      setMessage({ type: "error", text: "Please fill all signup fields." });
      setVerifyingOtp(false);
      return;
    }
    if (!otp || otp.length < 3) {
      setMessage({ type: "error", text: "Please enter a valid OTP." });
      setVerifyingOtp(false);
      return;
    }

    try {
      const payload = { ...form, otp };
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.message || data.error || "Signup failed" });
      } else {
        const token = data.token || (data.user && data.user.token);
        const role = (data.user && data.user.role) || data.role || form.role;
        if (token) localStorage.setItem("token", token);
        localStorage.setItem("id", data.data._id);
        if (role) localStorage.setItem("role", role);
        setMessage({ type: "success", text: data.message || "Account created" });
        setTimeout(() => goToRoleDashboard(role), 300);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (isLogin) {
      await handleLogin();
      return;
    }

    if (!otpSent) {
      if (!form.fname || !form.lname || !form.email || !form.password) {
        setMessage({ type: "error", text: "Please fill all required fields." });
        return;
      }
      await handleSendOtp();
      return;
    }

    await handleVerifyAndSignup();
  };

  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  // Role radio helper: set role when label clicked
  const handleRoleSelect = (roleValue) => {
    setForm(prev => ({ ...prev, role: roleValue }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl  p-8 shadow-[0_0_5px_1px_rgba(0,0,0,0.3)]">
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">{isLogin ? "Welcome Back" : "Create an account"}</h2>
        <p className="text-sm text-gray-500 text-center mb-6">{isLogin ? "Sign in to continue to the Alumni Portal." : "Sign up to join the community."}</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NEW: Role selector (labels act as radio buttons). Shown only on signup (like your original select). */}
          {!isLogin && (
            <div className="flex items-center justify-center gap-3 mb-2 w-full">
              {/* Hidden radio inputs for accessibility */}
              <input
                id="role-student"
                type="radio"
                name="role"
                value="Student"
                checked={form.role === "Student"}
                onChange={() => handleRoleSelect("Student")}
                className="sr-only"
              />
              <label
                htmlFor="role-student"
                onClick={() => handleRoleSelect("Student")}
                className={`py-[8px] rounded-lg cursor-pointer select-none  flex-1 text-center ${
                  form.role === "Student"
                    ? "bg-[#003366] text-white "
                    : "bg-[#e8f0fe] text-gray-700 "
                }`}
              >
                Student
              </label>

              <input
                id="role-alumni"
                type="radio"
                name="role"
                value="Alumni"
                checked={form.role === "Alumni" || form.role === "Alumini"}
                onChange={() => handleRoleSelect("Alumni")}
                className="sr-only"
              />
              <label
                htmlFor="role-alumni"
                onClick={() => handleRoleSelect("Alumni")}
                className={`py-[8px] rounded-lg cursor-pointer select-none  flex-1 text-center ${
                  (form.role === "Alumni" || form.role === "Alumini")
                    ? "bg-[#003366] text-white "
                    : "bg-[#e8f0fe] text-gray-700"
                }`}
              >
                Alumni
              </label>

              {/* Optional: Admin label if you want admins created via signup (kept out to match original options) */}
            </div>
          )}

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
                <input name="fname" value={form.fname} onChange={handleChange} className="outline-none border-none w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="First name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
                <input name="lname" value={form.lname} onChange={handleChange} className="outline-none border-none w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Last name" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="outline-none border-none w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="outline-none border-none w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Enter password" />
          </div>

          {/* If OTP was sent, show OTP input before finalizing signup */}
          {!isLogin && otpSent && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Enter OTP</label>
              <input
                name="otp"
                type="number"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="outline-none border-none w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter OTP"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <button type="button" onClick={handleResendOtp} disabled={sendingOtp} className="text-indigo-600 hover:underline">{sendingOtp ? "Resending..." : "Resend OTP"}</button>
                <button type="button" onClick={handleVerifyAndSignup} disabled={verifyingOtp} className="px-3 py-1 bg-indigo-600 text-white rounded-lg">{verifyingOtp ? "Verifying..." : "Verify & Create Account"}</button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading || sendingOtp || verifyingOtp} className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 bg-[#003366] disabled:opacity-60">
            {isLogin ? (loading ? "Signing in..." : "Sign In") : (!otpSent ? (sendingOtp ? "Sending OTP..." : "Create account — send OTP") : "Submit OTP")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setMessage(null); setOtpSent(false); setOtp(""); }} className="text-sm text-indigo-600 hover:underline">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message.text}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>All form values are stored inside a single `form` state object using useState.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;





