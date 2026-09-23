import React from "react";
import { Shield, Star, Zap } from "lucide-react";

const WhyOurCompany = () => {
    return (
        <section
            id="company"
            className="relative scroll-m-6 overflow-hidden bg-white py-14 px-4 sm:py-20 md:py-24 lg:px-20"
        >
            <div className="max-w-7xl mx-auto">
                
                {/* Heading */}
                <div
                    className="text-center mb-10 sm:mb-14 md:mb-16"
                    data-aos="fade-down"
                >
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight">
                        Why Choose{" "}
                        <span className="font-bold text-black block lg:inline">
                            Our Company<span className="text-blue-500">?</span>
                        </span>
                    </h2>

                    <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                        We're committed to connecting families with trusted professionals who make life easier.
                    </p>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* Left: Feature Cards */}
                    <div className="order-2 lg:order-1 space-y-6">

                        {/* Card 1 */}
                        <div
                            className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            data-aos="fade-right"
                            data-aos-delay="100"
                        >
                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" strokeWidth={2} />
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                    Excellence Guaranteed
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    We ensure only the most qualified and experienced cleaners, nannies, 
                                    and caregivers are matched with families—guaranteeing dependable and 
                                    top-quality service every time.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div
                            className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            data-aos="fade-right"
                            data-aos-delay="200"
                        >
                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" strokeWidth={2} />
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                    Trust & Reliability
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    Every worker is vetted for skills, background, and reliability, giving clients 
                                    peace of mind and consistent service they can depend on.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div
                            className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            data-aos="fade-right"
                            data-aos-delay="300"
                        >
                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
                                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" strokeWidth={2} />
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                    Innovation Driven
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    We use smart technology to make finding, hiring, and managing domestic services 
                                    quick, transparent, and convenient for both families and workers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Card */}
                    <div
                        className="order-1 lg:order-2"
                        data-aos="fade-left"
                        data-aos-delay="100"
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">

                            {/* Background shapes */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5 sm:mb-6">
                                    <Star className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2} />
                                </div>

                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                                    98% Customer Satisfaction
                                </h3>

                                <p className="mb-6 sm:mb-8 text-green-50 text-base sm:text-lg leading-relaxed">
                                    Our dedication to matching families with the right professionals has earned us a 
                                    growing community of happy clients across South Africa.
                                </p>

                                {/* Stats grid */}
                                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/20">

                                    <div data-aos="fade-up" data-aos-delay="200">
                                        <div className="text-2xl sm:text-4xl font-bold mb-1">500+</div>
                                        <div className="text-xs sm:text-sm text-green-50">Jobs Completed</div>
                                    </div>

                                    <div data-aos="fade-up" data-aos-delay="300">
                                        <div className="text-2xl sm:text-4xl font-bold mb-1">300+</div>
                                        <div className="text-xs sm:text-sm text-green-50">Verified Professionals</div>
                                    </div>

                                    <div data-aos="fade-up" data-aos-delay="400">
                                        <div className="text-2xl sm:text-4xl font-bold mb-1">99%</div>
                                        <div className="text-xs sm:text-sm text-green-50">Success Rate</div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Floating decor */}
                        <div className="absolute -top-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 bg-green-200 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-28 sm:w-32 h-28 sm:h-32 bg-green-300 rounded-full opacity-20 blur-2xl"></div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyOurCompany;
