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
  Heart,
  Clock,
  Award,
  Phone,
  MessageCircle,
  Sparkles
} from "lucide-react";

const HireCarer = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      icon: <Heart className="w-7 h-7" />,
      color: "from-blue-400 to-blue-600"
    },
    {
      number: "2",
      title: "Pay your Initiation Fee to start your search.",
      icon: <CheckCircle className="w-7 h-7" />,
      color: "from-cyan-400 to-cyan-600"
    },
    {
      number: "3",
      title: "Receive profiles of your recommended matches.",
      icon: <Users className="w-7 h-7" />,
      color: "from-indigo-400 to-indigo-600"
    },
    {
      number: "4",
      title: "Interview carers and book trial sessions.",
      icon: <MessageCircle className="w-7 h-7" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      number: "5",
      title: "Hire your chosen carer and pay the Placement Fee to complete your placement.",
      icon: <Award className="w-7 h-7" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      number: "6",
      title: "Manage your carer via the ShineSpec App or privately.",
      icon: <Sparkles className="w-7 h-7" />,
      color: "from-cyan-500 to-blue-600"
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Unique Design */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white overflow-hidden">
        {/* Circular Pattern Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-400 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <Heart className="w-5 h-5 text-blue-200" />
                <span className="text-sm font-semibold">COMPASSIONATE CARE PLACEMENTS</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Hire a <span className="text-cyan-200">carer.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
                We source reliable, full-time carers, to be managed by you or through the ShineSpec App. Our expert agents are here to find your perfect match.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/services/carer/apply")}
                  className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 justify-center"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Illustration/Stats Card */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="bg-cyan-400 rounded-full p-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">100%</div>
                      <div className="text-blue-100 text-sm">Vetted & Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="bg-indigo-400 rounded-full p-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">24/7</div>
                      <div className="text-blue-100 text-sm">Support Available</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="bg-blue-400 rounded-full p-3">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">10+ Years</div>
                      <div className="text-blue-100 text-sm">Experience Average</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80C240 26.6667 480 0 720 0C960 0 1200 26.6667 1440 80V80H0V80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Pricing Section - Unique Card Design */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Investment in Care
            </h2>
            <p className="text-xl text-gray-600">Transparent, honest pricing</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Main Pricing Card */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white rounded-3xl p-10 sm:p-12 shadow-2xl border-4 border-blue-100">
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-bl-2xl rounded-tr-2xl font-bold text-sm">
                  MOST POPULAR
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-gray-600">R</span>
                      <span className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        2249
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Carer Placement Fee
                  </h3>
                  
                  <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">Expert sourcing & matching</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">Background checks & vetting</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">Interview coordination</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">90-day satisfaction guarantee</span>
                      </li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => navigate("/services/carer/apply")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Start Your Journey
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-6">
                    One-time, non-refundable fee • Terms & Conditions apply
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Different Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              The ShineSpec Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compassionate care meets professional excellence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Large Feature Card */}
            <div className="lg:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-20 h-20 mb-6 flex items-center justify-center">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Compassionate Care Specialists
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-6">
                  Our carers are not just qualified—they're passionate about providing dignified, compassionate care. Each candidate undergoes rigorous screening, including background checks, reference verification, and personality assessments.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-300" />
                    <span>Certified & Experienced</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-300" />
                    <span>Empathetic & Patient</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-300" />
                    <span>Continuous Training</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Smaller Feature Cards */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border-2 border-cyan-100 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Fully Vetted & Insured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every carer is thoroughly vetted, reference-checked, and insured for your complete peace of mind.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-indigo-100 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Personalized Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We take time to understand your unique needs and match you with the perfect carer for your situation.
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-700 font-medium">Successful Placements</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
              <div className="text-gray-700 font-medium">Satisfaction Rate</div>
            </div>
            <div className="bg-cyan-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">15+</div>
              <div className="text-gray-700 font-medium">Years Experience</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Stepped Design */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Your Journey to Finding Care
            </h2>
            <p className="text-xl text-gray-600">A simple, stress-free process</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200"></div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative z-10">
                    {/* Step Number with Gradient */}
                    <div className="absolute -top-6 -right-6">
                      <div className={`bg-gradient-to-br ${step.color} text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shadow-lg`}>
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className={`bg-gradient-to-br ${step.color} text-white rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center`}>
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-800 font-semibold text-lg leading-relaxed">
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section - Unique Design */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">YOUR PEACE OF MIND MATTERS</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                90-Day Happiness Guarantee
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                If you're not completely satisfied within the first 90 days of hiring your carer, we'll match you with a replacement at <span className="font-bold text-white">absolutely no extra cost</span>. Your loved one's care is too important to compromise on.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                  <span>No Questions Asked</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free Replacement</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="bg-white/20 backdrop-blur-lg rounded-full w-64 h-64 flex items-center justify-center border-8 border-white/30">
                <div className="text-center">
                  <div className="text-7xl font-black mb-2">90</div>
                  <div className="text-2xl font-bold">DAYS</div>
                  <div className="text-lg text-blue-200">Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Tabbed Design */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Questions? <span className="text-blue-600">We have answers.</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about our carer placement service</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/50 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                      openFaq === faq.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaq === faq.id 
                      ? 'bg-blue-600 text-white rotate-180' 
                      : 'bg-white text-gray-600'
                  }`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                {openFaq === faq.id && (
                  <div className="px-8 py-6 bg-white border-t-2 border-blue-100">
                    <p className="text-gray-700 text-lg leading-relaxed pl-14">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+27000000000" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                <Phone className="w-5 h-5" />
                Call us directly
              </a>
              <a href="mailto:support@shinespec.com" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                <MessageCircle className="w-5 h-5" />
                Send us a message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Unique Design */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 sm:p-16 border border-white/20 text-center">
            <Heart className="w-20 h-20 mx-auto mb-6 text-blue-200" />
            
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Ready to Find Compassionate Care?
            </h2>
            <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Take the first step towards finding the perfect carer for your loved ones. Our team is ready to help you every step of the way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={() => navigate("/services/carer/apply")}
                className="group bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 flex items-center gap-3 justify-center hover:scale-105 transform duration-300"
              >
                Start Your Journey
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">90-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">Expert Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm">Compassionate Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Custom Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default HireCarer;