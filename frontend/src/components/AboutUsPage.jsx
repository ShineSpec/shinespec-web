import React from "react";
import { Heart, Users, Target, Award, CheckCircle, TrendingUp } from "lucide-react";
import image1 from "/sponge.png"; // Adjust the filename as needed
import image2 from "/ShineSpec-logo.webp"; // Adjust the filename as needed

// Shinespec About Us Page Component
export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-16 px-6 md:px-20 mt-20">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About Shine<span className="text-blue-500">Spec</span>
          </h1>
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
            Learn who we are, what we stand for, and why Shinespec is trusted by
            families and workers across the region.
          </p>
        </div>

        {/* Company Story with Image */}
        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-6" data-aos="fade-up">
          <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Shinespec was created with one mission: to make it easier, safer, and
                more reliable for families to connect with trusted house cleaners,
                caregivers, and nannies. We saw the growing need for dependable help
                in homes and an equally large number of skilled individuals seeking
                stable work opportunities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, Shinespec proudly stands as a streamlined, transparent, and
                community-focused service helping both families and workers build
                long-lasting, meaningful connections.
              </p>
            </div>
            <div className="overflow-hidden">
              <img 
                src={image1} 
                alt="Our Story" 
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <Users className="w-10 h-10 text-pink-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">People First</h3>
            <p className="text-gray-700 text-sm">
              We believe in treating both families and workers with respect,
              transparency, and fairness.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <Target className="w-10 h-10 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700 text-sm">
              To simplify the process of finding trusted home assistance while
              creating real opportunities for skilled workers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <Award className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
            <p className="text-gray-700 text-sm">
              We carefully vet workers to ensure safety, professionalism, and
              peace of mind for our clients.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-6" data-aos="fade-up">
          <h2 className="text-2xl font-semibold text-gray-900">Why Choose Shinespec</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Verified Professionals</h4>
                  <p className="text-gray-700 text-sm mt-1">Every worker undergoes thorough background checks and skills verification</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Transparent Pricing</h4>
                  <p className="text-gray-700 text-sm mt-1">No hidden fees. Know exactly what you're paying for upfront</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                  <p className="text-gray-700 text-sm mt-1">Our dedicated team is always available to help with any concerns</p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <img 
                src={image2} 
                alt="Why Choose Us" 
                className="w-full h-60 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center">
            <TrendingUp className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
            <p className="text-3xl font-bold text-gray-900 mb-2">5000+</p>
            <p className="text-gray-700 text-sm">Happy Families Served</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center">
            <Users className="w-10 h-10 text-pink-500 mb-4 mx-auto" />
            <p className="text-3xl font-bold text-gray-900 mb-2">2000+</p>
            <p className="text-gray-700 text-sm">Skilled Workers Employed</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center">
            <Heart className="w-10 h-10 text-red-500 mb-4 mx-auto" />
            <p className="text-3xl font-bold text-gray-900 mb-2">98%</p>
            <p className="text-gray-700 text-sm">Customer Satisfaction Rate</p>
          </div>
        </section>

        {/* Commitment */}
        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-6" data-aos="fade-up">
          <h2 className="text-2xl font-semibold text-gray-900">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed">
            At Shinespec, we are committed to maintaining high standards in every
            interaction. From the moment a family seeks help to the day a worker
            begins their journey with us, we provide support, guidance, and care.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you are a family looking for reliable assistance or a worker
            seeking a meaningful opportunity, Shinespec is here to guide you
            every step of the way. We believe in building sustainable relationships
            that create value for everyone involved in our community.
          </p>
        </section>
      </div>
    </div>
  );
}