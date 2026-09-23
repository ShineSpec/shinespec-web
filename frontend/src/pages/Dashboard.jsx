import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkerDashboard from "../components/dashboard/WorkerDashboard";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";

const Dashboard = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const user = await res.json();
          
          // Check if user is a worker
          const workerRes = await fetch(`${API_BASE_URL}/api/workers/my-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (workerRes.ok) {
            setUserType("worker");
          } else {
            setUserType("customer");
          }
        }
      } catch (err) {
        console.error("Error checking user type:", err);
        setUserType("customer");
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return userType === "worker" ? <WorkerDashboard /> : <CustomerDashboard />;
};

export default Dashboard;
