import React, { useState } from "react";

// Profile Component
const ProfileContent = () => (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h2>
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="+27 123 456 789" />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg">
          Update Profile
        </button>
      </div>
    </div>
  </div>
);

export default ProfileContent;