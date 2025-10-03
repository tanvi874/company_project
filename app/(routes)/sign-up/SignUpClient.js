// app/(routes)/sign-up/page.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "lib/firebase";
import Link from "next/link";
import Script from "next/script";

const SignUpSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleStandardSignUp = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      // Basic password length check (Firebase enforces this too)
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Sign-up successful:", userCredential.user);
      // Optionally send verification email here: sendEmailVerification(userCredential.user);
      // Redirect to sign-in page after sign-up to prompt login
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign-up error:", err);
      let errorMessage = "Sign-up failed. Please try again.";
      if (
        err.code === AuthErrorCodes.EMAIL_EXISTS ||
        err.code === "auth/email-already-in-use"
      ) {
        errorMessage = "An account with this email already exists.";
      } else if (
        err.code === AuthErrorCodes.WEAK_PASSWORD ||
        err.code === "auth/weak-password"
      ) {
        errorMessage =
          "Password is too weak. Please choose a stronger password (at least 6 characters).";
      } else if (
        err.code === AuthErrorCodes.INVALID_EMAIL ||
        err.code === "auth/invalid-email"
      ) {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in/up successful:", result.user);
      // If Google sign-in is successful, user is already logged in, go to dashboard
      router.push("/dashboard");
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
          "An account already exists with this email using a different sign-in method (e.g., Email/Password). Please sign in using that method.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSON-LD Schema ---
  const signUpSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sign Up - SetIndiaBiz",
    url: typeof window !== "undefined" ? window.location.href : "",
    description:
      "Sign-up page for SetIndiaBiz where new users can create an account using email/password or Google.",
    potentialAction: {
      "@type": "RegisterAction",
      target: typeof window !== "undefined" ? window.location.href : "",
      name: "User Sign Up",
    },
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="sign-up-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(signUpSchema) }}
      />

      <div className="flex flex-col items-center justify-center min-h-[80vh] pb-16 pt-8 mt-12">
        <section className="wrapper w-full lg:grid lg:grid-cols-2 lg:gap-10">
          {/* Optional: Different Image for Sign Up */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <Image
              alt="Sign up illustration"
              priority
              width={500}
              height={500}
              className="h-auto w-full max-w-md object-contain"
              src="https://www.setindiabiz.com/assets/company-name-search/login.webp" // Consider using a different image like /signup.svg
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full lg:mt-4 max-w-lg space-y-6 rounded-lg border bg-white p-10 shadow-md text-card-foreground">
              <div className="space-y-2 text-center mt-3">
                <h1 className="text-3xl font-bold text-black">
                  Create Account
                </h1>
              </div>

              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3 my-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleStandardSignUp} className="space-y-4">
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="block h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="At least 6 characters"
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
                </div>
                {/* Confirm Password Input */}
                <div className="space-y-1">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-black"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="block h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex cursor-pointer btn-primary rounded-md h-10 w-full items-center justify-center whitespace-nowrap bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              {/* Divider */}
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

              {/* Google Sign-In/Up Button */}
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
                Sign up with Google
              </button>

              {/* Link to Sign In */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignUpSection;
