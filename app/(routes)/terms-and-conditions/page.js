import Link from "next/link";

const TermsAndConditionsPage = () => {
  return (
    <div className="wrapper mb-16 mt-10">
      <h1 className="mb-8 text-2xl font-bold pt-20">Terms and Conditions</h1>

      {/* Table of Contents */}
      <section className="mt-10 rounded-lg border-l-[6px] border-primary bg-gray-100 bg-muted p-6">
        <h2 className="mb-4 text-sm font-bold md:text-lg">Table of Contents</h2>
        <ul className="space-y-2 text-sm md:text-base">
          <li><Link className="text-blue-500 hover:underline" href="#introduction">Introduction</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#user-account">User Account</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#content">Content</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#intellectual-property">Intellectual Property</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#termination">Termination</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#limitation-of-liability">Limitation of Liability</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#governing-law">Governing Law</Link></li>
          <li><Link className="text-blue-500 hover:underline" href="#consent">Consent for Communication</Link></li>
        </ul>
      </section>

      {/* Terms Sections */}
      <div className="mt-4">
        <section id="introduction">
          <h2 className="mb-4 pt-6 text-xl font-bold">Introduction</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            Welcome to SetIndiaBiz Website. We connect company owners with chartered accountants and company secretaries to help file their pending forms and ensure compliance. By accessing or using our website, you agree to be bound by these terms and conditions and our privacy policy.
          </p>
        </section>

        <section id="user-account">
          <h2 className="mb-4 pt-6 text-xl font-bold">User Account</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            To use our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your username and password.
          </p>
        </section>

        <section id="content">
          <h2 className="mb-4 pt-6 text-xl font-bold">Content</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            {`Our website and service may contain text, images, and other content (collectively, "Content"). The Content is provided for informational and educational purposes only and is not intended to be a substitute for professional advice.`}
          </p>
        </section>

        <section id="intellectual-property">
          <h2 className="mb-4 pt-6 text-xl font-bold">Intellectual Property</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            Our website and service, including all Content, are owned by us and are protected by copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section id="termination">
          <h2 className="mb-4 pt-6 text-xl font-bold">Termination</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            We reserve the right to suspend or terminate your access to our website and service at any time, for any reason, if we reasonably believe that you have violated these terms and conditions.
          </p>
        </section>

        <section id="limitation-of-liability">
          <h2 className="mb-4 pt-6 text-xl font-bold">Limitation of Liability</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            We will not be liable for any indirect, special, incidental, or consequential damages arising out of or related to your use of our website and service, including but not limited to lost profits, loss of data, or business interruption.
          </p>
        </section>

        <section id="governing-law">
          <h2 className="mb-4 pt-6 text-xl font-bold">Governing Law</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            These terms and conditions shall be governed by and construed in accordance with the laws of Mumbai.
          </p>
        </section>

        <section id="consent">
          <h2 className="mb-4 pt-6 text-xl font-bold">Consent for Communication</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
            By using the services provided by SetIndiaBiz, users consent to receive, either directly or through third-party service providers, various information, alerts, SMS, messages, calls, commercial communication, and other services on the registered contact numbers, irrespective of registration with the National Do Not Call Registry or similar preferences. Sending such messages or calls shall not make SetIndiaBiz or its third-party service providers liable under the Telecom Commercial Communications Customer Preference Regulations, 2010, or other applicable regulations, including amendments.
          </p>
        </section>
      </div>

      {/* Contact Link */}
      <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 md:text-base">
        If you have any questions about this Privacy Policy, please contact at <span>
        <a className="text-blue-500 hover:underline" href="mailto:help@setindiabiz.com">
        help@setindiabiz.com
        </a>.
        </span>
      </p>
    </div>
  );
};

export default TermsAndConditionsPage;