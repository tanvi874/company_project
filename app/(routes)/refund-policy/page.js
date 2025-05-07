import Link from 'next/link';
import React from 'react';

const RefundPolicyPage = () => { 
  return (
    <main className="container mx-auto"> 
      <div className="wrapper mb-16 mt-10"> 
        <h1 className="mb-8 text-2xl font-bold pt-20">Refund Policy</h1>

        {/* Table of Contents */}
        <section className="rounded-lg border-l-[6px] border-primary bg-gray-100 bg-muted p-6 ">
          <h2 className="mb-4 text-sm font-bold md:text-lg">Table of Contents</h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li><Link className="text-blue-500 hover:underline" href="#introduction">Introduction</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#refund-eligibility">Refund Eligibility</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#non-refundable-situations">Non-refundable Situations</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#refund-turnaround-time">Refund Turnaround Time</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#process-for-claiming-refund">Process for Claiming Refund</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#refund-amount">Refund Amount</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#refund-method">Refund Method</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#changes-to-refund-policy">Changes to Refund Policy</Link></li>
            <li><Link className="text-blue-500 hover:underline" href="#contact-us">Contact Us</Link></li>
          </ul>
        </section>

        {/* Policy Sections */}
        <div className="mt-4">
          <section id="introduction" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Introduction</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              At SetIndiaBiz, we aim to ensure customer satisfaction. However, there might be occasions when you need to seek a refund. This policy outlines the conditions for refunds and the process for claiming one.
            </p>
          </section>

          <section id="refund-eligibility" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Refund Eligibility</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              Refunds are eligible under the following conditions:
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
              <li>If the chartered accountant or company secretary fails to deliver the service within a mutually agreed timeframe.</li>
              <li>If the service provided is significantly different from the description on our platform.</li>
            </ul>
          </section>

          <section id="non-refundable-situations" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Non-refundable Situations</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              No refunds will be issued under these circumstances:
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base"> 
              <li>If you change your mind after engaging a service provider.</li>
              <li>If a delay or discrepancy is due to inaccurate or incomplete information provided by you.</li>
            </ul>
          </section>

          <section id="refund-turnaround-time" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Refund Turnaround Time</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              Refunds will be processed within 5 business days after approval of the refund request. This timeframe allows us to review and process the request fairly.
            </p>
          </section>

          <section id="process-for-claiming-refund" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Process for Claiming Refund</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              To claim a refund:
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base"> {/* Added space-y-1 */}
              <li>Contact our support team at help@setindiabiz.com within 7 days of the service completion date.</li>
              <li>Provide a detailed reason for your dissatisfaction and any supporting documentation.</li>
              <li>Our team will review the request and respond within 10 business days.</li>
            </ul>
          </section>

          <section id="refund-amount" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Refund Amount</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              The refund amount will depend on the nature of the service and the payment made. Generally:
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400 md:text-base"> {/* Added space-y-1 */}
              <li>Full refunds are issued for services not delivered.</li>
              <li>Partial refunds are considered if a portion of the service was delivered but was incomplete or unsatisfactory.</li>
            </ul>
          </section>

          <section id="refund-method" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Refund Method</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              Refunds are processed using the same payment method used for the original transaction unless otherwise agreed.
            </p>
          </section>

          <section id="changes-to-refund-policy" className="mb-4">
            <h2 className="mb-4 pt-6 text-xl font-bold">Changes to Refund Policy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              BizLecta reserves the right to modify this Refund Policy at any time. Any changes will be effective immediately upon posting, and we will notify users of significant changes.
            </p>
          </section>

          <section id="contact-us" className="mb-4"> 
            <h2 className="mb-4 pt-6 text-xl font-bold">Contact Us</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
              If you have any questions about this Refund Policy, please contact us at
              <a className="text-blue-500 hover:underline ml-1" href="mailto:help@setindiabiz.com">
              help@setindiabiz.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default RefundPolicyPage;
