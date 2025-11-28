import { Circle, Facebook, Heart, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
    const socialLinks = [
        {icon: Facebook, href: "#", color:"hover:bg-pink-600"},
        {icon: Twitter, href: "#", color:"hover:bg-blue-500"},
        {icon: Instagram, href: "#", color:"hover:bg-pink-500"},
        {icon: Linkedin, href: "#", color:"hover:bg-pink-600"},
    ];
    const quickLinks = [
        {label: "Home", href:"#"},
        {label: "About Us", href:"#"},
        {label: "Company", href:"#"},
        {label: "Services", href:"#"},
        {label: "Contact", href:"#"},
    ];
    const services = [
        {label:"Office Cleaning", href: "#"},
        {label:"Express Cleaning", href: "#"},
        {label:"Moving Cleaning", href: "#"},
        {label:"Laundry & Ironing", href: "#"},
        {label:"Mom's Helper", href: "#"},
        {label:"Elder Care", href: "#"},
        {label:"Extra Care", href: "#"},
        {label:"Outdoor Services", href: "#"},
    ];
    const contactInfo = [
        {icon: Phone, text:"+27 84 258 9071", color:"text-pink-500"},
        {icon: Mail, text:"info@shinespec.com", color:"text-yellow-500"},
        {
            icon: MapPin,
            text: "123 kenfl street kdkldnf kwjrngj kwnerjgn kswjfw.",
            color: "text-green-500",
            multiline: true
        }
    ];
    const decorativeDots = [
        {color: "text-pink-500"},
        {color: "text-blue-500"},
        {color: "text-green-500"}
    ]
    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:py-16 md:py-20 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
                <div className="space-y-6">
                    <div className="flex items-center text-2xl font-bold">
                        <img
                    src="/logo-ShineSpec.png"
                    alt="ShineSpec Logo"
                    className="h-10 sm:h-12 w-auto"
                />
                        <span>
                            Shine<span className="text-blue-500">Spec</span>
                        </span>
                    </div>
                    <div className="flex gap-4">
                        {socialLinks.map((social, idx) => (
                            <a key={idx} href={social.href}
                            className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center transition-colors ${social.color}`}>
                                <social.icon className="w-5 h-5"/>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b-2 border-blue-500 pb-2 inline-block">
                        Quick Links
                    </h3>
                    <ul className="space-y-3">
                        {quickLinks.map((link, index) => (
                            <li key={index}>
                                <a 
                                href={link.href}
                                className="text-gray-300 hover:text-blue-600 transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b-2 border-blue-500 pb-2 inline-block">
                        Our Services
                    </h3>
                    <ul className="space-y-3">
                        {services.map((service, index) => (
                            <li key={index}>
                                <a 
                                href={service.href}
                                className="text-gray-300 hover:text-blue-600 transition-colors"
                                >
                                    {service.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b-2 border-blue-500 pb-2 inline-block">
                        Contact Info
                    </h3>
                    <div className="space-y-3">
                        {contactInfo.map((contact, idx) => (
                            <div key={idx} className={`flex items-center gap-3 ${contact.multiline ? 'items-start' : ''}`}>
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <contact.icon className={`w-5 h-5
                                        ${contact.color}`}/>
                                </div>
                                <div>
                                    <p className="text-gray-300 whitespace-pre-line">
                                        {contact.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-3 mb-8">
                {decorativeDots.map((dot, idx) => (
                    <Circle key={idx} className={`${dot.color} w-4 h-4`}/>
                ))}
            </div>
            <div className="border-t border-gray-700 pt-8 text-center">
                <p className="text-gray-400 flex items-center justify-center gap-1">
                    @ 2025 Shine South (pty) Ltd, all rights reserved 
                    <Heart className="w-4 h-4 text-blue-500 fill-current"/>
                </p>
            </div>
            </div>
        </footer>
    )
}

export default Footer