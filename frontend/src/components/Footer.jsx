import { Circle, Facebook, Heart, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    const socialLinks = [
        {icon: Facebook, href: "https://www.facebook.com/profile.php?id=61552488884517&mibextid=wwXIfr", color:"hover:bg-pink-600"},
        {icon: Instagram, href: "https://www.instagram.com/shinespec/?igsh=MXVjeWZscm5sZ2Y2Yw%3D%3D&utm_source=qr", color:"hover:bg-pink-500"},
        {icon: Linkedin, href: "https://www.linkedin.com/company/shine-spec/posts/?feedView=all&viewAsMember=true", color:"hover:bg-pink-600"},
        {icon: Youtube, href: "https://www.youtube.com/@ShineSpec", color:"hover:bg-pink-600"},
    ];

    const quickLinks = [
        {label: "Home", href:"/"},
        {label: "About Us", href:"/about"},
        {label: "Company", href:"#"},
        {label: "Services", href:"/services"},
        {label: "Contact", href:"#"},
        {label: "Full-time services", href:"/fulltime-help"},
        {label: "Apply as a worker", href:"/apply-as-worker"},
        {label: "Terms & Conditions", href:"/terms"},
        {label: "Privacy Policy", href:"/privacy"}
    ];
    
    const services = [
        {label:"Office Cleaning", img: "/office.png"},
        {label:"Indoor Services", img: "/Indoor.png"},
        {label:"Moving Cleaning", img: "/moving.png"},
        {label:"Laundry & Ironing", img: "/laundry.png"},
        {label:"Mom's Helper", img: "/mom.png"},
        {label:"Elder Care", img: "/elder.png"},
        {label:"Event Cleaning", img: "/event.png"},
        {label:"Outdoor Services", img: "/outdoor.png"},
    ];

    const contactInfo = [
        {icon: Phone, text:"+27 63 145 7460", color:"text-pink-500"},
        {icon: Mail, text:"thabo@shinespec.com", color:"text-yellow-500"},
    ];

    const decorativeDots = [
        {color: "text-pink-500"},
        {color: "text-blue-500"},
        {color: "text-green-500"}
    ];

    const handleServiceClick = (service) => {
        navigate("/services/booking", { state: { selectedService: service } });
    };

    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8 px-4 sm:py-12 md:py-16 lg:py-20 lg:px-20">
            <div className="max-w-7xl mx-auto">
                {/* Main Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
                        <div className="flex items-center text-lg sm:text-xl md:text-2xl font-bold">
                            <img
                                src="/logo-ShineSpec.webp"
                                alt="ShineSpec Logo"
                                className="h-8 sm:h-10 md:h-12 w-auto"
                            />
                            <span>
                                Shine<span className="text-blue-500">Spec</span>
                            </span>
                        </div>
                        <div className="flex gap-3 sm:gap-4">
                            {socialLinks.map((social, idx) => (
                                <a key={idx} href={social.href}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center transition-colors ${social.color}`}>
                                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5"/>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold border-b-2 border-blue-500 pb-2 inline-block">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-center sm:text-left">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                    href={link.href}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold border-b-2 border-blue-500 pb-2 inline-block">
                            Our Services
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-center sm:text-left">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <button 
                                    onClick={() => handleServiceClick(service)}
                                    className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                                    >
                                        {service.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold border-b-2 border-blue-500 pb-2 inline-block">
                            Contact Info
                        </h3>
                        <div className="space-y-3 sm:space-y-4 flex flex-col items-center sm:items-start">
                            {contactInfo.map((contact, idx) => (
                                <div key={idx} className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        <contact.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${contact.color}`}/>
                                    </div>
                                    <p className="text-gray-300 text-sm sm:text-base break-words">
                                        {contact.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Dots */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {decorativeDots.map((dot, idx) => (
                        <Circle key={idx} className={`${dot.color} w-3 h-3 sm:w-4 sm:h-4`}/>
                    ))}
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
                    <p className="text-gray-400 text-xs sm:text-sm flex flex-wrap items-center justify-center gap-1">
                        @ 2025 Shine South (pty) Ltd, all rights reserved 
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 fill-current"/>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer