import React, { useState, useEffect } from "react";
import { CheckCircle, Upload, Calendar, FileText, User, Phone, Mail, MapPin, Briefcase, Clock, Shield, ChevronRight, ChevronLeft, AlertCircle, XCircle, Info, X, Loader2 } from "lucide-react";
import WorkExperienceSection from "../components/WorkExperienceSection";

const ApplyAsWorker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);


  // Update the formData state in ApplyAsWorker component
const [formData, setFormData] = useState({
  fullName: "",
  gender: "",
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
  workExperiences: [
    // Array of experience objects with integrated references
    // {
    //   id: timestamp,
    //   jobTitle: "",
    //   employer: "",
    //   duration: "",
    //   responsibilities: "",
    //   reference: {
    //     name: "",
    //     relationship: "",
    //     phone: "",
    //     email: ""
    //   }
    // }
  ],
  skills: "",
  qualificationsDocuments: [],
  availability: []
});

// Add this handler for work experiences
const handleWorkExperiencesUpdate = (experiences) => {
  setFormData(prev => ({
    ...prev,
    workExperiences: experiences
  }));
};

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
  const [validationErrors, setValidationErrors] = useState({});

  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    const intent = localStorage.getItem("applyWorkerIntent");
  
    if (intent === "submit") {
      setCurrentStep(2);
  
      // 🔴 CLEAR ALL FILE FIELDS (critical)
      setFormData(prev => ({
        ...prev,
        idDocument: null,
        photoDocument: null,
        proofOfAddress: null,
        workPermit: null,
        refugeeId: null,
        qualificationsDocuments: []
      }));
  
      localStorage.removeItem("applyWorkerIntent");
      localStorage.removeItem("applyWorkerStep");
  
      setTimeout(() => {
        alert(
          "You're almost done! Please re-upload your documents to complete your application."
        );
      }, 300);
    }
  }, []);
  
  
  // Load user data and auto-fill form fields
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) return;

      try {
        // Fetch full user data from API to get phone number
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const user = await res.json();
          // Auto-fill user details
          const fullName = `${user.name || ""} ${user.lastname || ""}`.trim();
          setFormData(prev => ({
            ...prev,
            fullName: fullName,
            email: user.email || "",
            phone: user.phone || ""
          }));
        } else {
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              const fullName = `${user.name || ""} ${user.lastname || ""}`.trim();
              setFormData(prev => ({
                ...prev,
                fullName: fullName,
                email: user.email || "",
                phone: user.phone || ""
              }));
            } catch (error) {
              console.error("Error parsing user data:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to localStorage if API fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            const fullName = `${user.name || ""} ${user.lastname || ""}`.trim();
            setFormData(prev => ({
              ...prev,
              fullName: fullName,
              email: user.email || "",
              phone: user.phone || ""
            }));
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
          }
        }
      }
    };

    loadUserData();
  }, [token]);

  // Check if user has already applied
  useEffect(() => {
    if (!token) {
      setLoadingStatus(false);
      setHasApplied(false);
      return;
    }
  
    const checkApplicationStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/workers/my-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.ok) {
          const data = await res.json();
          setHasApplied(true);
          setApplicationStatus((data.status || "pending").toLowerCase());
        } else {
          setHasApplied(false);
        }
      } catch (error) {
        setHasApplied(false);
      } finally {
        setLoadingStatus(false);
      }
    };
  
    checkApplicationStatus();
  }, [token]);
  
  const saveDraftToStorage = () => {
    localStorage.setItem(
      "workerApplicationDraft",
      JSON.stringify(formData)
    );
  };
  
  useEffect(() => {
    const draft = localStorage.getItem("workerApplicationDraft");
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error("Failed to restore draft");
      }
    }
  }, []);
  
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
    "Moving Cleaning",
    "Mom's Helper",
    "Event Cleaning"
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    if (field === "qualificationsDocuments") {
      // Handle multiple files for qualifications
      const filesArray = Array.from(file);
      setFormData(prev => ({
        ...prev,
        qualificationsDocuments: [...prev.qualificationsDocuments, ...filesArray]
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleRemoveQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualificationsDocuments: prev.qualificationsDocuments.filter((_, i) => i !== index)
    }));
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

  const validateStep = (step) => {
    switch (step) {
      case 1: // Personal Info
        const personalInfoErrors = [];
        if (!formData.fullName?.trim()) personalInfoErrors.push("Full name is required");
        if (!formData.gender) personalInfoErrors.push("Gender is required");
        if (!formData.nationality) personalInfoErrors.push("Nationality is required");
        if (!formData.idNumber?.trim()) personalInfoErrors.push(formData.nationality === "South African" ? "ID number is required" : "Passport number is required");
        if (!formData.phone?.trim()) personalInfoErrors.push("Phone number is required");
        if (!formData.email?.trim()) personalInfoErrors.push("Email address is required");
        if (!formData.province?.trim()) personalInfoErrors.push("Province is required");
        if (!formData.city?.trim()) personalInfoErrors.push("City is required");
        if (!formData.streetAddress?.trim()) personalInfoErrors.push("Street address is required");
        if (!formData.suburb?.trim()) personalInfoErrors.push("Suburb is required");
        if (!formData.postalCode?.trim()) personalInfoErrors.push("Postal code is required");
        return { isValid: personalInfoErrors.length === 0, errors: personalInfoErrors };

      case 2: // Documents
        const documentErrors = [];
        if (!formData.idDocument) documentErrors.push(formData.nationality === "South African" ? "ID document is required" : "Passport document is required");
        if (!formData.photoDocument) documentErrors.push("Profile photo is required");
        if (formData.nationality === "Foreign National" && !formData.workPermit) {
          documentErrors.push("Work permit is required for foreign nationals");
        }
        if (formData.nationality === "Refugee" && !formData.refugeeId) {
          documentErrors.push("Refugee ID / Asylum Seeker Permit is required");
        }
        return { isValid: documentErrors.length === 0, errors: documentErrors };

      case 3: // Services & Schedule
        const serviceErrors = [];
        if (!formData.serviceTypes || formData.serviceTypes.length === 0) {
          serviceErrors.push("At least one service must be selected");
        }
        if (!formData.availability || formData.availability.length === 0) {
          serviceErrors.push("At least one day of availability must be selected");
        }
        return { isValid: serviceErrors.length === 0, errors: serviceErrors };

      case 4: // Experience
        const experienceErrors = [];
        if (!formData.skills?.trim()) {
          experienceErrors.push("Additional skills are required");
        }
        return { isValid: experienceErrors.length === 0, errors: experienceErrors };

      case 5: // Review - no validation needed, just review
        return { isValid: true, errors: [] };

      default:
        return { isValid: true, errors: [] };
    }
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      // Set validation errors to display inline
      setValidationErrors({ [currentStep]: validation.errors });
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Clear validation errors for current step
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  // Clear validation errors when step changes (but not on form data changes to allow showing errors while user fixes them)
  useEffect(() => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });
  }, [currentStep]);

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {

    saveDraftToStorage();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/apply-as-worker");
      localStorage.setItem("applyWorkerIntent", "submit");
      localStorage.setItem("applyWorkerStep", currentStep.toString());
      setShowLoginPrompt(true);
      return;
    }
    
    if (!formData.idDocument || !formData.photoDocument) {
      alert(
        "Please re-upload your ID document and profile photo before submitting."
      );
      setCurrentStep(2);
      return;
    }
    
  
    // Check consent checkbox
    const consentCheckbox = document.getElementById('consent-checkbox');
    if (!consentCheckbox?.checked) {
      alert('Please confirm that all information provided is accurate and true by checking the consent checkbox.');
      return;
    }

    // Validate all steps before submission
    const step1Validation = validateStep(1);
    const step2Validation = validateStep(2);
    const step3Validation = validateStep(3);
    const step4Validation = validateStep(4);
    
    if (!step1Validation.isValid || !step2Validation.isValid || !step3Validation.isValid || !step4Validation.isValid) {
      const allErrors = [
        ...step1Validation.errors.map(e => `Step 1: ${e}`),
        ...step2Validation.errors.map(e => `Step 2: ${e}`),
        ...step3Validation.errors.map(e => `Step 3: ${e}`),
        ...step4Validation.errors.map(e => `Step 4: ${e}`)
      ];
      alert(`Please complete all required fields before submitting:\n\n${allErrors.join('\n')}`);
      // Go to first step with errors
      if (!step1Validation.isValid) setCurrentStep(1);
      else if (!step2Validation.isValid) setCurrentStep(2);
      else if (!step3Validation.isValid) setCurrentStep(3);
      else if (!step4Validation.isValid) setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true); // Add this at the start
    
    const form = new FormData();
    
    // Convert workExperiences to proper format
    const formattedExperiences = formData.workExperiences.map(exp => ({
      jobTitle: exp.jobTitle,
      employer: exp.employer,
      duration: exp.duration,
      responsibilities: exp.responsibilities,
      reference: exp.reference
    }));
  
    // Add text fields
    form.append("fullName", formData.fullName);
    form.append("gender", formData.gender);
    form.append("nationality", formData.nationality);
    form.append("idNumber", formData.idNumber || "");
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("country", formData.country);
    form.append("province", formData.province || "");
    form.append("city", formData.city || "");
    form.append("streetAddress", formData.streetAddress || "");
    form.append("suburb", formData.suburb || "");
    form.append("postalCode", formData.postalCode || "");
    form.append("serviceTypes", JSON.stringify(formData.serviceTypes));
    form.append("workExperiences", JSON.stringify(formattedExperiences));
    form.append("additionalSkills", formData.skills || "");
    form.append("availability", JSON.stringify(formData.availability));
  
    // Add file uploads
    if (formData.idDocument) form.append("idDocument", formData.idDocument);
    if (formData.photoDocument) form.append("photoDocument", formData.photoDocument);
    if (formData.proofOfAddress) form.append("proofOfAddress", formData.proofOfAddress);
    if (formData.workPermit) form.append("workPermit", formData.workPermit);
    if (formData.refugeeId) form.append("refugeeId", formData.refugeeId);
    // Add multiple qualifications documents
    if (formData.qualificationsDocuments && formData.qualificationsDocuments.length > 0) {
      formData.qualificationsDocuments.forEach((file) => {
        form.append("qualificationsDocuments", file);
      });
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/workers/apply`, {
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
    } finally {
      setIsSubmitting(false); // Add this in finally block
    }
  };

  const renderStatusIcon = () => {
    switch (applicationStatus) {
      case "approved":
        return (
          <CheckCircle className="w-20 h-20 text-green-500 drop-shadow-lg animate-bounce" />
        );
      case "rejected":
        return (
          <XCircle className="w-20 h-20 text-red-500 drop-shadow-lg animate-pulse" />
        );
      default:
        return (
          <Clock className="w-20 h-20 text-yellow-500 drop-shadow-lg animate-spin-slow" />
        );
    }
  };

  // Show loading state while checking application status
  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 text-xl font-medium">Checking your application status...</p>
        </div>
      </div>
    );
  }

  // Show application status if user has already applied
  if (hasApplied && applicationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-16 px-6 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
            {/* Badge */}
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-6 ${
                applicationStatus === "approved"
                  ? "bg-green-100 text-green-700"
                  : applicationStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {applicationStatus.toUpperCase()}
            </span>

            {/* Icon */}
            <div className="flex justify-center mt-6">{renderStatusIcon()}</div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-gray-800 mt-6 tracking-wide">
              Your Application Status
            </h2>

            {/* Message */}
            <p className="text-gray-600 mt-4 text-lg leading-relaxed mb-8">
              {applicationStatus === "approved" && (
                <>
                  🎉 <span className="font-semibold">Congratulations!</span>  
                  Your worker profile has been approved.  
                  You will start receiving job opportunities soon.
                </>
              )}
              {applicationStatus === "rejected" && (
                <>
                  Your application was not approved.  
                  <br />
                  You may contact support for more details.
                </>
              )}
              {applicationStatus === "pending" && (
                <>
                  Your application is still under review by our team.  
                  <br />
                  Please check again later.
                </>
              )}
            </p>

            {/* Additional Info */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {applicationStatus === "pending" && (
                  <>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Background check will be initiated (2-3 business days)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Criminal record verification will be conducted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Admin team will review your application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>You'll receive an email within 5-7 business days</span>
                    </li>
                  </>
                )}
                {applicationStatus === "approved" && (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>You can now receive job bookings from clients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Keep your profile updated to get more opportunities</span>
                    </li>
                  </>
                )}
                {applicationStatus === "rejected" && (
                  <>
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Contact our support team for more information about the decision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>You may be able to re-apply after addressing any issues</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Footer Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm mb-8">
              <Info className="w-4 h-4" />
              <span>We typically respond within 24–48 hours.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = "/"}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Return to Home
              </button>
              {applicationStatus === "rejected" && (
                <button 
                  onClick={() => window.location.href = "/contact"}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Contact Support
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-16 px-6 pt-24">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <CheckCircle className="absolute inset-0 w-8 h-8 text-blue-600 m-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Submitting Application</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we process your application. This may take a few moments...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading documents and saving your information</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Join Our <span className="text-blue-600">Professional Team</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This application is for cleaners, caregivers, nannies, and maintenance professionals seeking verified placement opportunities.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
  <div className="relative">

    {/* Connector background */}
    <div
      className="absolute top-6 h-2 bg-gray-200 rounded-full"
      style={{
        left: "10%",
        right: "10%",
      }}
    />

    {/* Active connector fill */}
    <div
      className="absolute top-6 h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
      style={{
        left: "10%",
        width: `${
          ((currentStep - 1) / (steps.length - 1)) * 80
        }%`,
      }}
    />

    {/* Steps */}
    <div className="relative flex items-center justify-between">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex flex-col items-center flex-1 z-10">

            {/* Step Circle */}
            <div
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-500 ease-in-out
                ${
                  isCompleted
                    ? "bg-blue-400 text-white scale-95"
                    : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-105"
                      : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 animate-[pop_0.6s_ease-out]" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
            </div>

            {/* Label */}
            <p
              className={`
                text-xs mt-2 font-medium hidden sm:block transition-colors
                ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}
              `}
            >
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
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
  readOnly={isLoggedIn}
  placeholder="Enter your full name as per ID"
  className={`w-full p-3 border rounded-xl outline-none
    ${isLoggedIn
      ? "bg-gray-50 text-gray-600 cursor-not-allowed"
      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
 />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
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
  readOnly={isLoggedIn}
  placeholder="Enter your phone number"
  className={`w-full p-3 border rounded-xl outline-none
    ${isLoggedIn
      ? "bg-gray-50 text-gray-600 cursor-not-allowed"
      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
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
  readOnly={isLoggedIn}
  placeholder="Enter your email address"
  className={`w-full p-3 border rounded-xl outline-none
    ${isLoggedIn
      ? "bg-gray-50 text-gray-600 cursor-not-allowed"
      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`}
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

  <input
    type="text"
    value={formData.city}
    onChange={(e) => handleInputChange("city", e.target.value)}
    placeholder="Type your city"
    className="w-full p-3 border border-gray-300 rounded-xl
    focus:ring-2 focus:ring-blue-500 outline-none"
  />
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
              <p className="text-gray-600 mb-6">Please upload clear, legible copies of the following documents. <span className="text-red-600 font-semibold">* Required</span></p>

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
                      {formData[doc.field] instanceof File && (
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
                  Select Services You Offer <span className="text-red-600">*</span>
                </label>
                {formData.serviceTypes.length === 0 && validationErrors[3]?.some(err => err.includes("service")) && (
                  <p className="text-sm text-red-600 mb-2">Please select at least one service</p>
                )}
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
                  Set Your Availability <span className="text-red-600">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">Select the days you're available to work:</p>
                {formData.availability.length === 0 && validationErrors[3]?.some(err => err.includes("availability")) && (
                  <p className="text-sm text-red-600 mb-2">Please select at least one day</p>
                )}
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
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience & Qualifications</h2>
    
    {/* Work Experience Component */}
    <WorkExperienceSection 
      workExperiences={formData.workExperiences}
      onUpdate={handleWorkExperiencesUpdate}
    />

    <div className="border-t border-gray-200 pt-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Additional Skills <span className="text-red-600">*</span>
        </label>
        {!formData.skills?.trim() && validationErrors[4]?.some(err => err.includes("skills")) && (
          <p className="text-sm text-red-600 mb-2">Please provide your additional skills</p>
        )}
        <p className="text-xs text-gray-500 mb-2">List other relevant skills and expertise</p>
        <textarea
          value={formData.skills}
          onChange={(e) => handleInputChange("skills", e.target.value)}
          placeholder="E.g., Deep cleaning, ironing, cooking, childcare, first aid, time management, garden maintenance..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Certifications & Qualifications (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-2">Upload your certificates, training documents, or formal qualifications</p>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition">
          <label className="block cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Upload Certificates/Qualifications</p>
                <p className="text-sm text-gray-500">You can upload multiple files (PDF, JPG, PNG)</p>
              </div>
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={(e) => handleFileUpload("qualificationsDocuments", e.target.files)}
              className="hidden"
            />
            {formData.qualificationsDocuments && formData.qualificationsDocuments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.qualificationsDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </label>
        </div>
      </div>
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
              
              {/* Final validation check before submit */}
              {(() => {
                const step1Validation = validateStep(1);
                const step2Validation = validateStep(2);
                const step3Validation = validateStep(3);
                const step4Validation = validateStep(4);
                const allErrors = [
                  ...step1Validation.errors.map(e => `Step 1: ${e}`),
                  ...step2Validation.errors.map(e => `Step 2: ${e}`),
                  ...step3Validation.errors.map(e => `Step 3: ${e}`),
                  ...step4Validation.errors.map(e => `Step 4: ${e}`)
                ];
                
                if (allErrors.length > 0) {
                  return (
                    <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-900 mb-2">Please complete all required fields before submitting:</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {allErrors.map((error, index) => (
                              <li key={index} className="text-sm text-amber-700">{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.fullName || "Not provided"}</span></div>
                    <div><span className="text-gray-600">Gender:</span> <span className="font-medium">{formData.gender || "Not provided"}</span></div>
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
                      {formData.workExperiences && formData.workExperiences.length > 0 ? (
                        <div className="mt-2 space-y-3">
                          {formData.workExperiences.map((exp, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="font-semibold text-gray-900">{exp.jobTitle || "Position"} at {exp.employer || "Employer"}</p>
                              <p className="text-gray-600 text-xs mt-1">Duration: {exp.duration || "Not specified"}</p>
                              <p className="text-gray-700 mt-2">{exp.responsibilities || "No responsibilities specified"}</p>
                              {exp.reference && (exp.reference.name || exp.reference.phone) && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Reference:</span> {exp.reference.name || ""} 
                                    {exp.reference.relationship && ` (${exp.reference.relationship})`}
                                    {exp.reference.phone && ` - ${exp.reference.phone}`}
                                    {exp.reference.email && ` - ${exp.reference.email}`}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 mt-1">Not provided</p>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Skills:</span>
                      <p className="text-gray-700 mt-1">{formData.skills || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Certifications & Qualifications:</span>
                      {formData.qualificationsDocuments && formData.qualificationsDocuments.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {formData.qualificationsDocuments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 mt-1">Not provided (optional)</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-300 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="consent-checkbox"
                      className="w-5 h-5 text-blue-600 rounded mt-0.5" 
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that all information provided is accurate and true. I understand that false information may result in rejection or termination. I consent to background checks and verification of my documents. <span className="text-red-600">*</span>
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
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Application</span>
                  </>
                )}
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
      {showLoginPrompt && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowLoginPrompt(false)}
    />

    {/* Modal */}
    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Close button */}
      <button
        onClick={() => setShowLoginPrompt(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Icon */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Shield className="w-8 h-8 text-blue-600" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
        Login Required
      </h3>

      {/* Message */}
      <p className="text-gray-600 text-center mb-6 leading-relaxed">
        To protect your application and link it to your profile,  
        please log in or create an account before submitting.
      </p>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Log In
        </button>

        <button
          onClick={() => {
            window.location.href = "/sign-up";
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition"
        >
          Create an Account
        </button>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Your progress is saved. You’ll return here after logging in.
      </p>
    </div>
  </div>
)}

    </div>
  );
};

export default ApplyAsWorker;