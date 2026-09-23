import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Star, CheckCircle, DollarSign, Calendar, BarChart3 } from "lucide-react";

const WorkerStatsContent = ({ workerData }) => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    averageRating: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Calculate stats from bookings if available
    // This would ideally come from an API endpoint
    if (workerData) {
      setStats({
        totalEarnings: workerData.totalEarnings || 0,
        thisMonth: workerData.thisMonthEarnings || 0,
        averageRating: workerData.rating || 0,
        completionRate: workerData.completionRate || 0
      });
    }
  }, [workerData]);

  return (
    <div className="max-w-7xl mx-auto w-full lg:mt-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Performance Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your progress and earnings</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-green-100 text-sm mb-1">Total Earnings</p>
          <p className="text-3xl font-bold">R{stats.totalEarnings.toFixed(2)}</p>
          <p className="text-green-100 text-xs mt-2">This month: R{stats.thisMonth.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Average Rating</p>
          <p className="text-3xl font-bold">{stats.averageRating}%</p>
          <p className="text-yellow-100 text-xs mt-2">Based on {workerData?.reviews?.length || 0} reviews</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-10 h-10 opacity-80" />
            <BarChart3 className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Completion Rate</p>
          <p className="text-3xl font-bold">{stats.completionRate}%</p>
          <p className="text-blue-100 text-xs mt-2">Jobs completed successfully</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 opacity-80" />
            <Calendar className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Jobs Completed</p>
          <p className="text-3xl font-bold">{workerData?.jobsCompleted || 0}</p>
          <p className="text-purple-100 text-xs mt-2">All time total</p>
        </div>
      </div>

      {/* Services Offered */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Services You Offer
        </h3>
        <div className="flex flex-wrap gap-3">
          {workerData?.serviceTypes && workerData.serviceTypes.length > 0 ? (
            workerData.serviceTypes.map((service, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200"
              >
                {service}
              </span>
            ))
          ) : (
            <p className="text-gray-600">No services added yet</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {workerData?.reviews && workerData.reviews.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Recent Reviews
          </h3>
          <div className="space-y-4">
            {workerData.reviews.slice(0, 5).map((review, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerStatsContent;
