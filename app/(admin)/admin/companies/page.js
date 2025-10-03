"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Trash2Icon } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import { API_PREFIX } from "../../../../lib/api-modifier";

const ALLOWED_ADMIN_EMAILS = ["admin@gmail.com"];

export default function AdminCompanySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("cin");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showingDetailsForCIN, setShowingDetailsForCIN] = useState(null);

  // State for CSV Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const fileInputRef = useRef(null); // Ref for resetting file input

  // --- State for Embedded Login ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // --- Firebase Authentication Check ---
  const [user, loadingAuth, errorAuth] = useAuthState(auth); // Use the imported auth instance
  // No separate isAdmin check needed per latest request

  function debounce(func, delay) {
    let timer;

    const debouncedFn = (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };

    // Add cancel method
    debouncedFn.cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    return debouncedFn;
  }

  // --- Embedded Login Handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      // *** Add check for allowed admin email ***
      if (
        userCredential.user &&
        ALLOWED_ADMIN_EMAILS.includes(userCredential.user.email)
      ) {
        // Login successful AND user is an allowed admin
        // useAuthState will update, and the component will re-render showing the dashboard.
        setLoginEmail("");
        setLoginPassword("");
      } else {
        // Login successful BUT user is NOT an allowed admin
        await auth.signOut(); // Immediately sign out the unauthorized user
        throw new Error("Access Denied: Not an authorized administrator.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      let message = "Login failed. Please check your credentials.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        message = "Invalid email or password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (
        error.message === "Access Denied: Not an authorized administrator."
      ) {
        message = error.message;
      }
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  // --- Core Search Logic ---
  const performSearch = useCallback(
    async (term, type, cinOverride = null) => {
      // Ensure user object is available before proceeding

      const currentSearchTerm = cinOverride || term;
      const currentSearchType = cinOverride ? "cin" : type;
      console.log(
        `Performing search: term='${currentSearchTerm}', type='${currentSearchType}', cinOverride='${cinOverride}'`
      ); // Log search trigger

      // Basic validation
      if (!currentSearchTerm) {
        if (!cinOverride) {
          setResults([]);
          setError(null);
          setShowingDetailsForCIN(null);
        }
        setLoading(false);
        return;
      }

      // --- CIN Specific Length Check ---
      const CIN_LENGTH = 21;
      if (
        currentSearchType === "cin" &&
        !cinOverride &&
        currentSearchTerm.length !== CIN_LENGTH
      ) {
        setError(`Please enter a full ${CIN_LENGTH}-character CIN.`);
        setResults([]); // Clear results if CIN length is wrong
        setLoading(false);
        setShowingDetailsForCIN(null);
        return; // Don't proceed with search
      }
      // --- End CIN Check ---

      // --- Name Specific Length Check ---
      const MIN_NAME_LENGTH = 3;
      if (
        currentSearchType === "name" &&
        !cinOverride &&
        currentSearchTerm.length < MIN_NAME_LENGTH
      ) {
        // Don't set error here, debounce handles clearing results
        setResults([]); // Clear results if name length is too short
        setLoading(false);
        setShowingDetailsForCIN(null);
        return; // Don't proceed with search
      }
      // --- End Name Check ---

      setLoading(true);
      setError(null); // Clear previous errors before new search
      if (!cinOverride) setShowingDetailsForCIN(null); // Reset detail view on new search

      try {
        // Assuming your getcompany API exists and works as intended
        const apiUrl =
          currentSearchType === "cin"
            ? `${API_PREFIX}/company/getcompany?cin=${encodeURIComponent(
                currentSearchTerm
              )}`
            : `${API_PREFIX}/company/getcompany?name=${encodeURIComponent(
                currentSearchTerm
              )}`;

        // Add Authorization Header with Firebase ID Token
        const response = await fetch(apiUrl);

        let data;
        try {
          // Check for unauthorized/forbidden responses before trying to parse JSON
          if (!response.ok) {
            let errorText = `API request failed with status ${response.status}`;
            try {
              const errorData = await response.json();
              errorText = errorData.message || errorText;
            } catch (e) {
              // If response is not JSON, use status text
              errorText = response.statusText || errorText;
            }
            throw new Error(errorText);
          }
          data = await response.json();
        } catch (parseError) {
          // Handle cases where response.ok is true but body is not valid JSON
          console.error("Could not parse response JSON:", parseError);
          throw new Error("Received an invalid response from the server.");
        }

        let foundResults = [];
        let apiSuccess = data.success;

        if (apiSuccess) {
          // Adjust based on the actual structure of your getcompany API response
          if (
            currentSearchType === "cin" &&
            data.directorRecords &&
            Array.isArray(data.directorRecords)
          ) {
            foundResults = data.directorRecords;
            if (cinOverride) setShowingDetailsForCIN(cinOverride); // Mark that we are showing details
          } else if (
            currentSearchType === "name" &&
            data.data &&
            Array.isArray(data.data)
          ) {
            foundResults = data.data;
          } else if (data.data && !Array.isArray(data.data)) {
            // Handle single object response for CIN?
            foundResults = [data.data];
            if (cinOverride) setShowingDetailsForCIN(cinOverride);
          } else {
            // Success true, but unexpected data structure
            console.warn("API success but unexpected data structure:", data);
          }
        }

        // Set results or error based on what was found
        if (foundResults.length > 0) {
          setResults(foundResults);
        } else {
          setResults([]);
          // Only set error if the API call itself didn't fail but returned no results
          if (response.ok && apiSuccess) {
            setError(data.message || "No company found matching the criteria.");
          } else if (response.ok && !apiSuccess) {
            // API responded OK but operation failed (e.g., success: false)
            setError(data.message || "Search failed or returned invalid data.");
          }
          // If !response.ok, error was already thrown above
        }
      } catch (err) {
        console.error("Search Error:", err);
        setError(err.message); // Display the error caught
        setResults([]); // Clear results on error
      } finally {
        setLoading(false);
      }
    },
    [user]
  ); // Add user dependency

  // --- Debounced Search Function (Only for Name) ---
  const debouncedNameSearchRef = useRef(
    debounce((term) => {
      console.log(`Debounced function executing with term: ${term}`);
      const MIN_NAME_LENGTH = 3;
      if (term && term.length >= MIN_NAME_LENGTH) {
        performSearch(term, "name");
      } else if (term.length === 0) {
        setResults([]);
        setError(null);
        setShowingDetailsForCIN(null);
      } else {
        setResults([]);
      }
    }, 500)
  );

  // --- useEffect to trigger search on searchTerm/searchType changes ---
  useEffect(() => {
    // Only run search logic if user is logged in
    if (!user) return;

    if (searchType === "name") {
      console.log(
        `useEffect triggered for name search with term: ${searchTerm}`
      );
      debouncedNameSearchRef.current(searchTerm);
    } else {
      console.log(`useEffect triggered for CIN search, cancelling debounce`);
      debouncedNameSearchRef.current.cancel();
      const CIN_LENGTH = 21;
      if (searchTerm.length > 0 && searchTerm.length !== CIN_LENGTH) {
        setResults([]);
        setError(`Enter a full ${CIN_LENGTH}-character CIN and click Search.`);
        setShowingDetailsForCIN(null);
      } else if (searchTerm.length === 0) {
        setResults([]);
        setError(null);
        setShowingDetailsForCIN(null);
      } else if (searchTerm.length === CIN_LENGTH) {
        setError(null); // Clear error if CIN length becomes valid
      }
    }
    // Cleanup function to cancel debounce on unmount or dependency change
    return () => {
      debouncedNameSearchRef.current.cancel();
    };
  }, [searchTerm, searchType, user, performSearch]); // Add user and performSearch dependencies

  // --- handleViewDetails (fetches immediately) ---
  const handleViewDetails = (cinToFetch) => {
    if (!cinToFetch || loading || !user) return; // Check auth
    console.log(`Fetching details for CIN: ${cinToFetch}`);
    debouncedNameSearchRef.current.cancel();
    setSearchTerm(cinToFetch); // Optionally update the search bar
    setSearchType("cin"); // Ensure type is CIN
    performSearch(null, null, cinToFetch); // Call directly, overriding term/type
  };

  // --- handleEdit (Navigate to edit page) ---
  const handleEdit = (recordId) => {
    // Ensure your edit route and logic exist
    if (recordId) {
      router.push(`/admin/companies/edit/${recordId}`); // Adjust route if needed
    } else {
      console.error("Cannot edit: Record ID is missing.");
      setError("Cannot edit this record type directly (missing specific ID).");
    }
  };

  // --- Delete Handler ---
  const handleDelete = async (recordId, cin) => {
    if (!recordId || !user) {
      // Check auth
      console.error(
        "Cannot delete: Record ID is missing or user not logged in."
      );
      setDeleteStatus({
        loading: false,
        error: "Cannot delete record: ID missing or not authorized.",
        success: null,
      });
      return;
    }

    // Confirmation dialog
    if (
      !window.confirm(
        `Are you sure you want to delete the record for CIN: ${cin}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleteStatus({ loading: true, error: null, success: null });
    try {
      // Add Authorization Header with Firebase ID Token
      const response = await axios.delete(
        `${API_PREFIX}/company/delete/${recordId}`
      );

      if (response.data?.success) {
        setDeleteStatus({
          loading: false,
          error: null,
          success: `Record ${recordId} deleted successfully.`,
        });
        // Refresh results by removing the deleted item locally
        setResults((prevResults) =>
          prevResults.filter((r) => r._id !== recordId)
        );
      } else {
        throw new Error(response.data?.message || "Deletion failed.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      // Extract message from Axios error response or fallback
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during deletion.";
      setDeleteStatus({ loading: false, error: errorMsg, success: null });
    }
  };

  // --- Manual Search Trigger (for CIN or explicit button click) ---
  const handleManualSearch = (e) => {
    if (e) e.preventDefault();
    console.log("Manual search triggered");
    debouncedNameSearchRef.current.cancel();
    // Perform search only if conditions are met (avoids unnecessary API calls)
    if (
      searchTerm &&
      ((searchType === "cin" && searchTerm.length === 21) ||
        (searchType === "name" && searchTerm.length >= 3))
    ) {
      performSearch(searchTerm, searchType);
    } else if (
      searchType === "cin" &&
      searchTerm.length !== 21 &&
      searchTerm.length > 0
    ) {
      // Only show error if something is entered
      setError("Please enter a full 21-character CIN.");
      setResults([]);
    } else if (
      searchType === "name" &&
      searchTerm.length < 3 &&
      searchTerm.length > 0
    ) {
      // Only show error if something is entered
      setError("Please enter at least 3 characters for name search.");
      setResults([]);
    } else if (!searchTerm) {
      // Clear error if search term is empty
      setError(null);
      setResults([]);
    }
  };

  // --- CSV Upload Handlers ---
  const handleFileChange = (event) => {
    setUploadError(null);
    setUploadSuccess(null);
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === "text/csv" ||
        file.name.toLowerCase().endsWith(".csv")
      ) {
        setSelectedFile(file);
      } else {
        setUploadError("Invalid file type. Please select a .csv file.");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input visually
        }
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile || !user) {
      // Check auth
      setUploadError("Please select a CSV file and ensure you are logged in.");
      return;
    }
    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);
    const formData = new FormData();
    formData.append("file", selectedFile); // Key 'file' must match API

    try {
      const response = await axios.post(
        `${API_PREFIX}/company/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Response:", response.data);

      if (response.data?.success) {
        // Use the detailed message from the API
        setUploadSuccess(
          response.data.message ||
            `Upload successful. Inserted ${
              response.data.insertedCount || 0
            }, Skipped ${response.data.skippedCount || 0}.`
        );
        setSelectedFile(null); // Clear state
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      } else {
        // Use the error message from the API response if available
        setUploadError(
          response.data?.message ||
            "Upload failed. Please check the file or server logs."
        );
      }
    } catch (err) {
      console.error("Upload Error:", err);
      // Extract message from Axios error response or fallback
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during upload.";
      setUploadError(errorMsg);
    } finally {
      setUploadLoading(false);
    }
  };

  // --- Function to clear selected file ---
  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setUploadError(null); // Clear any previous upload errors
    setUploadSuccess(null); // Clear any previous upload success messages
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };

  // --- Loading State ---
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />{" "}
        <span className="ml-2">Loading Authentication...</span>
      </div>
    );
  }

  // --- Auth Error State ---
  if (errorAuth) {
    console.error("Firebase Auth Error:", errorAuth);
    return (
      <p className="text-red-500 text-center mt-10">
        Error loading authentication state. Please try refreshing the page.
      </p>
    );
  }

  // --- Render Login Form if Not Authenticated ---
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-700">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="login-email"
              >
                Email
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={loginLoading}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="login-password"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loginLoading}
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Render Admin Dashboard if Authenticated ---
  // Note: This part only renders if 'user' is not null (i.e., login was successful and matched ALLOWED_ADMIN_EMAILS if that check was included)
  return (
    <div className="container mx-auto p-4 pt-6 md:pt-18 lg:pt-16 pb-10">
      {" "}
      {/* Adjusted padding */}
      {/* Header */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg mt-16 px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left text-white">
            ADMIN DASHBOARD
          </h1>

          {/* Logout Button */}
          <button
            onClick={() => auth.signOut()}
            className="cursor-pointer text-white underline hover:text-indigo-200 text-sm md:text-base"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
      {/* --- Search Section --- */}
      <div className="p-4 md:p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
          Search Companies
        </h2>
        <form
          onSubmit={handleManualSearch}
          className="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center"
        >
          <select
            value={searchType}
            onChange={(e) => {
              const newType = e.target.value;
              setSearchType(newType);
              setSearchTerm("");
              setResults([]);
              setError(null);
              setShowingDetailsForCIN(null);
            }}
            className="p-2 border cursor-pointer border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-10 sm:w-auto" // Fixed height
            disabled={loading} // Only disable during search loading
          >
            <option value="cin">CIN</option>
            <option value="name">Name</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchType === "cin"
                ? "Enter 21-character CIN"
                : "Company Name (min 3 chars)"
            }
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-10" // Fixed height
            required={false} // Remove HTML5 required for better custom handling
            disabled={loading}
            maxLength={searchType === "cin" ? 21 : undefined}
            minLength={searchType === "name" ? 3 : undefined} // HTML5 validation hint
          />
          <button
            type="submit"
            disabled={
              loading ||
              !searchTerm ||
              (searchType === "cin" && searchTerm.length !== 21) ||
              (searchType === "name" && searchTerm.length < 3)
            }
            className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed h-10 flex items-center justify-center" // Fixed height
          >
            {loading && !showingDetailsForCIN ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </form>

        {/* Status Messages Area */}
        <div className="min-h-[40px] mb-4">
          {" "}
          {/* Reserve space for messages */}
          {error && (
            <p className="text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
              {error}
            </p>
          )}
          {deleteStatus.error && (
            <p className="text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
              Delete Error: {deleteStatus.error}
            </p>
          )}
          {deleteStatus.success && (
            <p className="text-green-600 text-sm p-2 bg-green-50 rounded border border-green-200">
              {deleteStatus.success}
            </p>
          )}
        </div>

        {/* Search Results */}
        {loading && !results.length && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-600">
              Search Results{" "}
              {showingDetailsForCIN
                ? `(Details for ${showingDetailsForCIN})`
                : ""}{" "}
              ({results.length})
            </h3>
            <ul className="space-y-3">
              {results.map((record) => (
                <li
                  key={record._id || record.CIN || record.cin}
                  className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow duration-150 break-words"
                >
                  <div className="flex-grow min-w-0">
                    <p
                      className="font-semibold text-gray-800 break-words"
                      title={record.company || record.CompanyName}
                    >
                      {record.company || record.CompanyName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      CIN: {record.cin || record.CIN || "N/A"}
                    </p>
                    {record.DirectorFirstName && (
                      <p
                        className="text-sm text-indigo-700 break-words"
                        title={`${record.DirectorFirstName || ""} ${
                          record.DirectorLastName || ""
                        } (DIN: ${record.DirectorDIN || "N/A"})`}
                      >
                        Director:{" "}
                        {`${record.DirectorFirstName || ""} ${
                          record.DirectorLastName || ""
                        }`.trim() || "N/A"}
                        {record.DirectorDIN &&
                          ` (DIN: ${record.DirectorDIN.toString()})`}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0 w-full sm:w-auto">
                    {record._id ? (
                      <button
                        onClick={() => handleEdit(record._id)}
                        className="px-3 py-1 text-sm cursor-pointer bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
                        disabled={loading || deleteStatus.loading}
                        title="Edit this specific record"
                      >
                        Edit
                      </button>
                    ) : (
                      record.CIN &&
                      !showingDetailsForCIN && (
                        <button
                          onClick={() => handleViewDetails(record.CIN)}
                          className="px-3 py-1 text-sm cursor-pointer bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                          disabled={loading}
                          title={`View all records for CIN: ${record.CIN}`}
                        >
                          View Records
                        </button>
                      )
                    )}
                    {record._id && (
                      <button
                        onClick={() =>
                          handleDelete(record._id, record.cin || record.CIN)
                        }
                        className="px-3 py-1 text-sm cursor-pointer bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto flex items-center justify-center"
                        disabled={loading || deleteStatus.loading}
                        title={`Delete record ${record._id}`}
                      >
                        {deleteStatus.loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Results Message */}
        {!loading &&
          results.length === 0 &&
          !error &&
          searchTerm &&
          (searchType === "cin"
            ? searchTerm.length === 21
            : searchTerm.length >= 3) && (
            <p className="text-gray-500 mt-4 text-center">
              No records found matching your criteria.
            </p>
          )}
      </div>
      {/* Divider */}
      <hr className="my-2 md:my-6 border-t border-gray-300" />
      {/* CSV Upload Section */}
      <div className="p-4 md:p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
          Upload Company CSV
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="csvFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select CSV File:
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef} // Assign ref
                type="file"
                id="csvFile"
                name="file" // Matches API
                accept=".csv, text/csv"
                onChange={handleFileChange}
                className="block w-full max-w-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                disabled={uploadLoading}
              />
              {selectedFile && (
                <button
                  type="button" // Prevent form submission
                  onClick={handleClearSelectedFile}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 flex-shrink-0"
                  disabled={uploadLoading}
                  title="Clear selected file"
                >
                  <Trash2Icon size={20} className="cursor-pointer" />
                </button>
              )}
            </div>
            {selectedFile && (
              <p className="text-xs text-gray-600 mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Upload Status Messages Area */}
          <div className="">
            {" "}
            {/* Reserve space for messages */}
            {uploadError && (
              <p className="text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
                {uploadError}
              </p>
            )}
            {uploadSuccess && (
              <p className="text-green-600 text-sm p-2 bg-green-50 rounded border border-green-200">
                {uploadSuccess}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedFile || uploadLoading}
            className="px-5 py-2 cursor-pointer bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]" // Added min-width
          >
            {uploadLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Upload CSV"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
