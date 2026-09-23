import React, { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CarerApplyForm = () => {
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
    serviceType: "carer",
    startDate: "",
    preferredSchedule: "full-time",
    
    // Care Recipient Details
    recipientAge: "",
    recipientCondition: [],
    recipientMobility: "",
    
    // Care Needs
    careLevels: [],
    specializedCare: [],
    medicationManagement: false,
    medicalEquipment: "",
    
    // Living Situation
    liveIn: false,
    homeSize: "",
    numBedroomsAvailable: "",
    accessibilityNeeds: "",
    
    // Experience & Qualifications
    careExperience: "",
    certifications: "",
    languages: "",
    
    // Budget
    budgetRange: "",
    
    // Additional
    additionalNotes: "",
    agreeTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const conditionOptions = [
    "Dementia/Alzheimer's",
    "Mobility issues",
    "Post-surgery recovery",
    "Chronic illness",
    "Diabetes",
    "Heart condition",
    "Stroke recovery",
    "General aging support",
  ];

  const careLevelOptions = [
    "Companionship",
    "Personal hygiene assistance",
    "Meal preparation",
    "Medication reminders",
    "Mobility assistance",
    "Toileting assistance",
    "Bathing assistance",
    "Transportation",
  ];

  const specializedCareOptions = [
    "Dementia care",
    "Catheter care",
    "Wound care",
    "Oxygen therapy",
    "Dialysis assistance",
    "Post-stroke care",
    "Palliative care",
    "Incontinence management",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.recipientAge) newErrors.recipientAge = "Care recipient age is required";
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

  const handleArrayChange = (arrayName, item) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter((i) => i !== item)
        : [...prev[arrayName], item],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');
        
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
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
            Thank you for applying for our Elder Care service! Our team will review your application and contact you within 24-48 hours with next steps.
          </p>
          <button
            onClick={() => navigate("/services/fulltime")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/services/fulltime")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Apply for Full-Time Elder Care
          </h1>
          <p className="text-gray-600 text-lg">
            Help us understand your loved one's needs so we can find the perfect caregiver
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Personal Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="full-time">Full-Time (5 days/week)</option>
                  <option value="live-in">Live-In</option>
                  <option value="flexible">Flexible Hours</option>
                  <option value="overnight">Overnight Care</option>
                </select>
              </div>
            </div>
          </div>

          {/* Care Recipient Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
              Care Recipient Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age of Care Recipient *
                </label>
                <input
                  type="number"
                  name="recipientAge"
                  value={formData.recipientAge}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., 75"
                  min="18"
                />
                {errors.recipientAge && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.recipientAge}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobility Level
                </label>
                <select
                  name="recipientMobility"
                  value={formData.recipientMobility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select mobility level</option>
                  <option value="independent">Fully independent</option>
                  <option value="some-assistance">Some assistance needed</option>
                  <option value="wheelchair">Wheelchair bound</option>
                  <option value="bedbound">Bed bound</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Medical Conditions *
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {conditionOptions.map((condition) => (
                  <label key={condition} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.recipientCondition.includes(condition)}
                      onChange={() => handleArrayChange("recipientCondition", condition)}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Care Needs Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
              Care Requirements
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Types of Care Needed
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {careLevelOptions.map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.careLevels.includes(level)}
                      onChange={() => handleArrayChange("careLevels", level)}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Specialized Care (if needed)
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {specializedCareOptions.map((care) => (
                  <label key={care} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specializedCare.includes(care)}
                      onChange={() => handleArrayChange("specializedCare", care)}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">{care}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="medicationManagement"
                  checked={formData.medicationManagement}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Medication management required</span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Equipment Use
                </label>
                <input
                  type="text"
                  name="medicalEquipment"
                  value={formData.medicalEquipment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., Walker, oxygen tank, etc."
                />
              </div>
            </div>
          </div>

          {/* Living Situation Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
              Living Situation
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="liveIn"
                  checked={formData.liveIn}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Need live-in caregiver</span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Size
                </label>
                <select
                  name="homeSize"
                  value={formData.homeSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select home size</option>
                  <option value="small">Small (1-2 bedrooms)</option>
                  <option value="medium">Medium (3-4 bedrooms)</option>
                  <option value="large">Large (5+ bedrooms)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Accessibility/Special Arrangements Needed
              </label>
              <textarea
                name="accessibilityNeeds"
                value={formData.accessibilityNeeds}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                rows="3"
                placeholder="e.g., Wheelchair access, grab bars, etc."
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
              Additional Information
            </h2>
            <div className="space-y-6">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Any other information about your loved one's care..."
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
                className="w-5 h-5 text-blue-600 rounded cursor-pointer mt-1"
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
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
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

export default CarerApplyForm;