"use client";

import Link from "next/link";
import {
  Tag,
  Gift,
  UserCheck,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  Lock,
  FileCheck,
  Search,
  Info,
  Copy,
  Ban,
  Mail,
  AlertTriangle,
  BadgeIndianRupee,
  FileCheck2,
  Check,
  Loader2,
  LockIcon,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from "react";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "context/AuthContext"; // Import useAuth to get user ID
import { FaLock } from "react-icons/fa";
import { API_PREFIX } from "lib/api-modifier";
import Script from "next/script";
// Import ZeptoMail client - REMOVED FROM CLIENT-SIDE
// import { SendMailClient } from "zeptomail";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const PAYMENT_AMOUNT_INR = 100; // Define amount as a constant

// --- ZeptoMail Configuration ---
// REMOVE ZeptoMail client-side config - Token should not be here
// const ZEPTOMAIL_API_URL = "api.zeptomail.com/";
// const ZEPTOMAIL_TOKEN = process.env.NEXT_PUBLIC_ZEPTOMAIL_TOKEN; // REMOVED
// const ZEPTO_FROM_EMAIL_ADDRESS = "orders@setindiabiz.com"; // Keep for reference if needed, but not used here
// const ZEPTO_FROM_NAME = "SetIndiaBiz Orders"; // Or your desired sender name

// --- Function to Load Script ---
const loadScript = (src) => {
  return new Promise((resolve) => {
    // Check if script already exists
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const cleanAddressPart = (part) => {
  // Check if 'part' is a string and starts with a single quote
  if (typeof part === "string" && part.startsWith("'")) {
    // Return the string starting from the second character
    return part.substring(1);
  }
  // Otherwise, return the original part (or null/undefined if it wasn't a string)
  return part;
};

// --- Inner component to handle content dependent on searchParams ---
const UnlockContactContent = () => {
  const { user } = useAuth(); // Get user from context
  const searchParams = useSearchParams();
  const router = useRouter();
  const [directorData, setDirectorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);
  const [showNameSearchInput, setShowNameSearchInput] = useState(false);
  const [searchDin, setSearchDin] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isPaid, setIsPaid] = useState(false); // Tracks if payment for CURRENT director is done

  // Refs for payment form inputs
  const payerNameRef = useRef(null);
  const payerEmailRef = useRef(null);
  const payerPhoneRef = useRef(null);

  // --- Fetch Director Data ---
  const fetchDirectorData = useCallback(
    async (queryParam, value) => {
      if (!queryParam || !value) {
        setIsLoading(false);
        setIsSearching(false);
        setError(null);
        setDirectorData(null);
        setSearchDin("");
        setSearchName("");
        setIsPaid(false);
        return;
      }

      setIsSearching(true);
      setError(null);
      setDirectorData(null); // Reset director data on new search
      setIsPaid(false); // Reset paid status on new search

      const directorApiUrl = `${API_PREFIX}/company/getdirector?${queryParam}=${encodeURIComponent(
        value
      )}`;
      console.log("Fetching Director:", directorApiUrl);

      try {
        const response = await axios.get(directorApiUrl);

        if (response.data?.success && response.data.data?.length > 0) {
          const director = response.data.data[0]; // Assuming the first result is the primary one
          setDirectorData(director);
          setSearchDin(String(director.DirectorDIN || ""));
          setSearchName("");
          setShowNameSearchInput(false);
          setError(null);
        } else {
          const message =
            response.data?.message ||
            `Director not found for ${queryParam}: ${value}`;
          setError(message);
          setDirectorData(null);
          // Keep search input values as they were entered by user for failed search
          if (queryParam === "din") setSearchDin(String(value || ""));
          if (queryParam === "name") {
            setSearchName(value);
            setShowNameSearchInput(true); // Keep name input visible if search failed
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching director data.";
        setError(errorMessage);
        setDirectorData(null);
        // Keep search input values
        if (queryParam === "din") setSearchDin(String(value || ""));
        if (queryParam === "name") {
          setSearchName(value);
          setShowNameSearchInput(true);
        }
      } finally {
        setIsSearching(false);
        setIsLoading(false);
      }
    },
    [router]
  ); // Added router dependency as it's used indirectly via handleReset/handleSearch

  // --- Effect to fetch data based on URL on initial load ---
  useEffect(() => {
    const dinFromUrl = searchParams.get("din");
    if (dinFromUrl) {
      setSearchDin(dinFromUrl);
      fetchDirectorData("din", dinFromUrl);
    } else if (!directorData) {
      // Only stop loading if no data is already present
      setIsLoading(false); // No initial DIN, stop loading
    }
  }, [searchParams]); // fetchDirectorData is memoized, so it's stable

  // --- Masking function ---
  const maskData = (data, type) => {
    if (!data) return <span className="text-gray-400 italic">N/A</span>;

    // Convert to string, trim, and remove leading quote FIRST
    let dataStr = String(data).trim().replace(/^['"]/, "");
    const blurClasses = "filter blur-sm select-none pointer-events-none";

    try {
      if (type === "mobile") {
        if (dataStr.length > 5) {
          const visiblePart = dataStr.slice(0, 7);
          const blurredPart = "x".repeat(Math.max(0, dataStr.length - 7));
          return (
            <span>
              <span>{visiblePart}</span>
              <span className={blurClasses} aria-hidden="true">
                {blurredPart}
              </span>
            </span>
          );
        }
        return <span>{dataStr}</span>;
      }
      if (type === "email") {
        const parts = dataStr.split("@");

        if (parts.length === 2 && parts[0].length > 2) {
          const visibleUserPart = parts[0].slice(0, 2);
          const blurredUserPart = "x".repeat(Math.max(0, parts[0].length - 2));
          return (
            <span>
              <span>{visibleUserPart}</span>
              <span className={blurClasses} aria-hidden="true">
                {blurredUserPart}
              </span>
              <span>@{parts[1]}</span>
            </span>
          );
        } else {
          // Handle very short emails or emails without '@' - blur everything
          const blurredAll = "x".repeat(dataStr.length);
          return (
            <span className={blurClasses} aria-hidden="true">
              {blurredAll}
            </span>
          );
        }
      }
    } catch (e) {
      console.error("Masking error:", e);
      return (
        <span className={blurClasses} aria-hidden="true">
          xxxxx
        </span>
      ); // Fallback blurred JSX
    }
    // Agar type 'mobile' ya 'email' nahi hai, toh cleaned string return karein
    // Ensure it returns a valid React node if not masking
    return <>{dataStr || "N/A"}</>;
  };

  // --- Payment Handler ---
  const handlePayment = useCallback(
    async (event) => {
      event.preventDefault();
      setError(null);

      if (!user) {
        setError("You must be logged in to make a payment.");
        // Optionally redirect to login
        // router.push('/sign-in?redirect=/unlock-contact?din='+directorData?.DirectorDIN);
        return;
      }

      // if (!API_BASE_URL) {
      //      setError("API configuration error.");
      //      return;
      // }
      if (!RAZORPAY_KEY_ID) {
        console.error("Razorpay Key ID is not configured.");
        setError("Payment gateway is not configured correctly.");
        return;
      }
      // Client-side ZeptoMail config check removed

      const dinToPay = directorData?.DirectorDIN;
      if (!dinToPay || !directorData) {
        setError("Please find a valid director before attempting to pay.");
        return;
      }

      const payerName = payerNameRef.current?.value.trim();
      const payerEmail = payerEmailRef.current?.value.trim();
      const payerPhone = payerPhoneRef.current?.value.trim();

      if (!payerName || !payerEmail) {
        setError("Please enter your Name and Email to proceed.");
        return;
      }
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(payerEmail)) {
        setError("Please enter a valid Email address.");
        return;
      }

      setIsPaying(true);

      // 1. Load Razorpay Script
      const scriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!scriptLoaded) {
        setError("Could not load payment gateway. Please check connection.");
        setIsPaying(false);
        return;
      }

      // 2. Create Order on Backend
      let orderData;
      const directorFullName = `${directorData.DirectorFirstName || ""} ${
        directorData.DirectorLastName || ""
      }`.trim();
      try {
        console.log("Creating Razorpay order...");
        const orderResponse = await axios.post(
          `${API_PREFIX}/payment/create-order`,
          {
            amount: PAYMENT_AMOUNT_INR * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_din_${dinToPay}_${Date.now()}`,
            notes: {
              din: dinToPay,
              directorName: directorFullName,
              userId: user.uid, // Include userId in notes if helpful for backend logging
            },
          }
        );

        if (!orderResponse.data?.success || !orderResponse.data.order) {
          throw new Error(
            orderResponse.data.message || "Failed to create payment order."
          );
        }
        orderData = orderResponse.data.order;
        console.log("Order created:", orderData);
      } catch (err) {
        console.error("Order creation error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Could not initiate payment."
        );
        setIsPaying(false);
        return;
      }

      // 3. Configure and Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Director Unlock",
        description: `Unlock contact for DIN: ${dinToPay}`,
        image: "",
        order_id: orderData.id,
        handler: async function (response) {
          // Success Handler
          // console.log("Razorpay success response:", response);
          // 4. Verify Payment on Backend
          const verificationPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            // --- Pass context needed by backend ---
            userId: user.uid, // Pass user ID for saving (Backend MUST verify user independently)
            din: dinToPay,
            directorName: directorFullName,
            amount: orderData.amount, // Pass amount/currency for verification/saving
            currency: orderData.currency,
            payerName: payerName,
            payerEmail: payerEmail,
            payerPhone: payerPhone,
          };

          try {
            console.log("Verifying payment with payload:", verificationPayload);
            const verifyResponse = await axios.post(
              `${API_PREFIX}/payment/verify-payment`,
              verificationPayload
            );

            if (verifyResponse.data?.success) {
              console.log("Payment Verified Successfully");
              const companyData = verifyResponse.data.companyData; // Get company data from response
              setIsPaid(true); // Set paid status - THIS UNLOCKS DETAILS
              setError(null);

              // --- Send Email with Unlocked Details using ZeptoMail ---
              // Call the new API route to send the email
              console.log(
                "Payment verified, attempting to trigger email sending API..."
              );
              try {
                // Prepare data for the API route
                const emailPayload = {
                  payerName: payerName,
                  payerEmail: payerEmail,
                  directorFullName: directorFullName,
                  dinToPay: dinToPay,
                  rawMobile: String(directorData?.DirectorMobileNumber || "N/A")
                    .trim()
                    .replace(/^['"]/, ""),
                  rawEmail: String(directorData?.DirectorEmailAddress || "N/A")
                    .trim()
                    .replace(/^['"]/, ""),
                  companyData: companyData, // Pass company data if available
                };

                // Make POST request to the API route
                const emailApiResponse = await axios.post(
                  `${API_PREFIX}/send-unlock-email`,
                  emailPayload
                );

                if (emailApiResponse.data?.success) {
                  console.log("Email API call successful.");
                  // Optionally show a subtle confirmation, but main success is already shown
                } else {
                  // Log error from email API, but don't block user flow
                  console.error(
                    "Email API call failed:",
                    emailApiResponse.data?.message || "Unknown email API error"
                  );
                  // Optionally: You could set a non-blocking warning state here
                }
              } catch (emailApiError) {
                // Log error from calling the email API
                console.error(
                  "Error calling email API:",
                  emailApiError.response?.data?.message || emailApiError.message
                );
                // Optionally: Set a non-blocking warning state
              }
              // --- End Email Sending via API ---
            } else {
              // Verification failed on backend (e.g., signature mismatch)
              throw new Error(
                verifyResponse.data.message || "Payment verification failed."
              );
            }
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError);
            // Provide clearer error message if verification step failed after payment
            const errorMsg =
              verificationError.response?.data?.message ||
              verificationError.message;
            if (
              errorMsg &&
              errorMsg.toLowerCase().includes("verification failed")
            ) {
              setError(
                `Payment successful, but verification failed: ${errorMsg}. Contact support.`
              );
            } else {
              setError(
                errorMsg ||
                  "Payment verification failed. Contact support if amount deducted."
              );
            }
          } finally {
            setIsPaying(false); // Stop loading indicator
          }
        },
        prefill: {
          name: payerName,
          email: payerEmail,
          contact: payerPhone || undefined,
        },
        notes: {
          din: dinToPay, // Pass DIN again if helpful
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout form closed by user");
            if (!isPaid) {
              // Only stop loading if payment wasn't successful
              setIsPaying(false);
              // setError("Payment was cancelled."); // Optional message
            }
          },
        },
      };

      // Open Checkout
      try {
        const rzp = new window.Razorpay(options);

        // Failure Handler
        rzp.on("payment.failed", async function (response) {
          console.error("Razorpay payment failed:", response.error);
          const errorDetails = response.error;
          // Display user-friendly error
          setError(
            `Payment Failed: ${errorDetails.description || "Unknown Error"}`
          );

          setIsPaying(false); // Stop loading indicator
        });

        rzp.open(); // Open the checkout modal
      } catch (rzpError) {
        console.error("Razorpay initialization error:", rzpError);
        setError("Failed to open payment gateway. Please try again.");
        setIsPaying(false);
      }
    },
    [user, directorData, router, isPaid]
  ); // Added dependencies

  // --- Toggle Name Search Input Visibility ---
  const toggleNameSearchInput = useCallback(() => {
    setShowNameSearchInput((prev) => !prev);
    if (showNameSearchInput) {
      // If it was visible and is now being hidden
      setSearchName(""); // Clear name input
    } else {
      // If it was hidden and is now being shown
      // Optionally clear DIN when switching to name search
      // setSearchDin('');
      // setDirectorData(null);
      // setError(null);
      // setIsPaid(false);
    }
  }, [showNameSearchInput]);

  // --- Handle DIN Search ---
  const handleDinSearch = useCallback(
    (event) => {
      event.preventDefault();
      const dinToSearch = String(searchDin || "").trim();
      if (dinToSearch && /^\d+$/.test(dinToSearch)) {
        // Basic validation for digits
        setSearchName("");
        setShowNameSearchInput(false);
        fetchDirectorData("din", dinToSearch);
        // Update URL without full page reload
        router.push(`/unlock-contact?din=${dinToSearch}`, { scroll: false });
      } else {
        setError("Please enter a valid DIN (digits only) to search.");
      }
    },
    [searchDin, fetchDirectorData, router]
  );

  // --- Handle Name Search ---
  const handleNameSearch = useCallback(
    (event) => {
      event.preventDefault();
      const nameToSearch = searchName.trim();
      if (nameToSearch) {
        setSearchDin(""); // Clear DIN when searching by name
        fetchDirectorData("name", nameToSearch);
        // Clear DIN from URL
        router.push(`/unlock-contact`, { scroll: false });
      } else {
        setError("Please enter a director name to search.");
      }
    },
    [searchName, fetchDirectorData, router]
  );

  // --- Handle Reset ---
  const handleReset = useCallback(() => {
    setDirectorData(null);
    setError(null);
    setSearchDin("");
    setSearchName("");
    setIsPaid(false);
    setShowNameSearchInput(false);
    setIsLoading(false);
    setIsSearching(false);
    setIsPaying(false);
    // Clear URL parameters
    router.push("/unlock-contact", { scroll: false });
  }, [router]);

  // Determine overall loading state for disabling inputs/buttons
  const isProcessing = isLoading || isSearching || isPaying;

  const unlockServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Director Contact Unlock Service",
    description:
      "Unlock director contact details (mobile & email) instantly by paying ₹100 per director.",
    provider: {
      "@type": "Organization",
      name: "SetIndiaBiz",
      url: "https://www.setindiabiz.com",
      logo: "https://www.setindiabiz.com/assets/logo.webp",
    },
    offers: {
      "@type": "Offer",
      url: "https://www.setindiabiz.com/unlock-contact",
      priceCurrency: "INR",
      price: "100",
      availability: "https://schema.org/InStock",
    },
  };

  const unlockFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I unlock director contact details?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Search for a director by DIN or name, then proceed with the payment form to unlock mobile and email instantly.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each director contact unlock costs ₹100. Payment is required to view the contact details.",
        },
      },
      {
        "@type": "Question",
        name: "Will I receive a confirmation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, after payment, you will get a confirmation email along with unlocked contact details.",
        },
      },
      {
        "@type": "Question",
        name: "Can I unlock multiple contacts in bulk?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer special bulk purchase options for multiple director contacts.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="unlock-service-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(unlockServiceSchema)}
      </Script>

      <Script
        id="unlock-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(unlockFAQSchema)}
      </Script>
      <main className="wrapper flex flex-col mb-7 pt-20 md:pt-24 overflow-x-hidden">
        {/* Top Banner Section */}
        <section className="mb-4 md:mb-6 px-4 md:px-0">
          <Link
            className="flex flex-col items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 p-3 shadow-md transition-all duration-300 ease-in hover:shadow-xl md:flex-row md:gap-8 md:px-6 md:py-4"
            href="/unlock-contact" // Consider linking to a bulk purchase page if different
          >
            <div className="flex items-center gap-3 md:gap-4">
              <Tag className="hidden flex-shrink-0 text-3xl text-white md:block md:text-4xl" />
              <div className="text-center text-white md:text-left">
                <p className="text-lg font-bold">
                  <Tag className="-mt-1 mr-1.5 inline text-xl md:hidden" />
                  Want cheaper?
                </p>
                <p className="mt-1 text-sm font-medium">
                  Click here to buy in bulk. Buy in bulk to get it as low as ₹75
                  each. {/* Example bulk price */}
                </p>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center justify-center gap-2.5 rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow hover:bg-gray-100 md:text-base">
              <Gift className="flex-shrink-0 text-lg md:text-xl" />
              Explore Special Offers
            </div>
          </Link>
        </section>

        {/* Main Content Section */}
        <section className="flex flex-col items-start gap-6 md:flex-row md:items-stretch md:gap-8 px-4 md:px-0">
          {" "}
          {/* Added padding */}
          {/* Director Connect Card */}
          <div
            className="w-full rounded-lg border bg-card p-2 text-card-foreground shadow md:w-3/5 md:p-4"
            id="directorConnect"
          >
            {/* Card Header */}
            <div className="mb-2 flex flex-col items-center justify-between gap-1 space-y-1.5 bg-muted p-2 text-base font-bold text-primary md:flex-row md:gap-3 md:p-4 md:text-xl">
              <span className="flex items-center gap-3">
                <UserCheck className="text-xl md:text-3xl" />
                DIRECTOR CONNECT
              </span>
              <button
                className="inline-flex h-7 items-center justify-center whitespace-nowrap rounded-lg border border-input bg-gradient-to-r from-teal-300 to-blue-300 px-3 text-[10px] font-medium text-foreground opacity-80 ring-offset-background transition-all hover:text-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:text-xs"
                type="button"
                // TODO: Link this to a help modal or section
              >
                <HelpCircle className="mr-2 size-4" />
                How to Unlock Director Contacts
              </button>
            </div>

            {/* Card Body */}
            <div className="p-0 md:p-4">
              {/* Loading Indicator */}
              {(isLoading || isSearching) && ( // Show for initial load OR search
                <div className="mb-4 flex items-center justify-center gap-2 rounded border border-blue-300 bg-blue-50 p-3 text-sm text-blue-700">
                  <Loader2 className="size-5 animate-spin" />
                  {isLoading ? "Loading..." : "Searching for director..."}
                </div>
              )}

              {/* Inline Error Display */}
              {error &&
                !isPaying && ( // Don't show search errors during payment process
                  <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-center text-sm text-red-700">
                    <AlertTriangle className="inline size-4 mr-1" /> Error:{" "}
                    {error}
                    <button
                      onClick={handleReset}
                      className="ml-2 font-semibold text-blue-600 hover:underline"
                    >
                      (Clear Search)
                    </button>
                  </div>
                )}

              {/* Search Controls & Details Table */}
              {/* Wrap table in a responsive container */}
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border-collapse text-sm">
                  <tbody>
                    {/* DIN Search Row */}
                    <tr className="border-b">
                      <th className="w-1/3 place-content-start p-2 text-left align-top font-semibold text-foreground md:p-4 md:pt-6">
                        DIN
                      </th>
                      <td className="p-2 align-top md:p-4">
                        {/* DIN Search Form */}
                        <form
                          onSubmit={handleDinSearch}
                          className="flex flex-wrap items-start gap-2 sm:items-center"
                        >
                          <input
                            className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            id="search-din-input"
                            placeholder="Enter DIN"
                            type="text"
                            pattern="\d*"
                            inputMode="numeric"
                            value={searchDin}
                            onChange={(e) =>
                              setSearchDin(e.target.value.replace(/\D/g, ""))
                            }
                            aria-label="Director DIN Search"
                            disabled={isProcessing}
                          />
                          <button
                            type="submit"
                            className="inline-flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
                            aria-label="Search by DIN"
                            disabled={isProcessing || !searchDin.trim()}
                          >
                            <Search className="size-4" />
                            Search
                          </button>
                          <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex h-9 bg-red-500 text-white items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition hover:bg-gray-300 disabled:pointer-events-none disabled:opacity-50"
                            aria-label="Reset search"
                            disabled={isProcessing}
                          >
                            <RotateCcw className="size-4" />
                            Reset
                          </button>
                        </form>

                        {/* Name Search Toggle & Form */}
                        <div className="mt-2 text-xs">
                          <p className="inline text-muted-foreground">
                            Not sure about the DIN? <br className="sm:hidden" />{" "}
                            Search by name instead.
                          </p>
                          <button
                            className="inline cursor-pointer font-medium text-primary transition-all hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                            onClick={toggleNameSearchInput}
                            disabled={isProcessing}
                            aria-expanded={showNameSearchInput}
                          >
                            Click here{" "}
                            <ChevronRight
                              className={`ml-0.5 inline size-4 rounded-full bg-muted p-0.5 transition-transform ${
                                showNameSearchInput ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {showNameSearchInput && (
                          <form
                            onSubmit={handleNameSearch}
                            className="mt-2 flex w-full max-w-sm flex-wrap items-center gap-2"
                          >
                            <input
                              className="flex h-9 flex-grow rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Enter director name"
                              type="text"
                              value={searchName}
                              onChange={(e) => setSearchName(e.target.value)}
                              required
                              aria-label="Director Name Search Input"
                              disabled={isProcessing}
                            />
                            <button
                              type="submit"
                              className="inline-flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
                              aria-label="Search by Name"
                              disabled={isProcessing || !searchName.trim()}
                            >
                              <Search className="size-4" />
                              Search
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>

                    {/* Director Details Rows */}
                    <tr className="border-t border-b pt-4">
                      <th className="p-2 pt-4 text-left align-top font-semibold text-foreground md:p-4">
                        Director Name
                      </th>
                      <td className="p-2 pt-4 font-medium text-foreground md:p-4">
                        {directorData
                          ? `${directorData.DirectorFirstName || ""} ${
                              directorData.DirectorLastName || ""
                            }`.trim() || "N/A"
                          : !error &&
                            !isProcessing && (
                              <span className="text-sm text-gray-500">
                                Please search for a director.
                              </span>
                            )}
                      </td>
                    </tr>

                    <tr className="border-t border-b pt-4">
                      <th className="p-2 pt-4 text-left align-top font-semibold text-foreground md:p-4">
                        Director Address
                      </th>
                      <td className="p-2 pt-4 font-medium text-foreground md:p-4">
                        {directorData ? (
                          <div className="space-y-1 break-words">
                            <p>
                              {cleanAddressPart(
                                directorData.DirectorPermanentAddressLine1 ||
                                  "N/A"
                              )}{" "}
                              {directorData.DirectorPermanentCity || "N/A"},{" "}
                              {directorData.DirectorPermanentState || "N/A"} -{" "}
                              {directorData.DirectorPermanentPincode || "N/A"},
                              India
                            </p>
                          </div>
                        ) : (
                          !error &&
                          !isProcessing && (
                            <span className="text-sm text-gray-500">
                              Address details will appear here.
                            </span>
                          )
                        )}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <th className="p-2 text-left align-top font-semibold text-foreground md:p-4">
                        Contact Number
                      </th>
                      <td className="p-2 align-top text-muted-foreground md:p-4 break-words">
                        {directorData ? (
                          isPaid ? (
                            <span className="font-medium text-green-700">
                              {maskData(directorData.DirectorMobileNumber)}
                            </span>
                          ) : (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                              <FaLock className="size-4 mr-1.5 text-gray-500 flex-shrink-0" />
                              {maskData(
                                directorData.DirectorMobileNumber,
                                "mobile"
                              )}
                            </div>
                          )
                        ) : (
                          !error &&
                          !isProcessing && (
                            <span className="text-sm text-gray-500">
                              Details will appear here.
                            </span>
                          )
                        )}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <th className="p-2 text-left align-top font-semibold text-foreground md:p-4">
                        Email Address
                      </th>
                      <td className="p-2 align-top text-muted-foreground md:p-4 break-words">
                        {directorData ? (
                          isPaid ? (
                            <span className="font-medium text-green-700">
                              {maskData(directorData.DirectorEmailAddress)}
                            </span>
                          ) : (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                              <FaLock className="size-4 mr-1.5 text-gray-500 flex-shrink-0" />
                              {maskData(
                                directorData.DirectorEmailAddress,
                                "email"
                              )}
                            </div>
                          )
                        ) : (
                          !error &&
                          !isProcessing && (
                            <span className="text-sm text-gray-500">
                              Details will appear here.
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Info List */}
              {(isPaid || (directorData && !isPaid)) && (
                <ul className="mb-4 ml-6 mt-8 list-disc space-y-2 text-xs text-foreground md:ml-8 md:text-sm">
                  {isPaid ? (
                    <li className="font-semibold text-green-700">
                      <Check className="mr-1 inline size-4" /> Contact details
                      unlocked successfully! An email confirmation has been
                      sent.
                    </li>
                  ) : (
                    <li>
                      Contact details will be shown instantly here after
                      successful payment. A confirmation email will also be
                      sent.
                    </li>
                  )}
                  <li id="do-not-refresh-or-back">
                    Please{" "}
                    <strong className="font-semibold text-red-800">
                      do not refresh or press back button
                    </strong>{" "}
                    {isPaid
                      ? "until you have copied the details"
                      : "during or after payment until details are unlocked and copied"}
                    .
                  </li>
                </ul>
              )}
            </div>
          </div>
          {/* Pay to Unlock Card */}
          <div
            className="w-full max-w-md rounded-lg border bg-card p-2 text-card-foreground shadow md:w-2/5 md:max-w-none md:p-4"
            id="pay-to-unlock-contact"
          >
            <div className="flex flex-row items-center gap-2 space-y-1.5 p-2 text-lg font-bold text-foreground md:items-end md:p-4 md:text-xl">
              <Lock className="text-2xl text-primary md:text-3xl" />
              PAY TO UNLOCK CONTACT
            </div>
            <div className="p-2 md:p-4">
              {/* Payment Error Display */}
              {error && isPaying && (
                <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-center text-sm text-red-700">
                  <AlertTriangle className="inline size-4 mr-1" /> Error:{" "}
                  {error}
                </div>
              )}
              {/* Success message */}
              {isPaid && directorData && (
                <div className="mb-4 flex flex-col items-center rounded-lg border border-green-500 bg-green-50 p-3 text-center">
                  <Check className="size-8 text-green-600" />
                  <h3 className="mt-1 text-base font-semibold text-green-800">
                    Payment Successful!
                  </h3>
                  <p className="mt-0.5 text-xs text-green-700">
                    Details unlocked. Check your email for confirmation.
                  </p>
                </div>
              )}

              {/* Info text */}
              {!isPaid && directorData && (
                <p className="mb-4 flex w-full items-center gap-2 rounded border-l-4 border-primary bg-muted px-3 py-2 text-xs font-semibold text-foreground md:mb-6 md:text-sm">
                  <FileCheck className="text-xl text-primary flex-shrink-0" />
                  Unlock Mobile & Email for ₹{PAYMENT_AMOUNT_INR} Instantly
                </p>
              )}
              {!directorData && !isProcessing && !error && (
                <p className="mb-4 flex w-full items-center gap-2 rounded border-l-4 border-yellow-500 bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-800 md:mb-6 md:text-sm">
                  <Info className="text-xl text-yellow-600 flex-shrink-0" />
                  Please search for a director first to enable payment.
                </p>
              )}

              {/* Payment Form */}
              <form
                onSubmit={handlePayment}
                className={`space-y-4 ${
                  isPaid ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="payerName"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={payerNameRef}
                    className="mt-1 block h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    id="payerName"
                    placeholder="Enter Your Full Name"
                    name="payerName"
                    required
                    aria-required="true"
                    disabled={isPaid || isProcessing}
                  />
                </div>
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="payerEmail"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    Your Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={payerEmailRef}
                    className="mt-1 block h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    id="payerEmail"
                    placeholder="Enter Your Email Address"
                    name="payerEmail"
                    type="email"
                    required
                    aria-required="true"
                    disabled={isPaid || isProcessing}
                  />
                </div>
                {/* Phone Input */}
                <div>
                  <label
                    htmlFor="payerPhoneNumber"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    Your Contact Number{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </label>
                  <input
                    ref={payerPhoneRef}
                    className="mt-1 block h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    id="payerPhoneNumber"
                    placeholder="Enter Contact Number"
                    name="payerPhoneNumber"
                    type="tel"
                    disabled={isPaid || isProcessing}
                  />
                </div>
                {/* Submit Button */}
                <button
                  className={`relative z-0 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${
                    isPaid
                      ? "cursor-not-allowed bg-green-600"
                      : "cursor-pointer bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"
                  }`}
                  type="submit"
                  disabled={isProcessing || !directorData || isPaid}
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : isPaid ? (
                    <>
                      <Check className="mr-2 size-5" /> Payment Done
                    </>
                  ) : (
                    `PAY ₹${PAYMENT_AMOUNT_INR}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Payment Logos Section */}
        <section className="mt-6 md:px-0">
          <div className="relative mt-8 rounded-lg border bg-background py-2 md:px-7 md:py-4">
            <h2 className="absolute -top-2 left-1/2 translate-x-[-50%] whitespace-nowrap bg-background px-3 text-center text-[10px] font-semibold text-muted-foreground md:text-xs">
              Accepting All Payment Options
            </h2>
            <div
              className="mt-4 grid grid-cols-2 place-items-center sm:grid-cols-8 md:grid-cols-10 ml-4
                     gap-3 mr-5"
            >
              {[
                {
                  alt: "UPI",
                  src: "https://www.setindiabiz.com/assets/company-name-search/upi.webp",
                  title: "UPI",
                },
                {
                  alt: "Visa",
                  src: "https://www.setindiabiz.com/assets/company-name-search/visa.webp",
                  title: "Visa",
                },
                {
                  alt: "MasterCard",
                  src: "https://www.setindiabiz.com/assets/company-name-search/mastercard.webp",
                  title: "MasterCard",
                },
                {
                  alt: "Rupay",
                  src: "https://www.setindiabiz.com/assets/company-name-search/rupay.webp",
                  title: "Rupay",
                },
                {
                  alt: "GPay",
                  src: "https://www.setindiabiz.com/assets/company-name-search/gpay.webp",
                  title: "Google Pay",
                },
                {
                  alt: "Net Banking",
                  src: "https://www.setindiabiz.com/assets/company-name-search/netbanking.webp",
                  title: "Net Banking",
                  className: "",
                },
                {
                  alt: "Amazon Pay",
                  src: "https://www.setindiabiz.com/assets/company-name-search/amazonpay.webp",
                  title: "Amazon Pay",
                },
                {
                  alt: "Paytm",
                  src: "https://www.setindiabiz.com/assets/company-name-search/paytm.webp",
                  title: "Paytm",
                },
                {
                  alt: "PhonePe",
                  src: "https://www.setindiabiz.com/assets/company-name-search/phonepe.webp",
                  title: "PhonePe",
                },
                {
                  alt: "MobiKwik",
                  src: "https://www.setindiabiz.com/assets/company-name-search/mobikwik.webp",
                  title: "MobiKwik",
                },
              ].map((img) => (
                <div
                  key={img.alt}
                  className={`flex items-center justify-center ${
                    img.className || ""
                  }`}
                >
                  <Image
                    alt={img.alt}
                    title={img.title}
                    src={img.src}
                    width={60}
                    height={30}
                    className="h-6 w-auto object-contain sm:h-7"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Information Section */}
        <section className="mt-10 mb-5 md:px-6">
          <div className="rounded-lg py-0">
            <div className="flex items-center gap-2 space-y-1.5 p-2 pb-0 text-lg font-bold text-primary md:text-xl">
              <Info className="text-xl text-primary opacity-90 flex-shrink-0" />
              Important Information
            </div>
            <div
              data-orientation="horizontal"
              role="none"
              className="my-1 h-[1px] w-full shrink-0 bg-border"
            />
            <div className="p-2 md:p-4">
              <ul className="list-none space-y-3 text-sm text-foreground md:text-base">
                {[
                  {
                    icon: Copy,
                    color: "text-blue-500",
                    text: "Copy the unlocked information before closing the window or refreshing the page.",
                  },
                  {
                    icon: Ban,
                    color: "text-red-500",
                    text: "Circulation of these details is prohibited.",
                  },
                  {
                    icon: Mail,
                    color: "text-green-500",
                    text: "Details are not to be used for spamming.",
                  },
                  {
                    icon: AlertTriangle,
                    color: "text-yellow-500",
                    text: "The information is provided based on the best of our knowledge and publicly available data.",
                  },
                  {
                    icon: BadgeIndianRupee,
                    color: "text-purple-500",
                    text: "Amount once paid will not be refunded under any circumstances.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.text}
                      className="flex items-start gap-2.5 font-medium"
                    >
                      <Icon
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${item.color}`}
                      />
                      <span className=" font-sans-serif font-semibold">
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="wrapper mt-5 mb-2 px-4 md:px-0">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-md md:mx-4 md:rounded-xl md:p-12">
            <div className="flex flex-col items-center sm:flex-row">
              <div className="z-10 sm:w-1/2">
                <h2 className="mb-6 text-xl font-semibold md:text-2xl lg:text-3xl">
                  Ready to Reach New Clients and Boost Your Business?
                </h2>
                <p className="mb-8 text-xs font-light md:text-sm lg:text-base">
                  Whether you are in sales, marketing, IT services, or
                  consulting, access exclusive data on newly registered
                  companies to stay ahead of your competition. Fresh leads
                  delivered daily to help you grow.
                </p>
                <Link
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-white py-2 h-12 w-full gap-2 px-5 text-sm font-bold text-blue-700 ring-offset-background transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-fit lg:text-base"
                  href="/unlock-contact"
                >
                  <FileCheck className="text-lg md:text-2xl" />
                  Get Your Daily Reports Now
                </Link>
              </div>
              <div className="z-10 mt-8 sm:w-1/2 md:mt-0">
                <div className="relative h-auto">
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-400 opacity-50" />
                  <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500 opacity-50" />
                  <Image
                    alt="Business leads illustration"
                    src="https://www.setindiabiz.com/assets/company-name-search/report.webp"
                    width={500}
                    height={300}
                    sizes="(max-width: 768px) 80vw, 500px"
                    className="h-auto max-h-64 w-auto transform md:absolute md:left-1/2 md:top-1/2 md:max-h-80 md:-translate-x-1/2 md:-translate-y-1/2"
                  />
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-500 opacity-20" />
            <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-700 opacity-20" />
          </div>
        </section>
      </main>
    </>
  );
};

// --- Main Page Component ---
// This component now only sets up the Suspense boundary
const UnlockPage = () => {
  // Performance Note: While Suspense helps, the primary loading speed determinant after initial page load
  // is often the backend API response time for fetchDirectorData. Ensure '/api/company/getdirector' is optimized.
  return (
    <Suspense
      fallback={
        // Simple fallback UI while searchParams are loading
        <div className="wrapper flex justify-center items-center min-h-screen pt-20 md:pt-24">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading page...</p>
        </div>
      }
    >
      <UnlockContactContent /> {/* Render the inner component here */}
    </Suspense>
  );
};

export default UnlockPage;
