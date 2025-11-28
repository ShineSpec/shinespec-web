import React, { useState } from "react";
import { CheckCircle, Upload, Calendar, FileText, User, Phone, Mail, MapPin, Briefcase, Clock, Shield, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

const ApplyAsWorker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "South African",
    idNumber: "",
    workPermit: null,
    refugeeId: null,
    phone: "",
    email: "",
    country: "South Africa",
    province: "",
    city: "",
    streetAddress: "",
    suburb: "",
    postalCode: "",
    serviceTypes: [],
    idDocument: null,
    photoDocument: null,
    proofOfAddress: null,
    workExperience: "",
    skills: "",
    qualifications: "",
    references: "",
    availability: []
  });

  const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape"
  ];

  const citiesByProvince = {
    "Gauteng": ["Johannesburg", "Pretoria", "Ekurhuleni", "Midrand", "Centurion", "Randburg", "Sandton", "Soweto", "Tembisa", "Alexandra"],
    "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "George", "Knysna", "Mossel Bay", "Worcester", "Somerset West"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Newcastle", "Richards Bay", "Empangeni", "Ladysmith", "Ulundi"],
    "Eastern Cape": ["Port Elizabeth", "East London", "Mthatha", "Grahamstown", "Queenstown", "Uitenhage", "King William's Town"],
    "Free State": ["Bloemfontein", "Welkom", "Kroonstad", "Bethlehem", "Sasolburg", "Phuthaditjhaba"],
    "Limpopo": ["Polokwane", "Tzaneen", "Musina", "Thohoyandou", "Lebowakgomo", "Mokopane"],
    "Mpumalanga": ["Nelspruit", "Witbank", "Middelburg", "Secunda", "Standerton", "Ermelo"],
    "Northern Cape": ["Kimberley", "Upington", "Springbok", "De Aar", "Kuruman"],
    "North West": ["Rustenburg", "Klerksdorp", "Potchefstroom", "Mafikeng", "Brits", "Vryburg"]
  };
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Documents", icon: FileText },
    { number: 3, title: "Services & Schedule", icon: Calendar },
    { number: 4, title: "Experience", icon: Briefcase },
    { number: 5, title: "Review & Submit", icon: CheckCircle }
  ];

  const services = [
    "Indoor Cleaning",
    "Outdoor Cleaning",
    "Laundry & Ironing",
    "Child Care",
    "Elder Care",
    "Office Cleaning",
    "Gardening",
    "Cooking"
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter(s => s !== service)
        : [...prev.serviceTypes, service]
    }));
  };

  const handleAvailabilityToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      form.append(key, JSON.stringify(value));
    } else if (value) {
      form.append(key, value);
    }
  });

  try {
    const response = await fetch("http://localhost:5000/api/workers/apply", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: form,
});

    const data = await response.json();
    if (response.ok) {
      setSubmitted(true);
    } else {
      alert(data.message || "Something went wrong.");
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Server error while submitting form.");
  }
};

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for applying to join our team. Your application is now under review.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Background check will be initiated (2-3 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Criminal record verification will be conducted</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Admin team will review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email within 5-7 business days</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = "/check-status"}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Check Application Status
              </button>
              <button 
                onClick={() => window.location.href = "/"}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Join Our <span className="text-blue-600">Professional Team</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your application to become a verified service professional
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? "bg-green-500 text-white" :
                      isActive ? "bg-blue-600 text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs mt-2 font-medium hidden sm:block ${
                      isActive ? "text-blue-600" : "text-gray-600"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 transition-all ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name as per ID"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nationality *
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="South African">South African</option>
                  <option value="Foreign National">Foreign National (Work Permit)</option>
                  <option value="Refugee">Refugee / Asylum Seeker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  {formData.nationality === "South African" ? "ID Number *" : "Passport Number *"}
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  placeholder={formData.nationality === "South African" ? "Enter your ID number" : "Enter your passport number"}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => {
                    handleInputChange("province", e.target.value);
                    handleInputChange("city", ""); // Reset city when province changes
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!formData.province}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.province ? "Select a city" : "Select a province first"}
                  </option>
                  {formData.province &&
                    citiesByProvince[formData.province]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                  placeholder="Enter your street address"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Suburb *
                </label>
                <input
                  type="text"
                  value={formData.suburb}
                  onChange={(e) => handleInputChange("suburb", e.target.value)}
                  placeholder="Enter your suburb"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="Enter your postal code"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
              <p className="text-gray-600 mb-6">Please upload clear, legible copies of the following documents:</p>

              <div className="space-y-4">
                {[
                  { field: "idDocument", label: formData.nationality === "South African" ? "ID/Passport Document *" : "ID/Passport Document *", desc: formData.nationality === "South African" ? "Clear photo or scan of your ID" : "Clear photo or scan of your passport" },
                  { field: "photoDocument", label: "Profile Photo *", desc: "Recent picture of yourself" },
                  { field: "proofOfAddress", label: "Proof of Address (Optional)", desc: "Utility bill or bank statement (not older than 3 months)" }
                ].map((doc) => (
                  <div key={doc.field} className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition">
                    <label className="block cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">{doc.label}</p>
                          <p className="text-sm text-gray-500">{doc.desc}</p>
                        </div>
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(doc.field, e.target.files[0])}
                        className="hidden"
                      />
                      {formData[doc.field] && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{formData[doc.field].name}</span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}

                {/* Work Permit for Foreign Nationals */}
                {formData.nationality === "Foreign National" && (
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 hover:border-blue-500 transition bg-blue-50">
                    <label className="block cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">Work Permit *</p>
                          <p className="text-sm text-gray-600">Valid South African work permit or visa</p>
                        </div>
                        <Upload className="w-8 h-8 text-blue-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("workPermit", e.target.files[0])}
                        className="hidden"
                      />
                      {formData.workPermit && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{formData.workPermit.name}</span>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {/* Refugee ID for Refugees/Asylum Seekers */}
                {formData.nationality === "Refugee" && (
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 hover:border-blue-500 transition bg-blue-50">
                    <label className="block cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">Refugee ID / Asylum Seeker Permit *</p>
                          <p className="text-sm text-gray-600">Section 22 or Section 24 permit issued by DHA</p>
                        </div>
                        <Upload className="w-8 h-8 text-blue-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("refugeeId", e.target.files[0])}
                        className="hidden"
                      />
                      {formData.refugeeId && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{formData.refugeeId.name}</span>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Document Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Files must be clear and legible</li>
                      <li>Accepted formats: JPG, PNG, PDF</li>
                      <li>Maximum file size: 5MB per document</li>
                      {formData.nationality === "Foreign National" && <li>Work permit must be valid and allow employment in South Africa</li>}
                      {formData.nationality === "Refugee" && <li>Refugee permit must be valid (Section 22 or Section 24)</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services & Schedule */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Availability</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Select Services You Offer *
                </label>
                <p className="text-sm text-gray-600 mb-3">You can select multiple services:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label key={service} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                      formData.serviceTypes.includes(service)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-blue-50"
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.serviceTypes.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Set Your Availability *
                </label>
                <p className="text-sm text-gray-600 mb-3">Select the days you're available to work:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleAvailabilityToggle(day)}
                      className={`p-3 rounded-xl font-medium transition ${
                        formData.availability.includes(day)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Areas (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Specify areas you're willing to work in"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Experience */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience & References</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Work Experience *
                </label>
                <p className="text-xs text-gray-500 mb-2">Describe your relevant work history and responsibilities</p>
                <textarea
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange("workExperience", e.target.value)}
                  placeholder="E.g., Worked as a domestic worker for 5 years with the Smith family, responsible for cleaning, laundry, and meal preparation..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Skills *
                </label>
                <p className="text-xs text-gray-500 mb-2">List your specific skills and areas of expertise</p>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="E.g., Deep cleaning, ironing, cooking traditional meals, elderly care, first aid, childcare, time management..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Qualifications (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-2">List any certificates, training, or formal qualifications</p>
                <textarea
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange("qualifications", e.target.value)}
                  placeholder="E.g., First Aid Certificate (2022), Child Care Training (ABC Institute), Food Safety Certificate..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  References *
                </label>
                <p className="text-xs text-gray-500 mb-2">Provide at least 2 references with their contact information</p>
                <textarea
                  value={formData.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  placeholder="E.g., 
1. Jane Smith (Previous Employer) - 082 123 4567 - jane@example.com
2. John Doe (Supervisor at Community Center) - 071 987 6543 - john@example.com"
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Background Verification:</p>
                    <p>All applications undergo thorough background checks including criminal record verification to ensure safety for our clients.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.fullName || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Nationality:</span> <span className="font-medium">{formData.nationality}</span></div>
                    <div><span className="text-gray-600">{formData.nationality === "South African" ? "ID Number:" : "Passport Number:"}</span> <span className="font-medium">{formData.idNumber || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.phone || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.email || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Country:</span> <span className="font-medium">{formData.country}</span></div>
                    <div><span className="text-gray-600">Province:</span> <span className="font-medium">{formData.province || "Not provided"}</span></div>
                    <div><span className="text-gray-600">City:</span> <span className="font-medium">{formData.city || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Suburb:</span> <span className="font-medium">{formData.suburb || "Not provided"}</span></div>
                    <div className="sm:col-span-2"><span className="text-gray-600">Street Address:</span> <span className="font-medium">{formData.streetAddress || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Postal Code:</span> <span className="font-medium">{formData.postalCode || "Not provided"}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {formData.idDocument ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                      <span>{formData.nationality === "South African" ? "ID Document" : "Passport"} {formData.idDocument ? "uploaded" : "missing"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.photoDocument ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                      <span>Photo {formData.photoDocument ? "uploaded" : "missing"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.proofOfAddress ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
                      <span>Proof of Address {formData.proofOfAddress ? "uploaded" : "(optional - not provided)"}</span>
                    </div>
                    {formData.nationality === "Foreign National" && (
                      <div className="flex items-center gap-2">
                        {formData.workPermit ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                        <span>Work Permit {formData.workPermit ? "uploaded" : "missing"}</span>
                      </div>
                    )}
                    {formData.nationality === "Refugee" && (
                      <div className="flex items-center gap-2">
                        {formData.refugeeId ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                        <span>Refugee ID / Asylum Permit {formData.refugeeId ? "uploaded" : "missing"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Services & Availability</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-600">Services:</span> 
                      <span className="font-medium ml-2">
                        {formData.serviceTypes.length > 0 ? formData.serviceTypes.join(", ") : "Not selected"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Available:</span> 
                      <span className="font-medium ml-2">
                        {formData.availability.length > 0 ? formData.availability.join(", ") : "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Experience & Qualifications</h3>
                  <div className="text-sm space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium">Work Experience:</span>
                      <p className="text-gray-700 mt-1">{formData.workExperience || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Skills:</span>
                      <p className="text-gray-700 mt-1">{formData.skills || "Not provided"}</p>
                    </div>
                    {formData.qualifications && (
                      <div>
                        <span className="text-gray-600 font-medium">Qualifications:</span>
                        <p className="text-gray-700 mt-1">{formData.qualifications}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600 font-medium">References:</span>
                      <p className="text-gray-700 mt-1 whitespace-pre-line">{formData.references || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-300 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded mt-0.5" />
                    <span className="text-sm text-gray-700">
                      I confirm that all information provided is accurate and true. I understand that false information may result in rejection or termination. I consent to background checks and verification of my documents.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Application
              </button>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">
            Why Work With Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Flexible Working Hours",
                desc: "Choose when you want to work and manage your own schedule easily."
              },
              {
                icon: CheckCircle,
                title: "Fair & Transparent Pay",
                desc: "We ensure competitive rates and on-time payments for all services."
              },
              {
                icon: Shield,
                title: "Safe Work Environment",
                desc: "We prioritize your safety with trusted clients and support."
              }
            ].map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
                >
                  <Icon className="w-10 h-10 text-blue-500 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {perk.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyAsWorker;