import React, { useState } from 'react';
import { Shield, Lock, Eye, Trash2 } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [activePage, setActivePage] = useState('privacy');

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      lastUpdated: 'December 2025',
      content: (
        <div className="space-y-8">
          <div className="prose prose-sm max-w-none">
            <p className="text-lg font-semibold text-slate-900 mb-4">
              Shine Spec is committed to protecting your privacy and ensuring that your personal information is handled responsibly and in accordance with the Protection of Personal Information Act (POPIA), 2013.
            </p>
            <p className="text-slate-700 mb-6">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to book or provide cleaning services. Please read this policy carefully to understand our privacy practices.
            </p>
          </div>

          <Section title="1. Introduction">
            <SubSection title="Our Commitment to Privacy">
              Shine Spec ("we," "our," or "us"), with Registration Number 2023 / 193032 / 07, respects your privacy and is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA), 2013. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to book or provide services.
            </SubSection>

            <SubSection title="Scope of This Policy">
              This Privacy Policy applies to all personal information collected through our website (www.shinespec.com), mobile applications, and all other digital touchpoints through which we interact with you. It forms an integral part of our Terms and Conditions.
            </SubSection>
          </Section>

          <Section title="2. Lawful Processing of Personal Information">
            <SubSection title="Legal Basis for Processing">
              We process personal information only when lawful and necessary. We rely on the following lawful bases to process your information:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Your Consent:</strong> We process your personal information with your explicit and informed consent, which you provide by using our platform, accepting these terms, or actively opting in to specific services.</li>
                <li><strong>Contractual Performance:</strong> We process information necessary to execute and perform the services you have contracted for through our platform, including booking confirmations, service delivery, and payment processing.</li>
                <li><strong>Legal Obligation:</strong> We process information as required by applicable South African laws, regulations, and regulatory requirements, including tax obligations and consumer protection laws.</li>
                <li><strong>Legitimate Interest:</strong> We process information to protect our legitimate interests and those of our users, including fraud prevention, platform security, user safety, and service improvement.</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="3. Information We Collect">
            <SubSection title="From Clients (Service Seekers)">
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Contact Information:</strong> Full name, phone number, email address, and physical address where services are required.</li>
                <li><strong>Payment Information:</strong> Payment method details (processed securely via third-party providers; we do not store full card details).</li>
                <li><strong>Booking Details:</strong> Service type requested, preferred date(s) and time(s), special instructions, and service preferences.</li>
                <li><strong>Profile Information:</strong> Profile photographs, biographical details, and any preferences you choose to add to your account.</li>
              </ul>
            </SubSection>

            <SubSection title="From Service Providers">
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Contact Information:</strong> Full name, phone number, email address, and physical address.</li>
                <li><strong>Professional Information:</strong> Skills, qualifications, certifications, experience details, and professional references.</li>
                <li><strong>Verification Documents:</strong> Identification documents (ID number, passport details), proof of insurance, and verification documents required for onboarding.</li>
                <li><strong>Availability and Preferences:</strong> Service availability, preferred service types, service areas, and operational details.</li>
              </ul>
            </SubSection>

            <SubSection title="Automatically Collected Information">
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Device Information:</strong> IP address, device type, operating system, browser type, and device identifiers.</li>
                <li><strong>Usage Data:</strong> Pages visited, features accessed, time spent on the platform, actions taken, and browsing patterns.</li>
                <li><strong>Cookies and Tracking Data:</strong> Information collected through cookies, pixel tags, and similar technologies (refer to Section 10 for detailed cookie information).</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="4. Purpose of Collection and Use of Personal Information">
            <SubSection>
              We use the personal information we collect for the following purposes:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Service Facilitation:</strong> To process your bookings, confirm services, and facilitate the connection between clients and service providers.</li>
                <li><strong>Payment Processing:</strong> To process payments, manage refunds, and handle billing inquiries related to services booked through our platform.</li>
                <li><strong>Provider Verification:</strong> To verify the identity, qualifications, and suitability of service providers through background checks, ID verification, and credential validation.</li>
                <li><strong>Platform Improvement:</strong> To analyze usage patterns, understand user behaviour, improve platform functionality, and enhance the overall user experience.</li>
                <li><strong>Communication:</strong> To send important updates, service confirmations, notifications, promotional offers, and other communications related to your account and services.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable South African laws, regulations, tax requirements, and other legal obligations.</li>
                <li><strong>Safety and Security:</strong> To detect, prevent, and address fraud, security threats, abuse, and other harmful or illegal activities on the platform.</li>
                <li><strong>Dispute Resolution:</strong> To investigate and resolve disputes, complaints, and issues arising from bookings or interactions on the platform.</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="5. Disclosure and Sharing of Personal Information">
            <SubSection title="When We Share Your Information">
              We do not sell, lease, rent, or trade your personal information. However, we may disclose your information in the following circumstances:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Service Providers:</strong> We share necessary information with cleaning service providers to facilitate bookings (e.g., client address and contact details are shared so the provider can deliver services).</li>
                <li><strong>Payment Processors:</strong> We share payment information with secure, PCI-compliant third-party payment processors to facilitate secure transactions.</li>
                <li><strong>Verification Partners:</strong> We may share identification and professional information with trusted verification partners for background checks, ID validation, and credential verification.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, government request, or to protect our legal rights.</li>
                <li><strong>Safety and Protection:</strong> We may disclose information to protect the safety, security, and wellbeing of our users, staff, and the general public.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that business transaction. We will provide notice of such changes and any choices you may have regarding your information.</li>
              </ul>
            </SubSection>

            <SubSection title="Non-Disclosure to Third Parties">
              We will not disclose your personal information to third parties for marketing or promotional purposes without your explicit consent, except as outlined above.
            </SubSection>
          </Section>

          <Section title="6. Cross-Border Transfers of Personal Information">
            <SubSection title="International Data Transfers">
              If we transfer your personal information to a country outside the Republic of South Africa (which may occur if our service providers, payment processors, or other business partners are located internationally), we ensure that:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>The transfer is conducted in accordance with POPIA requirements.</li>
                <li>The recipient country or organization provides an adequate level of protection equivalent to or exceeding POPIA's standards.</li>
                <li>We obtain your explicit consent where required for such transfers.</li>
                <li>We implement appropriate safeguards, including Standard Contractual Clauses or other legally recognized mechanisms, to protect your information during and after the transfer.</li>
              </ul>
            </SubSection>

            <SubSection title="Your Rights Regarding Cross-Border Transfers">
              You have the right to request information about any cross-border transfers of your personal information and the safeguards in place to protect it. Please contact us using the details provided in Section 12.
            </SubSection>
          </Section>

          <Section title="7. Data Security and Protection Measures">
            <SubSection title="Security Commitment">
              Shine Spec is deeply committed to protecting your personal information against unauthorized access, alteration, disclosure, or destruction. We implement comprehensive, industry-standard security measures, including:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Encryption:</strong> Sensitive information, particularly payment data and identification documents, is encrypted using advanced encryption protocols (e.g., SSL/TLS) both in transit and at rest.</li>
                <li><strong>Secure Servers:</strong> Our servers are hosted in secure, restricted facilities with controlled access, physical security measures, and continuous monitoring.</li>
                <li><strong>Access Controls:</strong> Access to personal information is strictly limited to authorized employees, contractors, and service providers who have a legitimate need to access the information and who are bound by confidentiality obligations.</li>
                <li><strong>Regular Monitoring:</strong> We continuously monitor our systems and networks for unauthorized access attempts, suspicious activities, and security vulnerabilities.</li>
                <li><strong>Security Audits:</strong> We conduct regular security audits and assessments to identify and address potential vulnerabilities.</li>
                <li><strong>Employee Training:</strong> Our staff undergo regular training on data protection and privacy best practices.</li>
              </ul>
            </SubSection>

            <SubSection title="Limitation of Security">
              While we implement comprehensive security measures, please understand that no method of transmission over the internet or electronic storage is absolutely secure. We cannot guarantee absolute security, and you use our platform at your own risk. However, we remain committed to maintaining reasonable security standards.
            </SubSection>
          </Section>

          <Section title="8. Your Rights as a Data Subject (POPIA Rights)">
            <SubSection title="Right of Access">
              You have the right to request access to your personal information held by Shine Spec. We will provide you with a copy of your information in a clear, understandable format within a reasonable timeframe, typically thirty (30) days.
            </SubSection>

            <SubSection title="Right to Correction and Updating">
              You have the right to request correction or updating of any personal information that is inaccurate, incomplete, or outdated. We will correct such information promptly upon your request.
            </SubSection>

            <SubSection title="Right to Deletion or Destruction">
              You have the right to request the deletion or destruction of your personal information, subject to certain exceptions (e.g., where we are required by law to retain the information, or where deletion would compromise our ability to fulfil contractual obligations). We will assess your request and respond within thirty (30) days.
            </SubSection>

            <SubSection title="Right to Object to Processing">
              You have the right to object to the processing of your personal information for purposes such as direct marketing, profiling, or automated decision-making. If you object, we will cease processing your information for those purposes, unless we have a compelling legitimate reason to continue.
            </SubSection>

            <SubSection title="Right to Withdraw Consent">
              Where we rely on your consent to process your personal information, you have the right to withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness of processing that occurred prior to the withdrawal.
            </SubSection>

            <SubSection title="Right to Lodge a Complaint">
              If you believe that Shine Spec has violated your privacy rights or failed to comply with POPIA, you have the right to lodge a complaint with the Information Regulator of South Africa. Contact details for the Information Regulator can be found on their official website.
            </SubSection>

            <SubSection title="How to Exercise Your Rights">
              To exercise any of your data subject rights, please contact us using the contact details provided in Section 12. Include sufficient information to allow us to identify you and your request, and we will respond within the timeframes specified by POPIA.
            </SubSection>
          </Section>

          <Section title="9. Retention of Personal Information">
            <SubSection title="Retention Periods for Clients">
              For clients (service seekers), we retain personal information for the following periods:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Active Accounts:</strong> While your account is active and you continue to use our services.</li>
                <li><strong>Post-Service:</strong> For a minimum of thirty (30) days following service completion to allow for dispute resolution, refund processing, and payment confirmation.</li>
                <li><strong>Legal Requirements:</strong> For such period as required by applicable South African laws (e.g., tax, consumer protection, or accounting regulations), which may extend to seven (7) years or longer.</li>
              </ul>
            </SubSection>

            <SubSection title="Retention Periods for Service Providers">
              For service providers, we retain personal information for the following periods:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Active Accounts:</strong> While your account is active and you continue to offer services on the platform.</li>
                <li><strong>Post-Termination:</strong> For a minimum of one (1) year following account termination to allow for dispute resolution and legal compliance.</li>
                <li><strong>Legal Requirements:</strong> For such period as required by applicable South African laws, including tax and employment law requirements.</li>
              </ul>
            </SubSection>

            <SubSection title="Secure Deletion">
              When we determine that personal information is no longer needed, we securely delete or anonymize it through appropriate technical means to prevent unauthorized recovery or re-identification.
            </SubSection>
          </Section>

          <Section title="10. Cookies and Tracking Technologies">
            <SubSection title="What Are Cookies?">
              Cookies are small text files stored on your device by your web browser. They help us recognize you, remember your preferences, and improve your browsing experience on our platform.
            </SubSection>

            <SubSection title="Types of Cookies We Use">
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for the basic functioning of our website and services, such as security, login, and transaction processing.</li>
                <li><strong>Preference Cookies:</strong> Used to remember your preferences, language settings, and customizations to improve your experience.</li>
                <li><strong>Analytics Cookies:</strong> Used to analyze how you use our platform, including pages visited, time spent, and user behaviour patterns, to help us improve our services.</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver personalized advertisements and track the effectiveness of our marketing campaigns (only with your consent).</li>
              </ul>
            </SubSection>

            <SubSection title="Your Cookie Choices">
              You have the option to accept or reject cookies through your browser settings. Most browsers provide instructions on how to manage, disable, or delete cookies. However, please note that disabling certain cookies may affect the functionality of our platform, and you may not be able to access some features or services.
            </SubSection>

            <SubSection title="Other Tracking Technologies">
              In addition to cookies, we may use other tracking technologies such as pixel tags, web beacons, and similar technologies to collect usage information and track user behaviour on our platform.
            </SubSection>

            <SubSection title="Third-Party Analytics">
              We may use third-party analytics services (e.g., Google Analytics) to collect and analyze usage data. These services may place their own cookies on your device. We recommend reviewing the privacy policies of these third-party services for information on how they handle your data.
            </SubSection>
          </Section>

          <Section title="11. Third-Party Links and Services">
            <SubSection title="External Links">
              Our website may contain links to third-party websites and services that are not operated by Shine Spec. This Privacy Policy applies only to information collected through our platform. We are not responsible for the privacy practices of third-party websites or services.
            </SubSection>

            <SubSection title="Your Responsibility">
              We encourage you to review the privacy policies of any third-party websites or services before providing your personal information. Your use of third-party websites and services is subject to their terms and privacy policies, not ours.
            </SubSection>
          </Section>

          <Section title="12. Changes and Updates to This Privacy Policy">
            <SubSection title="Right to Modify">
              Shine Spec reserves the right to modify, update, revise, or amend this Privacy Policy at any time. Any changes will be effective immediately upon posting to our website, and we will update the "Last Updated" date at the top of this policy.
            </SubSection>

            <SubSection title="Your Responsibility to Review">
              It is your responsibility to review this Privacy Policy periodically for any updates or changes. Your continued use of the Shine Spec platform following any modifications constitutes your acceptance of the revised Privacy Policy.
            </SubSection>

            <SubSection title="Notification of Material Changes">
              For material changes that significantly affect your privacy rights, we will endeavour to provide notice through email or prominent notification on our website, though your continued use of the platform will constitute acceptance of the revised policy.
            </SubSection>
          </Section>

          <Section title="13. Contact Us">
            <SubSection title="Privacy Inquiries and Requests">
              If you have any questions, concerns, or requests regarding this Privacy Policy, your personal information, or our privacy practices, please contact us using the following details:
              <div className="mt-3 ml-4 space-y-2">
                <div><strong>Email:</strong> <a href="mailto:info@shinespec.com" className="text-blue-600 hover:underline">info@shinespec.com</a></div>
                <div><strong>Website:</strong> <a href="https://www.shinespec.com" className="text-blue-600 hover:underline">www.shinespec.com</a></div>
                <div><strong>Registration Number:</strong> 2023 / 193032 / 07</div>
              </div>
            </SubSection>

            <SubSection title="Information Regulator of South Africa">
              Should you wish to lodge a formal complaint regarding our handling of your personal information or our compliance with POPIA, you may contact the Information Regulator of South Africa at:
              <div className="mt-3 ml-4 space-y-1 text-slate-700">
                <div><strong>Website:</strong> <a href="https://www.justice.gov.za/inforeg/" className="text-blue-600 hover:underline">www.justice.gov.za/inforeg/</a></div>
              </div>
            </SubSection>

            <SubSection title="Response Timeframe">
              We are committed to responding to all inquiries and requests within thirty (30) days or as required by POPIA, whichever is sooner.
            </SubSection>
          </Section>

          <div className="mt-12 pt-8 border-t border-slate-300">
            <p className="text-sm text-slate-600 font-semibold">Shine Spec Registration Number: 2023 / 193032 / 07</p>
            <p className="text-sm text-slate-600 font-semibold">Website: www.shinespec.com</p>
            <p className="text-sm text-slate-600 font-semibold">Email: info@shinespec.com</p>
          </div>
        </div>
      )
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  const currentPolicy = policies[activePage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Page Selector Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {Object.entries(policies).map(([key, policy]) => {
              const Icon = policy.icon;
              return (
                <button
                  key={key}
                  onClick={() => handlePageChange(key)}
                  className={`px-4 sm:px-6 py-4 flex items-center gap-2 whitespace-nowrap border-b-2 transition-all font-medium text-sm ${
                    activePage === key
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{policy.title}</span>
                  <span className="sm:hidden">{policy.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <currentPolicy.icon size={36} />
            <h1 className="text-3xl sm:text-4xl font-bold">{currentPolicy.title}</h1>
          </div>
          <p className="text-emerald-100 text-sm">Last updated: {currentPolicy.lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-sm max-w-none bg-white rounded-lg p-8 shadow-sm">
          {currentPolicy.content}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
          <p>© 2024 Shine Spec. All rights reserved.</p>
          <p className="mt-2">Registration Number: 2023 / 193032 / 07 | Email: info@shinespec.com</p>
        </div>
      </div>
    </div>
  );
};

// Section and SubSection Components
const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold text-slate-900 mb-4 text-emerald-600">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SubSection = ({ title, children }) => (
  <div className="mb-4">
    {title && <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>}
    <p className="text-slate-700 leading-relaxed">{children}</p>
  </div>
);

export default PrivacyPolicyPage;