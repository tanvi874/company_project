// app/(routes)/sign-in/page.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  // Standard Email/Password
  signInWithEmailAndPassword,
  // Google Sign-In
  GoogleAuthProvider,
  signInWithPopup,
  // General
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";

// --- Component ---
const LoginSection = () => {
  // --- State Variables ---
  // Standard Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Loading and Error State
  const [isLoading, setIsLoading] = useState(false); // General loading state
  const [error, setError] = useState(""); // General error display

  const router = useRouter();

  // --- Event Handlers ---

  // Handle Standard Email/Password Sign In
  const handleStandardSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("Attempting standard sign in with:", { email });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Sign-in successful:", userCredential.user);
      router.push("/");
    } catch (err) {
      console.error("Sign-in error:", err);
      let errorMessage = "Sign-in failed. Please check your credentials.";
      if (
        err.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS ||
        err.code === "auth/invalid-credential"
      ) {
        errorMessage = "Invalid email or password.";
      } else if (
        err.code === AuthErrorCodes.USER_DELETED ||
        err.code === "auth/user-not-found"
      ) {
        errorMessage = "User account not found.";
      } else if (err.code === AuthErrorCodes.INVALID_EMAIL) {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    setIsLoading(true);
    setError("");
    console.log("Attempting Google sign in...");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      router.push("/");
    } catch (err) {
      console.error("Google Sign-in error:", err);
      let errorMessage = "Google sign-in failed. Please try again.";
      if (err.code === AuthErrorCodes.POPUP_CLOSED_BY_USER) {
        errorMessage = "Google sign-in cancelled.";
      } else if (err.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
        errorMessage =
          "Network error during Google sign-in. Please check your connection.";
      } else if (err.code === "auth/account-exists-with-different-credential") {
        errorMessage =
          "An account already exists with the same email address but different sign-in credentials. Try signing in using the original method.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] pb-16 pt-20">
        <section className="wrapper w-full lg:grid lg:grid-cols-2 lg:gap-10">
          {/* Image Section */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <Image
              alt="Login illustration"
              priority
              width={500} // Adjusted size for better visibility
              height={500} // Adjusted size for better visibility
              className="h-auto w-full max-w-md object-contain"
              src="https://www.setindiabiz.com/assets/company-name-search/login.webp"
            />
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center">
            <div className="w-full mt-8 lg:mt-0 max-w-lg space-y-6 rounded-lg border bg-white p-8 shadow-md text-card-foreground">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-black">Sign In</h1>
              </div>

              {/* Display General Errors */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3 my-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
                >
                  {error}
                </div>
              )}

              {/* --- Google Sign-In Button --- */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="inline-flex cursor-pointer h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <Image
                  src={
                    "https://www.setindiabiz.com/assets/company-name-search/google-icon.webp"
                  }
                  width={20}
                  height={20}
                  alt=""
                  className="mr-2"
                />
                Sign in with Google
              </button>

              {/* --- Divider --- */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* --- Standard Email/Password Sign In --- */}
              <form onSubmit={handleStandardSignIn} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="block h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>
                {/* Password Input */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="block h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Consider adding a "Forgot Password?" link here */}
                  {/* <div className="text-right text-sm mt-1">
                                    <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div> */}
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-10 w-full items-center cursor-pointer justify-center whitespace-nowrap rounded-md btn-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              {/* --- Link to Sign Up --- */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                {`Don't have an account? `}
                <Link
                  href="/sign-up"
                  className="font-medium text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LoginSection;
