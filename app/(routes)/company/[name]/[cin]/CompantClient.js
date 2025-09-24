"use client";

import React from "react";
import { LucidePieChart, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  LuBuilding2,
  LuChevronDown,
  LuAtSign,
  LuFileText,
  LuCheck,
  LuShoppingCart,
  LuFileSpreadsheet,
  LuStar,
  LuExternalLink,
  LuLoader,
} from "react-icons/lu";
import axios from "axios";
import { API_PREFIX } from "lib/api-modifier";

// Constants defined directly in the client component
const COMPANY_API_URL =
  process.env.NEXT_PUBLIC_COMPANY_API_URL || `${API_PREFIX}/company/getcompany`;
const PUBLIC_MCA_API_URL =
  process.env.NEXT_PUBLIC_MCA_API_URL || `${API_PREFIX}/public/mca`;

// Utility functions defined directly in the client component
const getInitials = (name) => {
  if (!name) return "";
  const names = name
    .trim()
    .split(" ")
    .filter((n) => n);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (
    (names[0][0] || "").toUpperCase() +
    (names[names.length - 1][0] || "").toUpperCase()
  );
};

function slugify(text) {
  if (!text) return "no-name";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const CompanyClient = () => {
  const params = useParams();
  const slugName = params.name ? decodeURIComponent(params.name) : null;
  const cinParam = params.cin ? decodeURIComponent(params.cin) : null;

  const [activeTab, setActiveTab] = useState(0);
  const [companyData, setCompanyData] = useState(null);
  const [directorRecords, setDirectorRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleSuggestion = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const reportPayload = {
        reporterName: name,
        reporterEmail: email,
        reportMessage: message,
        company_name:
          companyData?.CompanyName || companyData?.company || slugName,
        company_cin: companyData?.CIN || companyData?.cin || cinParam,
        companyName:
          companyData?.CompanyName ||
          companyData?.company ||
          slugName ||
          "Unknown Company",
        companyCin:
          companyData?.CIN || companyData?.cin || cinParam || "Unknown CIN",
      };

      const response = await axios.post(`${API_PREFIX}/report-change`, reportPayload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "API failed to send report.");
      }

      setSuccessMsg("Thank you! Your report was sent successfully.");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setPopup(false);
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      console.error("Email send failed:", error);
      const apiErrorMsg = error.response?.data?.message || error.message;
      setErrorMsg(
        apiErrorMsg || "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateFaqData = (data) => {
    if (!data) return [];
    const companyName = data.CompanyName || data.company || "The Company";
    const address =
      [
        data.Registered_Office_Address,
        data.streetAddress,
        data.streetAddress2,
        data.city,
        data.state,
        data.postalCode,
      ]
        .filter(Boolean)
        .join(", ") || "India";

    return [
      {
        question: `What is ${companyName} registered as?`,
        answer: `${companyName} is registered as a ${
          data.CompanyClass || data.classOfCompany || "N/A"
        } Limited ${data.companyType || "company"}.`,
      },
      {
        question: `When was ${companyName} incorporated?`,
        answer: `${companyName} was incorporated on ${
          data.CompanyRegistrationdate_date || data.dateOfIncorporation || "N/A"
        }.`,
      },
      {
        question: `What is the status of ${companyName}?`,
        answer: `The status of ${companyName} is ${
          data.CompanyStatus || "N/A"
        }.`,
      },
      {
        question: `Where is ${companyName} located?`,
        answer: `${companyName} is located in ${address}.`,
      },
      {
        question: `In which state is ${companyName} registered?`,
        answer: `${companyName} is registered in ${
          data.CompanyStateCode || data.state || "N/A"
        }.`,
      },
      {
        question: `What is the class of ${companyName}?`,
        answer: `The class of ${companyName} is ${
          data.CompanyClass || data.classOfCompany || "N/A"
        }.`,
      },
      {
        question: `What is the origin of ${companyName}?`,
        answer: `${companyName} is an ${
          data.companyOrigin || "Indian"
        } company.`,
      },
      {
        question: `What is the authorized capital of ${companyName}?`,
        answer: `The authorized capital of ${companyName} is ₹${
          data.AuthorizedCapital || data.authorisedCapital || "N/A"
        } Lakh.`,
      },
      {
        question: `What is the paid-up capital of ${companyName}?`,
        answer: `The paid-up capital of ${companyName} is ₹${
          data.PaidupCapital || data.paidUpCapital || "N/A"
        } Lakh.`,
      },
      {
        question: `Is ${companyName} listed?`,
        answer: `${companyName} is ${
          data.Listingstatus || data.whetherListedOrNot || "N/A"
        }.`,
      },
      {
        question: `Who are the current directors of ${companyName}?`,
        answer: `See the Directors tab for a list of current directors.`,
      },
      {
        question: `What is the company type of ${companyName}?`,
        answer: `The company type of ${companyName} is ${
          data.companyType || "Company"
        }.`,
      },
      {
        question: `What is the company subcategory of ${companyName}?`,
        answer: `The company subcategory of ${companyName} is ${
          data.CompanySubCategory || data.companySubcategory || "N/A"
        }.`,
      },
      {
        question: `What is the ROC code of ${companyName}?`,
        answer: `The ROC name of ${companyName} is ${
          data.CompanyROCcode || "N/A"
        }.`,
      },
    ];
  };

  useEffect(() => {
    const fetchCompanyAndDirectorData = async () => {
      console.log(`COMPANY CLIENT: useEffect triggered for CIN: ${cinParam}`);
      setLoading(true);
      setError(null);
      setCompanyData(null);
      setDirectorRecords([]);

      if (!cinParam) {
        setError("No CIN provided in the URL path.");
        setLoading(false);
        console.error("COMPANY CLIENT: No CIN found in params.");
        return;
      }

      const apiParams = { cin: cinParam };
      let publicCompanyDetails = null;
      let personalCompanyDetails = null;
      let personalDirectorRecords = [];
      let foundInPersonalAPI = false;
      let publicAPIError = null;
      let personalAPIError = null;
      let publicCompanyStatus = null;

      try {
        console.log(
          "COMPANY CLIENT: Fetching from Public API...",
          PUBLIC_MCA_API_URL,
          apiParams
        );
        const publicResponse = await axios.get(PUBLIC_MCA_API_URL, {
          params: apiParams,
        });
        console.log(
          "COMPANY CLIENT: Public API Raw Response:",
          publicResponse.data
        );

        if (
          publicResponse.data?.success &&
          Array.isArray(publicResponse.data.data) &&
          publicResponse.data.data.length > 0
        ) {
          const companyRecord = publicResponse.data.data[0];
          if (companyRecord?.CompanyName && companyRecord?.CIN) {
            publicCompanyDetails = companyRecord;
            publicCompanyStatus = companyRecord.CompanyStatus;
            console.log(
              "COMPANY CLIENT: Public API Success - Found basic details:",
              publicCompanyDetails
            );
          } else {
            console.warn(
              "COMPANY CLIENT: Public API Success but first record incomplete."
            );
          }
        } else {
          console.log(
            "COMPANY CLIENT: Public API Success but no valid data array."
          );
        }
      } catch (err) {
        publicAPIError = err;
        // console.error("COMPANY CLIENT: Error fetching from Public MCA API:", err.response?.status, err.response?.data || err.message);
      }

      try {
        console.log(
          "COMPANY CLIENT: Fetching from Personal API...",
          COMPANY_API_URL,
          apiParams
        );
        const personalResponse = await axios.get(COMPANY_API_URL, {
          params: apiParams,
        });
        console.log(
          "COMPANY CLIENT: Personal API Raw Response:",
          personalResponse.data
        );

        if (
          personalResponse.data?.success &&
          personalResponse.data.companyDetails
        ) {
          if (
            personalResponse.data.companyDetails.company &&
            personalResponse.data.companyDetails.cin
          ) {
            personalCompanyDetails = personalResponse.data.companyDetails;
            personalDirectorRecords =
              personalResponse.data.directorRecords || [];
            foundInPersonalAPI = true;
            console.log(
              "COMPANY CLIENT: Personal API Success - Found details:",
              personalCompanyDetails
            );
          } else {
            console.warn(
              "COMPANY CLIENT: Personal API Success but companyDetails incomplete ('company' or 'cin' missing)."
            );
          }
        } else {
          console.log(
            "COMPANY CLIENT: Personal API Success false or companyDetails missing."
          );
        }
      } catch (err) {
        personalAPIError = err;
        // console.error("COMPANY CLIENT: Error fetching from Personal API:", err.response?.status, err.response?.data || err.message);
        if (err.response?.status === 404) {
          console.log("COMPANY CLIENT: Personal API returned 404 (Not Found).");
        }
      }

      setLoading(false);
      if (foundInPersonalAPI) {
        const finalCompanyData = {
          ...personalCompanyDetails,
          ...(publicCompanyStatus && { CompanyStatus: publicCompanyStatus }),
        };
        setCompanyData(finalCompanyData);
        setDirectorRecords(personalDirectorRecords);
      } else if (publicCompanyDetails) {
        setCompanyData(publicCompanyDetails);
        setDirectorRecords([]);
      } else {
        const errorText =
          personalAPIError?.response?.status === 404 &&
          publicAPIError?.response?.status === 404
            ? `Company with CIN ${cinParam} not found in either database.`
            : `Failed to load company data for CIN ${cinParam}. Please try again.`;
        setError(errorText);
      }
    };

    fetchCompanyAndDirectorData();
  }, [cinParam, slugName]);

  const tabContent = [
    {
      title: "About",
      content: (
        <div className="wrapper overflow-hidden">
          <div className="mt-7">
            <div className="space-y-3 mt-3 md:space-y-4">
              <div className="space-y-3 divide-y md:space-y-4">
                <p className="text-sm leading-relaxed">
                  {companyData?.CompanyName ||
                    companyData?.company ||
                    "The company"}{" "}
                  is an Indian {companyData?.classOfCompany || "private"}{" "}
                  Limited {companyData?.companyType || "company"} incorporated
                  on{" "}
                  {companyData?.CompanyRegistrationdate_date ||
                    companyData?.dateOfIncorporation ||
                    "N/A"}
                  . It operates in the{" "}
                  {companyData?.mainDivisionDescription || "various"} sectors
                  based in{" "}
                  {companyData?.CompanyStateCode || companyData?.state || "N/A"}
                  , India. With an authorized capital of ₹
                  {companyData?.AuthorizedCapital ||
                    companyData?.authorisedCapital ||
                    "N/A"}{" "}
                  Lakh and a paid-up capital of ₹
                  {companyData?.PaidupCapital ||
                    companyData?.paidUpCapital ||
                    "N/A"}{" "}
                  Lakh the company is classified as a{" "}
                  {companyData?.CompanyClass ||
                    companyData?.classOfCompany ||
                    "N/A"}
                  . The registered office is in{" "}
                  {[
                    companyData?.Registered_Office_Address,
                    companyData?.streetAddress,
                    companyData?.streetAddress2,
                    companyData?.city,
                    companyData?.state,
                    companyData?.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "India"}
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:mt-10 lg:gap-6 items-start">
              <div className=" bg-card text-card-foreground overflow-hidden rounded-md shadow-sm md:col-span-7">
                <div className="flex flex-col space-y-1.5 bg-green-100 p-4 text-base font-normal">
                  Basic Information
                </div>
                <div className="space-y-3 divide-y p-4 md:space-y-4">
                  <div className="grid grid-cols-1 gap-2 text-sm pt-1 md:grid-cols-2 md:pt-2">
                    <h6 className="font-semibold text-primary">
                      Company Name:
                    </h6>
                    <div className="sm:flex-row sm:items-start sm:justify-between gap-1">
                      <p className="">
                        {companyData?.CompanyName ||
                          companyData?.company ||
                          "N/A"}
                      </p>
                      <span>
                        <Link
                          href="https://www.setindiabiz.com/company-name-change"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0"
                        >
                          <button
                            type="button"
                            className="btn-primary cursor-pointer mb-2 inline-flex rounded-md p-2"
                          >
                            Want to make Change ? <LuExternalLink size={12} />
                          </button>
                        </Link>
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-5">
                    <h6 className="font-semibold text-primary">CIN:</h6>
                    <p>{companyData?.CIN || companyData?.cin || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-5">
                    <h6 className="font-semibold text-primary">
                      Date of incorporation:
                    </h6>
                    <p>
                      {companyData?.CompanyRegistrationdate_date ||
                        companyData?.dateOfIncorporation ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">
                      Company Category:
                    </h6>
                    <p>
                      {companyData?.CompanyCategory ||
                        companyData?.companyCategory ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">
                      Company Subcategory:
                    </h6>
                    <p>
                      {companyData?.CompanySubCategory ||
                        companyData?.companySubcategory ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">
                      Class of Company:
                    </h6>
                    <p>
                      {companyData?.CompanyClass ||
                        companyData?.classOfCompany ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">
                      Listing Status:
                    </h6>
                    <p>
                      {companyData?.Listingstatus ||
                        companyData?.whetherListedOrNot ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">Industry:</h6>
                    <p>
                      {companyData?.CompanyIndustrialClassification ||
                        companyData?.mainDivisionDescription ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2 pt-3">
                    <h6 className="font-semibold text-primary">
                      Address (Registered Address):
                    </h6>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <p className="leading-relaxed flex-1">
                        {[
                          companyData?.Registered_Office_Address,
                          companyData?.streetAddress,
                          companyData?.streetAddress2,
                          companyData?.city,
                          companyData?.state,
                          companyData?.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                        <span>
                          <Link
                            href="https://www.setindiabiz.com/company-registered-office-change"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0"
                          >
                            <button
                              type="button"
                              className="btn-primary mb-2 cursor-pointer inline-flex rounded-md p-2"
                            >
                              Want to make Change ?<LuExternalLink size={12} />
                            </button>
                          </Link>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">
                      Authorized Capital:
                    </h6>
                    <p>
                      ₹
                      {companyData?.AuthorizedCapital ||
                        companyData?.authorisedCapital ||
                        "N/A"}{" "}
                      Lakh
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-3 text-sm md:grid-cols-2 md:pt-4">
                    <h6 className="font-semibold text-primary">
                      Paid Up Capital:
                    </h6>
                    <p>
                      ₹
                      {companyData?.PaidupCapital ||
                        companyData?.paidUpCapital ||
                        "N/A"}{" "}
                      Lakh
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-fit bg-card text-card-foreground overflow-hidden rounded-md shadow-sm md:col-span-5">
                <div className="space-y-1.5 font- flex flex-row bg-green-100 p-4 text-base">
                  Directors ({directorRecords.length})
                </div>
                <div className="p-4">
                  <div className="divide-y overflow-y-auto max-h-96">
                    {directorRecords.length > 0 ? (
                      directorRecords.map((director, index) => (
                        <div
                          key={director.DirectorDIN || index}
                          className="py-4 first:pt-0 hover:bg-muted/50"
                        >
                          <div className="flex gap-3">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full mt-1 size-10 border-lime-50 bg-sky-300">
                              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs text-black">
                                {getInitials(
                                  `${director.DirectorFirstName || ""} ${
                                    director.DirectorLastName || ""
                                  }`
                                )}
                              </span>
                            </span>
                            <div className="flex flex-1 flex-col items-start space-y-1 md:flex-row md:items-center md:justify-between md:space-y-0">
                              <div>
                                <Link
                                  className="block text-sm font-medium text-primary hover:underline"
                                  href={`/director/${slugify(
                                    `${director.DirectorFirstName} ${director.DirectorLastName}`
                                  )}/${director.DirectorDIN}`}
                                >
                                  {`${director.DirectorFirstName || ""} ${
                                    director.DirectorLastName || ""
                                  }`.trim() || "N/A"}
                                </Link>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {director.DirectorDesignation || "Director"}
                                </p>
                              </div>
                              <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-0 overflow-hidden after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%] flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-200 h-7 bg-blue-500 text-xs text-white hover:bg-primary"
                                href={`/unlock-contact?din=${director.DirectorDIN}`}
                              >
                                <LuShoppingCart />
                                Get Contact Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-sm text-muted-foreground">
                        No director information available.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="inline-flex mt-4 ml-2 cursor-pointer rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                    onClick={() => setPopup(true)}
                  >
                    Report any Change?
                  </button>
                  {popup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                        <button
                          onClick={() => setPopup(false)}
                          className="absolute cursor-pointer right-3 top-3 text-gray-500 hover:text-gray-800"
                        >
                          ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
                          Report a Change
                        </h2>
                        <form className="space-y-4" onSubmit={handleSuggestion}>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Your Name
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="you@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Message
                            </label>
                            <textarea
                              rows="4"
                              value={formData.message}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  message: e.target.value,
                                })
                              }
                              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Describe the change you want to report..."
                            ></textarea>
                          </div>
                          <div className="flex justify-end items-center">
                            <button
                              type="submit"
                              className="rounded-lg cursor-pointer bg-green-600 px-5 py-2 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                            <span className="ml-4 flex-1 text-right">
                              {errorMsg && (
                                <p className="text-red-500 text-sm">
                                  {errorMsg}
                                </p>
                              )}
                              {successMsg && (
                                <p className="text-green-600 text-sm">
                                  {successMsg}
                                </p>
                              )}
                            </span>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-10">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 shadow-md">
                <div className="relative z-10 p-4 text-white">
                  <div className="flex w-fit items-center gap-2 rounded bg-white/20 px-2 py-1">
                    <LucidePieChart className="size-6" />
                    <h3 className="text-sm font-semibold drop-shadow md:text-base">
                      Complete Company Report + Documents
                    </h3>
                  </div>
                  <p className="mt-4 text-xs drop-shadow">
                    All-in-one company intelligence package
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>
                        In-depth financial analysis & performance trends
                      </span>
                    </li>
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>
                        All documents filed on both V2 & V3 MCA portal
                      </span>
                    </li>
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>Year-wise insights with interactive charts</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white unlockbutton h-10 px-4 py-2 w-full text-purple-700 lg:w-fit"
                      type="button"
                    >
                      <span className="mr-1.5 font-semibold">Unlock</span>
                      <LuAtSign className="mr-1.5 size-4" />
                      <span className="text-lg font-bold">₹799</span>
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] italic drop-shadow-sm lg:max-w-[60%] lg:text-left">
                    Or Enjoy up to 50% discount with our credit packages <br />
                    <button
                      className="text-muted underline hover:text-white"
                      type="button"
                    >
                      view credit packages
                    </button>
                  </p>
                </div>
                <div className="absolute left-[65%] top-24 z-[5] hidden h-[190px] w-[260px] overflow-hidden rounded-tl-lg border border-gray-300 shadow-2xl lg:block">
                  <Image
                    alt="Financials Table"
                    loading="lazy"
                    width={360}
                    height={272}
                    className="h-full w-full object-cover object-left-top"
                    src="https://www.setindiabiz.com/assets/company-name-search/directors.webp"
                  />
                </div>
                <div className="absolute left-[60%] top-16 hidden h-60 w-72 overflow-hidden rounded-tl-lg border border-gray-300 shadow-md lg:block">
                  <Image
                    alt="Public Docs Table"
                    loading="lazy"
                    width={420}
                    height={340}
                    className="h-full w-full object-cover object-left-top"
                    src="https://www.setindiabiz.com/assets/company-name-search/directors.webp"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-sky-400 shadow-md">
                <div className="relative z-10 p-4 text-white">
                  <div className="flex w-fit items-center gap-2 rounded bg-white/20 px-2 py-1">
                    <LuFileText className="size-6" />
                    <h3 className="text-sm font-semibold drop-shadow md:text-base">
                      MCA Documents Access
                    </h3>
                  </div>
                  <p className="mt-4 text-xs drop-shadow">
                    Quick access to all public filings
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>
                        All documents filed on both V2 & V3 MCA portal
                      </span>
                    </li>
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>Incorporation certificates & annual returns</span>
                    </li>
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>Smart search & bulk download features</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap bg-white rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 getdocuments h-10 px-4 py-2 relative w-full text-purple-700 lg:w-fit"
                      type="button"
                    >
                      <span className="mr-1.5 font-semibold">
                        Get Documents
                      </span>
                      <LuAtSign className="mr-1.5 size-4" />
                      <span className="text-lg font-bold">₹499</span>
                      <LuStar className="absolute -right-2 -top-2 size-5 rotate-12 text-yellow-400 fill-amber-200" />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] italic drop-shadow-sm lg:text-left">
                    * Upgrade to full report for in-depth financial analysis
                  </p>
                </div>
                <div className="absolute left-[60%] top-16 hidden h-60 w-72 overflow-hidden rounded-tl-lg border border-gray-300 shadow-md lg:block">
                  <Image
                    alt="Public Docs Table"
                    loading="lazy"
                    width={421}
                    height={340}
                    className="h-full w-full object-cover object-left-top"
                    src="https://www.setindiabiz.com/assets/company-name-search/decision-contact.webp"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-sky-400 shadow-md">
                <div className="relative z-10 p-4 text-white">
                  <div className="flex w-fit items-center gap-2 rounded bg-white/20 px-2 py-1">
                    <LuFileText className="size-6" />
                    <h3 className="text-sm font-semibold drop-shadow md:text-base">
                      MCA Documents Access
                    </h3>
                  </div>
                  <p className="mt-4 text-xs drop-shadow">
                    Quick access to all public filings
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>
                        All documents filed on both V2 & V3 MCA portal
                      </span>
                    </li>
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>Incorporation certificates & annual returns</span>
                    </li>
                    <li className="flex items-center gap-2 drop-shadow">
                      <LuCheck className="size-4 text-purple-300" />
                      <span>Smart search & bulk download features</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap bg-white rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 getdocuments h-10 px-4 py-2 relative w-full text-purple-700 lg:w-fit"
                      type="button"
                    >
                      <span className="mr-1.5 font-semibold">
                        Get Documents
                      </span>
                      <LuAtSign className="mr-1.5 size-4" />
                      <span className="text-lg font-bold">₹499</span>
                      <LuStar className="absolute -right-2 -top-2 size-5 rotate-12 text-yellow-400 fill-amber-200" />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] italic drop-shadow-sm lg:text-left">
                    * Upgrade to full report for in-depth financial analysis
                  </p>
                </div>
                <div className="absolute left-[60%] top-16 hidden h-60 w-72 overflow-hidden rounded-tl-lg border border-gray-300 shadow-md lg:block">
                  <Image
                    alt="Public Docs Table"
                    loading="lazy"
                    width={421}
                    height={340}
                    className="h-full w-full object-cover object-left-top"
                    src="https://www.setindiabiz.com/assets/company-name-search/decision-contact.webp"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="wrapper relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-500  text-white shadow-md md:rounded-xl md:p-10">
                <div className="flex flex-col items-center sm:flex-row">
                  <div className="z-10 sm:w-7/12">
                    <h2 className="mb-6 w-[95%] text-xl font-semibold md:text-2xl lg:text-3xl">
                      Ready to Reach New Clients and Boost Your Business?
                    </h2>
                    <p className="mb-8 text-xs font-light md:text-sm lg:text-base">
                      Whether you are in sales, marketing, IT services, or
                      consulting, access exclusive data on newly registered
                      companies to stay ahead of your competition. Fresh leads
                      delivered daily to help you grow.
                    </p>
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
                        decoding="async"
                        data-nimg={1}
                        className="h-auto max-h-64 w-auto transform md:absolute md:left-1/2 md:top-1/2 md:max-h-80 md:-translate-x-1/2 md:-translate-y-1/2"
                        style={{ color: "transparent" }}
                        src="https://www.setindiabiz.com/assets/company-name-search/report.webp"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 -mr-32 -mt-32 h-55 w-64 rounded-full bg-blue-500 opacity-20" />
                <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-55 w-64 rounded-full bg-blue-700 opacity-20" />
              </div>
            </div>

            <div className="mb-3 mt-14">
              <div className=" md:mt-10">
                <h2 className="text-xl font-semibold md:text-2xl">
                  Frequently Asked Questions about{" "}
                  {companyData?.CompanyName ||
                    companyData?.company ||
                    "the Company"}
                </h2>
                <div className="mt-4 space-y-2 px-2">
                  {generateFaqData(companyData).map((faq, index) => (
                    <details key={index} className="border-b group">
                      <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                        <span className="text-left text-sm font-medium text-gray-800 md:text-base">
                          {faq.question}
                        </span>
                        <LuChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className="overflow-hidden transition-[max-height] duration-300 ease-in-out group-open:max-h-screen max-h-0">
                        <p className="pb-4 pt-1 text-sm text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Directors",
      content: (
        <section>
          <div className="pt-8 ml-8">
            <h4 className="text-base font-semibold md:text-lg ">Overview</h4>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {[
                {
                  label: "Board Members",
                  value: directorRecords.length,
                  color: "#7879FC",
                },
                { label: "Past Directors", value: 0, color: "#FC9858" },
                {
                  label: "Current Leadership",
                  value: directorRecords.length,
                  color: "#2CDE9A",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="border-amber-100 bg-card text-card-foreground shadow md:p-8 space-y-1 rounded-md sm:p-6"
                >
                  <p className="text-sm font-normal sm:text-base">{label}</p>
                  <p
                    className="text-xl font-extrabold md:text-4xl lg:text-3xl"
                    style={{ color }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <section className="wrapper mt-8 md:mt-10">
            <h2 className="w-10/12 text-base font-semibold md:text-lg">
              Current Leadership details
            </h2>
            <h6 className="mt-4 text-sm">
              This section lists the directors who are currently holding
              positions in this company. It includes the Director Identification
              Number (DIN), name, current designation and the date they were
              appointed to their current role.
            </h6>
            <div className="mt-4 w-full md:mt-4">
              <div className="relative overflow-hidden h-12 mb-2">
                <div className="h-full w-full rounded-[inherit]">
                  <div style={{ minWidth: "100%", display: "table" }}>
                    <div
                      role="tablist"
                      aria-orientation="horizontal"
                      className="inline-flex h-9 items-center justify-center rounded-lg text-muted-foreground gap-3 bg-background"
                      tabIndex={0}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected="true"
                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-none px-2 py-2 border-b-2 border-sky-400 text-primary"
                      >
                        Board Members
                        <div className="inline-flex items-center border py-0.5 font-semibold border-transparent ml-2 rounded-full bg-sky-200 px-1.5 text-xs text-gray-900 shadow-none hover:bg-sky-200">
                          {directorRecords.length}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                role="tabpanel"
                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="border-0 bg-card text-card-foreground shadow overflow-hidden rounded-md">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full  text-xs md:text-sm">
                      <thead className="[&>tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted divide-x bg-muted">
                          <th className="h-10 text-left align-middle p-4 font-semibold text-foreground hidden md:table-cell whitespace-nowrap">
                            DIN
                          </th>
                          <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                            Name
                          </th>
                          <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                            Current Designation
                          </th>
                          <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                            Current Date of Appointment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {directorRecords.length > 0 ? (
                          directorRecords.map((director, index) => (
                            <tr
                              key={director.DirectorDIN || index}
                              className="divide-x hover:bg-card"
                            >
                              <td className="p-4 align-top hidden md:table-cell border-b whitespace-nowrap">
                                {director.DirectorDIN || "N/A"}
                              </td>
                              <td className="p-4 align-top border-b md:whitespace-nowrap">
                                <Link
                                  href={`/director/${slugify(
                                    `${director.DirectorFirstName} ${director.DirectorLastName}`
                                  )}/${director.DirectorDIN}`}
                                  className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary underline-offset-4 hover:underline p-0 text-xs md:text-sm"
                                >
                                  {`${director.DirectorFirstName || ""} ${
                                    director.DirectorLastName || ""
                                  }`.trim() || "N/A"}
                                </Link>
                              </td>
                              <td className="p-4 align-top border-b ">
                                {director.DirectorDesignation || "Director"}
                              </td>
                              <td className="p-4 align-top flex border-b flex-col sm:flex-row justify-between gap-1 sm:gap-8">
                                <span>
                                  {director.dateOfAppointment ||
                                    director.dateOfIncorporation ||
                                    "N/A"}
                                </span>
                                <Link
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={`/unlock-contact?din=${director.DirectorDIN}`}
                                  className="flex items-center gap-1 font-semibold text-blue-600 hover:underline text-xs sm:text-sm"
                                >
                                  <ShoppingCartIcon size={16} /> Get Contact
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-4 text-center text-gray-500"
                            >
                              No current director data found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="wrapper mt-8 md:mt-10">
            <h2 className="w-10/12 text-base font-semibold md:text-lg">
              Past Directors
            </h2>
            <h6 className="mt-4 text-sm">
              This section provides information about individuals who have
              previously held positions in the company.
            </h6>
            <div className="mt-3 w-full md:mt-5">
              <div className="bg-card text-card-foreground shadow overflow-hidden rounded-md">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-xs md:text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted divide-x bg-muted">
                        <th className="h-10 text-left align-middle whitespace-nowrap p-4 font-semibold text-foreground hidden md:table-cell">
                          DIN
                        </th>
                        <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                          Director Name
                        </th>
                        <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                          Previous Designation
                        </th>
                        <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                          Previous Date of Appointment
                        </th>
                        <th className="h-10 text-left align-middle p-4 font-semibold text-foreground md:whitespace-nowrap">
                          Cessation Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      <tr>
                        <td
                          className="align-middle p-4 text-center"
                          colSpan="5"
                        >
                          No past director data found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </section>
      ),
    },
  ];

  if (loading) {
    return (
      <main className="container mx-auto text-center mt-20 p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto text-center mt-10 p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Search
        </Link>
      </main>
    );
  }

  if (!companyData) {
    return (
      <main className="container mx-auto text-center mt-10 p-4">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline ml-2">
            Company data could not be loaded.
          </span>
        </div>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Search
        </Link>
      </main>
    );
  }

  return (
    <main className="container-fluid flex flex-col mb-7">
      <section>
        <div className="relative border-b bg-gradient-to-r from-blue-50 to-indigo-50 pb-6 pt-20 md:pb-6 md:pt-24">
          <div className="wrapper flex-col-bottom relative w-full">
            <div className="w-full">
              <div className="flex gap-4 md:items-center md:gap-6">
                <div className="flex-shrink-0">
                  <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-lg bg-sky-300 text-muted shadow md:size-20 lg:size-24">
                    <LuBuilding2 className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-sky-700 opacity-80" />
                  </div>
                </div>
                <div className="w-full space-y-2 md:space-y-4">
                  <div className="flex flex-col items-start justify-center md:flex-row md:justify-between md:gap-8">
                    <h1 className="text-lg font-semibold text-gray-800 md:text-xl lg:text-3xl">
                      {companyData?.CompanyName ||
                        companyData?.company ||
                        "N/A"}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 md:justify-end md:text-xs">
                      <p>Last updated recently</p>
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-2 text-sm text-gray-700 md:grid-cols-3 md:divide-x md:text-sm lg:grid-cols-5">
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-gray-600 md:text-xs">
                        CIN/LLPIN
                      </h4>
                      <p className="font-medium">
                        {companyData?.CIN || companyData?.cin || "N/A"}
                      </p>
                    </div>
                    {companyData?.CompanyStatus ? (
                      <div className="space-y-1 md:pl-4">
                        <h4 className="text-[10px] text-gray-600 md:text-xs">
                          Status
                        </h4>
                        <p className="flex items-center gap-1.5 font-medium">
                          <span
                            className={`size-2 flex-shrink-0 rounded-full shadow md:size-3 ${
                              companyData.CompanyStatus.toLowerCase() ===
                              "active"
                                ? "bg-green-500"
                                : companyData.CompanyStatus.toLowerCase().includes(
                                    "strike"
                                  ) ||
                                  companyData.CompanyStatus.toLowerCase().includes(
                                    "dissolved"
                                  )
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          ></span>
                          {companyData.CompanyStatus}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 md:pl-4">
                        <h4 className="text-[10px] text-gray-600 md:text-xs">
                          Registration Number
                        </h4>
                        <p className="font-medium">
                          {companyData?.registrationNumber || "N/A"}
                        </p>
                      </div>
                    )}
                    <div className="hidden space-y-1 pl-4 md:inline-block">
                      <h4 className="text-[10px] text-gray-600 md:text-xs">
                        Industry
                      </h4>
                      <p className="font-medium line-clamp-1">
                        {companyData?.CompanyIndustrialClassification ||
                          companyData?.mainDivisionDescription ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="hidden space-y-1 pl-4 lg:inline-block">
                      <h4 className="text-[10px] text-gray-600 md:text-xs">
                        Type
                      </h4>
                      <p className="font-medium">
                        {companyData?.CompanyCategory ||
                          companyData?.companyType ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="wrapper flex flex-col md:flex-row md:items-center">
          <div className="w-full overflow-hidden">
            <div className="relative overflow-x-auto border-b border-gray-200">
              <div className="h-full w-full rounded-[inherit]">
                <div style={{ minWidth: "100%", display: "table" }}>
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="inline-flex h-12 items-end justify-start rounded-lg bg-muted px-2 pt-2 text-muted-foreground md:h-14"
                    tabIndex={0}
                    data-orientation="horizontal"
                    style={{ outline: "none" }}
                  >
                    {tabContent.map((tab, index) => (
                      <button
                        key={index}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`tab-content-${index}`}
                        className={`inline-flex cursor-pointer items-center justify-center rounded-t-md px-4 py-2.5 font-medium opacity-70 ring-offset-background transition-all hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                          activeTab === index
                            ? "bg-white text-foreground opacity-100 shadow-sm border border-gray-200 border-b-0"
                            : "border-transparent"
                        } md:text-base text-sm whitespace-nowrap`}
                        onClick={() => handleTabClick(index)}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-b-md">
              <div
                id={`tab-content-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
              >
                {tabContent[activeTab].content}
              </div>
            </div>
          </div>
        </div>
      </section>
      {companyData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: companyData?.CompanyName || companyData?.company,
              identifier: companyData?.CIN || companyData?.cin,
              url:
                typeof window !== "undefined"
                  ? window.location.href
                  : `${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "http://localhost:3000"
                    }/company/${slugName}/${cinParam}`,
              description: (
                companyData?.mainDivisionDescription ||
                `Details for ${
                  companyData?.CompanyName || companyData?.company
                }`
              ).substring(0, 5000),
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  companyData?.streetAddress ||
                  companyData?.Registered_Office_Address,
                addressLocality: companyData?.city,
                addressRegion:
                  companyData?.state || companyData?.CompanyStateCode,
                postalCode: companyData?.postalCode,
                addressCountry: "IN",
              },
              email: companyData?.emailAddress,
            }),
          }}
        />
      )}
    </main>
  );
};

export default CompanyClient;
