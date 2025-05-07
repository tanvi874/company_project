import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-navy-blue to-midnight-blue text-white"
     style={{backgroundColor: "#0D2483"}}>
      <div className="wrapper text-xs xl:text-sm">
        <div className="grid grid-cols-1 gap-3 py-2 md:grid-cols-6 lg:grid-cols-6 lg:gap-4 xl:gap-8">
          <div className="mr-0 space-y-4 tracking-wide max-w-xl md:col-span-2 md:mt-3 md:space-y-6 lg:mr-0">
            <p className="mt-10">{`India's first platform dedicated to simplifying RoC Compliance for company owners and compliance professionals`}</p>
            <p className="mt-3">{`DISCLAIMER: SetIndiaBiz provides information and data from trusted sources, but we don't guarantee its accuracy or take responsibility for any consequences. It's important to note that any information accessed through SetIndiaBiz cannot be sold, licensed, rented, or redistributed by any individual or entity in any form without explicit permission. By using SetIndiaBiz, you agree to these terms and conditions. If you do not agree with any part of this disclaimer, please refrain from using our services.`}</p>
          </div>
          <div className="hidden lg:block"></div>
          <div className="mt-12">
            <h3 className="mb-4 text-sm font-semibold lg:text-lg">PRODUCT</h3>
            <ul className="space-y-2 md:space-y-4">
              <li><Link className="transition-all hover:text-white" href="/">Company Search</Link></li>
              <li><Link className="transition-all hover:text-white" href="/">Director Search</Link></li>
              <li><Link className="transition-all hover:text-white" href="/unlock-contact">Director Contact</Link></li>
            </ul>
          </div>
          <div className="mt-12">
            <h3 className="mb-4 text-sm font-semibold lg:text-lg">COMPANY</h3>
            <ul className="space-y-2 md:space-y-4">
              <li><Link className="transition-all hover:text-white" href="/about">About</Link></li>
              <li><Link className="transition-all hover:text-white" href="/contact-us">Contact Us</Link></li>
              <li><Link className="transition-all hover:text-white" href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="mt-11">
            <h3 className="mb-3 text-sm font-semibold lg:text-lg">LEGAL</h3>
            <ul className="space-y-2 md:space-y-4">
              <li><Link className="transition-all hover:text-white" href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="transition-all hover:text-white" href="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link className="transition-all hover:text-white" href="/refund-policy">Refund Policy</Link></li>
              <li><Link className="transition-all hover:text-white" href="/cancellation-policy">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>
        <div data-orientation="horizontal" role="none" className="shrink-0 h-[1px] w-full my-4 bg-slate-500"></div>

        <div className="flex flex-col-reverse items-center justify-between gap-4 md:flex-row pb-3.5">
          <p className="flex flex-col flex-wrap gap-2 text-center md:flex-row md:text-left">
            <span>Copyright © {new Date().getFullYear()} SetIndiaBiz Private Limited. All rights reserved.</span>
            <span className="hidden lg:block">|</span>     
          </p>
          <ul className="flex items-center justify-center gap-2 md:gap-4">
            <li className="flex justify-center gap-4 text-xl">
              <Link target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="transition-all hover:text-white" href="https://www.facebook.com/setindiabiz">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.001 19.9381C16.9473 19.446 20.001 16.0796 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 16.0796 7.05467 19.446 11.001 19.9381V14H9.00098V12H11.001V10.3458C11.001 9.00855 11.1402 8.52362 11.4017 8.03473C11.6631 7.54584 12.0468 7.16216 12.5357 6.9007C12.9184 6.69604 13.3931 6.57252 14.2227 6.51954C14.5519 6.49851 14.9781 6.52533 15.501 6.6V8.5H15.001C14.0837 8.5 13.7052 8.54332 13.4789 8.66433C13.3386 8.73939 13.2404 8.83758 13.1653 8.97793C13.0443 9.20418 13.001 9.42853 13.001 10.3458V12H15.501L15.001 14H13.001V19.9381ZM12.001 22C6.47813 22 2.00098 17.5228 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22Z"></path>
                </svg>
              </Link>
              <Link target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="transition-all hover:text-white" href="https://www.instagram.com/setindiabiz/">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"></path>
                </svg>
              </Link>
              <Link target="_blank" rel="noopener noreferrer" aria-label="Visit our Linkedin page" className="transition-all hover:text-white" href="https://www.linkedin.com/company/setindiabiz/">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="0.9em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
