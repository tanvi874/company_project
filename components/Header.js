"use client"; 

import Link from "next/link";
import Image from "next/image";
import { useAuth } from 'context/AuthContext'; 
import { signOut } from 'firebase/auth';
import { auth } from 'lib/firebase'; 
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  Database,       
  ChevronDown,    
  BookUser,       
  CalendarDays,   
  Building,       
  CircleUserRound,
  LogOut,        
  LogIn           
} from 'lucide-react';
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully from header');
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  // Helper function to get user initials
  const getUserIndicator = () => {
    if (user?.photoURL) {
      return <Image src={user.photoURL} alt="User profile" width={26} height={24} className="rounded-full" />;
    }
    if (user?.displayName) {
      return <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-200 text-blue-800 text-xs font-semibold">
               {user.displayName.charAt(0).toUpperCase()}
             </span>;
    }
     if (user?.email) {
      return <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
               {user.email.charAt(0).toUpperCase()}
             </span>;
    }

    return <CircleUserRound className="h-6 w-6 text-gray-400" />
  };


  return (
    <header
      id="search"
      className="fixed left-0 right-0 top-0 z-40 transition-all duration-300 ease-in-out h-16" 
      style={{backgroundColor: "#0D2483"}} 
    >
      <div className="mr-6 ml-2 flex items-center justify-between h-full text-white"> 
        <div className="flex items-center">
          <Link className="cursor-pointer" href="/">
            <Image
              alt="Logo"
              priority 
              width={180}
              height={40}
              className="text-white ml-3"
              src="https://www.setindiabiz.com/assets/images/setindiabiz-white-logo.png"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center justify-end gap-4"> 
          <ul className="flex items-center gap-4">
            <li className="group relative inline-block">
              <button className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] h-10 py-2 border border-transparent px-1.5 group-hover:border-muted-foreground">
              <Database className="mr-2 h-4 w-4" aria-hidden="true" />
               Data Services
               <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
  
              <div className="absolute -ml-40 hidden min-w-80 rounded-lg bg-transparent pt-2 group-hover:block">
                <div className="absolute z-40 hidden min-w-80 space-y-1.5 rounded-lg bg-white p-2 text-foreground shadow-2xl transition-all group-hover:block">
                  <Link className="block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary" href="/unlock-contact">
                     <div className="flex items-center gap-2.5">
                     <BookUser className="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                        <p className="text-sm font-semibold text-black">Director Contact</p>
                     </div>
                     <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-1"></div>
                     <p className="mt-1 text-xs text-slate-500"> 
                        Unlock director contact information only at ₹100. Instant access. No hidden fees.
                     </p>
                  </Link>
                  <Link className="block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary" href="/">
                     <div className="flex items-center gap-2.5">
                     <CalendarDays className="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                        <p className="text-sm font-semibold text-black">Company Search</p>
                     </div>
                     <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-1"></div>
                     <p className="mt-1 text-xs text-slate-500"> 
                        Find detailed company information quickly and easily through our platform.
                     </p>
                  </Link>
                  <Link className="block rounded-md border bg-background p-2 text-sm transition-all duration-300 ease-in hover:border-primary" href="/">
                     <div className="flex items-center gap-2.5">
                     <Building className="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                        <p className="text-sm font-semibold text-black">Director Search</p>
                     </div>
                     <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-1"></div>
                     <p className="mt-1 text-xs text-slate-500"> 
                        Find information about company directors and their associated companies.
                     </p>
                  </Link>
                </div>
              </div>
            </li>

            {/* Vertical Divider */}
            <div
              data-orientation="vertical"
              role="separator" 
              aria-orientation="vertical"
              className="shrink-0 bg-white/50 w-[1px] h-6"
            ></div>

            {/* Auth Section*/}
            <li className="flex items-center gap-3">
              {loading ? (
                // Loader while checking auth state
                <div className="h-8 w-24 bg-gray-600 rounded animate-pulse"></div>
              ) : user ? (
                // User is logged IN
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 hover:text-gray-300 transition-colors" title={user.email || 'Go to dashboard'}>
                     {getUserIndicator()}
                     <span className="text-sm hidden lg:inline">{user.displayName || user.email}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="hover:bg-red-700 justify-center rounded-md font-extralight text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white h-8 px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                    type="button"
                    title="Sign Out"
                  >
                    {/* Sign Out Icon */}
                    {/* <LogOut className="h-4 w-6" aria-hidden="true" /> */}
                    <FaSignOutAlt/>
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                // User is logged OUT
                <Link href={"/sign-in"}>
                  <button className="hover:bg-blue-800 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white relative bg-blue-600 z-0 overflow-hidden h-9 px-4 py-2 flex items-center gap-2 cursor-pointer" // Simplified styles, adjusted size
                  type="button">
                    {/* Sign In Icon */}
                  <FaSignInAlt className="h-4 w-4" aria-hidden="true"/>
                   Sign In
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </nav>
        
      </div>
    </header>
  );
}

export default Header;