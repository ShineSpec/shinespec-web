import { Mail, MapPinIcon, Phone, Circle, Send } from "lucide-react";
import React from "react";

const Contact = () => {
  const formFields = [
    {
      id: "name",
      type: "text",
      label: "Full name",
      placeholder: "Enter your full name",
      delay: "150"
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      delay: "200"
    },
    {
      id: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Enter your message here ...",
      rows: 5,
      delay: "250"
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50
      py-12 px-4 sm:py-16 md:py-20 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div
          className="flex flex-col items-center justify-center text-center mb-10"
          data-aos="fade-down"
        >
          <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 font-semibold leading-tight">
              Get In{" "}
              <span className="font-bold text-black">
                Touch<span className="text-blue-500">.</span>
              </span>
            </h2>

            <div className="flex justify-center gap-3 mt-3">
              <Circle className="text-pink-500 w-5 h-5" />
              <Circle className="text-blue-500 w-5 h-5" />
              <Circle className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">

          {/* FORM CARD */}
          <div
            className="flex-1 bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 sm:p-8
            border border-gray-100 w-full max-w-xl"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <form className="space-y-6 w-full">
              {formFields.map((field) => (
                <div
                  key={field.id}
                  data-aos="fade-up"
                  data-aos-delay={field.delay}
                  className="w-full"
                >
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      name={field.id}
                      rows={field.rows}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                      bg-gray-50 hover:bg-white"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                      bg-gray-50 hover:bg-white"
                    />
                  )}
                </div>
              ))}

              <div data-aos="fade-up" data-aos-delay="300">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium
                  hover:bg-blue-700 transition-all shadow-md hover:shadow-lg 
                  flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* IMAGE SECTION */}
          <div className="flex-1 flex flex-col items-center lg:items-start w-full">
            <div
              className="w-full max-w-md sm:h-72 md:h-80 lg:h-full overflow-hidden"
              data-aos="zoom-in"
              data-aos-delay="150"
            >
              <img
                src="/cleaning-lady.png"
                alt="Contact Us"
                className="object-cover w-full h-full transform hover:scale-105 
                transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>

      {/* DECOR SHAPES (ALREADY HIDDEN ON MOBILE) */}
      <div
        className="hidden md:block absolute border-2 border-pink-500 bottom-20 left-10 
        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full opacity-50"
        data-aos="zoom-in"
        data-aos-delay="400"
      ></div>

      <div
        className="hidden md:block absolute border-2 border-purple-500 top-40 right-10 
        w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full opacity-50"
        data-aos="zoom-in"
        data-aos-delay="500"
      ></div>

    </section>
  );
};

export default Contact;
