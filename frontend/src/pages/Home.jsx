import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import WhyOurCompany from "../components/WhyOurCompany";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import SafetySecurity from "../components/SafetySecurity";
import JoinUsBanner from "../components/JoinUsBanner";
import EventCleaning from "../components/EventCleaning";
import AIFeatures from "../components/AIFeatures";
import BusinessCTA from "../components/BusinessCTA";

const Home = () => (
  <>
    <Hero />
    <About />
    <WhyOurCompany />
    <AIFeatures />
    <EventCleaning />
    <Services />
    <SafetySecurity />
    <BusinessCTA />
    <JoinUsBanner />
    <Contact />
    <Footer />
  </>
);

export default Home;