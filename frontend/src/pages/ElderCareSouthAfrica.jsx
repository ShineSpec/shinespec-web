import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle,
  Home
} from "lucide-react";

const ElderCareSouthAfrica = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Trusted Elder Care Services | ShineSpec – Professional Home Care for Seniors";

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    );
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      "Find trusted elder care and home care services with ShineSpec. We connect families with verified caregivers for seniors, offering in-home assistance, companionship, and daily support."
    );

    /* FAQ Rich Snippets */
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What services are included in elder care?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Elder care services include in-home assistance, companionship, help with daily activities, mobility support, and personalised care based on the senior’s needs."
          }
        },
        {
          "@type": "Question",
          "name": "Are ShineSpec caregivers verified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. All ShineSpec caregivers are identity-verified, background-checked, and assessed for experience before being approved on the platform."
          }
        },
        {
          "@type": "Question",
          "name": "Can I choose flexible care hours?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. ShineSpec allows families to book elder care for flexible hours, whether you need short visits, daily assistance, or long-term support."
          }
        },
        {
          "@type": "Question",
          "name": "Is elder care provided at home?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. All elder care services are provided in the comfort of the senior’s home to maintain familiarity, comfort, and independence."
          }
        },
        {
          "@type": "Question",
          "name": "How do I book elder care with ShineSpec?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking is simple. Select elder care, choose your preferred hours, get matched with a caregiver, and confirm securely through the ShineSpec platform."
          }
        }
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    script.setAttribute("data-page", "elder-care-faq");
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white mt-20">

      {/* HERO */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 px-6 lg:px-28 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Compassionate Elder Care, Right at Home
            </h1>
            <p className="text-lg text-gray-700 leading-[1.7] mb-6">
              ShineSpec connects families with trusted caregivers who provide
              respectful, reliable, and compassionate elder care — all in the
              comfort of home.
            </p>
            <button
              onClick={() => navigate("/services")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Find Elder Care Support →
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/elder-care-hero.jpeg"
              alt="Professional elder care at home"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-6 lg:px-28 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Elder Care Services We Offer
          </h2>
          <p className="text-lg text-gray-600 leading-[1.7]">
            Personalised support designed to help seniors live safely,
            comfortably, and independently at home.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Home className="w-8 h-8 text-blue-600" />,
              title: "In-Home Assistance",
              desc: "Daily support in a familiar and comfortable environment."
            },
            {
              icon: <Users className="w-8 h-8 text-blue-600" />,
              title: "Companionship",
              desc: "Emotional support and meaningful social interaction."
            },
            {
              icon: <Clock className="w-8 h-8 text-blue-600" />,
              title: "Flexible Care Hours",
              desc: "Short visits, daily care, or long-term support."
            },
            {
              icon: <HeartHandshake className="w-8 h-8 text-blue-600" />,
              title: "Personalised Care",
              desc: "Care plans tailored to individual needs and routines."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-[1.6]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 px-6 lg:px-28 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Trusted & Verified Caregivers
            </h2>
            <p className="text-lg text-gray-700 leading-[1.7] mb-6">
              We prioritise safety, dignity, and peace of mind for every family
              using ShineSpec.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Identity & background checks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Experienced senior caregivers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Secure bookings via ShineSpec
              </li>
            </ul>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/elder-care-trust.jpeg"
              alt="Verified elder caregiver assisting senior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 lg:px-28 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Care That Feels Like Family
          </h2>
          <p className="text-lg text-blue-100 leading-[1.7] mb-8">
            Let ShineSpec help you find the right caregiver for your loved one —
            with compassion, respect, and trust.
          </p>
          <button
            onClick={() => navigate("/services")}
            className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition"
          >
            Get Elder Care Support →
          </button>
        </div>
      </section>
    </div>
  );
};

export default ElderCareSouthAfrica;
