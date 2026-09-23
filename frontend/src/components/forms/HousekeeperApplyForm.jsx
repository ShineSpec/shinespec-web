import React, { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HousekeeperApplyForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    
    // Service Details
    serviceType: "housekeeper",
    startDate: "",
    preferredSchedule: "full-time",
    hoursPerWeek: "40",
    
    // Specific Needs
    homeSize: "",
    numRooms: "",
    specialServices: [],
    pets: false,
    childrenInHome: false,
    
    // Experience & Requirements
    experience: "",
    certifications: "",
    references: "",
    
    // Budget
    budgetRange: "",
    
    // Additional
    additionalNotes: "",
    agreeTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const specialServicesOptions = [
    "Deep cleaning",
    "Laundry management",
    "Meal preparation",
    "Ironing",
    "Garden maintenance",
    "Window cleaning",
    "Carpet cleaning",
    "Organizing/decluttering",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.homeSize) newErrors.homeSize = "Home size is required";
    if (!formData.numRooms) newErrors.numRooms = "Number of rooms is required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecialServicesChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      specialServices: prev.specialServices.includes(service)
        ? prev.specialServices.filter((s) => s !== service)
        : [...prev.specialServices, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token'); // Get auth token if exists
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workers/service-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit application');
        }
        
        console.log("Application submitted:", data);
        setSubmitted(true);
        
        setTimeout(() => {
          navigate("/");
        }, 3000);
        
      } catch (error) {
        console.error("Submission error:", error);
        setErrors({ submit: error.message });
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for applying! Our team will review your application and contact you within 24-48 hours with next steps.
          </p>
          <button
            onClick={() => navigate("/services/fulltime")}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/services/fulltime")}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold mb-8"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Apply for Full-Time Housekeeper
          </h1>
          <p className="text-gray-600 text-lg">
            Tell us about your household and we'll find the perfect match
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Personal Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-pink-200">
              Personal Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="+27 (0) 000 000 000"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.phone}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="Johannesburg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-pink-200">
              Service Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  When would you like to start? *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Schedule
                </label>
                <select
                  name="preferredSchedule"
                  value={formData.preferredSchedule}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="full-time">Full-Time (5 days/week)</option>
                  <option value="flexible">Flexible Hours</option>
                  <option value="live-in">Live-In</option>
                </select>
              </div>
            </div>
          </div>

          {/* Home Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-pink-200">
              Home Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Size *
                </label>
                <select
                  name="homeSize"
                  value={formData.homeSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="">Select home size</option>
                  <option value="studio">Studio</option>
                  <option value="1bed">1 Bedroom</option>
                  <option value="2bed">2 Bedrooms</option>
                  <option value="3bed">3 Bedrooms</option>
                  <option value="4bed">4+ Bedrooms</option>
                </select>
                {errors.homeSize && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.homeSize}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  name="numRooms"
                  value={formData.numRooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="e.g., 8"
                  min="1"
                />
                {errors.numRooms && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.numRooms}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Special Services Needed
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {specialServicesOptions.map((service) => (
                  <label key={service} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialServices.includes(service)}
                      onChange={() => handleSpecialServicesChange(service)}
                      className="w-5 h-5 text-pink-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="pets"
                  checked={formData.pets}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Do you have pets?</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="childrenInHome"
                  checked={formData.childrenInHome}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Children in home?</span>
              </label>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-pink-200">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Relevant Experience (if any)
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Tell us about any relevant experience with housekeepers..."
                />
              </div>

              <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Budget Range (Monthly)
  </label>
  <input
    type="text"
    name="budgetRange"
    value={formData.budgetRange}
    onChange={handleChange}
    placeholder="e.g. R5,000 - R10,000"
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg
    focus:outline-none focus:border-pink-500 transition-colors"
  />
</div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Any other information you'd like to share..."
                />
              </div>
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-5 h-5 text-pink-600 rounded cursor-pointer mt-1"
              />
              <span className="text-gray-700">
                I agree to the terms and conditions and understand that my application will be reviewed by the ShineSpec team. *
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={16} /> {errors.agreeTerms}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
          >
            Submit Application
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            By submitting, you agree to be contacted regarding your application
          </p>
        </form>
      </div>
    </div>
  );
};

export default HousekeeperApplyForm;