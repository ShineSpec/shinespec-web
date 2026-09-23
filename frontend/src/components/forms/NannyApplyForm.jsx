import React, { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NannyApplyForm = () => {
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
    serviceType: "nanny",
    startDate: "",
    preferredSchedule: "full-time",
    hoursPerWeek: "40",
    
    // Children Details
    numChildren: "",
    childrenAges: "",
    specialNeeds: false,
    specialNeedsDetails: "",
    
    // Childcare Requirements
    careActivities: [],
    educationalSupport: false,
    languagesSpoken: "",
    activities: [],
    
    // Safety & Experience
    cprCertified: false,
    firstAidCertified: false,
    careExperience: "",
    references: "",
    
    // Dietary & Allergies
    dietaryRestrictions: "",
    foodAllergies: "",
    
    // Living Situation
    liveIn: false,
    homeSize: "",
    
    // Budget
    budgetRange: "",
    
    // Additional
    additionalNotes: "",
    agreeTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const careActivitiesOptions = [
    "Feeding & nutrition",
    "Diaper changes/toilet training",
    "Bathing & personal hygiene",
    "Bedtime routine",
    "Playing & engagement",
    "School drop-off/pickup",
    "Homework help",
    "Light housekeeping (child-related)",
  ];

  const activitiesOptions = [
    "Arts & crafts",
    "Reading/storytelling",
    "Outdoor play",
    "Music & singing",
    "Sports/physical activities",
    "Educational games",
    "Cooking/baking",
    "Movie time",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.numChildren) newErrors.numChildren = "Number of children is required";
    if (!formData.childrenAges.trim()) newErrors.childrenAges = "Children ages are required";
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
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
            Thank you for applying for our Nanny service! Our team will review your application and contact you within 24-48 hours with next steps.
          </p>
          <button
            onClick={() => navigate("/services/fulltime")}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/services/fulltime")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-8"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Apply for Full-Time Nanny
          </h1>
          <p className="text-gray-600 text-lg">
            Let us find the perfect caregiver for your children
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Personal Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="full-time">Full-Time (5 days/week)</option>
                  <option value="part-time">Part-Time (3 days/week)</option>
                  <option value="live-in">Live-In</option>
                  <option value="flexible">Flexible Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Children Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200">
              Children Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Children *
                </label>
                <input
                  type="number"
                  name="numChildren"
                  value={formData.numChildren}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="e.g., 2"
                  min="1"
                />
                {errors.numChildren && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.numChildren}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ages of Children *
                </label>
                <input
                  type="text"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="e.g., 3 and 6 years old"
                />
                {errors.childrenAges && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.childrenAges}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  name="specialNeeds"
                  checked={formData.specialNeeds}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Any child has special needs or medical conditions?</span>
              </label>
              {formData.specialNeeds && (
                <textarea
                  name="specialNeedsDetails"
                  value={formData.specialNeedsDetails}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Please describe any special needs, allergies, or medical conditions..."
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dietary Restrictions & Food Allergies
              </label>
              <textarea
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
                rows="3"
                placeholder="e.g., Vegetarian, gluten-free, nut allergies, etc."
              />
            </div>
          </div>

          {/* Childcare Requirements Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200">
              Childcare Requirements
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Daily Care Activities Needed
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {careActivitiesOptions.map((activity) => (
                  <label key={activity} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.careActivities.includes(activity)}
                      onChange={() => handleArrayChange("careActivities", activity)}
                      className="w-5 h-5 text-green-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">{activity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  name="educationalSupport"
                  checked={formData.educationalSupport}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Homework help & educational support needed</span>
              </label>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages Spoken at Home
              </label>
              <input
                type="text"
                name="languagesSpoken"
                value={formData.languagesSpoken}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g., English, IsiZulu, Afrikaans"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Preferred Activities & Interests
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {activitiesOptions.map((activity) => (
                  <label key={activity} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activities.includes(activity)}
                      onChange={() => handleArrayChange("activities", activity)}
                      className="w-5 h-5 text-green-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">{activity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Safety & Experience Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200">
              Safety & Experience
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="cprCertified"
                  checked={formData.cprCertified}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">CPR Certified</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="firstAidCertified"
                  checked={formData.firstAidCertified}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-medium">First Aid Certified</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Childcare Experience
              </label>
              <textarea
                name="careExperience"
                value={formData.careExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
                rows="3"
                placeholder="Tell us about your childcare experience..."
              />
            </div>
          </div>

          {/* Budget & Additional */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
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
                className="w-5 h-5 text-green-600 rounded cursor-pointer mt-1"
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
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
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

export default NannyApplyForm;