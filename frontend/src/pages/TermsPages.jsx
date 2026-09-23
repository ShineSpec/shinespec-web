import React, { useState } from 'react';
import { FileText, Shield, RotateCcw, CheckCircle } from 'lucide-react';

const TermsPages = () => {
  const [activePage, setActivePage] = useState('terms');

  const policies = {
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      lastUpdated: 'December 2025',
      content: (
        <div className="space-y-8">
          <div className="prose prose-sm max-w-none">
            <p className="text-lg font-semibold text-slate-900 mb-4">
              Welcome to Shine Spec! These Terms and Conditions ("Agreement") govern your access to and use of the Shine Spec website (www.shinespec.com), mobile applications, and services provided by Shine Spec (Registration Number: 2023 / 193032 / 07).
            </p>
            <p className="text-slate-700 mb-6">
              By accessing or using our Services, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all other policies and guidelines incorporated by reference. If you do not agree to these Terms, you may not use our Services.
            </p>
          </div>

          <Section title="1. What does this Agreement regulate?">
            <SubSection title="Foundation of the Relationship">
              This Agreement serves as the foundational legal document that establishes the comprehensive terms and conditions governing the provision of Shine Spec's online platform services. It meticulously outlines the contractual relationship between Shine Spec, all categories of its users (both customers seeking cleaning services and independent cleaning service providers), and any third parties interacting with the platform.
            </SubSection>

            <SubSection title="Defining Rights and Obligations">
              It precisely defines the reciprocal rights, responsibilities, and obligations of every party engaged in the process of booking, facilitating, and ultimately providing cleaning services through the Shine Spec digital platform. This includes, but is not limited to, how services are requested, accepted, performed, and paid for.
            </SubSection>

            <SubSection title="Scope of Application">
              This Agreement comprehensively governs your interaction with and utilization of the entire Shine Spec digital ecosystem, which encompasses the official website (www.shinespec.com), any associated mobile applications, and all underlying software, content, functionalities, features, and services that are offered on or accessible through these digital interfaces.
            </SubSection>

            <SubSection title="Clarifying the Service Model">
              Crucially, this section clarifies the distinct roles and relationships within the Shine Spec ecosystem. It explicitly delineates that Shine Spec acts solely as an intermediary platform, connecting customers with independent cleaning service providers. It underscores that cleaning service providers operate as independent contractors, and no employer-employee relationship is established between Shine Spec and these providers. This distinction is vital for legal clarity and liability allocation.
            </SubSection>

            <SubSection title="User Conduct and Expectations">
              Beyond contractual obligations, this section also sets the initial expectations for user conduct, emphasizing the need for adherence to the stipulated terms to ensure a fair, secure, and efficient environment for all participants.
            </SubSection>
          </Section>

          <Section title="2. Amendments to the Agreement">
            <SubSection title="Right to Modify">
              Shine Spec expressly reserves the unequivocal right to unilaterally modify, update, revise, or amend any part or the entirety of these Terms and Conditions at any given time. Such modifications may be made with or without prior explicit notification to users, depending on the nature and impact of the changes.
            </SubSection>

            <SubSection title="Immediate Effectiveness">
              Any and all changes, revisions, or amendments to these Terms will become legally binding and effective immediately upon their publication or posting on the official Shine Spec website. The date of the last revision will be clearly indicated on the document.
            </SubSection>

            <SubSection title="User's Responsibility for Review">
              It is an inherent and continuous responsibility of every user to regularly and diligently review these Terms and Conditions. Users are strongly advised to check this document periodically for any updates or alterations, as their continued use of the platform will be governed by the most current version.
            </SubSection>

            <SubSection title="Implied Acceptance through Continued Use">
              Your continued access, browsing, or use of any aspect of the Shine Spec Services, including but not limited to booking or providing services, after any modifications to these Terms have been posted, constitutes your explicit and unequivocal acceptance and agreement to be bound by the revised and updated Terms.
            </SubSection>

            <SubSection title="Option to Disagree">
              Should you find yourself in disagreement with any of the amended or revised Terms and Conditions, your sole and exclusive recourse is to immediately cease all use of the Shine Spec Services. Continued use despite disagreement will be construed as acceptance.
            </SubSection>

            <SubSection title="Material Changes Notification">
              While general changes may be posted without direct notice, Shine Spec may, at its discretion, endeavour to provide more prominent notice (e.g., via email or platform notification) for material changes that significantly alter your rights or obligations. However, the primary responsibility for staying informed remains with the user.
            </SubSection>
          </Section>

          <Section title="3. Booking a Service">
            <SubSection title="Comprehensive Service Request Process">
              Customers initiate the booking process by submitting a detailed service request through the intuitive Shine Spec platform. This request requires specific information to ensure accurate matching and service delivery, including but not limited to the precise location where the cleaning service is required, the customer's preferred date(s) and time slot(s) for the service, the specific type of cleaning service desired (e.g., deep clean, regular clean, move-in/out clean), and any additional specific instructions, preferences, or special requirements relevant to the cleaning task.
            </SubSection>

            <SubSection title="Provider Discretion and Acceptance">
              Once a service request is submitted, it is made available to cleaning service providers registered on the Shine Spec platform. These providers retain full autonomy and discretion to either accept or decline service requests. Their decision is typically based on a multitude of factors, including their current availability, their specific skill sets and expertise, the type of equipment required, the estimated duration of the job, and their personal preferences or operational capacity.
            </SubSection>

            <SubSection title="Formal Confirmation of Booking">
              A booking is deemed formally confirmed and legally binding only upon the explicit acceptance of the service request by a qualified cleaning service provider. Following this acceptance, the customer will receive a definitive confirmation notification directly from Shine Spec, typically via email or through the platform's messaging system. This confirmation will include key details such as the confirmed date, time, service type, and the assigned provider.
            </SubSection>

            <SubSection title="User Responsibility for Accurate Information">
              Customers bear the sole and ultimate responsibility for ensuring that all information provided during the booking process is entirely accurate, complete, and truthful. This includes address details, contact information, service specifics, and any special instructions. Any provision of inaccurate, incomplete, or misleading information may lead to significant consequences, including but not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Delays in service commencement or completion.</li>
                <li>The imposition of additional charges for unforeseen work or travel.</li>
                <li>The potential cancellation of the service by the provider or Shine Spec without refund.</li>
                <li>Disputes regarding service scope or pricing.</li>
              </ul>
            </SubSection>

            <SubSection title="Adherence to Minimum Booking Durations">
              Certain specialized or comprehensive cleaning services offered through the Shine Spec platform may be subject to a predetermined minimum booking duration. This minimum time requirement will be clearly and conspicuously specified to the customer during the online booking process. Customers are required to select a booking duration that meets or exceeds this minimum to successfully complete their reservation.
            </SubSection>

            <SubSection title="Pre-authorization of Payment">
              By submitting a booking request, customers implicitly authorize Shine Spec to pre-authorize a hold on their selected payment method for the estimated cost of the service. Actual charges will only be processed upon service completion, as detailed in the Payment Terms.
            </SubSection>
          </Section>

          <Section title="4. Nature of the Service Provided by Shine Spec">
            <SubSection title="Pure Platform Facilitation">
              Shine Spec's core function and operational model are exclusively that of an online platform. We serve as a sophisticated digital marketplace designed to seamlessly connect individuals and entities (customers) who are actively seeking professional cleaning services with a network of independent, qualified cleaning service providers.
            </SubSection>

            <SubSection title="No Direct Service Provision">
              It is critically important to understand that Shine Spec itself does not directly engage in the provision of any cleaning services. We are not a cleaning company, nor do we employ cleaning staff. Our role is strictly limited to providing the technological infrastructure and administrative support necessary for customers and providers to interact and transact.
            </SubSection>

            <SubSection title="Limited Intermediary Role">
              Our involvement is precisely circumscribed to facilitating key aspects of the service arrangement. This includes:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Connection: Enabling customers to discover and connect with available cleaning service providers.</li>
                <li>Scheduling: Providing tools for customers to schedule services and for providers to manage their calendars.</li>
                <li>Payment Processing: Acting as a secure conduit for the processing of payments from customers to providers, while deducting applicable platform fees.</li>
                <li>Communication: Offering channels for communication between customers and providers regarding service details.</li>
              </ul>
            </SubSection>

            <SubSection title="Absence of Supervision or Control">
              Shine Spec explicitly does not supervise, direct, manage, or control the specific methods, means, or manner in which cleaning services are performed by the independent cleaning service providers. The providers operate autonomously. Consequently, Shine Spec bears no responsibility for the day-to-day operational decisions, work quality, or conduct of the providers during the execution of services.
            </SubSection>

            <SubSection title="Provider's Sole Responsibility for Quality">
              The ultimate responsibility for the quality, thoroughness, safety, and overall execution of the cleaning service rests solely and exclusively with the independent cleaning service provider who accepts and performs the job. Any issues pertaining to the service quality, damages, or non-performance must primarily be addressed with the performing provider, though Shine Spec may offer dispute resolution assistance as outlined in the "Booking Cover" section.
            </SubSection>

            <SubSection title="Technological Enabler, Not Service Deliverer">
              In essence, Shine Spec functions as a technological enabler, providing the digital tools and environment for service transactions, rather than being a direct provider or guarantor of the physical cleaning service itself.
            </SubSection>
          </Section>

          <Section title="5. Shine Spec is a Platform (Further Elaboration)">
            <SubSection title="Technology-Driven Marketplace">
              Shine Spec is fundamentally a technology platform engineered to empower users to efficiently arrange, schedule, and manage cleaning services. It achieves this by acting as a sophisticated intermediary, connecting customers with a diverse network of independent third-party cleaning service providers.
            </SubSection>

            <SubSection title="Distinct Legal Entities">
              To reiterate, Shine Spec maintains a clear legal distinction: we are not a cleaning company, nor do we directly offer or perform cleaning services. All actual cleaning services facilitated through our platform are exclusively rendered by independent contractors. These contractors operate their own businesses and are responsible for their own operations, equipment, and personnel.
            </SubSection>

            <SubSection title="No Guarantee of Provider Suitability or Availability">
              While Shine Spec strives to onboard reputable and qualified service providers, we do not provide an absolute guarantee regarding the continuous availability, specific suitability, or the inherent quality of any individual cleaning service provider listed on our platform. Users are expressly encouraged to exercise their own due diligence.
            </SubSection>

            <SubSection title="Empowering User Choice and Due Diligence">
              To facilitate informed decision-making, Shine Spec provides mechanisms for users to review detailed provider profiles, which may include information such as their service specializations, experience levels, customer ratings, and reviews. Customers are strongly advised to leverage these resources to select a provider that best aligns with their specific needs and expectations.
            </SubSection>

            <SubSection title="Limited Liability for Third-Party Actions">
              Given our role as a platform facilitator, Shine Spec explicitly disclaims responsibility for the direct acts, omissions, negligence, or any misconduct of any third-party cleaning service providers or customers. While we provide a framework for interaction, the direct relationship concerning the service performance is between the customer and the selected provider.
            </SubSection>

            <SubSection title="Dispute Facilitation, Not Liability Assumption">
              In instances of disputes or issues arising directly from the cleaning service, Shine Spec's role is primarily to facilitate communication and, where appropriate and at our sole discretion, assist in mediating resolutions between the customer and the provider, as detailed in the "Booking Cover" section. However, this facilitation does not imply assumption of liability for the underlying service performance or any resulting damages.
            </SubSection>
          </Section>

          <Section title="6. Representations and Warranties">
            <SubSection title="Warranties by Shine Spec (Our Commitment)">
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Shine Spec represents and warrants that it will employ commercially reasonable efforts and industry best practices to maintain the operational functionality, accessibility, and security of its digital platform.</li>
                <li>We commit to facilitating the connection process between customers and cleaning service providers efficiently and reliably, ensuring the platform serves its intended purpose as a marketplace.</li>
                <li>We warrant that the platform will generally perform in accordance with its published specifications, subject to standard technological limitations and maintenance.</li>
                <li>Shine Spec warrants that it holds the necessary rights and licenses to operate the platform and provide the intermediary services described herein.</li>
              </ul>
            </SubSection>

            <SubSection title="Warranties by Users (Customers - Your Commitments)">
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Legal Capacity:</strong> You represent and warrant that you are at least eighteen (18) years of age and possess the full legal capacity, right, and authority to enter into this binding Agreement and to perform your obligations hereunder.</li>
                <li><strong>Accuracy of Information:</strong> You warrant that all information provided by you during the registration, booking, and payment processes, including personal details, address, contact information, and payment credentials, is accurate, complete, current, and truthful.</li>
                <li><strong>Premises Suitability:</strong> You warrant that the premises where the cleaning service is to be performed are safe, accessible, and suitable for the requested services. This includes ensuring the absence of hazardous conditions, providing necessary access, and securing any valuable or fragile items prior to the service.</li>
                <li><strong>Compliance with Instructions:</strong> You warrant that you will adhere to any reasonable instructions or requests made by the cleaning service provider to facilitate the safe and effective performance of the service.</li>
              </ul>
            </SubSection>

            <SubSection title="Warranties by Users (Cleaning Service Providers - Your Commitments)">
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Legal Authorization to Work:</strong> You represent and warrant that you are legally authorized to work as an independent contractor in the Republic of South Africa and possess all necessary permits, licenses, and registrations required to operate your cleaning service business.</li>
                <li><strong>Skills, Experience, and Equipment:</strong> You warrant that you possess the requisite skills, training, experience, and professional competence to perform the cleaning services you offer through the platform. Furthermore, you warrant that you own or have legal access to all necessary and appropriate equipment, tools, and cleaning supplies required to deliver high-quality services safely and effectively.</li>
                <li><strong>Professional Conduct and Compliance:</strong> You warrant that you will conduct yourself in a professional, courteous, and ethical manner at all times when interacting with customers and Shine Spec staff. You further warrant that your provision of services will be in strict compliance with all applicable local, provincial, and national laws, regulations, and industry standards, including those pertaining to health, safety, and environmental protection.</li>
                <li><strong>Insurance Coverage:</strong> You explicitly represent and warrant that you maintain adequate and current public liability insurance (or equivalent professional indemnity insurance) to cover any potential damages, injuries, or losses that may arise during the course of your provision of cleaning services. You agree to provide proof of such insurance upon request by Shine Spec.</li>
                <li><strong>Independent Contractor Status:</strong> You represent and warrant that you understand and accept your status as an independent contractor and not an employee, agent, or partner of Shine Spec. You acknowledge your sole responsibility for all tax, social security, and other statutory obligations related to your earnings.</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="7. Accessing the Website and/or Software">
            <SubSection title="Limited and Revocable License">
              Shine Spec grants you a strictly limited, non-exclusive, non-transferable, and fully revocable license to access and personally use the Shine Spec website, its associated mobile applications, and/or any underlying software. This license is granted solely for your personal and non-commercial utilization as a customer seeking cleaning services, or for the express purpose of providing cleaning services as a duly registered and approved independent service provider on the platform, all in strict accordance with the terms and conditions outlined in this Agreement.
            </SubSection>

            <SubSection title="Mandatory Account Creation for Full Access">
              To gain access to and fully utilize certain advanced features, functionalities, and services offered by the Shine Spec platform (e.g., booking services, managing provider profiles, processing payments, communicating with other users), you will be required to create a user account. This involves providing accurate registration information and establishing secure login credentials.
            </SubSection>

            <SubSection title="User Responsibility for Account Security">
              You bear the sole and absolute responsibility for maintaining the strict confidentiality and security of your account credentials, including your username and password. You are also entirely responsible for all activities, transactions, and communications that occur under your account, regardless of whether such activities were authorized by you. In the event of any unauthorized use of your account or any suspected breach of security, you must immediately notify Shine Spec at info@shinespec.com.
            </SubSection>

            <SubSection title="Strictly Prohibited Activities">
              You explicitly agree and warrant that you will not, under any circumstances, use the Shine Spec website, software, or services for any unlawful, unauthorized, or malicious purpose. Prohibited activities include, but are not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Transmitting or uploading any harmful code, viruses, worms, Trojan horses, or any other destructive or disruptive software.</li>
                <li>Attempting to interfere with, disrupt, or compromise the integrity, performance, or security of the platform's operations, servers, or networks.</li>
                <li>Engaging in any activity that could potentially damage, disable, overburden, or impair the Shine Spec platform or its users.</li>
                <li>Attempting to gain unauthorized access to any part of the platform, other user accounts, or computer systems connected to Shine Spec.</li>
                <li>Using automated systems or software to extract data from the website (scraping) without explicit written permission.</li>
              </ul>
            </SubSection>

            <SubSection title="Platform Availability and Maintenance">
              While Shine Spec is committed to ensuring the highest possible level of availability and uninterrupted access to its website and services, we do not provide an absolute guarantee of continuous, error-free, or uninterrupted access. The platform may be temporarily unavailable due to scheduled maintenance, unscheduled repairs, system upgrades, network issues, or other unforeseen circumstances. Shine Spec reserves the right to suspend or terminate access to the platform or any part thereof for such reasons, or for any other operational necessity, typically without prior notice where immediate action is required. We will endeavour to provide notice for planned outages.
            </SubSection>
          </Section>

          <Section title="8. Information Submitted by Users and Personal Information">
            <SubSection title="Comprehensive Data Collection for Service Delivery">
              Shine Spec systematically collects various categories of personal information from its users. This data collection is strictly necessary and integral to the effective provision, enhancement, and personalization of our Services. The types of data collected typically include, but are not limited to: full names, physical addresses, email addresses, telephone numbers, payment method details (though not full card numbers, as specified in Payment Terms), preferred service types, historical booking data, and any specific instructions or preferences related to cleaning services.
            </SubSection>

            <SubSection title="Adherence to Privacy Policy">
              All personal information submitted by users to Shine Spec is handled with the utmost care and in strict accordance with our comprehensive Privacy Policy. This policy is explicitly incorporated into these Terms and Conditions by reference, forming an inseparable part of your agreement with Shine Spec. We strongly urge you to thoroughly review our Privacy Policy, available at www.shinespec.com/privacy, for a detailed understanding of our practices concerning the collection, usage, storage, protection, and disclosure of your personal data.
            </SubSection>

            <SubSection title="User Obligation for Data Accuracy">
              You bear the sole and ongoing responsibility for ensuring that all personal information and any other data you submit to Shine Spec, whether during registration, booking, or subsequent interactions, remains accurate, complete, current, and truthful at all times. Failure to maintain accurate information may impact service delivery, communication, and payment processing.
            </SubSection>

            <SubSection title="Informed Consent for Data Processing">
              By creating an account, submitting a booking, or otherwise using the Shine Spec Services, you provide your explicit and informed consent to Shine Spec for the collection, secure storage, and processing of your personal data. This processing will be conducted exclusively for the purposes clearly outlined within this Agreement and, more comprehensively, within our Privacy Policy. These purposes include facilitating bookings, processing payments, enabling communication, improving service offerings, and ensuring compliance with legal obligations.
            </SubSection>

            <SubSection title="Handling of User-Generated Content">
              Any content that you actively submit, post, upload, or display on the Shine Spec platform, such as written reviews, star ratings, comments, photographs, or any other form of user-generated material (collectively, "User Content"), must strictly comply with our established content guidelines. Furthermore, the handling and rights associated with such User Content will be governed by the specific provisions detailed in the "Your Content" section of this Agreement. You acknowledge that certain User Content, particularly reviews, may be publicly visible.
            </SubSection>
          </Section>

          <Section title="9. Your Use of the Services">
            <SubSection title="Strict Compliance with Legal Frameworks">
              You unequivocally agree and commit to using the Shine Spec Services in full and continuous compliance with all applicable laws, statutes, ordinances, regulations, and directives. This includes, but is not limited to, all relevant local, provincial, national (South African), and international laws governing online conduct, consumer protection, privacy, and commercial transactions.
            </SubSection>

            <SubSection title="Mandate for Respectful and Professional Conduct">
              You are obligated to interact with all other users of the platform, including both customers and cleaning service providers, as well as with Shine Spec's administrative and support staff, in a consistently respectful, courteous, and professional manner. Any form of harassment, intimidation, abusive language, or disrespectful behaviour is strictly prohibited.
            </SubSection>

            <SubSection title="Comprehensive List of Prohibited Conduct">
              You explicitly agree that you shall not, under any circumstances, use the Shine Spec Services to engage in, facilitate, or promote any of the following strictly prohibited activities:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Fraudulent or Deceptive Practices:</strong> Any activity that is fraudulent, deceptive, misleading, or involves misrepresentation, including providing false information, misrepresenting services, or engaging in payment fraud.</li>
                <li><strong>Harassment and Harm:</strong> Harassing, abusing, stalking, threatening, defaming, or otherwise harming any other person or entity, whether a user or a Shine Spec representative.</li>
                <li><strong>Unsolicited Communications:</strong> Transmitting or distributing any unsolicited advertising, promotional materials, "junk mail," "spam," chain letters, pyramid schemes, or any other form of unauthorized solicitation.</li>
                <li><strong>Impersonation:</strong> Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
                <li><strong>Circumvention of Platform Mechanisms:</strong> Attempting to circumvent, bypass, manipulate, or otherwise interfere with Shine Spec's established fee structure, billing processes, payment systems, or any security measures.</li>
                <li><strong>Off-Platform Transactions (Poaching):</strong> Directly or indirectly attempting to solicit, induce, or arrange for cleaning services with a cleaning service provider (or customer) encountered through the Shine Spec platform, outside of the platform's booking and payment system, with the intent to avoid Shine Spec's fees or commissions. This includes sharing direct contact information for off-platform engagement.</li>
                <li><strong>Intellectual Property Infringement:</strong> Uploading, posting, or transmitting any content that infringes upon the intellectual property rights (copyrights, trademarks, patents, trade secrets) or privacy rights of any third party.</li>
                <li><strong>Harmful Software:</strong> Introducing or transmitting any viruses, malware, or other harmful computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software, hardware, or telecommunications equipment.</li>
              </ul>
            </SubSection>

            <SubSection title="Mandatory Reporting of Misconduct">
              You are obligated to promptly report to Shine Spec any instances of inappropriate, unethical, or illegal conduct by other users that you become aware of. This includes violations of these Terms, suspicious activities, or any behaviour that compromises the safety or integrity of the platform. Reporting can be done via info@shinespec.com.
            </SubSection>
          </Section>

          <Section title="10. License Grant & Restrictions">
            <SubSection title="Explicit License Grant to User">
              Shine Spec hereby grants you a strictly limited, non-exclusive, non-transferable, and fully revocable license to access, view, and personally use the Shine Spec platform, including its website and software. This license is granted solely for the purpose of utilizing the platform's services as intended: either as a customer to book cleaning services or as a registered and approved cleaning service provider to offer and manage services. This license is expressly conditional upon your continuous adherence to all the terms and conditions stipulated within this Agreement.
            </SubSection>

            <SubSection title="Comprehensive List of User Restrictions (Prohibited Actions)">
              You are unequivocally and expressly prohibited from engaging in any of the following activities with respect to the Shine Spec website, software, or any part of its Services:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Reverse Engineering and Modification:</strong> You shall not modify, adapt, translate, reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code or underlying algorithms of any portion of the Shine Spec website or software. This prohibition extends to creating derivative works based on the platform.</li>
                <li><strong>Removal of Proprietary Notices:</strong> You shall not remove, alter, or obscure any copyright, trademark, service mark, patent, or other proprietary notices, legends, or symbols from any materials or content displayed on or obtained from any portion of the Services.</li>
                <li><strong>Unauthorized Reproduction and Distribution:</strong> You shall not reproduce, duplicate, copy, sell, resell, distribute, transmit, broadcast, display, publicly perform, license, lease, rent, transfer, or otherwise exploit any portion of the Services or its content for any commercial purpose without the explicit prior written consent of Shine Spec. This includes creating derivative works, adapting, or otherwise transforming the content.</li>
                <li><strong>Linking, Mirroring, and Framing:</strong> You shall not link to, mirror, frame, or utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of Shine Spec or its affiliates without express written consent.</li>
                <li><strong>Automated Data Access and System Overload:</strong> You shall not cause or launch any automated programs or scripts, including but not limited to web spiders, crawlers, robots, indexers, bots, viruses, worms, or any program which may make multiple server requests per second, or unduly burden or hinder the operation and/or functionality of any aspect of the Services. This includes scraping, data mining, or otherwise systematically extracting data from the platform.</li>
                <li><strong>Unauthorized System Access and Impairment:</strong> You shall not attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services, the server on which the Services are stored, or any server, computer, or database connected to the Services. This also includes any action that impairs or attempts to impair the proper working of the Services.</li>
                <li><strong>Circumvention of Security Measures:</strong> You shall not attempt to circumvent any security or authentication measures implemented by Shine Spec or its third-party providers.</li>
                <li><strong>Commercial Exploitation (Beyond Intended Use):</strong> Any use of the Services for purposes other than personal use or the legitimate provision of cleaning services as an independent contractor via the platform is strictly prohibited. This includes using the platform to build a competitive product or service.</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="11. Payment Terms">
            <SubSection title="Transparent Pricing Structure">
              The pricing for all cleaning services offered through the Shine Spec platform will be clearly and transparently displayed to the customer during the booking process. Prices may fluctuate based on a variety of factors, including the specific type of cleaning service requested (e.g., standard, deep, specialized), the estimated duration of the service, the geographical location of the service, and the individual rates set by the independent cleaning service provider.
            </SubSection>

            <SubSection title="Mandatory Valid Payment Method">
              To successfully book any cleaning service through the Shine Spec platform, customers are required to provide valid and current payment method details. Acceptable payment methods typically include major credit cards (e.g., Visa, MasterCard) and debit cards. By providing these details, you confirm that you are the authorized holder of the payment method.
            </SubSection>

            <SubSection title="Authorization for Charges">
              By proceeding with a booking confirmation, you explicitly authorize Shine Spec, or its designated third-party payment processor, to charge your selected payment method for the full amount of the agreed-upon service fees. This authorization includes any applicable taxes (e.g., VAT), platform fees, booking fees, and any additional charges that may arise from changes to the service or late cancellation fees as outlined in these Terms.
            </SubSection>

            <SubSection title="Secure Third-Party Payment Processing">
              All payments processed through the Shine Spec platform are handled securely by reputable third-party payment processors. Shine Spec prioritizes the security of your financial information; therefore, we do not directly store your full payment card details on our servers. Your payment information is encrypted and managed by the payment processor in compliance with industry security standards.
            </SubSection>

            <SubSection title="Procedure for Payment Disputes">
              In the event of any discrepancy, error, or dispute concerning a payment charge, customers are required to raise such concerns directly with Shine Spec's customer support team at info@shinespec.com. This notification must occur within a reasonable and specified timeframe, typically seven (7) calendar days following the completion of the service or the date the charge appeared on your statement. Failure to report disputes within this period may result in forfeiture of your right to dispute the charge.
            </SubSection>

            <SubSection title="Disbursement to Providers and Platform Fees">
              Following the successful completion of a cleaning service and after a specified verification period (e.g., 24-48 hours), Shine Spec will facilitate the disbursement of the collected service fees to the respective cleaning service provider. It is understood that Shine Spec will deduct its applicable platform fees, commissions, or service charges from the total amount paid by the customer before disbursing the remainder to the provider. The exact percentage or fixed amount of these fees will be communicated to providers upon registration and may be subject to change with notice.
            </SubSection>

            <SubSection title="No Cash Payments">
              For security and tracking purposes, all payments for services booked through the platform must be processed electronically via Shine Spec. Direct cash payments to providers are strictly prohibited and will void any booking cover or dispute resolution assistance from Shine Spec.
            </SubSection>
          </Section>

          <Section title="12. Use of the Service (Detailed)">
            <SubSection title="Exclusive Purpose and Prohibition of Misuse">
              The Shine Spec Service is designed and intended exclusively for the legitimate and lawful booking, scheduling, and provision of professional cleaning services. Any form of misuse, fraudulent activity, or engagement in activities that deviate from this primary purpose is strictly and unequivocally prohibited. This includes, but is not limited to, creating fake bookings, engaging in money laundering, or using the platform for illegal transactions.
            </SubSection>

            <SubSection title="Mandatory Platform Communication">
              For the sake of transparency, record-keeping, dispute resolution, and efficient support, all communications pertinent to bookings, service modifications, cancellations, or any issues arising before, during, or after a service should ideally be conducted and documented through the official Shine Spec platform's messaging system. While direct communication may occur, using the platform ensures that Shine Spec has a clear record of interactions, which is crucial for mediation and support.
            </SubSection>

            <SubSection title="Shared Responsibility for Safety and Environment">
              Both customers and cleaning service providers share a mutual and critical responsibility for ensuring a safe and conducive environment at the service location during the entire duration of the cleaning service.
              <div className="mt-2 ml-4 space-y-2">
                <div><strong>Customer's Role:</strong> Customers are responsible for securing pets, valuables, fragile items, and ensuring that the premises are free from any known hazards that could endanger the provider. They should also provide adequate lighting and access to necessary utilities (e.g., water, electricity).</div>
                <div><strong>Provider's Role:</strong> Providers are responsible for adhering to safety protocols, using equipment safely, and reporting any unsafe conditions they encounter.</div>
                <div><strong>Immediate Reporting of Safety Concerns:</strong> Any and all safety concerns, incidents, or potential hazards identified by either party must be reported to Shine Spec immediately via info@shinespec.com to allow for prompt investigation and intervention.</div>
              </div>
            </SubSection>

            <SubSection title="Importance of Feedback and Ratings System">
              Users are strongly encouraged to actively participate in the platform's feedback and ratings system. Providing honest, constructive, and fair feedback and ratings for completed services and the respective providers is vital for several reasons:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Quality Assurance:</strong> It helps Shine Spec maintain a high standard of service quality across the platform.</li>
                <li><strong>Informed Decisions:</strong> It assists other users in making informed decisions when selecting cleaning service providers.</li>
                <li><strong>Provider Improvement:</strong> It provides valuable insights to cleaning service providers, enabling them to improve their services and address any shortcomings.</li>
                <li><strong>Platform Integrity:</strong> It contributes to the overall integrity, trustworthiness, and transparency of the Shine Spec marketplace.</li>
              </ul>
              All feedback must be truthful and based on actual experiences, avoiding defamatory or malicious content, which will be subject to the "Your Content" guidelines.
            </SubSection>

            <SubSection title="Adherence to Service Scope">
              Customers are expected to respect the agreed-upon scope of work for the booked service. Any significant changes or additional tasks requested during the service should be discussed with the provider and, if necessary, adjusted through the platform, which may incur additional charges.
            </SubSection>

            <SubSection title="No Solicitation">
              Users are prohibited from using the platform to solicit, advertise, or promote any products, services, or businesses other than those directly related to the cleaning services facilitated by Shine Spec.
            </SubSection>
          </Section>

          <Section title="13. Payment for Services / Cancellation by You">
            <SubSection title="Detailed Customer Cancellation Policy">
              <div className="space-y-3 mt-2">
                <div><strong>Generous Free Cancellation Window:</strong> Customers are afforded the flexibility to cancel a confirmed booking without incurring any financial penalty or charge whatsoever, provided that such cancellation is initiated and completed within a specified timeframe. This "free cancellation window" is typically set at twenty-four (24) hours prior to the scheduled commencement time of the service. This allows customers ample time to adjust their plans without penalty.</div>

                <div><strong>Imposition of Late Cancellation Fee:</strong> Should a customer cancel a booking after the expiration of the free cancellation window, but still within a shorter, clearly defined period (e.g., between 2 and 24 hours) before the scheduled service start time, a predetermined late cancellation fee will be levied. This fee is designed to partially compensate the cleaning service provider for their lost opportunity and preparation time. The exact amount of this fee will be clearly communicated to the customer during the cancellation process.</div>

                <div><strong>No-Show or Last-Minute Cancellation Penalty:</strong> In instances where a customer cancels a booking with exceptionally short notice (e.g., less than two (2) hours prior to the scheduled service start time), or if the customer is not present at the service location and fails to provide access at the confirmed scheduled time (a "no-show"), a significant portion or even the full service fee may be charged to the customer's payment method. This measure is implemented to provide fair compensation to the cleaning service provider for their travel, time, and the complete loss of the scheduled booking.</div>

                <div><strong>Refund Processing and Timelines:</strong> Any refunds due to customers as a result of eligible cancellations will be processed strictly in accordance with Shine Spec's internal refund policy. While Shine Spec will initiate refunds promptly, please be aware that the actual reflection of the credited amount in your bank account or on your payment card statement may take several business days, depending on your financial institution's processing times.</div>
              </div>
            </SubSection>

            <SubSection title="Comprehensive Provider Cancellation Policy">
              <div className="space-y-3 mt-2">
                <div><strong>Obligation to Honour Bookings:</strong> Cleaning service providers registered on the Shine Spec platform are under a strong obligation and are expected to honour all accepted bookings. Consistency and reliability are paramount to maintaining customer trust and the integrity of the platform.</div>

                <div><strong>Mandatory Notification for Provider Cancellations:</strong> In the rare and unavoidable event that a cleaning service provider must cancel an accepted booking (e.g., due to unforeseen emergencies, illness, or equipment failure), they are strictly required to notify both Shine Spec's support team and the affected customer as soon as humanly possible. This allows Shine Spec to assist in finding an alternative provider or to communicate effectively with the customer.</div>

                <div><strong>Consequences of Repeated Provider Cancellations:</strong> Shine Spec maintains a strict policy regarding provider cancellations. Frequent or repeated cancellations by a service provider, especially without legitimate reasons or adequate notice, will be closely monitored. Such behaviour may lead to disciplinary actions, including but not limited to: temporary suspension of their account, reduced visibility on the platform, financial penalties, or ultimately, the permanent termination of their account and removal from the Shine Spec platform. This is to ensure a reliable and professional service network for customers.</div>
              </div>
            </SubSection>
          </Section>

          <Section title="14. Cancellation by us (Shine Spec)">
            <SubSection title="Shine Spec's Discretionary Right to Cancel">
              Shine Spec explicitly reserves the right, at its sole and absolute discretion, to cancel any booking facilitated through its platform. This right may be exercised under various circumstances, including but not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Provider Unavailability:</strong> If the assigned cleaning service provider becomes unexpectedly unavailable due to unforeseen circumstances, emergencies, or other issues beyond their control, and no suitable immediate replacement can be found.</li>
                <li><strong>Safety Concerns:</strong> If there are legitimate concerns regarding the safety of the cleaning service provider at the customer's premises, or if the service location is deemed unsuitable or hazardous for the requested cleaning services. This includes situations where the environment poses a risk to health or safety.</li>
                <li><strong>Suspected Fraud or Policy Violations:</strong> In instances where there is a reasonable suspicion of fraudulent activity, misrepresentation, or a material violation of these Terms and Conditions by either the customer or the cleaning service provider.</li>
                <li><strong>Technical Issues or Platform Errors:</strong> If technical malfunctions, system errors, or unforeseen operational challenges on the Shine Spec platform prevent the successful execution or management of the booking.</li>
                <li><strong>Force Majeure Events:</strong> As outlined in the "Limitation of Liability" section, events beyond Shine Spec's reasonable control may necessitate cancellation.</li>
              </ul>
            </SubSection>

            <SubSection title="Prompt Notification Obligation">
              In the event that Shine Spec exercises its right to cancel a booking, we commit to endeavouring to notify both the affected customer and the cleaning service provider as soon as reasonably possible. This notification will typically be sent via email or through the platform's messaging system, explaining the reason for the cancellation where appropriate.
            </SubSection>

            <SubSection title="Customer Remedy and Limitation of Liability">
              If a booking is cancelled by Shine Spec, customers will typically be offered one of the following remedies, at Shine Spec's discretion:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>A full refund of any amounts paid for the cancelled service.</li>
                <li>The option to reschedule the service for an alternative date and time, subject to provider availability.</li>
                <li>A credit for future bookings on the platform, equivalent to the value of the cancelled service.</li>
              </ul>
              It is explicitly understood and agreed that Shine Spec's liability for any cancellation initiated by us shall be strictly limited to the refund or rescheduling of the specific service fee. Shine Spec shall not be liable for any additional compensation, indirect damages, consequential losses, or any other costs incurred by either the customer or the provider as a result of such cancellation (e.g., lost earnings, travel costs, inconvenience).
            </SubSection>
          </Section>

          <Section title="15. Your Content">
            <SubSection title="Broad Definition of 'Your Content'">
              "Your Content" refers comprehensively to any and all forms of data, information, materials, or media that you, as a user of the Shine Spec platform, submit, post, upload, display, transmit, or otherwise make available on or through the Services. This includes, but is not limited to: written reviews, star ratings, comments, feedback, testimonials, photographs, videos, profile descriptions, messages exchanged through the platform, and any other user-generated content.
            </SubSection>

            <SubSection title="Perpetual, Worldwide License Grant to Shine Spec">
              By submitting Your Content to the Shine Spec platform, you hereby grant Shine Spec a non-exclusive, royalty-free, fully paid-up, worldwide, perpetual, irrevocable, transferable, and sublicensable license. This broad license permits Shine Spec to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, publicly perform, and publicly display Your Content (in whole or in part) in any media formats and through any media channels now known or hereafter developed. This license is granted specifically in connection with the operation, promotion, marketing, and improvement of the Shine Spec Services, including but not limited to displaying reviews on provider profiles, marketing materials, and social media.
            </SubSection>

            <SubSection title="Sole Responsibility for Content and Warranties">
              You acknowledge and agree that you are solely and entirely responsible for Your Content. You explicitly represent and warrant that:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>You own all necessary rights, licenses, consents, and permissions to submit Your Content and to grant the aforementioned license to Shine Spec.</li>
                <li>Your Content does not, and will not, infringe upon, misappropriate, or violate the intellectual property rights (including copyright, trademark, patent, trade secret), privacy rights, publicity rights, or any other rights of any third party.</li>
                <li>Your Content complies with all applicable laws, regulations, and these Terms and Conditions.</li>
                <li>Your Content is truthful, accurate, and not misleading.</li>
              </ul>
            </SubSection>

            <SubSection title="Strictly Prohibited Content Categories">
              You expressly agree not to post, upload, submit, or transmit any content that falls into the following prohibited categories:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Unlawful or Harmful:</strong> Content that is illegal, unlawful, fraudulent, defamatory, libelous, obscene, pornographic, sexually explicit, or hateful.</li>
                <li><strong>Infringement:</strong> Content that infringes or violates any patent, trademark, trade secret, copyright, or other intellectual property or proprietary right of any party.</li>
                <li><strong>Privacy Violations:</strong> Content that violates the privacy or publicity rights of any person.</li>
                <li><strong>Malicious Code:</strong> Content that contains viruses, corrupted data, or any other harmful, disruptive, or destructive files or code.</li>
                <li><strong>Discriminatory or Inciting:</strong> Content that promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic.</li>
                <li><strong>Threatening or Abusive:</strong> Content that is threatening, abusive, harassing, or otherwise objectionable.</li>
                <li><strong>Misleading or False:</strong> Content that is false, inaccurate, or misleading.</li>
              </ul>
            </SubSection>

            <SubSection title="Shine Spec's Right to Monitor and Remove Content">
              While Shine Spec has no obligation to actively monitor or review Your Content, we reserve the absolute right, at our sole discretion, to monitor, review, edit, refuse to post, or remove any of Your Content at any time and for any reason whatsoever, without prior notice. This includes content that we deem, in our sole judgment, to be in violation of these Terms, harmful, offensive, or otherwise inappropriate. Shine Spec is not responsible for any failure or delay in removing such content.
            </SubSection>
          </Section>

          <Section title="16. Social Media">
            <SubSection title="Engagement Subject to Dual Terms">
              Shine Spec may actively maintain official social media pages and accounts on various platforms (e.g., Facebook, Instagram, Twitter, LinkedIn). Your engagement with these official pages, including posting comments, sharing content, or participating in discussions, is subject to a dual set of terms: these Shine Spec Terms and Conditions, as well as the specific terms of service, community guidelines, and privacy policies of the respective social media platforms themselves.
            </SubSection>

            <SubSection title="Application of Content Guidelines">
              Any content you choose to post, share, or submit on Shine Spec's official social media pages, including comments, reviews, or direct messages, must strictly adhere to the "Your Content" guidelines and prohibitions outlined in Section 15 of these Terms. This ensures consistency in content standards across all our digital touchpoints.
            </SubSection>

            <SubSection title="Disclaimer Regarding Third-Party Content">
              Shine Spec explicitly disclaims any responsibility, endorsement, or liability for the content posted by third parties (i.e., other users or external entities) on its social media pages. While we may moderate our own pages, we cannot control or be held accountable for the opinions, statements, or actions of external users. Views expressed by third parties on our social media channels do not necessarily reflect the views of Shine Spec.
            </SubSection>

            <SubSection title="Specific Terms for Promotions and Giveaways">
              Any promotions, contests, giveaways, or special offers conducted by Shine Spec exclusively through its social media channels will be governed by a separate, distinct set of specific terms and conditions. These specific terms will be published clearly and separately for each promotion and will detail eligibility criteria, participation rules, prize information, and any other relevant provisions. Participation in such promotions implies acceptance of these specific terms in addition to this Agreement.
            </SubSection>

            <SubSection title="No Customer Service via Social Media">
              While social media may be used for general inquiries, it is not the primary channel for customer service, dispute resolution, or sensitive account-related issues. For such matters, users should utilize the official contact methods provided (e.g., email: info@shinespec.com) to ensure prompt and secure assistance.
            </SubSection>
          </Section>

          <Section title="17. Limitation of Liability (Comprehensive)">
            <SubSection title="Exclusion of Indirect and Consequential Damages">
              To the maximum extent permitted by the applicable laws of the Republic of South Africa, Shine Spec, including its affiliates, parent companies, subsidiaries, directors, officers, employees, agents, representatives, and licensors, shall not be held liable for any indirect, incidental, special, consequential, punitive, or exemplary damages. This comprehensive exclusion includes, but is not limited to, damages for loss of profits (whether direct or indirect), loss of goodwill or business reputation, loss of use, loss of data, costs of procuring substitute goods or services, or any other intangible losses. Such damages may arise directly or indirectly out of or in connection with your access to, use of, or inability to use the Services, even if Shine Spec has been advised of the possibility of such damages.
            </SubSection>

            <SubSection title="No Liability for Service Provider Actions">
              Shine Spec operates solely as a platform facilitator. Accordingly, Shine Spec explicitly disclaims all liability for the individual actions, omissions, negligence, misconduct, or any other acts of any independent cleaning service providers or customers. This includes, but is not limited to, any damages to property, personal injury, non-performance of services, or unsatisfactory service quality arising directly from the interaction between a customer and a provider. Any disputes or claims arising directly from the provision of the cleaning service must be resolved primarily and directly between the customer and the cleaning service provider involved. While Shine Spec may, at its sole discretion, offer assistance in mediating such disputes as outlined in the "Booking Cover" section, this assistance does not imply or create any liability on the part of Shine Spec.
            </SubSection>

            <SubSection title="Maximum Aggregate Liability Cap">
              Notwithstanding any other provision in this Agreement, in no event shall Shine Spec's total aggregate liability to you for all damages, losses, and causes of action (whether in contract, tort, including negligence, strict liability, or otherwise) arising out of or in connection with these Terms or your use of the Services exceed the lesser of:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>The total amount actually paid by you to Shine Spec for the specific service giving rise to the liability in the three (3) months immediately preceding the event giving rise to the claim; or</li>
                <li>ZAR 1000 (One Thousand South African Rand). This limitation applies regardless of the form of action, whether in contract, tort, or otherwise.</li>
              </ul>
            </SubSection>

            <SubSection title="Force Majeure Events (Uncontrollable Circumstances)">
              Shine Spec shall not be held liable for any failure or delay in performing its obligations under this Agreement if such failure or delay is caused by or results from events or circumstances beyond its reasonable control. These "Force Majeure" events include, but are not limited to: acts of God (e.g., natural disasters, extreme weather), war, acts of terrorism, civil disturbances, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, epidemics or pandemics, strikes, labour disputes, shortages of transportation facilities, fuel, energy, labour, or materials, or failures of public utilities or telecommunications networks. In such cases, Shine Spec's performance shall be excused for the duration of the Force Majeure event.
            </SubSection>

            <SubSection title="No Warranty of Fitness for Purpose">
              Shine Spec does not warrant that the Services will meet your specific requirements, be uninterrupted, timely, secure, or error-free, or that defects will be corrected. The Services are provided on an "as is" and "as available" basis.
            </SubSection>
          </Section>

          <Section title="18. Employment and Tax">
            <SubSection title="Unequivocal Independent Contractor Status">
              It is explicitly and unequivocally stated that all cleaning service providers who register and offer their services through the Shine Spec platform are operating as independent contractors. They are not, under any circumstances, to be considered employees, agents, joint ventures, partners, or franchisees of Shine Spec. This Agreement does not create, nor is it intended to create, any form of employment relationship between Shine Spec and any cleaning service provider.
            </SubSection>

            <SubSection title="No Employment Relationship Created">
              This Agreement, and the relationship it establishes between Shine Spec and its users (both customers and providers), is strictly limited to that of a platform facilitator and independent service providers/customers. It does not give rise to, nor should it be construed as creating, any employment relationship, partnership, joint venture, or agency relationship between Shine Spec and any cleaning service provider or customer.
            </SubSection>

            <SubSection title="Sole Responsibility for Provider Taxes and Statutory Payments">
              Cleaning service providers bear the sole and exclusive responsibility for all their own tax obligations, including but not limited to income tax, provisional tax, and any applicable Value Added Tax (VAT), as required by the South African Revenue Service (SARS) or other relevant tax authorities. Furthermore, providers are solely responsible for their own national insurance contributions, social security payments, unemployment insurance fund (UIF) contributions, workmen's compensation, and any other statutory payments, deductions, or levies related to their earnings generated through the Shine Spec platform. Shine Spec will not withhold or pay any such amounts on behalf of the providers.
            </SubSection>

            <SubSection title="Provider's Operational Responsibility">
              Cleaning service providers are solely responsible for providing, maintaining, and insuring their own equipment, tools, cleaning supplies, and transportation necessary to perform the cleaning services. They are also responsible for managing their own schedules, work methods, and business operations.
            </SubSection>

            <SubSection title="No Employee Benefits from Shine Spec">
              As independent contractors, cleaning service providers are expressly not entitled to receive any employee benefits, remuneration, or compensation from Shine Spec beyond the agreed-upon service fees (minus platform commissions). This includes, but is not limited to, health insurance, paid time off (e.g., vacation, sick leave), retirement benefits, pension plans, bonuses, or any other benefits typically associated with an employment relationship.
            </SubSection>

            <SubSection title="Indemnification for Misclassification">
              Cleaning service providers agree to indemnify and hold harmless Shine Spec from and against any and all claims, liabilities, costs, damages, and expenses (including reasonable attorneys' fees) arising from or related to any claim by a third party (including government agencies) that the provider is an employee of Shine Spec, or that Shine Spec is responsible for any employment-related obligations or liabilities with respect to the provider.
            </SubSection>
          </Section>

          <Section title="19. Intellectual Property Ownership">
            <SubSection title="Exclusive Ownership of Shine Spec IP">
              All intellectual property rights, including but not limited to copyrights, trademarks, service marks, trade names, logos, patents, trade secrets, design rights, and database rights, in and to the Shine Spec website, mobile applications, underlying software, platform infrastructure, design, text, graphics, images, audio, video, and all other proprietary content and materials (excluding "Your Content" as defined below) are exclusively owned by or duly licensed to Shine Spec. This includes the "Shine Spec" name, logo, and domain names (e.g., www.shinespec.com).
            </SubSection>

            <SubSection title="Strict Restrictions on User Exploitation">
              You are expressly and strictly prohibited from using, copying, reproducing, modifying, adapting, distributing, transmitting, broadcasting, displaying, selling, licensing, leasing, transferring, or otherwise exploiting any of Shine Spec's intellectual property without the explicit, prior written consent of an authorized representative of Shine Spec. Any unauthorized use is a violation of these Terms and applicable intellectual property laws.
            </SubSection>

            <SubSection title="User Content IP Ownership and License">
              While Shine Spec maintains ownership of its platform and core intellectual property, you, as the user, retain ownership of all intellectual property rights in and to "Your Content" (as defined in Section 15). However, by submitting Your Content to the platform, you grant Shine Spec a broad, perpetual, worldwide, non-exclusive, royalty-free, transferable, and sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, publicly perform, and publicly display Your Content in connection with the operation, promotion, and improvement of the Services, as detailed in Section 15.
            </SubSection>

            <SubSection title="Reporting Infringement">
              Shine Spec respects the intellectual property rights of others. If you believe that your intellectual property rights have been infringed upon by any content on the Shine Spec platform, please notify us immediately at info@shinespec.com, providing all necessary details to investigate the claim.
            </SubSection>
          </Section>

          <Section title="20. Gift Vouchers, Coupons, Third Party Vouchers and Referral Bonus Program Terms">
            <SubSection title="Specific Terms Governing Validity">
              All gift vouchers, promotional coupons, and vouchers issued by third-party partners are strictly subject to their own distinct and specific terms and conditions. These terms will typically include, but are not limited to, the validity period (expiry dates), specific service categories for which they can be redeemed, minimum spend requirements, geographical limitations, and any other redemption limitations or restrictions as clearly specified at the time of their issue or on the voucher itself. It is the user's responsibility to review these specific terms before attempting to use the voucher.
            </SubSection>

            <SubSection title="Non-Transferable and Non-Refundable Nature">
              Unless explicitly stated otherwise on the voucher or in its accompanying terms, all gift vouchers, coupons, and third-party vouchers are inherently non-transferable, meaning they cannot be sold, exchanged, or assigned to another individual. Furthermore, they are generally non-refundable and cannot be redeemed or exchanged for cash, credit, or any other monetary value.
            </SubSection>

            <SubSection title="Referral Bonus Program Specifics">
              Participation in any referral bonus program offered by Shine Spec is entirely voluntary and is governed by a separate and specific set of terms and conditions applicable to that particular program. These terms will meticulously detail the eligibility criteria for both the referrer and the referred party, the specific actions required to qualify for a bonus, the exact bonus amounts (which may vary), the method of bonus redemption, and any limitations on the number of referrals. Shine Spec retains the absolute right to modify, suspend, or completely terminate any referral program at any time, with or without prior notice, at its sole discretion.
            </SubSection>

            <SubSection title="Strict Prohibition of Fraudulent or Unauthorized Use">
              Shine Spec reserves the unequivocal right to invalidate, cancel, or refuse the redemption of any gift voucher, coupon, or referral bonus if there is a reasonable suspicion of fraudulent use, misuse, or if it is determined that the voucher or bonus was obtained through unauthorized, illegal, or deceptive means. This includes, but is not limited to, the use of automated scripts, multiple accounts, or any other method intended to unfairly gain an advantage. In such cases, Shine Spec may also take further action, including account suspension or termination.
            </SubSection>

            <SubSection title="One Voucher Per Transaction">
              Typically, only one voucher or coupon can be applied per single booking transaction unless explicitly stated otherwise in the specific voucher terms. Vouchers cannot usually be combined.
            </SubSection>
          </Section>

          <Section title="21. Privacy; ECT Act">
            <SubSection title="Paramount Importance of Privacy">
              At Shine Spec, we recognize and prioritize the paramount importance of your privacy. Our practices concerning the collection, utilization, secure storage, and disclosure of your personal information are meticulously governed by our comprehensive Privacy Policy. This policy is a fundamental component of your agreement with Shine Spec and is incorporated into these Terms and Conditions by reference.
            </SubSection>

            <SubSection title="Mandatory Review of Privacy Policy">
              We strongly and unequivocally urge all users to thoroughly review our Privacy Policy, which is readily accessible on our website at www.shinespec.com/privacy. This document provides detailed information on:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>What types of personal data we collect.</li>
                <li>The purposes for which we collect and process your data.</li>
                <li>How we secure your data against unauthorized access or breaches.</li>
                <li>Under what limited circumstances we may share your data with third parties.</li>
                <li>Your rights regarding your personal data (e.g., access, correction, deletion).</li>
              </ul>
            </SubSection>

            <SubSection title="Consent to Privacy Policy">
              By accessing, using, or registering for any of the Shine Spec Services, you explicitly acknowledge that you have read, understood, and agreed to the terms of our Privacy Policy. Your continued use of the Services signifies your ongoing consent to our data practices as described therein.
            </SubSection>

            <SubSection title="Compliance with Electronic Communications and Transactions Act (ECT Act)">
              Shine Spec is fully committed to and operates in strict compliance with the provisions of the Electronic Communications and Transactions Act 25 of 2002 ("ECT Act") of the Republic of South Africa. This commitment includes, but is not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Transparency of Information:</strong> Providing clear, accurate, and easily accessible information about Shine Spec as a service provider, including our legal name, registration number (2023 / 193032 / 07), physical address, and contact details (email: info@shinespec.com).</li>
                <li><strong>Service Description:</strong> Offering clear descriptions of the services provided through the platform.</li>
                <li><strong>Pricing:</strong> Ensuring transparent pricing for services.</li>
                <li><strong>Dispute Resolution Mechanisms:</strong> Establishing accessible and fair mechanisms for the resolution of consumer disputes.</li>
                <li><strong>Security of Transactions:</strong> Implementing reasonable security measures to protect the integrity and confidentiality of electronic transactions.</li>
              </ul>
            </SubSection>

            <SubSection title="Robust Data Protection Measures">
              Shine Spec implements and maintains a range of reasonable and appropriate technical and organizational security measures designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction. These measures are continually reviewed and updated in accordance with applicable data protection laws and industry best practices to ensure the ongoing security of your data.
            </SubSection>
          </Section>

          <Section title="22. Termination">
            <SubSection title="User-Initiated Termination (Your Right to Exit)">
              You retain the right to terminate your user account with Shine Spec at any time, for any reason, by sending a formal request to our designated email address: info@shinespec.com. Upon successful processing of your termination request, your access to the Shine Spec Services will cease immediately. Any outstanding payments owed by you for services rendered or applicable cancellation fees will be processed and settled at the time of termination.
            </SubSection>

            <SubSection title="Shine Spec-Initiated Termination (Our Right to Suspend/End)">
              Shine Spec reserves the absolute right to suspend, limit, or permanently terminate your account and your access to all or any part of the Services immediately, and without prior notice or liability, for any reason whatsoever. Such reasons for termination by Shine Spec include, but are not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Breach of Terms:</strong> Any material breach or repeated violation of these Terms and Conditions, our Privacy Policy, or any other policies or guidelines incorporated by reference.</li>
                <li><strong>Fraudulent or Illegal Activity:</strong> Engagement in, or suspected engagement in, any fraudulent, illegal, or deceptive activities on the platform.</li>
                <li><strong>Harm to Platform or Users:</strong> Any conduct that, in Shine Spec's sole discretion, is harmful to the platform, other users, cleaning service providers, or Shine Spec's reputation.</li>
                <li><strong>Non-Payment:</strong> Failure to make timely payments for services rendered or fees due.</li>
                <li><strong>Technical or Operational Necessity:</strong> If required by law, court order, or for technical or operational reasons.</li>
              </ul>
            </SubSection>

            <SubSection title="Effect of Termination">
              Upon the effective date of termination, regardless of which party initiated it:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Your license to use the Services will immediately cease.</li>
                <li>Your access to your account and any associated data may be revoked or deleted (subject to our data retention policies).</li>
                <li>Any outstanding financial obligations (payments owed to or by you) will become immediately due and payable.</li>
              </ul>
            </SubSection>

            <SubSection title="Survival of Provisions">
              Certain provisions of these Terms are designed to survive the termination of this Agreement. These "survival" provisions shall remain in full force and effect indefinitely after termination, as their nature dictates their continued applicability. Such provisions include, without limitation: ownership provisions (Intellectual Property), warranty disclaimers, indemnification clauses, limitations of liability, governing law and jurisdiction, and any other clauses that by their context are intended to survive.
            </SubSection>
          </Section>

          <Section title="23. Disclaimer of Warranties (Comprehensive)">
            <SubSection title="'As Is' and 'As Available' Basis">
              The Shine Spec Services, encompassing the website, mobile applications, platform, and all content, functionalities, and services provided therein, are furnished to you strictly on an "as is" and "as available" basis. This means that Shine Spec provides the Services without any representations or warranties of any kind, whether express, implied, statutory, or otherwise.
            </SubSection>

            <SubSection title="Exclusion of Implied Warranties">
              To the fullest extent permissible under the applicable laws of the Republic of South Africa, Shine Spec expressly disclaims all warranties, whether express or implied. This includes, but is not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Implied Warranties of Merchantability:</strong> Warranties that the Services are fit for the ordinary purposes for which such goods or services are used.</li>
                <li><strong>Implied Warranties of Fitness for a Particular Purpose:</strong> Warranties that the Services are suitable for your specific, individual purpose.</li>
                <li><strong>Implied Warranties of Non-Infringement:</strong> Warranties that the Services do not infringe upon the intellectual property rights of third parties.</li>
                <li><strong>Implied Warranties Arising from Course of Performance, Course of Dealing, or Usage of Trade:</strong> Any warranties that might otherwise arise from business practices or customary dealings.</li>
              </ul>
            </SubSection>

            <SubSection title="No Guarantee of Uninterrupted or Error-Free Service">
              Shine Spec does not warrant or guarantee that:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>The Services will be uninterrupted, continuous, timely, secure, or operate without errors.</li>
                <li>Any defects or errors in the Services will be corrected.</li>
                <li>The Services or the servers that make them available are free of viruses or other harmful components.</li>
                <li>The results that may be obtained from the use of the Services will be accurate, reliable, complete, or meet your specific requirements or expectations.</li>
                <li>The quality of any products, services, information, or other material purchased or obtained by you through the Services will meet your expectations.</li>
              </ul>
            </SubSection>

            <SubSection title="No Endorsement or Guarantee of Third-Party Services">
              Shine Spec's role is solely that of a platform facilitator. Therefore, Shine Spec does not endorse, warrant, or guarantee the quality, safety, legality, reliability, or suitability of any cleaning services provided by independent third-party cleaning service providers who operate through the platform. Users acknowledge that they engage these independent providers at their own risk.
            </SubSection>

            <SubSection title="No Advice or Information Warranty">
              No advice or information, whether oral or written, obtained by you from Shine Spec or through the Services shall create any warranty not expressly stated in these Terms.
            </SubSection>

            <SubSection title="User Assumption of Risk">
              You expressly acknowledge and agree that your use of the Services is at your sole risk.
            </SubSection>
          </Section>

          <Section title="24. Network Delays">
            <SubSection title="Inherent Limitations of Internet and Electronic Communications">
              Shine Spec's Services, by their very nature as online digital platforms, are inherently reliant on the internet and various electronic communication networks. Consequently, the Services may be subject to various limitations, delays, and other problems that are intrinsic to the use of such technologies. These issues can arise from factors beyond Shine Spec's direct control.
            </SubSection>

            <SubSection title="Examples of Potential Delays">
              Such problems may include, but are not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Delays or failures in data transmission over the internet.</li>
                <li>Network congestion or outages affecting internet service providers.</li>
                <li>Malfunctions or unavailability of telecommunications networks.</li>
                <li>Performance issues related to your own internet connection, device hardware, or software.</li>
                <li>Geographical limitations or disparities in network infrastructure.</li>
              </ul>
            </SubSection>

            <SubSection title="Shine Spec Not Responsible for External Network Issues">
              Shine Spec explicitly disclaims responsibility and liability for any delays, delivery failures, service interruptions, or other damages, losses, or inconveniences that directly result from problems inherent in the use of the internet and electronic communications, or from factors related to third-party network providers. Our responsibility is limited to the functionality of our platform itself, not the underlying internet infrastructure.
            </SubSection>

            <SubSection title="No Guarantee of Compatibility">
              While Shine Spec strives to ensure broad accessibility, we do not provide a guarantee that the Service will be fully compatible with all hardware, software, operating systems, or internet browsers that you may choose to use to access the platform. Users are responsible for ensuring their own equipment meets the necessary technical specifications for optimal use.
            </SubSection>

            <SubSection title="Impact on Service Execution">
              Users acknowledge that such network delays could potentially impact the real-time functionality of the platform, including but not limited to, the speed of booking confirmations, communication between parties, or the processing of payments. Shine Spec will endeavour to mitigate the impact of such issues on its own systems, but cannot control external network conditions.
            </SubSection>
          </Section>

          <Section title="25. Insurance">
            <SubSection title="Sole Responsibility of Provider for Insurance">
              Cleaning service providers registered on the Shine Spec platform are solely and entirely responsible for obtaining, maintaining, and ensuring the adequacy of their own appropriate insurance coverage. This mandatory coverage must include, at a minimum, comprehensive public liability insurance (or equivalent professional indemnity insurance) sufficient to cover any potential damages, injuries, losses, or liabilities that may arise during the course of their provision of cleaning services to customers. This includes accidental damage to property, personal injury to the customer or third parties, or any other insurable event directly related to their work.
            </SubSection>

            <SubSection title="Shine Spec is Not an Insurer">
              It is unequivocally stated that Shine Spec does not provide, underwrite, or act as an insurer for any cleaning services facilitated through its platform. Shine Spec does not offer any form of insurance coverage to either customers or cleaning service providers for damages, injuries, or losses incurred during the performance of services.
            </SubSection>

            <SubSection title="Customer Due Diligence Regarding Provider Insurance">
              While Shine Spec encourages providers to maintain adequate insurance, customers are advised and encouraged to exercise their own due diligence. If insurance coverage is a significant concern for a customer, they should verify directly with the chosen cleaning service provider that the provider possesses and maintains adequate and current insurance before confirming a booking. Shine Spec may, at its discretion, request proof of insurance from providers upon onboarding or at any time.
            </SubSection>

            <SubSection title="Direct Resolution for Damage/Loss">
              In the unfortunate event of any damage to property, loss of items, or personal injury occurring during the provision of a cleaning service, customers should first attempt to resolve the issue directly with the cleaning service provider who performed the service. The provider's insurance should be the primary recourse for such claims.
            </SubSection>

            <SubSection title="Shine Spec's Limited Mediation Role">
              While Shine Spec may, at its sole discretion and as outlined in the "Booking Cover" section, offer assistance in mediating disputes between customers and providers regarding damages or losses, such assistance does not imply or create any liability on the part of Shine Spec for the damages themselves. Shine Spec's role in such mediation is strictly facilitative and not that of an insurer or guarantor of outcomes.
            </SubSection>
          </Section>

          <Section title="26. Booking Cover">
            <SubSection title="Formal Dispute Resolution Procedure">
              In the event of a significant dispute or issue directly related to a specific booking, such as a service not being performed to the agreed-upon standard, a material breach of the service agreement by the provider, or significant damage caused during the service, customers are required to formally contact Shine Spec's dedicated customer support team. This contact must be made promptly, typically within a specified period (e.g., twenty-four (24) to forty-eight (48) hours) following the scheduled completion time of the service. All communications should be directed to info@shinespec.com, providing comprehensive details of the complaint.
            </SubSection>

            <SubSection title="Shine Spec's Investigation Process">
              Upon receiving a valid complaint, Shine Spec will initiate an internal investigation into the matter. This process may involve reviewing booking details, communication logs, and potentially contacting both the customer and the cleaning service provider to gather all relevant information and perspectives. Shine Spec will strive to conduct a fair and impartial assessment of the situation.
            </SubSection>

            <SubSection title="Discretionary Remedies Offered by Shine Spec">
              Based on the findings of its investigation and at its sole and absolute discretion, Shine Spec may offer various remedies to the customer. These remedies are designed to address the specific issue and may include, but are not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>A partial or full refund of the service fee paid for the specific booking in question.</li>
                <li>The arrangement for a re-performance of the service by the same or an alternative cleaning service provider, at no additional cost to the customer.</li>
                <li>The issuance of a credit for future bookings on the Shine Spec platform, equivalent to the value of the disputed service.</li>
                <li>Facilitating direct communication or mediation between the customer and the provider to reach a mutually agreeable resolution.</li>
              </ul>
            </SubSection>

            <SubSection title="Strict Limitations of Booking Cover">
              It is critically important to understand that this "Booking Cover" is a discretionary goodwill gesture by Shine Spec and is not, under any circumstances, to be construed as an insurance policy. It does not extend to cover:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li><strong>Consequential Damages:</strong> Any indirect, incidental, or consequential damages, such as loss of income, emotional distress, or costs associated with alternative arrangements.</li>
                <li><strong>Losses Beyond Direct Service Cost:</strong> Any losses or damages that exceed the direct cost of the specific cleaning service giving rise to the dispute.</li>
                <li><strong>Provider's Liability:</strong> It does not absolve the cleaning service provider of their direct liability for damages or non-performance, nor does it replace the need for the provider to carry their own insurance.</li>
                <li><strong>External Issues:</strong> Problems arising from factors outside the direct control or scope of the cleaning service (e.g., pre-existing damage, issues with customer-supplied equipment).</li>
              </ul>
            </SubSection>

            <SubSection title="No Legal Obligation">
              Shine Spec's provision of this Booking Cover is entirely voluntary and does not create any legal obligation on Shine Spec to provide specific remedies in every instance. Each case will be assessed individually.
            </SubSection>
          </Section>

          <Section title="27. Non-discrimination">
            <SubSection title="Commitment to Inclusive Platform">
              Shine Spec is deeply committed to fostering and maintaining an inclusive, equitable, and welcoming platform environment that is entirely free from any form of discrimination. We believe that all individuals, whether customers or cleaning service providers, should be treated with respect and dignity.
            </SubSection>

            <SubSection title="Explicit Prohibition of Discrimination">
              We strictly and unequivocally prohibit any form of discrimination against any user of the Shine Spec platform. This prohibition extends to discrimination based on, but not limited to, the following protected characteristics:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Race</li>
                <li>Colour</li>
                <li>Religion (including religious beliefs and practices)</li>
                <li>National Origin or Ancestry</li>
                <li>Gender (including gender identity and expression)</li>
                <li>Sexual Orientation</li>
                <li>Age</li>
                <li>Disability (physical or mental)</li>
                <li>Marital Status</li>
                <li>Any other characteristic protected by applicable South African law.</li>
              </ul>
            </SubSection>

            <SubSection title="Application to All Interactions">
              This non-discrimination policy applies to all aspects of interaction on the Shine Spec platform, including but not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>The acceptance or rejection of service requests by providers.</li>
                <li>The provision of services by providers.</li>
                <li>Customer interactions with providers.</li>
                <li>The content of reviews and feedback.</li>
                <li>Any communication exchanged through the platform.</li>
              </ul>
            </SubSection>

            <SubSection title="Consequences of Discriminatory Behaviour">
              Any user (whether a customer or a cleaning service provider) found to be engaging in discriminatory behaviour, as determined by Shine Spec in its sole discretion following an investigation, will face serious consequences. These may include, but are not limited to:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Immediate suspension of their user account.</li>
                <li>Permanent termination of their account and removal from the Shine Spec platform.</li>
                <li>Reporting to relevant authorities if the discriminatory behaviour constitutes a violation of law.</li>
              </ul>
            </SubSection>

            <SubSection title="Reporting Discrimination">
              Users are strongly encouraged and expected to report any instances of suspected discriminatory behaviour to Shine Spec immediately via info@shinespec.com, providing as much detail as possible to facilitate an investigation.
            </SubSection>
          </Section>

          <Section title="28. Consumer Protection">
            <SubSection title="Acknowledgement of Consumer Rights">
              Shine Spec fully acknowledges, respects, and is committed to upholding your fundamental rights as a consumer, as enshrined and protected under the Consumer Protection Act 68 of 2008 ("CPA") of the Republic of South Africa. We understand that our operations must align with the principles and provisions of this crucial legislation.
            </SubSection>

            <SubSection title="No Limitation of Mandatory Rights">
              Nothing contained within these Terms and Conditions is intended to, nor shall it be interpreted to, limit, restrict, exclude, or override any of your mandatory statutory consumer rights that are guaranteed under the CPA. Where any provision of these Terms might appear to conflict with a mandatory provision of the CPA, the CPA's provision shall prevail.
            </SubSection>

            <SubSection title="Severability and Modification for CPA Compliance">
              In the event that any specific provision or part of a provision within these Terms and Conditions is found by a court of competent jurisdiction or a regulatory body to be inconsistent with, invalid under, or unenforceable due to the Consumer Protection Act, that particular provision (or part thereof) will be severed from this Agreement or modified to the minimum extent necessary to comply with the CPA. The remaining provisions of these Terms and Conditions shall, however, remain in full force and effect and continue to be binding upon all parties.
            </SubSection>

            <SubSection title="Commitment to Fair Dealing">
              Shine Spec is committed to dealing with all consumers fairly, honestly, and responsibly. This includes providing clear, accurate, and transparent information about our services, pricing, and terms, and ensuring that our dispute resolution processes are accessible and equitable.
            </SubSection>

            <SubSection title="Accessibility of Information">
              We strive to ensure that all information required by the CPA (e.g., our registration details, contact information, and service descriptions) is readily available and easily accessible on our website.
            </SubSection>
          </Section>

          <Section title="29. Controlling Law and Jurisdiction">
            <SubSection title="Governing Law">
              This Agreement, including its formation, validity, interpretation, performance, and any disputes arising out of or in connection with it, shall be exclusively governed by and construed in accordance with the substantive laws of the Republic of South Africa. This choice of law applies without regard to its conflict of law principles, meaning that the laws of South Africa will apply irrespective of where you access or use the Services.
            </SubSection>

            <SubSection title="Exclusive Jurisdiction">
              You irrevocably agree and consent that any legal action, suit, or proceeding arising out of or directly relating to these Terms and Conditions, your use of the Shine Spec Services, or any services facilitated through the platform, shall be exclusively brought and litigated in the appropriate courts located within Randburg, Gauteng, South Africa.
            </SubSection>

            <SubSection title="Waiver of Other Jurisdictions">
              By agreeing to these Terms, you explicitly waive any right you may have to bring legal action in any other jurisdiction, and you consent to the personal jurisdiction of the courts in Randburg, Gauteng, South Africa, for the purpose of litigating any such claims or disputes.
            </SubSection>

            <SubSection title="Enforcement">
              This clause ensures legal certainty and efficiency in resolving any potential disputes, directing all legal proceedings to a specific and recognized legal forum.
            </SubSection>
          </Section>

          <Section title="30. General Provisions">
            <SubSection title="Entire Agreement Clause">
              These Terms and Conditions, in conjunction with our Privacy Policy and any other specific policies, guidelines, or rules explicitly referenced and incorporated herein (such as specific terms for gift vouchers or referral programs), constitute the complete and entire agreement between you and Shine Spec. This Agreement supersedes and replaces all prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and Shine Spec regarding the subject matter hereof.
            </SubSection>

            <SubSection title="Severability Clause">
              If any provision or part of a provision of these Terms is found by a court of competent jurisdiction to be invalid, illegal, or unenforceable for any reason (e.g., due to conflict with applicable law), that specific provision or part thereof shall be deemed severed from this Agreement. The invalidity or unenforceability of that particular provision shall not affect the validity or enforceability of the remaining provisions of these Terms, which shall remain in full force and effect.
            </SubSection>

            <SubSection title="No Waiver of Rights">
              No waiver by Shine Spec of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition, or a waiver of any other term or condition. Any failure by Shine Spec to assert a right or provision under these Terms shall not constitute a waiver of such right or provision. A waiver can only be effective if it is in writing and signed by an authorized representative of Shine Spec.
            </SubSection>

            <SubSection title="Prohibition of Assignment by User">
              You may not assign, transfer, delegate, or sublicense these Terms and Conditions, or any of your rights or obligations hereunder, by operation of law or otherwise, without the explicit prior written consent of Shine Spec. Any attempted assignment or transfer in violation of this provision shall be null and void.
            </SubSection>

            <SubSection title="Shine Spec's Right to Assign">
              Shine Spec reserves the right to assign, transfer, or delegate these Terms and Conditions, and its rights and obligations hereunder, to any third party at its sole discretion, without requiring your consent. This may occur, for example, in connection with a merger, acquisition, or sale of assets.
            </SubSection>

            <SubSection title="Headings for Convenience Only">
              The headings and subheadings used in these Terms and Conditions are included for convenience and ease of reference only. They are not intended to define, limit, construe, or describe the scope or extent of any section or provision of this Agreement and shall not affect their interpretation.
            </SubSection>

            <SubSection title="Language">
              The official language of this Agreement is English. Any translations are provided for convenience only and shall not be binding.
            </SubSection>
          </Section>

          <Section title="31. Complaints">
            <SubSection title="Structured Complaint Procedure">
              Should you have any complaints, concerns, feedback, or issues regarding the Shine Spec Services, the conduct of a cleaning service provider, or any aspect pertaining to these Terms and Conditions, we encourage you to follow our structured complaint procedure. This ensures that your concerns are directed to the appropriate channels for efficient resolution.
            </SubSection>

            <SubSection title="Primary Contact Information for Complaints">
              Please direct all formal complaints and detailed concerns to Shine Spec's dedicated customer support team using the following contact information:
              <div className="mt-2 ml-4 space-y-1">
                <div><strong>Email:</strong> info@shinespec.com</div>
                <div><strong>Website:</strong> For general inquiries or to find additional support resources, please visit www.shinespec.com.</div>
              </div>
            </SubSection>

            <SubSection title="Information to Include in Your Complaint">
              To facilitate a prompt and effective resolution, please ensure your complaint includes all relevant details, such as:
              <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                <li>Your full name and contact information.</li>
                <li>Your Shine Spec account details (if applicable).</li>
                <li>The booking ID or relevant service date/time.</li>
                <li>A clear, concise, and detailed description of the issue or complaint.</li>
                <li>Any supporting documentation, photographs, or communication logs.</li>
                <li>The specific outcome or resolution you are seeking.</li>
              </ul>
            </SubSection>

            <SubSection title="Commitment to Fair and Timely Resolution">
              Shine Spec is committed to addressing and resolving all legitimate complaints in a fair, impartial, and timely manner. Upon receipt of your complaint, we will acknowledge it and endeavour to investigate the matter thoroughly. We will communicate with you throughout the resolution process and inform you of the outcome. While we strive for quick resolutions, complex issues may require more time.
            </SubSection>

            <SubSection title="Escalation">
              If you are not satisfied with the initial resolution provided, you may request an escalation of your complaint to a higher level of management within Shine Spec, which will be handled according to our internal escalation protocols.
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <currentPolicy.icon size={36} />
            <h1 className="text-3xl sm:text-4xl font-bold">{currentPolicy.title}</h1>
          </div>
          <p className="text-blue-100 text-sm">Last updated: {currentPolicy.lastUpdated}</p>
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
    <h3 className="text-xl font-bold text-slate-900 mb-4 text-blue-600">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SubSection = ({ title, children }) => (
  <div className="mb-4">
    {title && <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>}
    <p className="text-slate-700 leading-relaxed">{children}</p>
  </div>
);

export default TermsPages;