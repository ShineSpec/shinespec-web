import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, MessageSquare, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "../components/Toast";
import { formatErrorMessage } from "../utils/errorFormatter";

const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1); // 1: Request reset, 2: Verify code
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/request-password-reset`,
        { email: formData.email }
      );

      toast.success(res.data.message || "Verification code sent to your WhatsApp!");
      setStep(2);
    } catch (err) {
      const friendlyError = formatErrorMessage(err);
      setError(friendlyError);
      toast.error(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and reset password
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.code || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-password-reset`,
        {
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }
      );

      toast.success(res.data.message || "Password reset successful!");
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const friendlyError = formatErrorMessage(err);
      setError(friendlyError);
      toast.error(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          {step === 1 ? "Reset Password" : "Enter Verification Code"}
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          {step === 1
            ? "You'll receive a verification code from our support team via WhatsApp"
            : "Check your WhatsApp for the 6-digit code from our support team"}
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 text-green-700 animate-fade-in shadow-sm">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed font-medium">
              Password reset successful! Redirecting to login...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700 animate-fade-in shadow-sm">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed font-medium">{error}</p>
          </div>
        )}

        {/* Step 1: Request Reset */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="flex-1 outline-none px-2 py-1 text-gray-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: Verify Code and Reset */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndReset} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Verification Code
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  className="flex-1 outline-none px-2 py-1 text-gray-700"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Code will be sent to you by our support team via WhatsApp
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="flex-1 outline-none px-2 py-1 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm New Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="flex-1 outline-none px-2 py-1 text-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError(null);
                  setFormData({ ...formData, code: "", newPassword: "", confirmPassword: "" });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
