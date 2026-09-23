import React, { useState } from "react";
import { User, Mail, Phone, MapPin, FileText, AlertCircle, LogOut } from "lucide-react";

const WorkerProfileContent = ({ workerData, onProfileUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: workerData?.fullName || "",
    phone: workerData?.phone || "",
    email: workerData?.email || "",
    city: workerData?.city || "",
    province: workerData?.province || "",
    streetAddress: workerData?.streetAddress || "",
    skills: workerData?.skills || "",
  });

  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/workers/update-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setEditMode(false);
        onProfileUpdate();
      }
    } catch (err) {
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
            {workerData?.photoDocument && (
              <img
                src={workerData.photoDocument}
                alt={workerData.fullName}
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
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
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
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Logout Button - Bottom Positioned */}
<div className="mt-10">
  <button
    onClick={handleLogout}
    className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition-all duration-300 hover:shadow-lg"
  >
    Logout
  </button>
</div>

    </div>
  );
};

export default WorkerProfileContent;
