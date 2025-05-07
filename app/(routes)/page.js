"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  LuSearch,
  LuUser,
  LuShieldCheck,
  LuMail,
  LuFileSpreadsheet,
  LuUserSearch,
  LuCheck,
  LuContact,
  LuChevronDown,
  LuLoader,
  LuLoaderCircle,
} from "react-icons/lu";
import { LucideLoader2 } from "lucide-react";

const WORDS_TO_TYPE = ["Directors", "Companies"];
const TYPING_SPEED = 68;
const DELETING_SPEED = 70;
const PAUSE_DURATION = 1000;
const SUGGESTION_DEBOUNCE_TIME = 300; // Debounce time in ms
const MIN_SEARCH_LENGTH = 3; // Minimum characters to trigger suggestions

// --- API Endpoints ---
const COMPANY_API_ENDPOINT = `/api/public/mca`; // Public MCA API for company search/fetch
const DIRECTOR_API_ENDPOINT = `/api/company/getdirector`; // Personal API for director search/fetch/suggestions
const PERSONAL_COMPANY_API_ENDPOINT = `/api/company/getcompany`; // Personal API for company fetch/suggestions

const faqData = [
  {
    question: "What can I find on SetIndiaBiz?",
    answer:
      "SetIndiaBiz provides comprehensive data on Indian companies and directors, including incorporation details, director profiles.",
  },
  {
    question: "How do I search for companies and directors?",
    answer:
      "You can search for companies and directors using the search bar on our homepage. Enter the company name, CIN, or director name/DIN to get started.",
  },
  {
    question: "Is the basic company profile free?",
    answer:
      "Yes, we offer a basic company profile for free, which includes essential details. More in-depth information is available with our premium subscriptions.",
  },
  {
    question: "How do I contact SetIndiaBiz's support team?",
    answer:
      "You can contact our support team via email at help@setindiabiz.com or through the contact form on our website.",
  },
];

const StatsSectionJSX = () => (
  <section
    className="py-12 lg:py-14 xl:py-16 gap-3.5"
    style={{ backgroundColor: "#0D2483" }}
  >
    <h6 className="text-center text-base text-ocean-mist md:text-lg lg:text-xl">
      It is about delivering insightful analysis, not just numerical data..
    </h6>
    <div className="mt-8 flex flex-col justify-center text-center md:flex-row md:gap-20 lg:gap-28">
      {/* Stat 1 */}
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="flex items-center justify-center mx-auto gap-3 text-3xl font-bold text-primary lg:text-4xl xl:text-5xl">
          <span>1+</span>
          <span>crore</span>
        </p>
        <p className="text-sm text-ocean-mist md:text-base lg:text-lg">
          Records
        </p>
      </div>
      {/* Stat 2 */}
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="flex items-center justify-center mx-auto gap-3 text-3xl font-bold text-primary lg:text-4xl xl:text-5xl">
          <span>8+</span>
          <span>lakhs</span>
        </p>
        <p className="text-sm text-ocean-mist md:text-base lg:text-lg">
          Companies Financial Summary
        </p>
      </div>
      {/* Stat 3 */}
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="flex items-center justify-center mx-auto gap-3 text-3xl font-bold text-primary lg:text-4xl xl:text-5xl">
          <span>25.5+</span>
          <span>lakhs</span>
        </p>
        <p className="text-sm text-ocean-mist md:text-base lg:text-lg">
          Companies Incorporation Data
        </p>
      </div>
    </div>
  </section>
);

const DirectorProfileSectionJSX = () => (
  // Use padding on wrapper for consistent spacing
  <section className="wrapper py-10 md:py-14">
    <h1 className="section-title mb-8 md:mb-12 text-center mt-2">
      Explore Indian Directors <span className="text-primary">Complete</span>{" "}
      Profile
    </h1>
    {/* Centered the container */}
    <div className="flex w-full flex-col items-center justify-center gap-8 lg:max-w-6xl lg:mx-auto lg:flex-row lg:justify-between lg:gap-12 xl:gap-16">
      {/* Text Content */}
      <div className="lg:w-1/2 lg:pr-8">
        <h3 className="max-w-xl text-sm font-medium text-muted-foreground md:text-lg lg:max-w-full 2xl:text-xl">
          Access personal information of both current and past directorships by
          conducting a directors search
        </h3>
        <div className="mt-6 flex flex-col gap-4 md:gap-6 lg:mt-8">
          {/* Feature 1 */}
          <div className="flex items-start gap-3 text-sm font-medium text-muted-foreground md:text-base">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-[#EFD9F9] p-1 text-[#0F172A]">
              <LuCheck size={14} />
            </div>
            <p>Stay informed about disqualified directors</p>
          </div>
          {/* Feature 2 */}
          <div className="flex items-start gap-3 text-sm font-medium text-muted-foreground md:text-base">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-[#EFD9F9] p-1 text-[#0F172A]">
              <LuCheck size={14} />
            </div>
            <p>{`Analyze a director's qualifications using their business history.`}</p>
          </div>
          {/* Feature 3 */}
          <div className="flex items-start gap-3 text-sm font-medium text-muted-foreground md:text-base">
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-[#EFD9F9] p-1 text-[#0F172A]">
              <LuCheck size={14} />
            </div>
            <p>Information about the company management and structure</p>
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 search-director-btn py-2 h-12 w-full gap-2 px-5 text-white transition-all duration-300 md:w-auto md:text-base"
            href="/"
          >
            <LuUserSearch /> Search for all directors
          </Link>
        </div>
      </div>
      {/* Image Section */}
      <div className="relative mt-8 lg:w-1/2 lg:mt-0 ">
        {/* Added sizes prop */}
        <Image
          alt="Image of directors in a business office"
          loading="lazy"
          width={500}
          height={370}
          sizes="(max-width: 1024px) 90vw, 570px"
          className="w-full max-w-[570px] h-auto rounded-lg object-cover grayscale"
          style={{ color: "transparent" }}
          src="https://www.setindiabiz.com/assets/company-name-search/directors.webp"
        />
      </div>
    </div>
  </section>
);

const DecisionMakerSectionJSX = () => (
  <section className="mb-16 md:mb-20">
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-md md:rounded-xl md:p-8 mx-4 md:mx-auto md:max-w-6xl">
      <div className="flex flex-col-reverse items-center sm:flex-row">
        <div className="z-10 mt-8 sm:w-5/12 md:mt-0">
          <div className="relative h-auto">
            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-400 opacity-50" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500 opacity-50" />
            <Image
              alt="Illustration showing contact access"
              loading="lazy"
              width={500}
              height={500}
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 500px"
              className="h-auto max-h-64 w-auto transform md:absolute md:left-1/2 md:top-1/2 md:max-h-80 md:-translate-x-1/2 md:-translate-y-1/2"
              style={{ color: "transparent" }}
              src="https://www.setindiabiz.com/assets/company-name-search/decision-contact.webp"
            />
          </div>
        </div>
        {/* Text Content */}
        <div className="z-10 sm:w-7/12 sm:pl-6 md:pl-10 lg:pl-16 text-center sm:text-left">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl lg:text-3xl">
            Only Need to Talk to the Decision Makers?
          </h2>
          <p className="mb-6 text-xs font-light md:text-sm">
            {`Skip the clutter and get straight to what matters - directors' contact info from newly registered companies. Quick, direct, and perfect for focused outreach.`}
          </p>
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 hover:bg-secondary/80 py-2 h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700 sm:w-fit lg:text-base contact-btn"
            href="/unlock-contact"
          >
            <LuContact className="text-lg md:text-2xl" />
            {`Get Directors' Contact Now`}
          </Link>
        </div>
      </div>
      {/* Background decorative elements */}
      <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-500 opacity-20" />
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-700 opacity-20" />
    </div>
  </section>
);

const FAQSectionJSX = ({ data }) => (
  <section id="faq" className="wrapper w-full mb-16 md:mb-24 px-4">
    <h2 className="section-title text-center mb-8 md:mb-12">
      All You Need To Know{" "}
      <span className="block text-primary md:inline">About BizLecta</span>
    </h2>
    <div className="flex w-full flex-col items-center justify-center gap-3 md:flex-row md:gap-6 lg:mx-auto">
      <div className="max-w-sm md:max-w-md flex-shrink-0">
        <Image
          alt="FAQ illustration with question marks"
          loading="lazy"
          width={100}
          height={79}
          className="h-50 w-80 rounded-lg"
          style={{ color: "transparent" }}
          src="https://www.setindiabiz.com/assets/company-name-search/faq-image.webp"
        />
      </div>
      <div className="w-full lg:w-2/3">
        {data.map((faq, index) => (
          <details key={index} className="border-b group py-3 last:border-b-0">
            <summary className="flex flex-1 cursor-pointer list-none items-center justify-between text-left text-sm font-semibold hover:no-underline md:text-base">
              {faq.question}
              <LuChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="pt-2 pb-1 text-sm text-muted-foreground">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const DynamicStatsSection = dynamic(() => Promise.resolve(StatsSectionJSX), {
  ssr: false,
});
const DynamicDirectorProfileSection = dynamic(
  () => Promise.resolve(DirectorProfileSectionJSX),
  { ssr: false }
);
const DynamicDecisionMakerSection = dynamic(
  () => Promise.resolve(DecisionMakerSectionJSX),
  { ssr: false }
);
const DynamicFAQSection = dynamic(() => Promise.resolve(FAQSectionJSX), {
  ssr: false,
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState("company");
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false); // Add loading state for navigation

  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [dynamicWord, setDynamicWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [suggestions, setSuggestions] = useState([]); // For company suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState(""); // Specific error for suggestions

  // --- Refs ---
  const searchContainerRef = useRef(null); // Ref for the search container
  const suggestionTimeoutRef = useRef(null); // Ref for suggestion debounce timeout

  const router = useRouter();

  //company
  function slugify(text) {
    if (!text) return "no-name"; // Fallback if name is missing
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphen
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  // --- Typing Animation Effect ---
  useEffect(() => {
    let timeoutId;
    const handleTypingLogic = () => {
      const currentWord = WORDS_TO_TYPE[wordIndex];
      if (isDeleting) {
        if (charIndex > 0) {
          setDynamicWord(currentWord.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
          timeoutId = setTimeout(handleTypingLogic, DELETING_SPEED);
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % WORDS_TO_TYPE.length);
          timeoutId = setTimeout(handleTypingLogic, TYPING_SPEED);
        }
      } else {
        if (charIndex < currentWord.length) {
          setDynamicWord(currentWord.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
          timeoutId = setTimeout(handleTypingLogic, TYPING_SPEED);
        } else {
          setIsDeleting(true);
          timeoutId = setTimeout(handleTypingLogic, PAUSE_DURATION);
        }
      }
    };
    timeoutId = setTimeout(
      handleTypingLogic,
      isDeleting ? DELETING_SPEED : TYPING_SPEED
    );
    return () => clearTimeout(timeoutId);
  }, [wordIndex, charIndex, isDeleting]);

  // --- Fetch Company Data from PERSONAL API ---
  const fetchPersonalCompanyData = async (identifier, type = "name") => {
    try {
      const params =
        type === "cin" ? { cin: identifier } : { name: identifier };
      console.log(
        "Attempting fetch from Personal Company API:",
        PERSONAL_COMPANY_API_ENDPOINT,
        "with params:",
        params
      );
      const response = await axios.get(PERSONAL_COMPANY_API_ENDPOINT, {
        params,
      });
      console.log("Personal Company API Response:", response.data);

      // Expecting { success: true, companyDetails: {...}, directorRecords: [...] }
      if (
        response.data &&
        response.data.success &&
        response.data.companyDetails
      ) {
        // Basic validation
        if (
          response.data.companyDetails.CompanyName &&
          response.data.companyDetails.CIN
        ) {
          console.log("Data found in Personal Company API.");
          // Return the companyDetails part, directorRecords aren't needed for navigation decision
          return response.data.companyDetails;
        } else {
          console.warn(
            "Personal Company API response missing CompanyName or CIN in companyDetails."
          );
          return null;
        }
      } else {
        console.log(
          "Company not found in Personal Company API or invalid response structure."
        );
        return null;
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("Personal Company API returned 404 (Not Found).");
      } else {
        console.error(
          "Error fetching from Personal Company API:",
          err.response?.data || err.message
        );
        // Don't set global error here, let handleSearch decide
      }
      return null; // Indicate error or not found
    }
  };

  // --- Fetch Company Data from PUBLIC API --- (Keep existing function)
  const fetchCompanyData = async (identifier, type = "name") => {
    // This function uses the PUBLIC endpoint: `${BACKEND_API_URL}/company`
    try {
      const params =
        type === "cin" ? { cin: identifier } : { name: identifier };
      console.log(
        "Attempting fetch from Public MCA API:",
        COMPANY_API_ENDPOINT,
        "with params:",
        params
      );
      const response = await axios.get(COMPANY_API_ENDPOINT, { params }); // COMPANY_API_ENDPOINT is public /company

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const companyRecord = response.data.data[0];
        if (companyRecord && companyRecord.CompanyName && companyRecord.CIN) {
          console.log(
            "Found valid company record (from Public API):",
            companyRecord
          );
          return companyRecord;
        } else {
          console.warn(
            "First record in Public API data array is missing CompanyName or CIN:",
            companyRecord
          );
          return null;
        }
      } else {
        console.log(
          "No valid company data array found in Public API response:",
          response.data
        );
        return null;
      }
    } catch (err) {
      console.error(
        `Error fetching public company data by ${type}:`,
        err.response?.data || err.message
      );
      if (err.response && err.response.status === 404) {
        console.log("Public API returned 404 (Not Found).");
      } else {
        // Avoid setting global error here if possible, let handleSearch manage
        // setError("Failed to fetch public company details. Please try again.");
      }
      return null;
    }
  };

  const fetchDirectorData = async (identifier, type = "name") => {
    // Use the globally defined DIRECTOR_API_ENDPOINT
    try {
      const params =
        type === "din" ? { din: identifier } : { name: identifier };
      console.log(`Fetching director data with params:`, params);
      const response = await axios.get(DIRECTOR_API_ENDPOINT, { params });

      let directorRecord = null;
      let processedData = null;

      // Check for successful response and presence of data field
      if (response.data && response.data.success && response.data.data) {
        // Extract the record based on array or object structure
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          directorRecord = response.data.data[0]; // Use first record if array
        } else if (
          typeof response.data.data === "object" &&
          response.data.data !== null &&
          !Array.isArray(response.data.data)
        ) {
          // Check it's an object, not null, and not an array
          directorRecord = response.data.data; // Use if single object
        }

        // Now check if the extracted record has the required fields
        if (
          directorRecord &&
          directorRecord.DirectorFirstName &&
          directorRecord.DirectorLastName &&
          directorRecord.DirectorDIN
        ) {
          // Construct the full name
          const directorFullName = `${directorRecord.DirectorFirstName || ""} ${
            directorRecord.DirectorLastName || ""
          }`.trim();
          processedData = {
            ...directorRecord, // Include all original fields
            DirectorName: directorFullName, // Add the combined name
          };
          console.log("Fetched and processed director data:", processedData);
          return processedData; // SUCCESS CASE: Return the data
        } else {
          // Case: Success=true, data present, but required fields missing in the record
          console.warn(
            "Fetched director data missing required fields (FirstName, LastName, DIN):",
            directorRecord
          );
          // Don't set global error here
          // setError(`Incomplete details received for the director.`);
          return null; // Return null as data is incomplete
        }
      } else {
        // Case: Response unsuccessful (success:false) OR data field missing/empty in response.data
        console.warn(
          "No director data found or unsuccessful response:",
          response.data
        );
        // Don't set global error here
        // setError(`No director found matching the ${type}.`);
        return null; // Return null as no valid data found
      }
    } catch (err) {
      // Catch block correctly follows try
      console.error(
        `Error fetching director data by ${type}:`,
        err.response?.data || err.message
      );
      // Don't set global error here
      // if (err.response && err.response.status === 404) {
      //     setError(`No director found matching the ${type}.`);
      // } else {
      //     setError("Failed to fetch director details. Please try again.");
      // }
      return null; // Indicate error
    }
  };

  // --- fetchSuggestions ---
  const fetchSuggestions = useCallback(
    async (query) => {
      // --- Input Validation ---
      if (!query || query.length < MIN_SEARCH_LENGTH) {
        setSuggestions([]);
        setShowSuggestions(false);
        setSuggestionError("");
        return;
      }

      // --- Set Loading State ---
      setIsLoadingSuggestions(true);
      setSuggestionError("");
      setShowSuggestions(true);

      const params = { name: query };
      let finalSuggestions = []; // Store final list
      let suggestionsSource = null; // Track source

      if (searchMode === "company") {
        // --- Step 1: Try Personal API First ---
        try {
          console.log(
            "Suggestions: Trying Personal API:",
            PERSONAL_COMPANY_API_ENDPOINT,
            params
          );
          const personalResponse = await axios.get(
            PERSONAL_COMPANY_API_ENDPOINT,
            { params }
          );
          console.log(
            "Suggestions: Personal API Response:",
            personalResponse.data
          );

          // Expecting { success: true, data: [{ CIN, CompanyName }, ...] } from backend aggregate
          const personalResultsArray = personalResponse.data?.data;
          if (
            personalResponse.data?.success &&
            Array.isArray(personalResultsArray) &&
            personalResultsArray.length > 0
          ) {
            // Backend already deduplicated, just filter for validity if needed (should be valid now)
            const validSuggestions = personalResultsArray.filter(
              (comp) => comp.CompanyName && comp.CIN // Check fields returned by aggregate
            );

            if (validSuggestions.length > 0) {
              finalSuggestions = validSuggestions; // Use directly as backend deduplicated
              suggestionsSource = "personal";
              console.log(
                `Suggestions: Found ${finalSuggestions.length} unique suggestions from Personal API.`
              );
            } else {
              console.log(
                "Suggestions: Personal API successful but suggestions array is empty or invalid after filtering."
              );
            }
          } else {
            console.log(
              "Suggestions: Personal API did not return a valid data array."
            );
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log(`Suggestions: Personal API 404 for query: "${query}".`);
          } else {
            console.error(
              "Suggestions: Error fetching from Personal API:",
              err.response?.data || err.message
            );
          }
          // Proceed to fallback
        }

        // --- Step 2: Fallback to Public API if Personal API found nothing ---
        if (suggestionsSource !== "personal") {
          try {
            console.log(
              "Suggestions: Falling back to Public API:",
              COMPANY_API_ENDPOINT,
              params
            );
            const publicResponse = await axios.get(COMPANY_API_ENDPOINT, {
              params,
            });
            console.log(
              "Suggestions: Public API Response:",
              publicResponse.data
            );

            const publicResultsArray = publicResponse.data?.data;
            if (
              publicResponse.data?.success &&
              Array.isArray(publicResultsArray) &&
              publicResultsArray.length > 0
            ) {
              const companyRecord = publicResultsArray[0];
              // Use || here as public API might have different field names
              if (
                companyRecord &&
                (companyRecord.CompanyName || companyRecord.company) &&
                (companyRecord.CIN || companyRecord.cin)
              ) {
                const formattedSingleSuggestion = {
                  CompanyName:
                    companyRecord.CompanyName || companyRecord.company,
                  CIN: companyRecord.CIN || companyRecord.cin,
                };
                finalSuggestions = [formattedSingleSuggestion]; // Use the single public result
                suggestionsSource = "public";
                console.log("Suggestions: Found 1 suggestion from Public API.");
              } else {
                //  console.warn("Suggestions: Public API response's first record is incomplete.");
              }
            } else {
              console.log(
                "Suggestions: Public API did not return a valid data array."
              );
            }
          } catch (err) {
            if (err.response && err.response.status === 404) {
              console.log(`Suggestions: Public API 404 for query: "${query}".`);
            } else {
              console.error(
                "Suggestions: Error fetching from Public API:",
                err.response?.data || err.message
              );
              setSuggestionError("Failed to load suggestions.");
            }
            finalSuggestions = []; // Clear if public API fails
          }
        }

        // --- Step 3: Set Final Suggestions ---
        setSuggestions(finalSuggestions); // Set final list (empty or unique results)
        console.log(
          `Suggestions: Setting final suggestions list (Count: ${
            finalSuggestions.length
          }, Source: ${suggestionsSource || "none"})`
        );
        // --- End Company Suggestions ---
      } else {
        // searchMode === 'director'
        // --- Director Suggestions Logic ---
        try {
          console.log(
            "Suggestions: Fetching director suggestions...",
            DIRECTOR_API_ENDPOINT,
            params
          );
          const response = await axios.get(DIRECTOR_API_ENDPOINT, { params });
          console.log(`Suggestions: Director API Response:`, response.data);

          if (response.data?.success && Array.isArray(response.data.data)) {
            const validSuggestions = response.data.data.filter(
              (dir) => dir.DirectorDIN && dir.DirectorFirstName
            );
            const uniqueDirectorMap = new Map();
            validSuggestions.forEach((dir) => {
              const key = dir.DirectorDIN;
              if (key && !uniqueDirectorMap.has(key)) {
                uniqueDirectorMap.set(key, dir);
              }
            });
            const uniqueDirectors = Array.from(uniqueDirectorMap.values());
            setSuggestions(uniqueDirectors);
            console.log(
              `Suggestions: Found ${uniqueDirectors.length} unique director suggestions.`
            );
          } else {
            console.log(
              "Suggestions: No director suggestions array found or invalid response."
            );
            setSuggestions([]);
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log(`Suggestions: Director API 404 for query: "${query}"`);
          } else {
            console.error(
              `Suggestions: Error fetching director suggestions:`,
              err.response?.data || err.message
            );
            setSuggestionError(`Failed to load director suggestions.`);
          }
          setSuggestions([]);
        }
        // --- End Director Suggestions ---
      }

      // --- Final Loading State ---
      setIsLoadingSuggestions(false);
    },
    [searchMode]
  ); // Dependencies

  // --- Debounce Suggestions Fetch ---
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Set timeout to fetch suggestions for the current mode
    suggestionTimeoutRef.current = setTimeout(() => {
      const trimmedSearchTerm = searchTerm.trim();
      if (trimmedSearchTerm.length >= MIN_SEARCH_LENGTH) {
        // Fetch suggestions for the current searchMode (company or director)
        fetchSuggestions(trimmedSearchTerm);
      } else {
        // Clear suggestions if search term is too short
        setSuggestions([]);
        setShowSuggestions(false);
        setSuggestionError("");
      }
    }, SUGGESTION_DEBOUNCE_TIME);

    // Cleanup function
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
    // Dependencies: run when searchTerm or searchMode changes
  }, [searchTerm, searchMode, fetchSuggestions]);

  // --- Handle Suggestion Click ---
  const handleSuggestionClick = (suggestion) => {
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchTerm("");
    setError("");
    setSuggestionError("");
    setIsNavigating(true);

    if (searchMode === "company") {
      const companyName = suggestion.CompanyName;
      const companyCin = suggestion.CIN;
      if (companyName && companyCin) {
        console.log(
          "Company Suggestion clicked:",
          companyName,
          "(CIN:",
          companyCin,
          ")"
        );
        const slugifiedName = slugify(companyName);
        const targetUrl = `/company/${slugifiedName}/${companyCin}`;
        console.log("Navigating to:", targetUrl);
        router.push(targetUrl);
      } else {
        console.warn(
          "Clicked company suggestion missing CompanyName or CIN:",
          suggestion
        );
        setError("Selected company suggestion is incomplete.");
        setIsNavigating(false);
      }
    } else {
      // searchMode === 'director'
      const directorDin = suggestion.DirectorDIN;
      const firstName = suggestion.DirectorFirstName;
      const lastName = suggestion.DirectorLastName;

      if (directorDin && firstName) {
        const directorFullName = `${firstName || ""} ${lastName || ""}`.trim();
        console.log(
          "Director Suggestion clicked:",
          directorFullName,
          "(DIN:",
          directorDin,
          ")"
        );
        const slugifiedName = slugify(directorFullName);
        const targetUrl = `/director/${slugifiedName}/${directorDin}`;
        console.log("Navigating to:", targetUrl);
        router.push(targetUrl);
      } else {
        console.warn(
          "Clicked director suggestion missing DirectorDIN or FirstName:",
          suggestion
        );
        setError("Selected director suggestion is incomplete.");
        setIsNavigating(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    // Show suggestions on focus if term is long enough AND
    // there are suggestions, loading is happening, or an error occurred
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm.length >= MIN_SEARCH_LENGTH) {
      if (isLoadingSuggestions || suggestionError || suggestions.length > 0) {
        setShowSuggestions(true);
      }
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow click event on suggestion item
    setTimeout(() => {
      // Check if the new focused element is outside the search container
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(document.activeElement)
      ) {
        setShowSuggestions(false);
      }
    }, 150); // Adjust delay if needed
  };

  const changeSearchMode = (mode) => {
    setSearchMode(mode);
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
    setSuggestionError("");
  };

  // --- Modify handleSearch ---
  const handleSearch = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      const trimmedSearchTerm = searchTerm.trim();
      setError("");
      if (!trimmedSearchTerm) {
        setError("Please enter a company/director name or CIN/DIN.");
        return;
      }
      setIsNavigating(true);
      setShowSuggestions(false);

      if (searchMode === "company") {
        const isCinSearch = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i.test(
          trimmedSearchTerm
        );
        let companyDataForNav = null; // Variable to hold the data used for navigation

        if (isCinSearch) {
          console.log(`Performing CIN search: "${trimmedSearchTerm}"`);
          const cin = trimmedSearchTerm.toUpperCase();
          // For CIN search, public API is usually sufficient to get the name for the slug
          companyDataForNav = await fetchCompanyData(cin, "cin"); // Use Public API
          if (!companyDataForNav) {
            setError(`Could not find company details for CIN "${cin}".`);
          }
        } else {
          console.log(`Performing Name search: "${trimmedSearchTerm}"`);
          const name = trimmedSearchTerm;
          // --- Step 1: Try Personal API first ---
          console.log("Checking Personal API first for name search...");
          companyDataForNav = await fetchPersonalCompanyData(name, "name");

          // --- Step 2: If not found in Personal, try Public API ---
          if (!companyDataForNav) {
            console.log("Not found in Personal API, checking Public API...");
            companyDataForNav = await fetchCompanyData(name, "name"); // Fallback to Public API
          }

          if (!companyDataForNav) {
            setError(`Could not find company details for "${name}".`);
          }
        }

        // --- Navigate if data was found ---
        if (
          companyDataForNav &&
          companyDataForNav.CompanyName &&
          companyDataForNav.CIN
        ) {
          const slugifiedName = slugify(companyDataForNav.CompanyName);
          const cin = companyDataForNav.CIN;
          const targetUrl = `/company/${slugifiedName}/${cin}`;
          console.log("Navigating to company page:", targetUrl);
          router.push(targetUrl);
          return; // Exit after successful navigation start
        }
        // If we reach here, data wasn't found or was invalid
      } else if (searchMode === "director") {
        // Director search logic remains the same (uses fetchDirectorData)
        let directorData = null;
        const isDinSearch = /^\d{8}$/.test(trimmedSearchTerm);
        console.log(
          `Performing director search: "${trimmedSearchTerm}", is DIN: ${isDinSearch}`
        );
        if (isDinSearch) {
          directorData = await fetchDirectorData(trimmedSearchTerm, "din");
        } else {
          directorData = await fetchDirectorData(trimmedSearchTerm, "name");
        }

        if (
          directorData &&
          directorData.DirectorName &&
          directorData.DirectorDIN
        ) {
          const slugifiedName = slugify(directorData.DirectorName);
          const din = directorData.DirectorDIN;
          const targetUrl = `/director/${slugifiedName}/${din}`;
          console.log("Navigating to director page:", targetUrl);
          router.push(targetUrl);
          return; // Exit after successful navigation start
        } else {
          if (!error) {
            // Avoid overwriting specific errors
            setError(
              `Could not find director details for "${trimmedSearchTerm}".`
            );
          }
        }
      }

      // If navigation didn't happen, stop loading indicator
      setIsNavigating(false);

      // Add fetchPersonalCompanyData to dependencies
    },
    [
      searchTerm,
      searchMode,
      router,
      error,
      fetchCompanyData,
      fetchPersonalCompanyData,
      fetchDirectorData,
      slugify,
    ]
  );

  return (
    <main className="flex-1 min-h-screen flex flex-col">
      {/* === Hero Section === */}
      <section className="bg-[#0D2483]">
        <div className="relative mb-16 pt-32 mt-4 md:pb-20 md:pt-36 lg:pt-44 xl:pt-44 px-36 md:px-16 lg:px-18 xl:px-30">
          <div className="wrapper flex-col-bottom relative w-full text-white">
            <h1 className="text-center text-3xl font-bold pl-8 mt-1 text-white lg:text-4xl xl:text-5xl ">
              Get insights about <br className="sm:hidden" /> Indian
              <span className="font-extrabold text-primary min-h-[1.2em] inline-block">
                &nbsp;{dynamicWord}
              </span>
              <span className="text-primary text-2xl md:text-3xl lg:text-5xl font-medium">
                <span className="animate-blink">|</span>
              </span>
            </h1>

            {/* --- Search Area --- */}
            <div
              className="w-full max-w-4xl mt-10 mb-12 md:mt-14 mx-auto"
              id="search"
              ref={searchContainerRef}
            >
              <div className="relative">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  {/* Search Mode Toggle */}
                  <div className="w-full sm:w-auto flex-shrink-0">
                    <div
                      role="tablist"
                      aria-orientation="horizontal"
                      className="flex w-full h-12 items-center justify-center rounded-lg bg-white p-1 text-gray-700"
                      tabIndex={-1}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={searchMode === "company"}
                        className={`inline-flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-all md:text-base ${
                          searchMode === "company"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                        }`}
                        title="Search for Company Name/CIN"
                        onClick={() => changeSearchMode("company")}
                      >
                        Company
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={searchMode === "director"}
                        className={`inline-flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-all md:text-base ${
                          searchMode === "director"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                        }`}
                        title="Search for Director Name/DIN"
                        onClick={() => changeSearchMode("director")}
                      >
                        Director
                      </button>
                    </div>
                  </div>

                  {/* Search Input & Button */}
                  <div className="relative flex-1">
                    <form
                      onSubmit={handleSearch}
                      className="relative"
                      noValidate
                    >
                      <input
                        type="text"
                        className="h-12 w-full rounded-lg border border-input bg-white py-1 pl-4 pr-16 text-sm text-gray-900 shadow-sm transition-colors file:border-0 file:bg-transparent placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:pr-32 md:text-base"
                        placeholder={
                          searchMode === "company"
                            ? "Search by Company Name / CIN"
                            : "Search by Director Name / DIN"
                        }
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus} // Re-enable focus handler
                        onBlur={handleBlur} // Re-enable blur handler
                        aria-autocomplete="list" // Re-enable ARIA attribute
                        aria-controls="suggestions-list" // Re-enable ARIA attribute
                        // Dynamically set aria-expanded based on suggestion visibility and content
                        aria-expanded={
                          showSuggestions &&
                          (isLoadingSuggestions ||
                            suggestions.length > 0 ||
                            !!suggestionError)
                        }
                        disabled={isNavigating} // Disable input while navigating
                      />
                      <button
                        type="submit"
                        className="group absolute cursor-pointer right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-0 bg-gray-100 text-center text-sm font-medium text-gray-700 ring-offset-background transition-all duration-300 hover:w-24 hover:bg-blue-100 hover:text-blue-700 hover:pr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 md:right-2 md:hover:w-28"
                        title="Search"
                        disabled={
                          isNavigating || (!searchTerm.trim() && !isNavigating)
                        } // Also disable if input is empty
                      >
                        {isNavigating ? (
                          <LucideLoader2 className="h-5 w-5 animate-spin" /> // Show loader
                        ) : (
                          <>
                            <LuSearch className="h-5 w-5 flex-shrink-0 transition-all duration-300" />
                            <span className="ml-0 w-0 flex-shrink-0 whitespace-nowrap text-base opacity-0 transition-all duration-300 group-hover:ml-1.5 group-hover:w-auto group-hover:opacity-100">
                              Search
                            </span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* --- Suggestion Box (Handles both modes) --- */}
                    {showSuggestions && (
                      <div
                        id="suggestions-list"
                        role="listbox"
                        className="absolute z-20 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg max-h-60 overflow-y-auto"
                      >
                        {/* Loading State */}
                        {isLoadingSuggestions && (
                          <div className="flex items-center justify-center p-3 text-gray-500">
                            <LuLoaderCircle className="h-5 w-5 animate-spin mr-2" />
                            Loading...
                          </div>
                        )}
                        {/* Error State */}
                        {suggestionError && !isLoadingSuggestions && (
                          <div className="p-3 text-sm text-red-600 text-center">
                            {suggestionError}
                          </div>
                        )}
                        {/* No Results State */}
                        {!isLoadingSuggestions &&
                          !suggestionError &&
                          suggestions.length === 0 &&
                          searchTerm.trim().length >= MIN_SEARCH_LENGTH && (
                            <div className="p-3 text-sm text-gray-500 text-center">
                              No suggestions found.
                            </div>
                          )}
                        {/* Suggestions List */}
                        {!isLoadingSuggestions &&
                          !suggestionError &&
                          suggestions.length > 0 && (
                            <ul>
                              {searchMode === "company"
                                ? // Render Company Suggestions
                                  suggestions.map((suggestion, index) => (
                                    <li
                                      key={
                                        suggestion.CIN ||
                                        `company-suggestion-${index}`
                                      }
                                      role="option"
                                      aria-selected="false"
                                      className="cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-blue-50"
                                      onMouseDown={() =>
                                        handleSuggestionClick(suggestion)
                                      } // Use onMouseDown
                                    >
                                      <span className="font-medium">
                                        {suggestion.CompanyName}
                                      </span>
                                      {suggestion.CIN && (
                                        <span className="block text-xs text-gray-500">
                                          CIN: {suggestion.CIN}
                                        </span>
                                      )}
                                    </li>
                                  ))
                                : // Render Director Suggestions
                                  suggestions.map((suggestion, index) => {
                                    const directorFullName = `${
                                      suggestion.DirectorFirstName || ""
                                    } ${
                                      suggestion.DirectorLastName || ""
                                    }`.trim();
                                    return (
                                      <li
                                        key={
                                          suggestion.DirectorDIN ||
                                          `director-suggestion-${index}`
                                        }
                                        role="option"
                                        aria-selected="false"
                                        className="cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-blue-50"
                                        onMouseDown={() =>
                                          handleSuggestionClick(suggestion)
                                        } // Use onMouseDown
                                      >
                                        <span className="font-medium">
                                          {directorFullName}
                                        </span>
                                        {suggestion.DirectorDIN && (
                                          <span className="block text-xs text-gray-500">
                                            DIN: {suggestion.DirectorDIN}
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })}
                            </ul>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                {/* General Error Display */}
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </div>
            </div>
            {/* --- End Search Area --- */}

            <h2 className="max-w-4xl text-center font-medium tracking-wide text-gray-200 md:mt-14 md:text-lg ml-10">
              Check out profiles of over 3M+ companies and 5M+ directors.
              Discover additional information about company financials, director
              details, and more…
            </h2>
          </div>
        </div>
      </section>

      {/* === Why Choose Us Section === */}
      <section className="space-y-6 md:space-y-6 py-10 md:py-14">
        <div className="space-y-3 text-center mt-7">
          <h2 className="section-title">
            Why Choose <span className="text-primary">SetIndiaBiz</span>?
          </h2>
          <p className="section-para md:text-lg max-w-2xl mx-auto">
            Discover the benefits of using SetIndiaBiz for your company
            compliance needs.
          </p>
        </div>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-5xl ml-28">
          {[
            {
              icon: LuShieldCheck,
              title: "Verified Information",
              description:
                "Data from trusted sources, ensuring accuracy and reliability.",
            },
            {
              icon: LuUser,
              title: "Director Details",
              description: "In-depth information about directors.",
            },
            {
              icon: LuMail,
              title: "Unlock Director Contact",
              description: "Unlock director contact information.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border shadow overflow-hidden rounded-md p-5 mt-4"
            >
              <div className="flex items-center gap-2 mb-2 mt-2 ml-2">
                <Icon className="text-primary h-6 w-6 flex-shrink-0" />
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-3">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* === Daily Reports Section === */}
      <section className="wrapper mb-16 md:mb-20">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-md md:rounded-xl md:p-12 mt-8 mx-4 md:mx-auto md:max-w-6xl">
          <div className="flex flex-col items-center sm:flex-row">
            <div className="z-10 sm:w-7/12">
              <h2 className="mb-6 w-full text-xl font-semibold md:text-2xl lg:text-3xl">
                Need the Bigger Picture? Get Full Reports on Newly Registered
                Companies!
              </h2>
              <p className="mb-8 text-xs font-light md:text-sm lg:text-base">
                {`New Company Alerts provides everything you need to understand your leads-detailed company data plus directors' contact information in one place.`}
              </p>
              {/* Use Link component for internal navigation */}
              <Link
                className="inline-flex items-center bg-white justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary hover:bg-secondary/80 py-2 h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700 sm:w-fit lg:text-base"
                href="/"
              >
                <LuFileSpreadsheet className="text-lg md:text-2xl" />
                Get Your Daily Reports Now
              </Link>
            </div>
            <div className="z-10 mt-8 sm:w-5/12 md:mt-0">
              <div className="relative h-auto">
                <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-400 opacity-50" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500 opacity-50" />
                <Image
                  alt="Business analytics illustration"
                  loading="lazy"
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 500px"
                  className="h-auto max-h-64 w-auto transform md:absolute md:left-1/2 md:top-1/2 md:max-h-80 md:-translate-x-1/2 md:-translate-y-1/2"
                  style={{ color: "transparent" }}
                  src="https://www.setindiabiz.com/assets/company-name-search/report.webp"
                />
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-500 opacity-20" />
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-700 opacity-20" />
        </div>
      </section>

      <DynamicStatsSection />
      <DynamicDirectorProfileSection />
      <DynamicDecisionMakerSection />
      <DynamicFAQSection data={faqData} />
    </main>
  );
}
