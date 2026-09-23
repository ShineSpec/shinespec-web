import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle, Save } from "lucide-react";
import { useToast } from "../Toast";
import { formatErrorMessage } from "../../utils/errorFormatter";

const WorkerAvailabilityContent = ({ workerData, onUpdate }) => {
  const [availability, setAvailability] = useState(workerData?.availability || []);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");
  const toast = useToast();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
    "07:00 - 09:00", "09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00",
    "15:00 - 17:00", "17:00 - 19:00"
  ];

  useEffect(() => {
    if (workerData?.availability) {
      setAvailability(workerData.availability);
    }
  }, [workerData]);

  const toggleAvailability = (day, slot) => {
    const key = `${day}-${slot}`;
    setAvailability(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
  };

  const toggleDay = (day) => {
    const daySlots = timeSlots.map(slot => `${day}-${slot}`);
    const allSelected = daySlots.every(slot => availability.includes(slot));
    
    if (allSelected) {
      setAvailability(prev => prev.filter(a => !daySlots.includes(a)));
    } else {
      setAvailability(prev => [...new Set([...prev, ...daySlots])]);
    }
  };

  const handleSaveAvailability = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workers/update-availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ availability }),
      });

      if (res.ok) {
        toast.success("Availability updated successfully!");
        onUpdate?.();
      } else {
        throw new Error("Failed to update availability");
      }
    } catch (err) {
      console.error("Update availability error:", err);
      toast.error(formatErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const getDayAvailability = (day) => {
    const daySlots = timeSlots.map(slot => `${day}-${slot}`);
    return daySlots.filter(slot => availability.includes(slot)).length;
  };

  return (
    <div className="max-w-5xl mx-auto w-full lg:mt-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Your Availability</h2>
        <p className="text-gray-600 mt-1">Set when you're available to work</p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-1">How it works</p>
          <p className="text-sm text-blue-800">
            Select the time slots when you're available to work. Customers will only be able to book you during these times. 
            You can update your availability at any time.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-6 mb-6">
          {days.map(day => {
            const dayCount = getDayAvailability(day);
            const allSelected = dayCount === timeSlots.length;
            
            return (
              <div key={day} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    {day}
                    {dayCount > 0 && (
                      <span className="text-sm font-normal text-gray-500">
                        ({dayCount} slots selected)
                      </span>
                    )}
                  </h4>
                  <button
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      allSelected
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {timeSlots.map(slot => {
                    const key = `${day}-${slot}`;
                    const isSelected = availability.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleAvailability(day, slot)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                          isSelected
                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4 inline mr-1" />}
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {availability.length} time slot{availability.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={handleSaveAvailability}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition font-semibold shadow-lg"
          >
            {saving ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerAvailabilityContent;
