"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Keep router if you add sign-out back
import { useAuth } from "../../../context/AuthContext";
// import { signOut } from 'firebase/auth'; // Import if sign-out button is added
// import { auth } from 'lib/firebase'; // Import if sign-out button is added
import axios from "axios";
import {
  IndianRupee,
  Clock,
  User,
  Hash,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
} from "lucide-react"; // Added LogOut for potential sign-out button
import { API_PREFIX } from "../../../lib/api-modifier";
import Script from "next/script";

// --- Fetch Payment History Function (Uses actual API call) ---
const fetchPaymentHistory = async (userId) => {
  console.log(`Fetching payment history for user: ${userId}`);
  // TODO: Consider using environment variables for API base URL

  const apiUrl = `${API_PREFIX}/payment/history?userId=${userId}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success) {
      console.log("API Response Success:", response.data.history);
      // Ensure data is an array before returning
      return Array.isArray(response.data.history) ? response.data.history : [];
    } else {
      // Handle cases where API returns success: false or unexpected structure
      throw new Error(
        response.data.message || "Failed to fetch payment history from API."
      );
    }
  } catch (error) {
    console.error(
      "API Error fetching payment history:",
      error.response?.data || error.message
    );
    // Rethrow a user-friendly message or the specific error message
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Could not connect to fetch payment history."
    );
  }
};
// --- End Fetch Function ---

// --- Main Page Component ---
const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for payment history
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  // --- Memoized Callbacks ---
  // Memoize formatDate to avoid redefining it on every render
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      // Using 'en-GB' for dd/mm/yyyy format which is common in India
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata", // Explicitly set timezone if needed
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  }, []); // Empty dependency array means it's created once

  // Effect to redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("User not logged in, redirecting to sign-in...");
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  // Effect to fetch payment history when user is available
  useEffect(() => {
    if (user) {
      setHistoryLoading(true);
      setHistoryError(null);
      // --- IMPORTANT ---
      // Ensure the backend API (/api/payment/history) is optimized and uses pagination.
      // This frontend code assumes it receives the *entire* history for now.
      fetchPaymentHistory(user.uid)
        .then((data) => {
          // Sort data by date descending (most recent first)
          const sortedData = [...data].sort(
            (a, b) =>
              new Date(b.paymentDate || b.createdAt) -
              new Date(a.paymentDate || a.createdAt)
          ); // Use paymentDate or createdAt
          setPaymentHistory(sortedData);
        })
        .catch((error) => {
          console.error("Error fetching payment history:", error);
          setHistoryError(error.message || "Failed to load payment history.");
        })
        .finally(() => {
          setHistoryLoading(false);
        });
    } else {
      // If there's no user, don't attempt to load history
      setHistoryLoading(false);
      setPaymentHistory([]);
    }
  }, [user]); // Dependency: only run when user object changes (or its uid)

  // --- Sign out handler (Optional - uncomment if needed) ---
  // const handleSignOut = useCallback(async () => {
  //     try {
  //         await signOut(auth);
  //         console.log('User signed out successfully');
  //         router.push('/sign-in');
  //     } catch (error) {
  //         console.error('Error signing out:', error);
  //         // Use a more user-friendly notification system if available
  //         alert('Failed to sign out. Please try again.');
  //     }
  // }, [router]);

  // Initial Auth Loading State
  if (authLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-gray-50" // Added subtle background
        role="status"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />{" "}
        {/* Use primary color */}
        <p className="text-lg text-muted-foreground">
          Loading your dashboard...
        </p>{" "}
        {/* Use theme colors */}
      </div>
    );
  }

  // If auth is done, but no user (should be brief before redirect)
  if (!user) {
    // Render null or a minimal loading/redirecting message
    // return (
    //     <div className="flex justify-center items-center min-h-screen bg-gray-50" role="status">
    //         <p className="text-lg text-muted-foreground">Redirecting...</p>
    //     </div>
    // );
    return null;
  }

  // --- JSON-LD Schema (safe to use here) ---
  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Dashboard - SetIndiaBiz",
    url: typeof window !== "undefined" ? window.location.href : "",
    description:
      "User dashboard showing account overview and payment history (contact unlocks).",
    author: {
      "@type": "Person",
      name: user.displayName || user.email || "User",
      identifier: user.uid,
    },
    mainEntity: (paymentHistory || []).map((p) => ({
      "@type": "PaymentAction",
      name: "Contact Unlock",
      recipient: {
        "@type": "Person",
        name: p.directorName || "Unknown Director",
      },
      startTime: p.paymentDate || p.createdAt || undefined,
      actionStatus:
        p.status === "captured" || p.status === "paid"
          ? "https://schema.org/CompletedActionStatus"
          : "https://schema.org/FailedActionStatus",
    })),
  };

  // --- Render Dashboard ---
  return (
    <>
      <Script
        type="application/ld+json"
        id="dashboard-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dashboardSchema) }}
      />
      <div className="container-fluid px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-80px)] md:mt-14">
        {/* Main content card */}
        <div className="bg-card text-card-foreground shadow-lg rounded-xl p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 mt-16 sm:mt-0">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          </div>

          {/* Welcome Message */}
          <div className="mb-8 p-4 bg-background rounded-lg border border-border">
            <p className="text-lg text-foreground">
              Welcome back,{" "}
              <span className="font-semibold text-primary">
                {user.displayName || user.email || "User"}!
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              User ID:{" "}
              <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                {user.uid}
              </span>
            </p>
          </div>

          {/* Payment History Section */}
          <div className="mt-6 border-t border-border pt-6">
            <h2 className="text-2xl font-semibold text-foreground mb-5">
              Payment History (Contact Unlocks)
            </h2>

            {/* History Loading State */}
            {historyLoading && (
              <div
                className="text-center py-10 flex flex-col justify-center items-center bg-background rounded-lg border border-dashed border-border"
                role="status"
              >
                <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
                <p className="text-muted-foreground">
                  Loading payment history...
                </p>
              </div>
            )}

            {/* History Error State */}
            {historyError && !historyLoading && (
              <div
                role="alert"
                className="text-center py-6 text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/30"
              >
                <div className="flex justify-center items-center mb-2">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Error Loading History</span>
                </div>
                <p className="text-sm">{historyError}</p>
              </div>
            )}

            {/* History Display Table */}
            {!historyLoading &&
              !historyError &&
              (paymentHistory.length > 0 ? (
                <div className="overflow-x-auto shadow-sm border border-border rounded-lg">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th
                          scope="col"
                          className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Director Unlocked
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Payment ID
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {paymentHistory.map((payment) => (
                        <tr
                          key={payment._id || payment.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                              {formatDate(
                                payment.paymentDate || payment.createdAt
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                            <div className="flex items-center">
                              <IndianRupee className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
                              {/* Assuming amount is in paise */}
                              {(payment.amount / 100).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-foreground">
                                  {payment.directorName || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  DIN: {payment.dinUnlocked || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                            <div
                              className="flex items-center"
                              title={payment.razorpay_payment_id}
                            >
                              <Hash className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                              {/* Displaying only part of the ID for brevity */}
                              {payment.razorpay_payment_id?.substring(4) ||
                                "N/A"}
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm">
                            {/* Using theme colors for status badges */}
                            {payment.status === "captured" ||
                            payment.status === "paid" ? (
                              <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-500 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                Successful
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-500 text-white">
                                <AlertCircle className="w-3 h-3 mr-1" />{" "}
                                {payment.status
                                  ? payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)
                                  : "Failed"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-border rounded-lg bg-background">
                  <p className="text-muted-foreground">
                    You have no payment history for contact unlocks yet.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
