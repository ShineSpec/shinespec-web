import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, Lock, CheckCircle, Camera,
  X, Eye, EyeOff, AlertCircle, Building2, Bell, Shield,
  Loader2, LogOut, KeyRound
} from "lucide-react";
import { useUser, useClerk, useReverification } from "@clerk/clerk-react";
import { useToast } from "../Toast";
import { formatErrorMessage } from "../../utils/errorFormatter";
import { authFetch } from "../../lib/auth";

// Clerk errors carry their message in err.errors[0]
const errorText = (err) =>
  err?.errors?.[0]?.longMessage ||
  err?.errors?.[0]?.message ||
  err?.message ||
  formatErrorMessage(err);

const ProfileContent = () => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const toast = useToast();

  // Profile stored in your database (/api/auth/me)
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    companyName: "",
    receiveNewsletter: false,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ── Clerk-derived values ───────────────────────────────────────────────
  const hasPassword = Boolean(clerkUser?.passwordEnabled);
  const googleAccount = clerkUser?.externalAccounts?.find((a) =>
    String(a.provider || "").toLowerCase().includes("google")
  );
  const primaryEmail = clerkUser?.primaryEmailAddress;
  const email = primaryEmail?.emailAddress || userData?.email || "";
  const emailVerified = primaryEmail?.verification?.status === "verified";
  const profileImage = clerkUser?.hasImage ? clerkUser.imageUrl : null;

  // Changing a password is a sensitive action: Clerk may ask the user to re-verify first
  const updatePassword = useReverification(({ currentPassword, newPassword }) =>
    clerkUser?.updatePassword(
      hasPassword
        ? { currentPassword, newPassword, signOutOfOtherSessions: false }
        : { newPassword }
    )
  );

  // ── Load profile ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const applyProfile = (data) => {
      setUserData(data);
      setForm({
        firstName: data.name || clerkUser?.firstName || "",
        lastName: data.lastname || clerkUser?.lastName || "",
        mobile: data.phone || clerkUser?.primaryPhoneNumber?.phoneNumber || "",
        companyName: data.companyName || "",
        receiveNewsletter: Boolean(data.receiveNewsletter),
      });
    };

    (async () => {
      try {
        const res = await authFetch("/api/auth/me");
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (!cancelled) applyProfile(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        // Still show the page using what Clerk knows
        if (!cancelled) {
          applyProfile({
            name: clerkUser?.firstName || "",
            lastname: clerkUser?.lastName || "",
            email: clerkUser?.primaryEmailAddress?.emailAddress || "",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  // ── Form handling ──────────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.trim().length < 2 ? "Must be at least 2 characters" : "";
      case "mobile":
        return !/^\+?[\d\s-]{10,}$/.test(value) ? "Invalid phone number" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (type === "checkbox") return;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = async () => {
    const newErrors = {};
    ["firstName", "lastName", "mobile"].forEach((field) => {
      if (form[field]) {
        const error = validateField(field, form[field]);
        if (error) newErrors[field] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUpdating(true);
    try {
      const res = await authFetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // both naming styles, so it works whichever one the controller reads
        body: JSON.stringify({
          name: form.firstName,
          lastname: form.lastName,
          phone: form.mobile,
          firstName: form.firstName,
          lastName: form.lastName,
          mobile: form.mobile,
          receiveNewsletter: form.receiveNewsletter,
          companyName: form.companyName,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update profile");
      }

      // Keep Clerk's copy of the name in step (not fatal if it fails)
      if (
        clerkUser &&
        (clerkUser.firstName !== form.firstName || clerkUser.lastName !== form.lastName)
      ) {
        try {
          await clerkUser.update({ firstName: form.firstName, lastName: form.lastName });
        } catch (e) {
          console.warn("Could not update name in Clerk:", e);
        }
      }

      // Refresh the cached profile so the Navbar initials update straight away
      try {
        const cached = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...cached,
            name: form.firstName,
            lastname: form.lastName,
            phone: form.mobile,
            companyName: form.companyName,
            receiveNewsletter: form.receiveNewsletter,
          })
        );
        window.dispatchEvent(new Event("storage"));
      } catch {
        /* ignore */
      }

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(errorText(err));
    } finally {
      setUpdating(false);
    }
  };

  // ── Profile picture (stored by Clerk; Google users start with their Google photo) ──
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file || !clerkUser) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB. Please choose a smaller image.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    setUploadingImage(true);
    try {
      await clerkUser.setProfileImage({ file });
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Profile image error:", err);
      toast.error(errorText(err));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!clerkUser) return;
    setUploadingImage(true);
    try {
      await clerkUser.setProfileImage({ file: null });
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setUploadingImage(false);
    }
  };

  // ── Password (handled by Clerk) ────────────────────────────────────────
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordError("");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (
      (hasPassword && !passwordData.currentPassword) ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (hasPassword && passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordSaving(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(hasPassword ? "Password updated successfully!" : "Password set successfully!");
      closePasswordModal();
    } catch (err) {
      if (err?.code === "reverification_cancelled") return; // user closed the re-verify dialog
      setPasswordError(errorText(err));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => signOut({ redirectUrl: "/" });

  // ── Render ─────────────────────────────────────────────────────────────
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn || !userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">
            {isSignedIn ? "Failed to load user data" : "Please sign in to view your profile"}
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const hasErrors = Object.keys(errors).some((key) => errors[key]);

  return (
    <div className="max-w-5xl mx-auto space-y-4 lg:space-y-6 w-full">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6">
          <div className="relative group">
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/20">
              {uploadingImage ? (
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-10 h-10 lg:w-14 lg:h-14 text-white/70" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2.5 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Camera className="w-4 h-4 text-white" />
            </label>
            {profileImage && (
              <button
                onClick={handleRemoveImage}
                disabled={uploadingImage}
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl lg:text-3xl font-bold mb-1 break-words">{fullName || "Your profile"}</h1>
            <p className="text-blue-100 flex items-center gap-2 justify-center md:justify-start break-all">
              <Mail className="w-4 h-4 flex-shrink-0" />
              {email}
            </p>
            {form.mobile && (
              <p className="text-blue-100 flex items-center gap-2 justify-center md:justify-start mt-1">
                <Phone className="w-4 h-4" />
                {form.mobile}
              </p>
            )}
            {googleAccount && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium">
                <span className="w-4 h-4 rounded-full bg-white text-[#4285F4] flex items-center justify-center text-[10px] font-bold">
                  G
                </span>
                Signed in with Google
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white shadow-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-24 p-3 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 cursor-not-allowed"
                  />
                  {emailVerified && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {googleAccount
                    ? "This is the email of your Google account and can't be changed here"
                    : "Email cannot be changed"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="+27 123 456 789"
                    className={`w-full pl-10 p-3 rounded-lg border ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Company Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter your company name (optional)"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              Sign-in methods
            </h2>
            <div className="space-y-3">
              {googleAccount && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#4285F4]">
                    G
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">Google</p>
                    <p className="text-xs text-gray-500 truncate">
                      {googleAccount.emailAddress || email}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                    Connected
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-500" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">Email &amp; password</p>
                  <p className="text-xs text-gray-500 truncate">{hasPassword ? email : "Not set up"}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    hasPassword
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {hasPassword ? "Enabled" : "Off"}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Security
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow transition"
              >
                <Lock className="w-4 h-4" />
                {hasPassword ? "Change Password" : "Set a Password"}
              </button>
            </div>
          </section>

          <section className="lg:hidden bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-50 rounded-lg transition border border-red-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">SIGN OUT</span>
            </button>
          </section>

          <section className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="receiveNewsletter"
                  checked={form.receiveNewsletter}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <span className="text-gray-700 group-hover:text-gray-900">Email Notifications</span>
                  <p className="text-xs text-gray-500 mt-1">Receive newsletters and promotional updates</p>
                </div>
              </label>
            </div>
          </section>

          <button
            onClick={handleSave}
            disabled={updating || hasErrors}
            className={`w-full flex items-center justify-center gap-2 ${
              updating || hasErrors ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white px-6 py-4 rounded-lg shadow-lg transition transform hover:scale-105`}
          >
            {updating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                {hasPassword ? "Change Password" : "Set a Password"}
              </h3>
              <button onClick={closePasswordModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!hasPassword && (
              <p className="text-sm text-gray-600 mb-4">
                {googleAccount
                  ? "You signed in with Google, so you don't have a password yet. Setting one lets you also log in with your email and password."
                  : "You don't have a password yet. Set one to log in with your email and password."}
              </p>
            )}

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{passwordError}</span>
              </div>
            )}

            <div className="space-y-4">
              {hasPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closePasswordModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={passwordSaving}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
              >
                {passwordSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {hasPassword ? "Update Password" : "Set Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;