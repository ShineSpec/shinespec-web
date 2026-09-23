import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Circle,
  Building2,
  Store,
  PartyPopper,
  HardHat,
  Key,
  ClipboardCheck,
  Home,
  Gift,
  LayoutDashboard,
  CalendarClock,
  Camera,
  Percent,
  ShieldCheck,
  FileCheck,
  Phone,
  ArrowRight,
  Leaf,
  Quote,
} from "lucide-react";
import BusinessAIMatcher from "../components/BusinessAIMatcher";

const coreServices = [
  {
    icon: <img src="/desk.png" alt="Office Cleaning" className="w-9 h-9 object-contain" />,
    title: "Office Cleaning",
    description:
      "Half-day or full-day sessions that keep desks, boardrooms, and shared spaces spotless and productive, scheduled around your working hours.",
    bg: "bg-blue-50",
  },
  {
    icon: <Store className="w-8 h-8 text-pink-600" />,
    title: "Retail & Business Premises",
    description:
      "A professional, hygienic shop floor or front-of-house leaves a lasting impression on every customer who walks in.",
    bg: "bg-pink-50",
  },
  {
    icon: <PartyPopper className="w-8 h-8 text-purple-600" />,
    title: "Event Cleaning",
    description:
      "Weddings, parties, corporate functions, and special occasions covered end to end, from pre-event setup to post-event cleanup.",
    bg: "bg-purple-50",
    image: "/events.png",
  },
  {
    icon: <HardHat className="w-8 h-8 text-yellow-600" />,
    title: "Specialized Industrial Services",
    description:
      "Carpets, upholstery, windows, and post-construction sites handled by teams equipped for the job, not a general clean.",
    bg: "bg-yellow-50",
  },
  {
    icon: <Key className="w-8 h-8 text-green-600" />,
    title: "Airbnb & Short-Term Rental Turnover",
    description:
      "Fast, reliable turnover cleans built for hospitality timelines, so the next guest always checks into a spotless space.",
    bg: "bg-green-50",
  },
];

const aiAdvantages = [
  {
    icon: <CalendarClock className="w-7 h-7 text-blue-600" />,
    title: "Predictive Scheduling",
    description:
      "The platform learns your business's rhythm and prompts you ahead of time, like reminding you a deep clean usually falls on the first Monday of the month.",
    status: "In development",
  },
  {
    icon: <Camera className="w-7 h-7 text-purple-600" />,
    title: "AI-Powered Quality Verification",
    description:
      "Computer vision compares before-and-after photos against a quality score, so you have proof of completeness without walking the floor yourself.",
    status: "In development",
  },
  {
    icon: <Percent className="w-7 h-7 text-green-600" />,
    title: "Smart Pricing for Volume",
    description:
      "Dynamic pricing recognizes high-volume and long-term contracts and adjusts rates accordingly, no separate negotiation required.",
    status: "In development",
  },
];

const vettingSteps = [
  { step: "01", title: "Criminal Background Check", description: "Every provider is screened before they're approved to work." },
  { step: "02", title: "Reference Calls", description: "We speak directly with past employers or clients before onboarding." },
  { step: "03", title: "Document Verification", description: "ID, right-to-work, and qualification documents are checked and kept on file." },
  { step: "04", title: "In-Person Interview", description: "A real conversation, not just a form, before anyone joins the platform." },
];

const testimonials = [
  {
    quote: "Loved her professional attitude... thorough cleaning",
    name: "Facilities Manager",
    context: "Recurring office contract",
  },
  {
    quote: "Always on time, always discreet around our clients",
    name: "Estate Agency Owner",
    context: "Listing prep & move-out cleans",
  },
  {
    quote: "Our turnover team has never missed a guest check-in",
    name: "Short-term rental host",
    context: "Airbnb turnover cleaning",
  },
];

const BusinessServices = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 pt-28 pb-16 px-6 md:px-12 lg:px-20 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <div className="flex gap-3 mb-5">
              <Circle className="text-pink-500 w-5 h-5" />
              <Circle className="text-blue-500 w-5 h-5" />
              <Circle className="text-green-500 w-5 h-5" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 leading-tight">
              Cleaning that keeps{" "}
              <span className="font-bold text-black block">
                your business <span className="text-blue-500">running.</span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-6 max-w-xl">
              Offices, retail floors, listings, and short-term rentals, kept to a standard your
              clients and colleagues notice. Built for managers who need it booked in minutes,
              not chased up for days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="#ai-matcher"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                Get a Business Quote
              </a>
              <Link
                to="/business-services/refer-earn"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-full border-2 border-blue-600 shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                Become a Referral Partner
              </Link>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="200" className="relative">
            <div className="w-full h-72 sm:h-96 lg:h-[420px] rounded-3xl overflow-hidden shadow-xl">
              <img src="/cleaning.png" alt="Office cleaning in progress" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Commercial Service Offerings */}
      <section className="py-16 sm:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl text-gray-900">
              Built for{" "}
              <span className="font-bold text-black">
                commercial needs<span className="text-blue-500">.</span>
              </span>
            </h2>
            <p className="text-gray-600 mt-3">
              Every offering below is staffed and scoped differently from a residential clean,
              because a boardroom and a bedroom aren't the same job.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service, index) => (
              <div
                key={service.title}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {service.image && (
                  <div className="h-36 w-full overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Professional Tools */}
      <section className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl text-gray-900">
              Built with{" "}
              <span className="font-bold text-black">
                estate agents<span className="text-blue-500">.</span>
              </span>
            </h2>
            <p className="text-gray-600 mt-3">
              From listing day to handover day, a clean property is part of the deal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100" data-aos="fade-up">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Listing Preparation</h3>
              <p className="text-gray-600 text-sm">
                A spotless property for high-value viewings, scheduled to fit your listing timeline.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100" data-aos="fade-up" data-aos-delay="80">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Move-In / Move-Out Packages</h3>
              <p className="text-gray-600 text-sm">
                An essential part of a stress-free handover, for the outgoing and incoming tenant alike.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/business-services/refer-earn"
              className="group bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all text-white flex flex-col justify-between"
              data-aos="fade-up"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Refer & Earn Agent Portal</h3>
                <p className="text-gray-300 text-sm">
                  Join in under two minutes and earn a R150 cash commission or business credit for
                  every client you send our way.
                </p>
              </div>
              <span className="flex items-center gap-2 text-sm font-semibold text-blue-300 mt-6 group-hover:gap-3 transition-all">
                Join the program <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/property-manager"
              className="group bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Manager Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Track cleaning schedules, view receipts, and manage recurring bookings across every
                  address you're responsible for, in one place.
                </p>
              </div>
              <span className="flex items-center gap-2 text-sm font-semibold text-blue-600 mt-6 group-hover:gap-3 transition-all">
                Open dashboard <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Business Advantage */}
      <section id="ai-matcher" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl text-gray-900">
              The{" "}
              <span className="font-bold text-black">
                AI Business Advantage<span className="text-blue-500">.</span>
              </span>
            </h2>
            <p className="text-gray-600 mt-3">
              Built for managers who don't have time to fill out a booking form between meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3" data-aos="fade-right">
              <BusinessAIMatcher />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {aiAdvantages.map((item, index) => (
                <div
                  key={item.title}
                  data-aos="fade-left"
                  data-aos-delay={index * 80}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-[10px] uppercase tracking-wide font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust, Safety & Compliance */}
      <section className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              Vetted before they{" "}
              <span className="font-bold text-black">
                ever step in<span className="text-blue-500">.</span>
              </span>
            </h2>
            <p className="text-gray-600 mb-8">
              Your office, store, or listing isn't open to just anyone. Every provider clears four
              checks before they're approved to work.
            </p>
            <div className="space-y-4">
              {vettingSteps.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <span className="text-2xl font-bold text-blue-200 w-10 flex-shrink-0">{step.step}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-8 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Dedicated account support is available 24/7 through our AI chatbot for booking
                guidance and policy questions.
              </p>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="200" className="order-1 lg:order-2">
            <div className="w-full max-w-md mx-auto h-[420px] rounded-3xl overflow-hidden shadow-xl">
              <img src="/elder-care-trust.jpeg" alt="A vetted ShineSpec service provider" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof + market insight */}
      <section className="py-16 sm:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t, index) => (
              <div
                key={t.name}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md"
              >
                <Quote className="w-6 h-6 text-blue-200 mb-3" />
                <p className="text-gray-800 italic mb-4">"{t.quote}"</p>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.context}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 sm:p-12">
            <div data-aos="fade-right">
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Commercial cleaning now makes up 40% of the market
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Post-pandemic hygiene expectations didn't fade, they became the baseline. Businesses
                that maintain visible, consistent sanitation stand out to clients, staff, and
                regulators alike.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md" data-aos="fade-left" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Our Eco-Friendly Commitment</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                As part of our 2026 objectives, we're transitioning to eco-friendly cleaning
                solutions across every commercial contract, lower-impact products without a
                lower-quality result.
              </p>
              <div className="overflow-hidden rounded-xl">
                <img src="/service2.png" alt="Eco-friendly cleaning supplies" className="w-full h-40 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div
          className="max-w-5xl mx-auto bg-gray-900 rounded-3xl p-10 sm:p-14 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to give your business a professional shine?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get matched to the right service in minutes, or talk to us about a recurring contract
            for your office, store, or portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#ai-matcher"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all"
            >
              Get a Business Quote
            </a>
            <button
              onClick={() => navigate("/services")}
              className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full transition-all"
            >
              Browse All Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessServices;