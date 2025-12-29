"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  LuRefreshCw,
  LuContact,
  LuMail,
  LuLink,
  LuShoppingCart,
  LuUserSearch,
  CircleUserRound,
  LuBriefcase,
  LuLogOut,
  LuExternalLink,
  LuLoader,
} from "react-icons/lu";
import Image from "next/image";
import { API_PREFIX } from "../../../../../lib/api-modifier";

// Helper component for table rows
const DetailRow = ({ label, value, isMasked = false, ctaElement = null }) => {
  const displayValue =
    value !== undefined && value !== null && value !== ""
      ? String(value)
      : "N/A";
  return (
    <tr>
      <td
        className="font-semibold bg-gray-100 p-2 border align-top"
        style={{ width: "30%" }}
      >
        {label}
      </td>
      <td
        className={`p-2 border align-top ${isMasked && displayValue !== "N/A"}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>{displayValue}</span>
          {ctaElement}
        </div>
      </td>
    </tr>
  );
};

// Helper function to generate initials
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

// Helper function to format Director Name
const formatDirectorName = (record) => {
  return `${record?.DirectorFirstName || ""} ${
    record?.DirectorLastName || ""
  }`.trim();
};

// Helper function to format Date
const formatDate = (dateString, includeEndDate = false) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return includeEndDate ? `Ended: ${formattedDate}` : formattedDate;
  } catch (e) {
    console.error(`Error formatting date: ${dateString}`, e);
    return dateString;
  }
};

const maskMobile = (mobile) => {
  if (!mobile || typeof mobile !== "string" || mobile.length < 6) return "N/A";
  return `${mobile.substring(0, 2)}******${mobile.substring(
    mobile.length - 2
  )}`;
};

const maskEmail = (email) => {
  if (!email || typeof email !== "string" || !email.includes("@")) return "N/A";
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  return `${localPart.substring(0, 2)}***${localPart.substring(
    localPart.length - 1
  )}@${domain}`;
};

function slugify(text) {
  if (!text) return "no-name";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Main Component
const DirectorClient = () => {
  const router = useRouter();

  const [directorData, setDirectorData] = useState([]);
  const [otherDirectors, setOtherDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOtherDirectors, setLoadingOtherDirectors] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("associated-companies");

  // API URLs - Ensure these are correct and NEXT_PUBLIC_DIRECTOR_API_URL is set in your .env.local
  const DIRECTOR_API_URL = `${API_PREFIX}/company/getdirector`;
  const COMPANY_API_URL = `${API_PREFIX}/company/getcompany`;

  const params = useParams() || {};
  const din = params?.din ? String(params.din) : null;
  const nameSlug = params?.name ? String(params.name) : null;


  const cleanAddressPart = (part) => {
    if (typeof part === "string" && part.startsWith("'")) {
      return part.substring(1);
    }
    return part;
  };

  useEffect(() => {
    const fetchDirectorData = async () => {
      setLoading(true);
      setError("");
      setDirectorData([]);
      setOtherDirectors([]);

      if (!din) {
        setError("Director DIN not found in URL parameters.");
        setLoading(false);
        return;
      }

      const url = `${DIRECTOR_API_URL}?din=${din}`;
      const searchCriteria = `DIN ${din}`;

      console.log(`Fetching primary director data from: ${url}`);
      try {
        const response = await axios.get(url);

        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setDirectorData(response.data.data);
        } else {
          setError(
            response.data?.message ||
              `Director not found or invalid response format for criteria: ${searchCriteria}.`
          );
          setDirectorData([]);
        }
      } catch (err) {
        console.error("Error fetching primary director data:", err);
        if (err.message === "Network Error") {
          setError(
            "Network Error: Could not connect to the API. Ensure the backend is running."
          );
        } else if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              err.response.data?.message || "Failed to fetch director details."
            }`
          );
        } else {
          setError(
            "An unexpected error occurred while fetching primary director data."
          );
        }
        setDirectorData([]);
      } finally {
        setLoading(false);
      }
    };

    if (din) {
      fetchDirectorData();
    } else {
      setError("Director DIN not found in URL parameters.");
      setLoading(false);
      setDirectorData([]);
    }
  }, [din, DIRECTOR_API_URL]);

  useEffect(() => {
    const fetchOtherDirectors = async () => {
      if (
        loading ||
        !directorData ||
        directorData.length === 0 ||
        !directorData[0]?.DirectorDIN
      ) {
        setOtherDirectors([]);
        setLoadingOtherDirectors(false);
        return;
      }

      setLoadingOtherDirectors(true);
      setOtherDirectors([]);

      const primaryDirectorDIN = String(directorData[0]?.DirectorDIN);
      const appointmentsForPrimaryDirector = directorData.filter(
        (record) => String(record.DirectorDIN) === primaryDirectorDIN
      );

      const uniqueCompanyIds = new Map();
      appointmentsForPrimaryDirector.forEach((record) => {
        if (
          record.cin &&
          String(record.cin).trim() &&
          !uniqueCompanyIds.has(record.cin)
        ) {
          uniqueCompanyIds.set(record.cin, { type: "cin", id: record.cin });
        } else if (
          record.llpin &&
          String(record.llpin).trim() &&
          !uniqueCompanyIds.has(record.llpin)
        ) {
          uniqueCompanyIds.set(record.llpin, {
            type: "llpin",
            id: record.llpin,
          });
        }
      });

      if (uniqueCompanyIds.size === 0) {
        setLoadingOtherDirectors(false);
        return;
      }

      const fetchPromises = Array.from(uniqueCompanyIds.values()).map(
        async ({ type, id }) => {
          const companyUrl = `${COMPANY_API_URL}?${type}=${id}`;
          try {
            const response = await axios.get(companyUrl);
            if (
              response.data?.success &&
              Array.isArray(response.data.directorRecords)
            ) {
              return response.data.directorRecords.map((dir) => ({
                ...dir,
                associatedEntityId: id,
                associatedEntityType: type,
                associatedEntityName:
                  response.data.companyRecord?.company ||
                  response.data.llpRecord?.llpName ||
                  id,
              }));
            }
            return [];
          } catch (err) {
            console.error(
              `Error fetching directors for ${type.toUpperCase()} ${id}:`,
              err.response?.data?.message || err.message
            );
            return [];
          }
        }
      );

      try {
        const results = await Promise.all(fetchPromises);
        const allOtherDirectorsMap = new Map();

        results.flat().forEach((directorRecord) => {
          const currentDirectorDIN = String(directorRecord?.DirectorDIN);
          if (
            directorRecord &&
            currentDirectorDIN &&
            currentDirectorDIN !== "undefined" &&
            currentDirectorDIN !== primaryDirectorDIN
          ) {
            if (!allOtherDirectorsMap.has(currentDirectorDIN)) {
              allOtherDirectorsMap.set(currentDirectorDIN, {
                din: currentDirectorDIN,
                name: formatDirectorName(directorRecord),
                association: directorRecord.associatedEntityName || "N/A",
                designation:
                  directorRecord.DirectorDesignation ||
                  (directorRecord.associatedEntityType === "llp"
                    ? "Designated Partner"
                    : "Director"),
              });
            }
          }
        });

        setOtherDirectors(Array.from(allOtherDirectorsMap.values()));
      } catch (error) {
        console.error(
          "fetchOtherDirectors: Error processing other director data:",
          error
        );
        setOtherDirectors([]);
      } finally {
        setLoadingOtherDirectors(false);
      }
    };

    if (!loading && directorData.length > 0) {
      fetchOtherDirectors();
    } else {
      setOtherDirectors([]);
      setLoadingOtherDirectors(false);
    }
  }, [directorData, loading, COMPANY_API_URL]);

  const {
    primaryDirectorRecord,
    directorFullName,
    initials,
    description,
    displayAddress,
    totalAppointmentsForPrimaryDirector,
    associatedCompanies,
    associatedLLPs,
    pastCompanies,
  } = useMemo(() => {
    if (!directorData || directorData.length === 0) {
      return {
        primaryDirectorRecord: null,
        directorFullName: "Director Details",
        initials: "",
        description: "",
        displayAddress: "N/A",
        totalAppointmentsForPrimaryDirector: 0,
        associatedCompanies: [],
        associatedLLPs: [],
        pastCompanies: [],
      };
    }

    const primaryRecord = directorData[0];
    const primaryDIN = primaryRecord?.DirectorDIN;

    if (!primaryDIN) {
      return {
        primaryDirectorRecord: primaryRecord,
        directorFullName: formatDirectorName(primaryRecord),
        initials: getInitials(formatDirectorName(primaryRecord)),
        description: "Director details incomplete (Missing DIN).",
        displayAddress: "N/A",
        totalAppointmentsForPrimaryDirector: 0,
        associatedCompanies: [],
        associatedLLPs: [],
        pastCompanies: [],
      };
    }

    const fullName = formatDirectorName(primaryRecord);
    const desc = `Details for director ${fullName} (DIN: ${primaryDIN}).
    ${fullName} is currently associated with various companies/LLPs. They are registered
    with the Ministry of Corporate Affairs (MCA) of India and hold a DIN of ${primaryDIN}.
    `; // Slightly more generic description
    const address =
      [
        cleanAddressPart(primaryRecord.DirectorPermanentAddressLine1),
        primaryRecord.DirectorPermanentAddressLine2,
        primaryRecord.DirectorPermanentCity,
      ]
        .filter(Boolean)
        .join(", ") || "N/A"; // Changed to comma separation

    const appointmentsForPrimaryDirector = directorData.filter(
      (record) => String(record.DirectorDIN) === String(primaryDIN)
    );

    const currentAppointments = appointmentsForPrimaryDirector.filter(
      (record) => !record.DirectorResignationDate
    );
    const pastAppointments = appointmentsForPrimaryDirector.filter(
      (record) => !!record.DirectorResignationDate
    );

    const currentCompanies = currentAppointments.filter(
      (record) => record.companyType === "Company" // Assuming your API provides companyType
    );
    const currentLLPs = currentAppointments.filter(
      (record) => record.companyType === "LLP" // Assuming your API provides companyType
    );

    return {
      primaryDirectorRecord: primaryRecord,
      directorFullName: fullName,
      initials: getInitials(fullName),
      description: desc,
      displayAddress: address,
      totalAppointmentsForPrimaryDirector:
        appointmentsForPrimaryDirector.length,
      associatedCompanies: currentCompanies,
      associatedLLPs: currentLLPs,
      pastCompanies: pastAppointments,
    };
  }, [directorData]);

  const directorContactSearch = () => {
    const directorDIN = primaryDirectorRecord?.DirectorDIN;
    if (directorDIN) {
      router.push(`/unlock-contact?din=${directorDIN}`);
    } else {
      alert("Director DIN not available to unlock contact.");
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    if (platform === "Copy Link") {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(url)
          .then(() => alert("Link copied to clipboard!"))
          .catch((err) => console.error("Failed to copy link: ", err));
      } else {
        alert("Clipboard API not available in this browser.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto text-center mt-10 p-4 flex justify-center items-center min-h-screen">
        <LuLoader className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto text-center mt-10 p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Link
          href="/"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Search
        </Link>
      </div>
    );
  }
  if (!primaryDirectorRecord && !loading) {
    // Check if primary record is null after loading
    return (
      <div className="container mx-auto text-center mt-10 p-4">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline">
            {" "}
            Director details could not be loaded for DIN: {din}.
          </span>
        </div>
        <Link
          href="/"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="main bg-gray-50 pb-10">
        {/* Header Section */}
        <section className="bg-[#0D2483]">
          <div className="relative overflow-hidden pb-6 pt-20 md:pt-20">
            <div className="container mx-auto px-4 flex flex-col items-center relative w-full text-white">
              <div className="text-center">
                <h1 className="mt-8 text-2xl font-semibold md:text-3xl lg:text-4xl">
                  {directorFullName}
                </h1>
                <h4 className="mt-3 text-base md:mt-4 mb-5 md:text-lg">
                  DIN: {primaryDirectorRecord?.DirectorDIN || "N/A"}
                </h4>
              </div>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"></div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="container mx-auto px-4 mt-6 md:mt-8">
          <div className="flex flex-col-reverse justify-between gap-4 md:flex-row md:items-center mb-4">
            <h2 className="text-lg font-semibold md:text-xl text-gray-800 ml-2">
              Overview
            </h2>
            <div className="flex items-center justify-center">
              <button
                onClick={() => handleShare("Copy Link")}
                className="p-1.5 cursor-pointer text-gray-600 hover:text-indigo-600 border rounded-full hover:bg-gray-100 transition-colors"
                title="Copy Link"
              >
                <LuLink className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row bg-white p-4 rounded-lg shadow">
            <div className="gap-6 md:flex lg:w-1/3">
              <div className="border bg-white text-gray-800 shadow-sm min-w-56 rounded-md flex-shrink-0">
                <div className="flex h-full flex-col items-center justify-center p-2 text-center text-sm">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-600 md:h-24 md:w-24 md:text-3xl">
                    {initials}
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">
                    {directorFullName}
                  </h4>
                  <p className="mt-1 font-medium text-gray-500">Director</p>
                  <p className="mt-1 font-medium text-gray-500">
                    DIN: {primaryDirectorRecord?.DirectorDIN}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-3.5 mt-4">
              <div className="md:block lg:block">
                <div className="w-full">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {description}
                  </p>
                </div>
              </div>
              <div className="border bg-white text-gray-800 shadow-sm mt-4 p-2 rounded-md mb-10">
                <div className="flex flex-col justify-between md:flex-row">
                  <div className="w-40 ml-8 text-center md:py-4">
                    <h4 className="text-sm font-semibold text-gray-500">
                      Total Appointments
                    </h4>
                    <p className="text-lg font-bold text-gray-900">
                      {totalAppointmentsForPrimaryDirector}
                    </p>
                  </div>
                  <div className="w-full text-center md:py-4 ">
                    <h4 className="text-sm font-semibold text-gray-500">
                      Address
                    </h4>
                    <address
                      className="not-italic text-sm text-gray-900 truncate"
                      title={displayAddress}
                    >
                      {displayAddress}
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information Table */}
        <section className="container mx-auto px-5 mt-6 md:mt-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold md:text-xl text-gray-800 mb-4 border-b pb-2">
              {`Director's Detailed Information`}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <tbody>
                  <DetailRow
                    label="DIN Number"
                    value={primaryDirectorRecord?.DirectorDIN}
                  />
                  <DetailRow label="Full Name" value={directorFullName} />
                  <DetailRow
                    label="Email Address"
                    value={maskEmail(
                      primaryDirectorRecord?.DirectorEmailAddress
                    )}
                    isMasked={true}
                    ctaElement={
                      primaryDirectorRecord?.DirectorDIN ? (
                        <Link
                          href={`/unlock-contact?din=${primaryDirectorRecord.DirectorDIN}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-7 px-3 py-1 flex-shrink-0"
                        >
                          <LuShoppingCart size={14} className="mr-1" />
                          Get Contact Details
                        </Link>
                      ) : null
                    }
                  />
                  <DetailRow
                    label="Mobile Number"
                    value={maskMobile(
                      primaryDirectorRecord?.DirectorMobileNumber
                    )}
                    isMasked={true}
                    ctaElement={
                      primaryDirectorRecord?.DirectorDIN ? (
                        <Link
                          href={`/unlock-contact?din=${primaryDirectorRecord.DirectorDIN}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-7 px-3 py-1 flex-shrink-0"
                        >
                          <LuShoppingCart size={14} className="mr-1" />
                          Get Contact Details
                        </Link>
                      ) : null
                    }
                  />
                  <tr>
                    <td
                      className="font-semibold bg-gray-100 p-2 border align-top"
                      style={{ width: "30%" }}
                    >
                      Permanent Address
                    </td>
                    <td className="p-2 border align-top">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-grow space-y-2">
                          <p>
                            <span className="font-medium text-gray-600">
                              Permanent Address Line 1:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPermanentAddressLine1 ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Permanent Address Line 2:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPermanentAddressLine2 ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Permanent City:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPermanentCity ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Permanent State:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPermanentState ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Permanent Pincode:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPermanentPincode ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Permanent Country:
                            </span>{" "}
                            {primaryDirectorRecord?.companyOrigin || "India"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-xs xl:max-w-sm">
                          <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-teal-50 to-cyan-100 p-3 gap-3 rounded-md border border-cyan-200">
                            <div className="flex-shrink-0 md:w-20 md:h-35 flex justify-center items-center">
                              <Image
                                src="https://www.setindiabiz.com/assets/company-name-search/address-change-illustration.webp"
                                alt="Address Change Illustration"
                                width={100}
                                height={300}
                              />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                                Update Address?
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                Visit our partner site to update address.
                              </p>
                              <Link
                                href="https://www.setindiabiz.com/company-registered-office-change"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-cyan-600 text-white hover:bg-cyan-700 h-8 px-3 py-1"
                              >
                                Update Details
                                <LuExternalLink size={14} className="ml-1.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-semibold bg-gray-100 p-2 border align-top"
                      style={{ width: "30%" }}
                    >
                      Present Address
                    </td>
                    <td className="p-2 border align-top">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-grow space-y-2">
                          <p>
                            <span className="font-medium text-gray-600">
                              Present Address Line 1:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPresentAddressLine1 ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Present Address Line 2:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPresentAddressLine2 ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Present City:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPresentCity ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Present State:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPresentState ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Present Pincode:
                            </span>{" "}
                            {primaryDirectorRecord?.DirectorPresentPincode ||
                              "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">
                              Present Country:
                            </span>{" "}
                            {primaryDirectorRecord?.companyOrigin || "India"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-xs xl:max-w-sm">
                          <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-teal-50 to-cyan-100 p-3 gap-3 rounded-md border border-cyan-200">
                            <div className="flex-shrink-0 md:w-20 md:h-35 flex justify-center items-center">
                              <Image
                                src="https://www.setindiabiz.com/assets/company-name-search/address-change-illustration.webp"
                                alt="Address Change Illustration"
                                width={100}
                                height={300}
                              />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                                Update Address?
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                Visit our partner site to update address.
                              </p>
                              <Link
                                href="https://www.setindiabiz.com/company-registered-office-change"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-cyan-600 text-white hover:bg-cyan-700 h-8 px-3 py-1"
                              >
                                Update Details
                                <LuExternalLink size={14} className="ml-1.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Unlock Contact Banner */}
        <section className="container mx-auto px-4 mt-6 md:mt-8">
          <div className="flex flex-col ml-2 items-center justify-between gap-6 bg-gradient-to-r from-blue-500 to-purple-600 p-6 shadow-lg md:flex-row rounded-md">
            <div className="flex items-center space-x-4 text-white">
              <LuContact className="flex-shrink-0 text-4xl md:text-4xl" />
              <div>
                <h5 className="text-lg font-semibold leading-tight">
                  {`Unlock Directors' Contact Information`}
                </h5>
                <p className="mt-1 text-sm md:text-base">
                  Gain instant access to verified contact details (if
                  available).
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="justify-center whitespace-nowrap cursor-pointer text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-0 overflow-hidden after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%] h-10 flex flex-shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-blue-600 transition-all duration-200 hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                onClick={directorContactSearch}
                disabled={!primaryDirectorRecord?.DirectorDIN}
              >
                <LuShoppingCart />
                Get Contact Details
              </button>
            </div>
          </div>
        </section>

        {/* Associations Section (Tabs) */}
        <section className="container px-4 mt-8 md:mt-10 mx-auto">
          <h2 className="w-full text-base font-semibold md:text-lg lg:w-10/12 mb-3">
            {`${directorFullName}'s Profile and Shareholding Details`}
          </h2>

          <div dir="ltr" data-orientation="horizontal" className="w-full">
            <div
              dir="ltr"
              className="relative overflow-x-auto h-12 border-b border-gray-200"
            >
              <div
                data-radix-scroll-area-viewport=""
                className="h-full w-full rounded-[inherit] pb-2"
              >
                <div style={{ minWidth: "100%", display: "table" }}>
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="inline-flex h-10 items-center justify-start rounded-none p-0 text-muted-foreground gap-1 md:gap-3 bg-transparent"
                    tabIndex={0}
                    data-orientation="horizontal"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "associated-companies"}
                      data-state={
                        activeTab === "associated-companies"
                          ? "active"
                          : "inactive"
                      }
                      onClick={() => setActiveTab("associated-companies")}
                      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-t-md px-3 py-2 border-b-2 ${
                        activeTab === "associated-companies"
                          ? "border-sky-500 text-sky-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      tabIndex={-1}
                    >
                      Associated Companies
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          activeTab === "associated-companies"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {associatedCompanies.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "associated-llps"}
                      data-state={
                        activeTab === "associated-llps" ? "active" : "inactive"
                      }
                      onClick={() => setActiveTab("associated-llps")}
                      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-t-md px-3 py-2 border-b-2 ${
                        activeTab === "associated-llps"
                          ? "border-sky-500 text-sky-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      tabIndex={-1}
                    >
                      Associated LLPs
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          activeTab === "associated-llps"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {associatedLLPs.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "past-companies"}
                      data-state={
                        activeTab === "past-companies" ? "active" : "inactive"
                      }
                      onClick={() => setActiveTab("past-companies")}
                      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-t-md px-3 py-2 border-b-2 ${
                        activeTab === "past-companies"
                          ? "border-sky-500 text-sky-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      tabIndex={-1}
                    >
                      Past Appointments
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          activeTab === "past-companies"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {pastCompanies.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "shareholding"}
                      data-state={
                        activeTab === "shareholding" ? "active" : "inactive"
                      }
                      onClick={() => setActiveTab("shareholding")}
                      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-t-md px-3 py-2 border-b-2 ${
                        activeTab === "shareholding"
                          ? "border-sky-500 text-sky-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      tabIndex={-1}
                    >
                      Shareholding
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === "remuneration"}
                      data-state={
                        activeTab === "remuneration" ? "active" : "inactive"
                      }
                      onClick={() => setActiveTab("remuneration")}
                      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-t-md px-3 py-2 border-b-2 ${
                        activeTab === "remuneration"
                          ? "border-sky-500 text-sky-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      tabIndex={-1}
                    >
                      Remuneration
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div
                hidden={activeTab !== "associated-companies"}
                role="tabpanel"
                aria-labelledby="tab-trigger-associated-companies"
                className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="border border-gray-200 bg-white shadow-sm overflow-hidden rounded-md">
                  <div className="relative w-full overflow-x-auto">
                    <table className="w-full caption-bottom text-xs md:text-sm">
                      <thead className="[&_tr]:border-b border-gray-200 bg-gray-50">
                        <tr className="transition-colors">
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black hidden md:table-cell">
                            CIN/FCRN
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black">
                            Company Name
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black">
                            Designation
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black whitespace-nowrap">
                            Date of Appointment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0 divide-y divide-gray-100">
                        {associatedCompanies.length === 0 ? (
                          <tr>
                            <td
                              className="p-4 text-center text-gray-500"
                              colSpan={4}
                            >
                              No current associated companies found.
                            </td>
                          </tr>
                        ) : (
                          associatedCompanies.map((record, index) => (
                            <tr
                              key={`${record.cin}-${index}`}
                              className="transition-colors hover:bg-gray-50/50"
                            >
                              <td className="p-4 align-middle hidden md:table-cell text-black">
                                {record.cin || "N/A"}
                              </td>
                              <td className="p-4 align-middle font-medium text-black">
                                {record.cin ? (
                                  <Link
                                    href={`/company/${slugify(
                                      record.company // Assuming 'company' holds the company name
                                    )}/${record.cin}`}
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {record.company || "N/A"}
                                  </Link>
                                ) : (
                                  record.company || "N/A"
                                )}
                              </td>
                              <td className="p-4 align-middle text-gray-700">
                                {record.DirectorDesignation || "Director"}
                              </td>
                              <td className="p-4 align-middle text-gray-700 whitespace-nowrap">
                                {formatDate(
                                  record.DirectorAppointmentDate ||
                                    record.dateOfIncorporation
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                hidden={activeTab !== "associated-llps"}
                role="tabpanel"
                aria-labelledby="tab-trigger-associated-llps"
                className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="border border-gray-200 bg-white shadow-sm overflow-hidden rounded-md">
                  <div className="relative w-full overflow-x-auto">
                    <table className="w-full caption-bottom text-xs md:text-sm">
                      <thead className="[&_tr]:border-b border-gray-200 bg-gray-50">
                        <tr className="transition-colors">
                          <th className="h-12 px-4 text-left align-middle font-semibold text-gray-600 hidden md:table-cell">
                            LLPIN
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-gray-600">
                            LLP Name
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-gray-600">
                            Designation
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-gray-600 whitespace-nowrap">
                            Date of Appointment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0 divide-y divide-gray-100">
                        {associatedLLPs.length === 0 ? (
                          <tr>
                            <td
                              className="p-4 text-center text-gray-500"
                              colSpan={4}
                            >
                              No current associated LLPs found.
                            </td>
                          </tr>
                        ) : (
                          associatedLLPs.map((record, index) => (
                            <tr
                              key={`${record.llpin}-${index}`} // Use llpin if available
                              className="transition-colors hover:bg-gray-50/50"
                            >
                              <td className="p-4 align-middle hidden md:table-cell font-mono text-gray-700">
                                {record.llpin || record.cin || "N/A"}{" "}
                                {/* Fallback to cin if llpin missing */}
                              </td>
                              <td className="p-4 align-middle font-medium text-gray-900">
                                {record.llpin ? (
                                  <Link
                                    href={`/llp/${slugify(record.company)}/${
                                      record.llpin
                                    }`} // Assuming 'company' holds LLP name
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {record.company || "N/A"}
                                  </Link>
                                ) : (
                                  record.company || "N/A"
                                )}
                              </td>
                              <td className="p-4 align-middle text-gray-700">
                                {record.DirectorDesignation ||
                                  "Designated Partner"}
                              </td>
                              <td className="p-4 align-middle text-gray-700 whitespace-nowrap">
                                {formatDate(
                                  record.DirectorAppointmentDate ||
                                    record.dateOfIncorporation
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                hidden={activeTab !== "past-companies"}
                role="tabpanel"
                aria-labelledby="tab-trigger-past-companies"
                className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="border border-gray-200 bg-white shadow-sm overflow-hidden rounded-md">
                  <div className="relative w-full overflow-x-auto">
                    <table className="w-full caption-bottom text-xs md:text-sm">
                      <thead className="[&_tr]:border-b border-gray-200 bg-gray-50">
                        <tr className="transition-colors">
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black hidden md:table-cell">
                            CIN/LLPIN
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black">
                            Company/LLP Name
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black">
                            Designation
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black whitespace-nowrap">
                            Date of Appointment
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-semibold text-black whitespace-nowrap">
                            Date of Cessation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0 divide-y divide-gray-100">
                        {pastCompanies.length === 0 ? (
                          <tr>
                            <td
                              className="p-4 text-center text-gray-500"
                              colSpan={5}
                            >
                              No past appointments found.
                            </td>
                          </tr>
                        ) : (
                          pastCompanies.map((record, index) => (
                            <tr
                              key={`${record.cin || record.llpin}-${index}`}
                              className="transition-colors hover:bg-gray-50/50"
                            >
                              <td className="p-4 align-middle hidden md:table-cell text-black">
                                {record.cin || record.llpin || "N/A"}
                              </td>
                              <td className="p-4 align-middle font-medium text-black">
                                {record.cin ? (
                                  <Link
                                    href={`/company/${slugify(
                                      record.company
                                    )}/${record.cin}`}
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {record.company || "N/A"}
                                  </Link>
                                ) : record.llpin ? (
                                  <Link
                                    href={`/llp/${slugify(record.company)}/${
                                      record.llpin
                                    }`}
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {record.company || "N/A"}
                                  </Link>
                                ) : (
                                  record.company || "N/A"
                                )}
                              </td>
                              <td className="p-4 align-middle text-black">
                                {record.DirectorDesignation ||
                                  (record.companyType === "LLP"
                                    ? "Designated Partner"
                                    : "Director")}
                              </td>
                              <td className="p-4 align-middle text-black whitespace-nowrap">
                                {formatDate(record.DirectorAppointmentDate)}
                              </td>
                              <td className="p-4 align-middle text-black whitespace-nowrap">
                                {formatDate(record.DirectorResignationDate)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                hidden={activeTab !== "shareholding"}
                role="tabpanel"
                aria-labelledby="tab-trigger-shareholding"
                className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="p-4 border border-gray-200 rounded-md bg-white shadow-sm text-gray-600">
                  Shareholding data is typically sourced from annual returns or
                  shareholding pattern filings, which may require separate data
                  integration. This information is not directly available from
                  the current director/company records structure.
                </div>
              </div>

              <div
                hidden={activeTab !== "remuneration"}
                role="tabpanel"
                aria-labelledby="tab-trigger-remuneration"
                className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="p-4 border border-gray-200 rounded-md bg-white shadow-sm text-gray-600">
                  Director remuneration details are usually found in company
                  financial statements or annual reports and are not part of the
                  basic director/company registration data shown here.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Associated Directors Section */}
        <section className="container mx-auto px-4 mt-8 md:mt-10">
          <h4 className="px-1 text-start text-lg font-semibold sm:text-center md:text-xl xl:text-start">
            Other Associated Directors
          </h4>
          <p className="px-1 text-sm text-gray-600 sm:text-center xl:text-start mt-1">
            Directors associated with the same companies/LLPs as{" "}
            {directorFullName}.
          </p>
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5 md:pt-8 lg:grid-cols-4">
            {loadingOtherDirectors ? (
              <div className="col-span-full text-center p-4 text-gray-500">
                <LuLoader className="animate-spin text-blue-500 text-2xl inline-block" />{" "}
                Loading other directors...
              </div>
            ) : otherDirectors.length > 0 ? (
              otherDirectors.map((director) => (
                <div
                  key={director.din}
                  className="border bg-white rounded-md shadow hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  <Link
                    className="flex items-start gap-3 p-4 text-sm"
                    href={`/director/${slugify(director.name)}/${director.din}`}
                    title={`View details for ${director.name} (DIN: ${director.din})`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                      {getInitials(director.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="truncate font-semibold text-gray-800 hover:text-blue-600">
                        {director.name || "N/A"}
                      </h6>
                      <p className="text-xs text-gray-500">
                        DIN: {director.din}
                      </p>
                      <p
                        className="mt-1 text-xs text-gray-500 truncate"
                        title={`${director.designation} at ${director.association}`}
                      >
                        {director.designation} at {director.association}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              !loading &&
              !loadingOtherDirectors && (
                <div className="col-span-full text-center p-4 text-gray-500 bg-gray-50 rounded-md border">
                  No other associated directors found for the companies linked
                  to {directorFullName}.
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default DirectorClient;
