import React from "react";
import { Shield, Star, Zap } from "lucide-react";

const WhyOurCompany = () => {
    return (
        <section
            id="company"
            className="relative scroll-m-6 overflow-hidden bg-white py-16 px-6 sm:py-20 md:py-24 lg:px-20"
        >
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div
                    className="text-center mb-12 md:mb-16"
                    data-aos="fade-down"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl text-gray-900">
                        Why Choose {" "}
                        <span className="font-bold text-black block lg:inline">
                            Our Company<span className="text-blue-500">?</span>
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                        We're committed to connecting families with trusted professionals who make life easier
                    </p>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* Left: Feature Cards */}
                    <div className="relative order-2 lg:order-1 space-y-6">
                        {/* Card 1 */}
                        <div
                            className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            data-aos="fade-right"
                            data-aos-delay="100"
                        >
                            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <Star className="w-7 h-7 text-blue-600" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Excellence Guaranteed
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We ensure only the most qualified and experienced
                                    cleaners, nannies, and caregivers are matched with
                                    families—guaranteeing dependable and top-quality service
                                    every time.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div
                            className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            data-aos="fade-right"
                            data-aos-delay="200"
                        >
                            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                                <Shield className="w-7 h-7 text-green-600" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Trust & Reliability
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Every worker is vetted for skills, background, and
                                    reliability, giving clients full peace of mind and
                                    consistent service they can depend on.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div
                            className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            data-aos="fade-right"
                            data-aos-delay="300"
                        >
                            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
                                <Zap className="w-7 h-7 text-yellow-600" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Innovation Driven
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We use smart technology to make finding, hiring, and
                                    managing domestic services quick, transparent, and
                                    convenient for both families and workers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Card */}
                    <div className="relative order-1 lg:order-2" data-aos="fade-left" data-aos-delay="100">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                            {/* Decorative background pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                                    <Star className="w-10 h-10" strokeWidth={2} />
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                    98% Customer Satisfaction
                                </h3>
                                
                                <p className="mb-8 text-green-50 text-lg leading-relaxed">
                                    Our dedication to matching families with the right
                                    professionals has earned us a high satisfaction rate and a
                                    growing community of happy clients across South Africa.
                                </p>

                                {/* Stats grid */}
                                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                                    <div data-aos="fade-up" data-aos-delay="200">
                                        <div className="text-4xl font-bold mb-1">500+</div>
                                        <div className="text-sm text-green-50">Jobs Completed</div>
                                    </div>
                                    <div data-aos="fade-up" data-aos-delay="300">
                                        <div className="text-4xl font-bold mb-1">10+</div>
                                        <div className="text-sm text-green-50">Years Experience</div>
                                    </div>
                                    <div data-aos="fade-up" data-aos-delay="400">
                                        <div className="text-4xl font-bold mb-1">99%</div>
                                        <div className="text-sm text-green-50">Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative floating elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyOurCompany;