"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "lib/firebase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Database,
  ChevronDown,
  BookUser,
  CalendarDays,
  Building,
  CircleUserRound,
} from "lucide-react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      alert("Failed to sign out. Try again.");
    }
  };

  const getUserIndicator = () => {
    if (user?.photoURL)
      return (
        <Image
          src={user.photoURL}
          alt="User"
          width={26}
          height={24}
          className="rounded-full"
        />
      );
    if (user?.displayName)
      return (
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-200 text-blue-800 text-xs font-semibold">
          {user.displayName.charAt(0).toUpperCase()}
        </span>
      );
    if (user?.email)
      return (
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
          {user.email.charAt(0).toUpperCase()}
        </span>
      );
    return <CircleUserRound className="h-6 w-6 text-gray-400" />;
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 bg-[#0D2483]">
      <div className="flex items-center justify-between h-full px-4 md:px-6 text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://www.setindiabiz.com/assets/images/setindiabiz-white-logo.png"
            alt="Logo"
            width={180}
            height={40}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-4">
            {/* Data Services dropdown stays exactly the same */}
            <li className="group relative inline-block">
              <button className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] h-10 py-2 border border-transparent px-1.5 group-hover:border-muted-foreground">
                <Database className="mr-2 h-4 w-4" />
                Data Services
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="absolute -ml-40 hidden min-w-80 rounded-lg bg-transparent pt-2 group-hover:block">
                <div className="absolute z-40 hidden min-w-80 space-y-1.5 rounded-lg bg-white p-2 text-foreground shadow-2xl transition-all group-hover:block">
                  <Link
                    className="block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary"
                    href="/unlock-contact"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookUser className="h-5 w-5 flex-shrink-0 text-slate-500" />
                      <p className="text-sm font-semibold text-black">
                        Director Contact
                      </p>
                    </div>
                    <div
                      data-orientation="horizontal"
                      role="none"
                      className="shrink-0 bg-border h-[1px] w-full my-1"
                    ></div>
                    <p className="mt-1 text-xs text-slate-500">
                      Unlock director contact information only at ₹100. Instant
                      access. No hidden fees.
                    </p>
                  </Link>
                  <Link
                    className="block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary"
                    href="/"
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-5 w-5 flex-shrink-0 text-slate-500" />
                      <p className="text-sm font-semibold text-black">
                        Company Search
                      </p>
                    </div>
                    <div
                      data-orientation="horizontal"
                      role="none"
                      className="shrink-0 bg-border h-[1px] w-full my-1"
                    ></div>
                    <p className="mt-1 text-xs text-slate-500">
                      Find detailed company information quickly and easily
                      through our platform.
                    </p>
                  </Link>
                  <Link
                    className="block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary"
                    href="/"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="h-5 w-5 flex-shrink-0 text-slate-500" />
                      <p className="text-sm font-semibold text-black">
                        Director Search
                      </p>
                    </div>
                    <div
                      data-orientation="horizontal"
                      role="none"
                      className="shrink-0 bg-border h-[1px] w-full my-1"
                    ></div>
                    <p className="mt-1 text-xs text-slate-500">
                      Find information about company directors and their
                      associated companies.
                    </p>
                  </Link>
                </div>
              </div>
            </li>

            {/* Auth Section */}
            <li className="flex items-center gap-3">
              {loading ? (
                <div className="h-8 w-24 bg-gray-600 rounded animate-pulse"></div>
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 hover:text-gray-300"
                  >
                    {getUserIndicator()}
                    <span className="text-sm hidden lg:inline">
                      {user.displayName || user.email}
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="hover:bg-red-700 justify-center rounded-md font-extralight text-sm transition-colors bg-red-600 text-white h-8 px-2.5 py-1 flex items-center gap-1"
                  >
                    <FaSignOutAlt />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link href="/sign-in">
                  <button className="hover:bg-blue-800 justify-center whitespace-nowrap rounded-md text-sm font-medium text-white bg-blue-600 h-9 px-4 py-2 flex items-center gap-2">
                    <FaSignInAlt />
                    Sign In
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D2483] text-white px-4 py-3 space-y-2">
          <Link href="/unlock-contact" className="block py-2">
            Director Contact
          </Link>
          <Link href="/" className="block py-2">
            Company Search
          </Link>
          <Link href="/" className="block py-2">
            Director Search
          </Link>

          <div className="border-t border-white/30 mt-2 pt-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="flex items-center gap-2">
                  {getUserIndicator()}{" "}
                  <span>{user.displayName || user.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-800"
              >
                <FaSignInAlt /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
