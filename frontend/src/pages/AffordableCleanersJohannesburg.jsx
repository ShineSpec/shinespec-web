import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  DollarSign,
  Sparkles
} from 'lucide-react';

const AffordableCleanersJohannesburg = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'Affordable Cleaners in Johannesburg | ShineSpec - Trusted Local Cleaning Services';
    
    // Add or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Find affordable, reliable cleaners in Johannesburg. ShineSpec connects you with verified local cleaners for homes, offices, and apartments. Transparent hourly rates, no hidden fees. Book instantly online.');

    // Add structured data for local SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ShineSpec - Affordable Cleaners in Johannesburg",
      "description": "Affordable, reliable cleaning services in Johannesburg. Connect with verified local cleaners for homes, offices, and apartments.",
      "url": window.location.origin,
      "telephone": "+27",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Johannesburg",
        "addressRegion": "Gauteng",
        "addressCountry": "ZA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -26.2041,
        "longitude": 28.0473
      },
      "areaServed": [
        "Soweto",
        "Johannesburg CBD",
        "Randburg",
        "Roodepoort",
        "Sandton",
        "Midrand"
      ],
      "priceRange": "R290-R800",
      "serviceType": [
        "Home Cleaning",
        "Office Cleaning",
        "Deep Cleaning",
        "Moving Cleaning",
        "Laundry Services"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "500"
      }
    };

    // Remove existing structured data script if present
    const existingScript = document.querySelector('script[type="application/ld+json"][data-page="affordable-cleaners"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'affordable-cleaners');
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleBookNow = () => {
    navigate('/services');
  };

  const johannesburgAreas = [
    'Soweto',
    'Johannesburg CBD',
    'Randburg',
    'Roodepoort',
    'Sandton',
    'Midrand',
    'Bryanston',
    'Rosebank',
    'Parktown',
    'Melrose',
    'Fourways',
    'Northcliff',
    'Westdene',
    'Greenside',
    'Emmarentia'
  ];

  const services = [
    { img: '/Indoor.png', name: 'Home & Apartment Cleaning', desc: 'Regular and deep cleaning for residential spaces' },
    { img: '/office.png', name: 'Office & Workplace Cleaning', desc: 'Professional cleaning for businesses and offices' },
    { img: '/moving.png', name: 'Moving-In / Moving-Out Cleaning', desc: 'Complete cleaning for property transitions' },
    { img: '/Indoor.png', name: 'Deep Cleaning', desc: 'Thorough cleaning for special occasions or maintenance' },
    { img: '/laundry.png', name: 'Laundry & Ironing Assistance', desc: 'Professional laundry and ironing services' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section 
        className="relative text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-28 mt-20 bg-cover bg-center bg-no-repeat min-h-[400px] sm:min-h-[500px] flex items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552937075-967cf58b74a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Affordable Cleaners in <span className="text-yellow-300">Johannesburg</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 text-blue-100 leading-relaxed max-w-3xl">
            Looking for affordable, reliable cleaners in Johannesburg? ShineSpec makes it easy to find trusted local cleaners for homes, offices, and apartments — all at transparent hourly rates with no hidden fees.
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-blue-100 max-w-3xl">
            Whether you need a once-off clean or regular help, ShineSpec connects you with verified cleaners near you in minutes.
          </p>
          <button
            onClick={handleBookNow}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            Book a Cleaner Now →
          </button>
        </div>
      </section>

      {/* Why Choose ShineSpec Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Why Choose ShineSpec for Affordable Cleaning?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-4">
              Finding a cleaner shouldn't be stressful or expensive. ShineSpec is built to make cleaning services accessible, fair, and professional.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              With ShineSpec, you get:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">✔️ Affordable Hourly Pricing</h3>
                  <p className="text-sm sm:text-base text-gray-600">Pay only for the hours you need. No contracts, no hidden fees, no surprises.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">✔️ Cleaners Available Across Johannesburg</h3>
                  <p className="text-sm sm:text-base text-gray-600">Find verified cleaners in your neighborhood, from Soweto to Sandton.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">✔️ Flexible Booking</h3>
                  <p className="text-sm sm:text-base text-gray-600">Choose hours that fit your budget. Book for 3 hours or 8 hours — you decide.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">✔️ Secure Online Payments</h3>
                  <p className="text-sm sm:text-base text-gray-600">Pay safely through our secure platform. Multiple payment options available.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">✔️ Easy Booking — No Phone Calls Needed</h3>
                  <p className="text-sm sm:text-base text-gray-600">Book your cleaner online in minutes. Select service, choose hours, and confirm.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">✔️ Verified & Trusted Cleaners</h3>
                  <p className="text-sm sm:text-base text-gray-600">All cleaners are background-checked and reviewed by previous clients.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
            <p className="text-base sm:text-lg text-gray-800 font-semibold italic">
              "We believe everyone deserves a clean space, without overpaying."
            </p>
          </div>
        </div>
      </section>

      {/* Services Available Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Cleaning Services Available in Johannesburg
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 text-center max-w-3xl mx-auto px-4">
            Our platform connects you with cleaners offering a wide range of services, including:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all border border-blue-100"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4">
                  <img
                    src={service.img}
                    alt={service.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm sm:text-base text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-gray-800 font-medium mb-3 sm:mb-0">
              Simply choose the service you need, select the number of hours, and book instantly.
            </p>
            <button
              onClick={handleBookNow}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              View All Services →
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center px-2">
            How Much Do Affordable Cleaners Cost in Johannesburg?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center max-w-3xl mx-auto px-4">
            Cleaning prices on ShineSpec are hour-based, making them flexible and budget-friendly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Number of Hours</h3>
              <p className="text-sm sm:text-base text-gray-600">Choose 3-8 hours based on your needs. More hours = better value per hour.</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Type of Service</h3>
              <p className="text-sm sm:text-base text-gray-600">Different services have different rates. Indoor cleaning starts from R290 for 3 hours.</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg sm:col-span-2 md:col-span-1">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-sm sm:text-base text-gray-600">Prices are consistent across Johannesburg. No location-based surcharges.</p>
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-xl p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
              <h3 className="text-xl sm:text-2xl font-bold">Transparent Pricing</h3>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4">
              You'll see your full price upfront before booking, so there are no surprises. Our pricing structure is designed to be fair for both clients and cleaners.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold">R290</p>
                <p className="text-xs sm:text-sm text-blue-200">3 hours</p>
              </div>
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold">R320</p>
                <p className="text-xs sm:text-sm text-blue-200">5 hours</p>
              </div>
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold">R350</p>
                <p className="text-xs sm:text-sm text-blue-200">7 hours</p>
              </div>
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold">R365</p>
                <p className="text-xs sm:text-sm text-blue-200">8 hours</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-blue-200 mt-3 sm:mt-4 italic">
              *Prices shown are for Indoor Services. Other services may vary. All prices in South African Rand (ZAR).
            </p>
          </div>
        </div>
      </section>

      {/* Areas Covered Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center px-2">
            📍 Cleaners Available Across Johannesburg
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center max-w-3xl mx-auto px-4">
            ShineSpec connects you with cleaners in many Johannesburg areas, including:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {johannesburgAreas.map((area, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-all border border-blue-100 text-center"
              >
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{area}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-base sm:text-lg text-gray-800 font-semibold mb-2">
              Wherever you are in Johannesburg, ShineSpec helps you find affordable cleaners near you.
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              Don't see your area? Contact us — we're expanding our coverage across the city.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center px-2">
            🔐 Trusted & Verified Cleaners
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center max-w-3xl mx-auto px-4">
            Your safety and peace of mind matter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Reviewed by Clients</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Every cleaner has ratings and reviews from previous clients. See their track record before booking.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Managed Through Secure Platform</h3>
              <p className="text-sm sm:text-base text-gray-600">
                All bookings are managed through ShineSpec's secure platform. Your information and payments are protected.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Booked and Paid Through ShineSpec</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Secure transactions, clear communication, and full accountability on every job.
              </p>
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-xl p-4 sm:p-6 md:p-8 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">This ensures accountability, professionalism, and trust on every job.</h3>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4 sm:mb-6">
              When you book through ShineSpec, you're not just hiring a cleaner — you're getting a verified professional backed by our platform's guarantee of quality service.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Background Checks</h4>
                <p className="text-xs sm:text-sm text-blue-200">All cleaners undergo identity verification and background screening.</p>
              </div>
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Insurance Coverage</h4>
                <p className="text-xs sm:text-sm text-blue-200">Workers are covered by our platform insurance for your peace of mind.</p>
              </div>
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Quality Guarantee</h4>
                <p className="text-xs sm:text-sm text-blue-200">If you're not satisfied, we'll work to make it right.</p>
              </div>
              <div className="bg-blue-700 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">24/7 Support</h4>
                <p className="text-xs sm:text-sm text-blue-200">Our support team is available to help with any questions or concerns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center px-2">
            How to Book Affordable Cleaners in Johannesburg
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 text-center max-w-3xl mx-auto px-4">
            Booking a cleaner through ShineSpec is simple, fast, and secure. Here's how it works:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Choose Your Service</h3>
              <p className="text-sm sm:text-base text-gray-600">Select from home cleaning, office cleaning, deep cleaning, or other services.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Select Hours</h3>
              <p className="text-sm sm:text-base text-gray-600">Choose how many hours you need (3-8 hours). See the price instantly.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Pick Date & Time</h3>
              <p className="text-sm sm:text-base text-gray-600">Select your preferred date and time slot from available options.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Pay & Confirm</h3>
              <p className="text-sm sm:text-base text-gray-600">Complete secure payment online. Your booking is confirmed instantly.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 sm:p-6 md:p-8 text-center shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Book Your Cleaner?</h3>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4 sm:mb-6">
              Join thousands of satisfied customers in Johannesburg who trust ShineSpec for affordable, reliable cleaning services.
            </p>
            <button
              onClick={handleBookNow}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
            >
              Book Your Cleaner Now →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">
             Frequently Asked Questions ❓
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                How much do cleaners cost in Johannesburg?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Cleaning services on ShineSpec start from R290 for 3 hours of indoor cleaning. Prices vary based on the number of hours and type of service. You'll see the exact price before booking.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Are the cleaners verified and trustworthy?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Yes! All cleaners on ShineSpec undergo background checks, identity verification, and are reviewed by previous clients. You can see ratings and reviews before booking.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                What areas in Johannesburg do you cover?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                We cover most areas in Johannesburg including Soweto, CBD, Randburg, Roodepoort, Sandton, Midrand, and many more. If your area isn't listed, contact us and we'll check availability.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Can I book for the same day?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Yes, if cleaners are available. We recommend booking at least 24 hours in advance for the best selection, but same-day bookings are possible depending on availability.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                What if I'm not satisfied with the cleaning?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                We stand behind our service. If you're not satisfied, contact our support team within 24 hours and we'll work to resolve the issue, which may include a re-clean or refund.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Do I need to provide cleaning supplies?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Most cleaners bring their own basic supplies. However, if you have specific products you prefer, you can mention this in your booking notes. The cleaner will confirm what's needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-28 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
            Start Your Booking Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
            Join thousands of Johannesburg residents who trust ShineSpec for affordable, reliable cleaning services. Book your cleaner in minutes and enjoy a spotless space.
          </p>
          <button
            onClick={handleBookNow}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 sm:py-4 sm:px-10 rounded-lg text-base sm:text-lg md:text-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            Find Affordable Cleaners in Johannesburg →
          </button>
          <p className="mt-4 sm:mt-6 text-blue-200 text-xs sm:text-sm px-4">
            No hidden fees • Verified cleaners • Secure payments • 100% satisfaction guaranteed
          </p>
        </div>
      </section>
    </div>
  );
};

export default AffordableCleanersJohannesburg;

