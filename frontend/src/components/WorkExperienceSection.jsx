import React, { useState } from "react";
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

// Enhanced Work Experience Component
const WorkExperienceSection = ({ workExperiences, onUpdate }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      jobTitle: "",
      employer: "",
      duration: "",
      responsibilities: "",
      reference: {
        name: "",
        relationship: "",
        phone: "",
        email: ""
      }
    };
    onUpdate([...workExperiences, newExp]);
    setExpandedIndex(workExperiences.length);
  };

  const removeExperience = (index) => {
    onUpdate(workExperiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...workExperiences];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      updated[index][parent][child] = value;
    } else {
      updated[index][field] = value;
    }
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <Briefcase className="w-4 h-4 inline mr-2" />
          Work Experience *
        </label>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {workExperiences.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">No work experience added yet</p>
          <p className="text-gray-500 text-xs mt-1">Click "Add Experience" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workExperiences.map((exp, index) => (
            <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
              {/* Header - Collapsible */}
              <button
                type="button"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {exp.jobTitle || "Add job title"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {exp.employer ? `at ${exp.employer}` : "Add employer"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(index);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="p-4 border-t border-gray-200 bg-white space-y-4">
                  {/* Job Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                        placeholder="e.g., Domestic Worker, House Cleaner"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Employer *
                      </label>
                      <input
                        type="text"
                        value={exp.employer}
                        onChange={(e) => updateExperience(index, "employer", e.target.value)}
                        placeholder="e.g., Smith Family, ABC Company"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, "duration", e.target.value)}
                      placeholder="e.g., 3 years (2020-2023) or Jan 2020 - Present"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Responsibilities & Achievements *
                    </label>
                    <textarea
                      value={exp.responsibilities}
                      onChange={(e) => updateExperience(index, "responsibilities", e.target.value)}
                      placeholder="Describe your key duties and achievements. e.g., 'Handled household cleaning, laundry, cooking, and childcare for 2 children'"
                      rows={3}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                    />
                  </div>

                  {/* Reference Section */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Reference for this Experience</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Reference Name *
                        </label>
                        <input
                          type="text"
                          value={exp.reference.name}
                          onChange={(e) => updateExperience(index, "reference.name", e.target.value)}
                          placeholder="e.g., Jane Smith"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Relationship *
                        </label>
                        <select
                          value={exp.reference.relationship}
                          onChange={(e) => updateExperience(index, "reference.relationship", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                          <option value="">Select relationship</option>
                          <option value="Employer">Employer</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Manager">Manager</option>
                          <option value="Client">Client</option>
                          <option value="Colleague">Colleague</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={exp.reference.phone}
                          onChange={(e) => updateExperience(index, "reference.phone", e.target.value)}
                          placeholder="e.g., 082 123 4567"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={exp.reference.email}
                          onChange={(e) => updateExperience(index, "reference.email", e.target.value)}
                          placeholder="e.g., jane@example.com"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        💡 Tip: Add at least 2 work experiences with references for better chances of approval
      </p>
    </div>
  );
};

export default WorkExperienceSection;