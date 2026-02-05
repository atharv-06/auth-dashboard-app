import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ===== Validation ===== */
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return setError("All fields are required");
    }

    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully!");

      /* Auto redirect after 1.5 sec */
      setTimeout(() => {
        navigate("/login");
      }, 1500);

      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Enter Key Submit ===== */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-lg shadow">

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
          Create an Account
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Sign up to access your dashboard
        </p>

        {/* Name */}
        <input
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {/* Email */}
        <input
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {/* Password */}
        <input
          className="border p-2 w-full mb-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <p className="text-xs text-gray-400 mb-3">
          Password must be at least 6 characters
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-600 text-sm mb-3">{success}</p>
        )}

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white w-full py-2 rounded transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
