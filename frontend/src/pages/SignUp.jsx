import React, { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2, Mail, Lock, Phone, User } from "lucide-react";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    code: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1: Sign Up
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setMessage(res.data.message || "Signup successful!");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Account
  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify", {
        email: formData.email,
        code: formData.code,
      });

      setMessage(res.data.message || "Account verified successfully!");
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-500 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {step === 1 && "Create Your Account"}
          {step === 2 && "Verify Your Email"}
          {step === 3 && "You're All Set!"}
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {step === 1 && "Start your ShineSpec journey by signing up below."}
          {step === 2 && "Enter the verification code sent to your email."}
          {step === 3 && "Account successfully verified!"}
        </p>

        {/* Step 1: Sign Up */}
        {step === 1 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Surname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verification */}
        {step === 2 && (
          <form onSubmit={handleVerification} className="space-y-4">
            <input
              type="text"
              name="code"
              placeholder="Enter 6-digit Verification Code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </button>
          </form>
        )}

        {/* Step 3: Success Message */}
        {step === 3 && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <p className="text-blue-600 font-semibold mb-4">
              Your account has been verified successfully!
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Go to Login
            </button>
          </div>
        )}

        {message && step < 3 && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
