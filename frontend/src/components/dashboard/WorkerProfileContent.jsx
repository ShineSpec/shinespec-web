import React, { useState, useEffect } from "react";
import { AlertCircle, LogOut, CheckCircle } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { authFetch } from "../../lib/auth";

const buildForm = (workerData) => ({
  fullName: workerData?.fullName || "",
  phone: workerData?.phone || "",
  email: workerData?.email || "",
  city: workerData?.city || "",
  province: workerData?.province || "",
  streetAddress: workerData?.streetAddress || "",
  skills: workerData?.skills || "",
});

const WorkerProfileContent = ({ workerData, onProfileUpdate }) => {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(buildForm(workerData));

  // The parent usually loads workerData after this component has mounted, so keep the
  // form in step with it. Leaving edit mode also discards any unsaved changes.
  useEffect(() => {
    if (!workerData || editMode) return;
    setFormData(buildForm(workerData));
  }, [workerData, editMode]);

  // ── Clerk account info ─────────────────────────────────────────────────
  const googleAccount = clerkUser?.externalAccounts?.find((a) =>
    String(a.provider || "").toLowerCase().includes("google")
  );
  const accountEmail = clerkUser?.primaryEmailAddress?.emailAddress || "";
  const emailVerified = clerkUser?.primaryEmailAddress?.verification?.status === "verified";
  const clerkPhoto = clerkUser?.hasImage ? clerkUser.imageUrl : null;

  // Worker's uploaded photo first, otherwise their account photo (e.g. Google)
  const photo = workerData?.photoDocument?.url || workerData?.photoDocument || clerkPhoto;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authFetch("/api/workers/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save changes");
      }

      setEditMode(false);
      onProfileUpdate?.();
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  // Ends the Clerk session; ClerkAuthBridge then clears the stored token/user
  const handleLogout = () => signOut({ redirectUrl: "/" });

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 lg:mt-20">
      {/* Status Alerts */}
      {workerData?.status === "pending" && (
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
          <div>
            <p className="font-bold text-yellow-900">Pending Approval</p>
            <p className="text-sm text-yellow-800">
              Your application is being reviewed. You'll receive a notification once approved.
            </p>
          </div>
        </div>
      )}

      {workerData?.status === "rejected" && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="font-bold text-red-900">Application Rejected</p>
          <p className="text-sm text-red-800">Please contact support for more information.</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          {/* Profile Left */}
          <div className="flex items-center gap-4">
            {photo && (
              <img
                src={photo}
                alt={workerData?.fullName || "Profile"}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{workerData?.fullName}</h3>
              <p className="text-gray-600">{workerData?.email}</p>
              <p className="text-sm text-gray-500">
                {workerData?.city}, {workerData?.province}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setError("");
                setEditMode(!editMode);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Signed-in account (from Clerk) */}
        {clerkUser && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
            {clerkPhoto ? (
              <img
                src={clerkPhoto}
                alt=""
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200" />
            )}
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 break-all">{accountEmail}</p>
            </div>
            {googleAccount && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700">
                <span className="w-4 h-4 rounded-full bg-white border border-gray-200 text-[#4285F4] flex items-center justify-center text-[10px] font-bold">
                  G
                </span>
                Google
              </span>
            )}
            {emailVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 py-6 border-t border-gray-200 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">{workerData?.rating || 0}%</p>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{workerData?.jobsCompleted || 0}</p>
            <p className="text-sm text-gray-600">Jobs Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{workerData?.reviews?.length || 0}</p>
            <p className="text-sm text-gray-600">Reviews</p>
          </div>
        </div>

        {/* Editable Form */}
        {editMode ? (
          <div className="space-y-4 mt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  rows="3"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-semibold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-6 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Phone</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">City</p>
                <p className="font-medium">{formData.city}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Province</p>
                <p className="font-medium">{formData.province}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-600 mb-1">Skills</p>
                <p className="font-medium">{formData.skills}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      {workerData?.reviews?.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {workerData.reviews.slice(0, 5).map((review, idx) => (
              <div key={idx} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold">{review.name}</p>
                  <span className="text-yellow-500">{`⭐`.repeat(review.rating)}</span>
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout Button - Bottom Positioned */}
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default WorkerProfileContent;