import React from "react";
import { Circle, Heart, Award, Users, Target, ArrowRight } from "lucide-react";

const About = () => {
    return (
        <section id='about' className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 
        py-12 px-4 sm:py-16 md:py-20 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 w-full lg:mr-8 xl:mr-12 relative order-2 lg:order-1 mt-10 lg:mt-0">
                <div 
                className="w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl h-[300px] sm:h-[350px] md:h-[400px]
                lg:h-[450px] xl:h-[500px] overflow-hidden shadow-lg md:shadow-xl relative z-10 -rotate-2
                rounded-[40%_60%_70%_30%/40%_50%_60%_60%] hover:rotate-0 transition-transform duration-700"
                data-aos='fade-right'
                data-aos-delay='200'
                >
                    <img 
                    src="/cleaning.png"
                    alt="About"
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
                    />
                </div>
            </div>
            <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 space-y-6 md:space-y-8 relative z-20 order-1 lg:order-2">
                <div className="mb-6 md:mb-8" data-aos="fade-left">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 text-center lg:text-left">
                        Agency {" "}
                        <span className="font-bold text-black block lg:inline">
                            Overview<span className="text-blue-500">.</span>
                        </span>
                    </h2>

                    <div className="flex gap-3 mt-4 justify-center lg:justify-start">
                        <Circle className="text-pink-500 w-5 h-5"/>
                        <Circle className="text-blue-500 w-5 h-5"/>
                        <Circle className="text-green-500 w-5 h-5"/>
                    </div>
                </div>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed text-center lg:text-left"
                data-aos='fade-left'
                data-aos-delay='100'>
                    We specialize in connecting skilled house cleaners, caregivers, and nannies with individuals and 
                    families in need of reliable, professional help. Our goal is to match qualified workers with clients,
                     ensuring trusted and lasting relationships built on care and quality service.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10"
    data-aos="fade-up"
    data-aos-delay="200">
    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-md
    md:shadow-lg transition-all hover:shadow-xl">
        <div className="w-10 h-10 md:w-12 flex items-center justify-center rounded-lg bg-pink-100 mb-3 md:mb-4">
            <Users className="text-pink-600 w-5 h-5 md:w-6 md:h-6"/>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            Expert Team
        </h3>
        <p className="text-gray-700 text-xs md:text-sm">
            Our team carefully screens and connects skilled house cleaners, caregivers, 
            and nannies, ensuring families receive dependable and professional service.
        </p>
    </div>
    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-md
    md:shadow-lg transition-all hover:shadow-xl">
        <div className="w-10 h-10 md:w-12 flex items-center justify-center rounded-lg bg-yellow-100 mb-3 md:mb-4">
            <Target className="text-yellow-600 w-5 h-5 md:w-6 md:h-6"/>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            Our Mission
        </h3>
        <p className="text-gray-700 text-xs md:text-sm">
            We aim to make it simple and safe for families to find trusted help while 
            empowering local workers with stable and rewarding job opportunities.
        </p>
    </div>
</div>

                <div className="flex justify-center lg:justify-start mt-8 md:mt-10"
                data-aos="fade-up"
                data-aos-delay="300">
                    <button className="px-6 py-3 md:px-8 md:py-4 bg-pink-500 text-white rounded-full font-medium
                    hover:bg-pink-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm md:text-base">
                        Learn more About Us
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5"/>
                    </button>
                </div>
            </div>

        </section>
    )
}

export default About