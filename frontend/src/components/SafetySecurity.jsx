import React from "react";
import { Search, Phone, FileCheck, Users, TestTube } from "lucide-react";

const SafetySecurity = () => {
    const features = [
        {
            icon: Search,
            title: "Background Checks",
            description: "Criminal and identity verification to ensure your safety."
        },
        {
            icon: Phone,
            title: "Reference Calls",
            description: "We contact previous employers to verify reliability and performance."
        },
        {
            icon: FileCheck,
            title: "Document Verification",
            description: "We review IDs, certifications, and work history for authenticity."
        },
        {
            icon: Users,
            title: "In-Person Interviews",
            description: "We assess personality, professionalism, and communication."
        },
        {
            icon: TestTube,
            title: "Trial Period (Optional)",
            description: "For long-term roles, we offer a supervised trial to ensure the perfect fit."
        }
    ];

    return (
        <section className="relative py-16 px-6 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Card Container */}
                <div 
                    className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 md:p-16"
                    data-aos="fade-up"
                >
                    {/* Heading */}
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Your Safety and Security Come First<span className="text-blue-500">.</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Ensuring peace of mind with every step you take.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="flex flex-col items-center text-center group"
                                data-aos="fade-up"
                                data-aos-delay={100 + (index * 100)}
                            >
                                {/* Icon Circle */}
                                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-300">
                                    <feature.icon className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-base font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                
                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SafetySecurity;