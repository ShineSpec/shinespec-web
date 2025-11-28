import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Shield, 
  Star,
  ChevronDown,
  Heart,
  Baby,
  BookOpen,
  Music,
  Smile,
  Award,
  Clock,
  Phone,
  Mail
} from "lucide-react";

const HireNanny = () => {
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
      answer: "If you're not satisfied within the first 90 days of hiring your nanny, we'll find a replacement — free of charge. Simply reach out to your dedicated agent at support@shinespec.com."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Fill in an application form, with your specific needs.",
      description: "Tell us about your family and childcare requirements"
    },
    {
      number: "2",
      title: "Pay your Initiation Fee to start your search.",
      description: "Secure your spot in our placement process"
    },
    {
      number: "3",
      title: "Receive profiles of your recommended matches.",
      description: "Review carefully selected nanny candidates"
    },
    {
      number: "4",
      title: "Interview nannies and book trial sessions.",
      description: "Meet candidates and see them interact with your children"
    },
    {
      number: "5",
      title: "Hire your chosen nanny and pay the Placement Fee to complete your placement.",
      description: "Finalize the hiring process with confidence"
    },
    {
      number: "6",
      title: "Manage your nanny via the ShineSpec App or privately.",
      description: "Seamless ongoing management and support"
    },
  ];

  const features = [
    {
      icon: <Baby className="w-8 h-8" />,
      title: "Child Development Focus",
      description: "Our nannies are trained in age-appropriate activities and developmental milestones.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Educational Activities",
      description: "Engaging learning experiences tailored to your child's interests and abilities.",
      color: "from-teal-400 to-cyan-500"
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Creative Play",
      description: "Encouraging imagination through arts, crafts, music, and outdoor activities.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: "Positive Nurturing",
      description: "Creating a warm, loving environment where children feel safe and valued.",
      color: "from-emerald-500 to-green-600"
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Playful Design */}
      <section className="relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white overflow-hidden">
        {/* Playful Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-40 h-40 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-purple-300 rounded-full"></div>
        </div>

        {/* Floating Shapes Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-12 h-12 bg-white/20 rounded-lg rotate-12 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/20 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-white/20 rounded-lg rotate-45 animate-float-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30">
              <Heart className="w-5 h-5 text-pink-200" />
              <span className="text-sm font-bold tracking-wide">TRUSTED NANNY PLACEMENTS</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
              Find Your Family's
              <span className="block text-yellow-200">Perfect Nanny</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-green-50 mb-10 leading-relaxed max-w-3xl mx-auto">
              We source reliable, loving nannies who will nurture your children and become a trusted part of your family. Managed by you or through the ShineSpec App.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate("/services/booking")}
                className="group bg-white text-green-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-2xl hover:shadow-green-900/30 flex items-center gap-3 justify-center hover:scale-105 transform duration-300"
              >
                Start Your Search
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-green-100 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Background Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Highly Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/30 to-transparent"></div>
      </section>

      {/* What Makes Great Nanny Section */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What Makes a Great Nanny?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just supervision—enriching your child's world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-green-200 hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Colorful Card */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Invest in quality care for your children</p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Decorative background circles */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-green-200 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-teal-200 rounded-full opacity-30 blur-2xl"></div>

            <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-10 sm:p-14 shadow-2xl border-2 border-green-200">
              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="inline-flex flex-col items-center">
                  <div className="text-8xl font-black bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    R2249
                  </div>
                  <div className="bg-green-600 text-white px-6 py-2 rounded-full font-bold text-lg mb-4">
                    Nanny Placement Fee
                  </div>
                  <p className="text-gray-600 text-lg">One-time investment • Non-refundable</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-2xl p-8 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">What's Included</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Comprehensive background checks</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Reference verification</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Personality assessment</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Interview coordination</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Trial session setup</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">90-day guarantee</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/services/booking")}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-green-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform duration-300"
              >
                Get Started Today
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Terms & Conditions apply • <a href="#" className="text-green-600 hover:underline">View pricing guide</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Card Grid */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Families Trust Us
            </h2>
            <p className="text-xl text-gray-600">
              Finding the right nanny shouldn't be stressful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all border-2 border-green-100 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-5 w-20 h-20 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Experienced Professionals
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Every nanny in our network has years of childcare experience and is passionate about child development.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all border-2 border-teal-100 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full p-5 w-20 h-20 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Thoroughly Vetted
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Rigorous background checks, reference verification, and in-person interviews ensure quality matches.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all border-2 border-emerald-100 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-5 w-20 h-20 mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ongoing Support
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our team provides continuous support to ensure a successful, long-term placement for your family.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl sm:text-6xl font-black mb-2">1000+</div>
                <div className="text-green-100 text-lg font-semibold">Happy Families</div>
              </div>
              <div>
                <div className="text-5xl sm:text-6xl font-black mb-2">97%</div>
                <div className="text-green-100 text-lg font-semibold">Success Rate</div>
              </div>
              <div>
                <div className="text-5xl sm:text-6xl font-black mb-2">8+</div>
                <div className="text-green-100 text-lg font-semibold">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Six simple steps to find your perfect nanny</p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-6 items-start group"
              >
                {/* Step Number Circle */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-16 bg-gradient-to-b from-green-300 to-teal-300 mx-auto mt-2"></div>
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all group-hover:-translate-y-1 border border-green-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section - Split Design */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-bold">YOUR SATISFACTION GUARANTEED</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">
                90-Day Happiness Guarantee
              </h2>
              
              <p className="text-xl sm:text-2xl text-green-50 mb-8 leading-relaxed">
                Not happy with your nanny placement? We'll find you a replacement within 90 days at <span className="font-bold text-yellow-200">no additional cost</span>. Your family's happiness is our priority.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">No questions asked policy</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">Free replacement matching</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">Dedicated support team</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-12 border-4 border-white/30">
                  <div className="bg-white rounded-full w-64 h-64 flex flex-col items-center justify-center shadow-2xl">
                    <Shield className="w-20 h-20 text-green-600 mb-4" />
                    <div className="text-8xl font-black text-green-600">90</div>
                    <div className="text-2xl font-bold text-gray-900">DAYS</div>
                    <div className="text-green-600 font-semibold">Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Colorful Accordion */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Got questions? We've got answers!</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  openFaq === faq.id ? 'ring-4 ring-green-200' : ''
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className={`w-full px-8 py-6 flex items-center justify-between text-left transition-all ${
                    openFaq === faq.id
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                      : 'bg-white hover:bg-green-50 text-gray-900'
                  }`}
                >
                  <span className="font-bold text-lg pr-4">{faq.question}</span>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFaq === faq.id
                        ? 'bg-white/20 text-white rotate-180'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                {openFaq === faq.id && (
                  <div className="px-8 py-6 bg-green-50 border-t-2 border-green-200">
                    <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-700 text-lg mb-4">Have more questions? We're here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@shinespec.com"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
              <a
                href="tel:+27000000000"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Playful Design */}
      <section className="relative py-24 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white overflow-hidden">
        {/* Playful Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-pink-300 rounded-full animate-bounce-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-purple-300 rounded-full animate-bounce-delayed"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-20 h-20 mx-auto mb-6 text-pink-200" />
          
          <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">
            Ready to Find Your Family's Perfect Nanny?
          </h2>
          
          <p className="text-xl sm:text-2xl text-green-50 mb-10 max-w-3xl mx-auto leading-relaxed">
            Start your journey to finding a loving, qualified nanny who will help your children thrive. Our team is ready to help you every step of the way!
          </p>

          <button
            onClick={() => navigate("/services/booking")}
            className="group bg-white text-green-600 px-12 py-6 rounded-full font-black text-xl hover:bg-green-50 transition-all shadow-2xl hover:shadow-white/50 flex items-center gap-3 mx-auto hover:scale-110 transform duration-300"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Trust Elements */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">90-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Fully Vetted</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              <span className="font-semibold">5-Star Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              <span className="font-semibold">Trusted by 1000+ Families</span>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(-5deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce-delayed {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-bounce-delayed {
          animation: bounce-delayed 5s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
};

export default HireNanny;