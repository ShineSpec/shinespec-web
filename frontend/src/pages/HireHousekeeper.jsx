import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Shield, 
  Star,
  ChevronDown,
  ChevronUp,
  Home,
  Sparkles,
  Clock,
  Mail
} from "lucide-react";

const HireHousekeeper = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Can I get a refund if I don't like any of the candidates?",
      answer: "We don't offer refunds on the placement fee, but we will continue sourcing and recommending additional candidates for you to trial until you find the right fit."
    },
    {
      id: 2,
      question: "How many interviews and trial bookings can I do?",
      answer: "You can interview up to 5 candidates. After that, you'll need to book a trial session with one or more to move forward with the process."
    },
    {
      id: 3,
      question: "What's included in the placement fee?",
      answer: "The placement fee covers expert sourcing, vetting, and coordination of interviews and trials — plus support until you find the right helper."
    },
    {
      id: 4,
      question: "What if my placement isn't the right fit?",
      answer: "If you're not satisfied within the first 90 days of hiring your helper, we'll find a replacement — free of charge. Simply reach out to your dedicated agent at support@shinespec.com."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Fill in an application form, with your specific needs.",
      icon: <Home className="w-6 h-6" />
    },
    {
      number: "2",
      title: "Pay your Initiation Fee to start your search.",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      number: "3",
      title: "Receive profiles of your recommended matches.",
      icon: <Users className="w-6 h-6" />
    },
    {
      number: "4",
      title: "Interview housekeepers and book trial sessions.",
      icon: <Clock className="w-6 h-6" />
    },
    {
      number: "5",
      title: "Hire your chosen housekeeper and pay the Placement Fee to complete your placement.",
      icon: <Star className="w-6 h-6" />
    },
    {
      number: "6",
      title: "Manage your housekeeper via the ShineSpec App or privately.",
      icon: <Sparkles className="w-6 h-6" />
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Enhanced Design */}
      <section className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">NEW! SHINESPEC PLACEMENTS</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              Hire a housekeeper.
            </h1>
            <p className="text-xl sm:text-2xl text-pink-50 mb-10 leading-relaxed animate-slide-up animation-delay-200">
              We source reliable, full-time housekeepers, to be managed by you or through the ShineSpec App. Our expert agents are here to find your perfect match.
            </p>
            <button
              onClick={() => navigate("/services/booking")}
              className="group bg-white text-pink-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-pink-50 transition-all shadow-2xl hover:shadow-pink-300/50 flex items-center gap-3 mx-auto hover:scale-105 transform duration-300 animate-slide-up animation-delay-400"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Pricing Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What does it cost?
          </h2>
          <p className="text-lg text-gray-600 mb-12">Simple, transparent pricing</p>
          
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-pink-50 via-white to-rose-50 rounded-3xl p-10 sm:p-14 shadow-2xl border-2 border-pink-100 hover:shadow-pink-200/50 transition-all duration-300">
              <div className="mb-6">
                <div className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  R1249
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                  Placement Fee
                </div>
                <div className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-semibold">
                  One-time payment
                </div>
              </div>
              
              <div className="border-t border-pink-200 pt-6 mt-6">
                <p className="text-gray-700 text-lg mb-4">
                  This is a non-refundable Placement Fee.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700 transition-colors">
                  View detailed pricing guide
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <p className="text-sm text-gray-500 mt-6">Terms & Conditions apply</p>
            </div>
          </div>
        </div>
      </section>

      {/* Happiness Guarantee - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0aDd2MWgtN3YtMXptMTQgMHY3aC0xdi03aDF6bS0xNCAxNGg3djFoLTd2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-2xl border border-gray-100">
            <div className="flex flex-col items-center text-center">
              {/* Shield Icon with Pulse Animation */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 shadow-lg">
                  <Shield className="w-16 h-16 text-white" />
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Our happiness guarantee
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl leading-relaxed">
                If you're not completely satisfied within the first 90 days of hiring your helper, we'll match you with a replacement helper at <span className="font-bold text-green-600">no extra cost</span>.
              </p>

              {/* 90 Day Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full shadow-lg">
                <CheckCircle className="w-8 h-8" />
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">90</span>
                  <span className="text-2xl font-bold">day guarantee</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-8">Terms & Conditions apply</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Us - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why choose ShineSpec?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium placement service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-pink-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full opacity-10 -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Experienced & Vetted Professionals
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We connect you with highly skilled and reliable professionals. We carefully vet and match each candidate to ensure they meet your specific needs.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-10 -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Customise Your Preferences
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To ensure the best fit, trial one or a few different housekeepers before making a final decision. Your satisfaction is our priority.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-10 -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Expert Placements, Guaranteed
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  With a focus on trust, efficiency, and satisfaction, our service makes it easy to find the right professional for your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Housekeepers - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Meet our housekeepers
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Our placements are <span className="font-bold text-pink-600">highly experienced</span>, <span className="font-bold text-pink-600">vetted</span> and <span className="font-bold text-pink-600">reference-checked</span>. We have strict criteria to ensure that only the best candidates are available to be matched with you.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl text-center border border-pink-100">
                <div className="text-4xl font-bold text-pink-600 mb-2">100%</div>
                <div className="text-gray-700 font-medium">Background Checked</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl text-center border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-gray-700 font-medium">Years Experience</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl text-center border border-green-100">
                <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-700 font-medium">Satisfaction Rate</div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate("/services/booking")}
                className="group bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 hover:scale-105 transform duration-300"
              >
                Start Your Search
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How does it work?
            </h2>
            <p className="text-xl text-gray-600">Simple steps to find your perfect match</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-pink-50 via-white to-rose-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-pink-100"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex justify-end mb-4">
                  <div className="text-pink-400 group-hover:text-pink-600 transition-colors">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-800 font-semibold text-lg leading-relaxed">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Your questions, <span className="italic text-pink-600">answered</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about our service</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                >
                  <span className="font-bold text-lg text-gray-900 pr-4 group-hover:text-pink-600 transition-colors">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaq === faq.id 
                      ? 'bg-pink-500 text-white rotate-180' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-pink-100 group-hover:text-pink-600'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                {openFaq === faq.id && (
                  <div className="px-8 py-6 bg-gradient-to-br from-pink-50 to-rose-50 border-t-2 border-pink-100 animate-fade-in">
                    <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative py-24 bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Ready to find your perfect housekeeper?
          </h2>
          <p className="text-xl sm:text-2xl text-pink-50 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get started today and let us help you find the right match for your home. Our expert team is ready to assist you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/services/booking")}
              className="group bg-white text-pink-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-pink-50 transition-all shadow-2xl hover:shadow-pink-300/50 flex items-center gap-3 hover:scale-105 transform duration-300"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a href="mailto:support@shinespec.com" className="group flex items-center gap-3 text-white hover:text-pink-100 transition-colors">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Or contact us directly</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-pink-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>90-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Fully Vetted</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>Expert Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* Add animations to the style tag */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: backwards;
        }
      `}</style>
    </div>
  );
};

export default HireHousekeeper;