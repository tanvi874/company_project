"use client"; // Add this to make it a Client Component

import React, { useState } from 'react'; // Import useState
import { ChevronDown } from 'lucide-react';

// Sample FAQ data (replace with your actual data source if dynamic)
const faqItems = [
    {
        id: 'faq1', // Unique ID for aria-controls
        question: 'What information can I find on SetIndiaBiz?',
        answer: 'SetIndiaBiz provides comprehensive data on registered companies, including basic profiles, director details, and more.',
    },
    {
        id: 'faq2',
        question: 'How do I search for companies on SetIndiaBiz?',
        answer: 'You can search using the company name, Corporate Identification Number (CIN)',
    },
    {
        id: 'faq3',
        question: 'What is a CIN, and why is it important?',
        answer: "A CIN (Corporate Identification Number) is a unique 21-digit alphanumeric code assigned to companies registered in India. It's crucial for identifying and tracking companies.",
    },
    {
        id: 'faq4',
        question: 'Can I search for directors on SetIndiaBiz?',
        answer: 'Yes, you can search for directors using their name or Director Identification Number (DIN) to find their associated companies and other details.',
    },
    {
        id: 'faq5',
        question: "Is SetIndiaBiz's basic company profile free?",
        answer: 'Yes, basic company profile information is generally available for free. More detailed data and features may require a subscription.',
    },
    {
        id: 'faq6',
        question: 'How often is the information on SetIndiaBiz updated?',
        answer: 'We strive to update our database regularly based on information sourced from official registries like the Ministry of Corporate Affairs (MCA).',
    },
    {
        id: 'faq7',
        question: "Can I find information about directors' qualifications on SetIndiaBiz?",
        answer: "No",
    },
    {
        id: 'faq8',
        question: "How do I contact SetIndiaBiz's support team?",
        answer: 'You can reach our support team via email at help@setindiabiz.com or through the contact form on our website.',
    },
    {
        id: 'faq9',
        question: 'What is the purpose of SetIndiaBiz?',
        answer: 'SetIndiaBiz aims to simplify access to comprehensive and up-to-date information about Indian companies for businesses, professionals, and individuals.',
    },
    {
        id: 'faq10',
        question: 'Does SetIndiaBiz offer real-time company information?',
        answer: 'While we update frequently, the data reflects the latest information available from official sources, which may not always be instantaneous real-time.',
    },
    {
        id: 'faq11',
        question: 'What types of companies can I find on SetIndiaBiz?',
        answer: 'You can find information on various types of registered entities, including Private Limited Companies, Public Limited Companies, Limited Liability Partnerships (LLPs), and more.',
    },
    {
        id: 'faq12',
        question: 'Can I find information about Indian company directors on SetIndiaBiz?',
        answer: 'Yes, SetIndiaBiz offers extensive search capabilities for directors registered in India, linking them to the companies they are associated with.',
    },
];


const FaqPage = () => {
    // State to keep track of the currently open FAQ item's ID
    const [openItemId, setOpenItemId] = useState('faq12'); // Start with 'faq12' open, or null for none

    // Function to toggle the open state of an item
    const handleToggle = (id) => {
        setOpenItemId(prevId => (prevId === id ? null : id)); // If clicking the open one, close it (null), otherwise open the new one
    };

    return (
        <main className="container mx-auto">
            <div className="wrapper mb-16 mt-10">
                <div className="mb-8 border-l-[6px] border-primary bg-muted p-6 pt-20">
                    <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
                </div>

                <div className="grid gap-4">
                    {faqItems.map((item) => {
                        // Determine if the current item is the open one
                        const isOpen = openItemId === item.id;
                        const state = isOpen ? 'open' : 'closed';

                        return (
                            // Use item.id as the key for React list rendering
                            <div key={item.id} data-state={state}>
                                <button
                                    type="button"
                                    onClick={() => handleToggle(item.id)} // Add the onClick handler
                                    aria-controls={item.id + '-content'}
                                    aria-expanded={isOpen} // Set aria-expanded based on state
                                    data-state={state} // Set data-state based on state
                                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-4 text-left text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 md:text-base"
                                >
                                    {item.question}
                                    <ChevronDown
                                        className="h-5 w-5 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
                                        data-state={state} // Pass state to icon for styling
                                        aria-hidden="true"
                                    />
                                </button>
                                {/* Content Div */}
                                <div
                                    data-state={state} // Set data-state based on state
                                    id={item.id + '-content'}
                                    hidden={!isOpen} // Use hidden attribute based on state
                                    // Optional: Add animation classes if defined in tailwind.config.js
                                    className="overflow-hidden rounded-md border border-t-0 border-gray-200 bg-white p-4 text-sm text-gray-500 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down dark:text-black md:text-base"
                                >
                                    {item.answer ? <p>{item.answer}</p> : <p>Answer coming soon...</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default FaqPage;
