import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "lib/dbConnect";
import Payment from "lib/models/Payment"; // Adjust path as needed
import Razorpay from "razorpay"; // Needed to fetch order details
import Company from "lib/models/companyModel"; // Import the Company model (Adjust path as needed)

export async function POST(request) {
  // --- Environment Variable Access & Validation ---
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_SECRET_KEY; // Secret should NOT have NEXT_PUBLIC_ prefix

  console.log("--- Verify Payment API Start ---"); // Log start

  if (!razorpayKeyId || !razorpayKeySecret) {
    console.error(
      "API Route Error (verify-payment): Razorpay API keys missing in environment variables!"
    );
    // Log which key is missing
    if (!razorpayKeyId) console.error("Missing: NEXT_PUBLIC_RAZORPAY_KEY_ID");
    if (!razorpayKeySecret) console.error("Missing: RAZORPAY_SECRET_KEY");
    return NextResponse.json(
      { success: false, message: "Payment gateway configuration error." },
      { status: 500 }
    );
  }
  console.log("API Keys Found (Key ID starts with):", razorpayKeyId?.substring(0, 8)); // Log partial key ID

  try {
    console.log("Connecting to DB...");
    await dbConnect();
    console.log("DB Connected.");

    let body;
    try {
        console.log("Parsing request body...");
        body = await request.json();
        console.log("Request body parsed:", JSON.stringify(body, null, 2));
    } catch (parseError) {
        console.error("API Route Error (verify-payment): Failed to parse request body:", parseError);
        return NextResponse.json({ success: false, message: 'Invalid request body format.' }, { status: 400 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId, // IMPORTANT: Replace with secure server-side user ID retrieval
      din,
      directorName,
      payerName,
      payerEmail,
      payerPhone,
      // Note: amount and currency from body are less reliable than fetched order details
    } = body;

    // --- Basic Payload Validation ---
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error("API Route Error (verify-payment): Missing payment verification details in payload.");
        return NextResponse.json(
            { success: false, message: "Missing payment verification details." },
            { status: 400 }
        );
    }

    // --- !!! IMPORTANT SECURITY STEP: Get User ID Securely !!! ---
    // Replace this placeholder with your actual server-side session/token validation
    // Example using NextAuth.js:
    // import { getServerSession } from "next-auth/next"
    // import { authOptions } from "app/api/auth/[...nextauth]/route" // Adjust path
    // const session = await getServerSession(authOptions);
    // const secureUserId = session?.user?.id; // Adjust based on your session structure
    // if (!secureUserId) {
    //     return NextResponse.json({ success: false, message: 'Unauthorized: User not authenticated.' }, { status: 401 });
    // }
    // console.log("API Route: Verifying payment for secure user:", secureUserId, "Order ID:", razorpay_order_id);
    // Use `secureUserId` instead of `userId` from the body below.
    if (!userId) { // Temporary check for the insecure userId
      console.error("API Route Error (verify-payment): Insecure userId missing from request body.");
      return NextResponse.json({ success: false, message: 'User identifier missing (Insecure). Fix server-side handling.' }, { status: 400 });
    }
    console.warn("API Route (verify-payment): Using INSECURE userId from request body:", userId, "Order ID:", razorpay_order_id);
    const secureUserId = userId; // Replace with securely obtained ID


    // Verify Signature
    console.log("Verifying signature...");
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    let expectedSign;
    try {
        // Ensure razorpayKeySecret is treated as a string
        const secretString = String(razorpayKeySecret || '');
        if (!secretString) {
            throw new Error("RAZORPAY_SECRET_KEY is empty or undefined for HMAC creation.");
        }
        expectedSign = crypto
            .createHmac("sha256", secretString) // Use the validated secret as string
            .update(sign.toString())
            .digest("hex");
    } catch (cryptoError) {
        console.error("API Route Error (verify-payment): Crypto HMAC creation failed:", cryptoError);
        return NextResponse.json({ success: false, message: 'Failed to generate verification signature.' }, { status: 500 });
    }


    // --- Debugging Logs for Signature ---
    console.log(`API Route: Signature Check - String to Sign: "${sign}"`);
    console.log(`API Route: Signature Check - Secret Used (First 5): ${razorpayKeySecret?.substring(0, 5) ?? 'MISSING'}`);
    console.log(`API Route: Signature Check - Received Signature: ${razorpay_signature}`);
    console.log(`API Route: Signature Check - Expected Signature: ${expectedSign}`);

    if (expectedSign !== razorpay_signature) {
      console.warn(
        "API Route: Payment Verification Failed: Signature mismatch for Order ID:",
        razorpay_order_id
      );
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed: Signature mismatch.",
        },
        { status: 400 } // Return 400 for mismatch
      );
    }

    console.log(
      "API Route: Payment Signature Verified for Order ID:",
      razorpay_order_id
    );

    // --- Save to Database (Check if exists first) ---
    console.log("Checking for existing payment...");
    const existingPayment = await Payment.findOne({
      razorpay_payment_id: razorpay_payment_id,
    }).lean(); // Use lean for efficiency
    if (existingPayment) {
      console.warn(
        "API Route: Payment ID already processed:",
        razorpay_payment_id
      );
      // Even if already processed, fetch company data to return to client
      let companyData = null;
      try {
        if (existingPayment.dinUnlocked) {
          console.log(`API Route: Fetching company data for already processed payment (DIN: ${existingPayment.dinUnlocked})`);
          // *** ADJUST THIS QUERY based on your Company schema ***
          companyData = await Company.findOne({ 'directors.din': existingPayment.dinUnlocked })
                                      .select('companyName cin -_id') // Select fields needed for email
                                      .lean();
          console.log("API Route: Found company data for existing payment:", companyData);
        }
      } catch (companyError) {
        console.error("API Route Error (verify-payment): Failed to fetch company data for existing payment:", companyError);
      }
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
        companyData: companyData // Still return company data if found
      });
    }
    console.log("No existing payment found. Proceeding to save...");

    // Fetch order details from Razorpay (optional but good)
    let orderDetails;
    // Create instance here, only if needed and keys are confirmed present
    const razorpayInstance = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
    });
    try {
      console.log("Fetching order details from Razorpay...");
      orderDetails = await razorpayInstance.orders.fetch(razorpay_order_id);
      if (!orderDetails) throw new Error("Order not found on Razorpay");
      console.log(
        "API Route: Fetched Order Details from Razorpay:",
        JSON.stringify(orderDetails, null, 2) // Log fetched details
      );
    } catch (fetchError) {
      console.error(
        "API Route: Could not fetch order details from Razorpay:",
        fetchError?.message || fetchError // Log error message
      );
      // Decide how to handle - fail verification or proceed with caution?
      // If order fetch fails, signature verification *should* have already caught issues
      // with the order_id, but it's safer to rely on fetched details if possible.
      // Consider failing if order details are crucial for amount verification.
    }

    console.log("Creating new payment record...");
    const newPayment = new Payment({
      userId: secureUserId, // Use the securely obtained ID
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      razorpay_signature: razorpay_signature, // Store signature if needed
      amount: orderDetails?.amount || 0, // Prefer fetched amount, default to 0
      currency: orderDetails?.currency || "INR", // Prefer fetched currency
      status: orderDetails?.status || "captured", // Use fetched status if available, else default
      dinUnlocked: din,
      directorName: directorName,
      paymentDate: new Date(), // Use current time for verification record
      payerName: payerName,
      payerEmail: payerEmail,
      payerPhone: payerPhone,
    });

    console.log("Saving payment record to DB...");
    await newPayment.save();
    console.log(
      "API Route: Payment record saved successfully for Payment ID:",
      razorpay_payment_id
    );
    // -----------------------

    // --- Fetch Related Company Data (After successful save) ---
    let companyData = null;
    try {
      if (din) { // Only search if DIN is available
        console.log(`API Route: Searching for company associated with DIN: ${din}`);
        // *** ADJUST THIS QUERY based on your Company schema ***
        // Example: Searching within a 'directors' array field named 'directors' where each object has a 'din' property
        companyData = await Company.findOne({ 'directors.din': din })
                                    .select('companyName cin -_id') // Select only fields needed for email
                                    .lean();
        console.log("API Route: Found company data:", companyData);
      }
    } catch (companyError) {
      console.error("API Route Error (verify-payment): Failed to fetch company data:", companyError);
      // Decide if this should be a fatal error or just proceed without company data
    }

    console.log("--- Verify Payment API End (Success) ---");
    return NextResponse.json({
      success: true,
      message: "Payment verified and recorded successfully",
      companyData: companyData // Include company data in the response
    });
  } catch (error) {
    console.error("--- Verify Payment API End (Error) ---");
    console.error("API Route Error (verify-payment):", error);
    // Provide more specific error messages based on error type
    let errorMessage = "Payment verification failed.";
    let statusCode = 500;
    if (error instanceof Error) {
        errorMessage = error.message;
        if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
            console.error("Database connection error during payment verification.");
            errorMessage = "Database connection error. Please try again later.";
        } else if (error instanceof SyntaxError) { // JSON parsing error (already handled, but good practice)
            errorMessage = "Invalid request format.";
            statusCode = 400; // Bad request
        } else if (error.name === 'ValidationError') { // Mongoose validation error
            console.error("Database validation error:", error.errors);
            errorMessage = `Invalid data: ${Object.values(error.errors).map(e => e.message).join(', ')}`;
            statusCode = 400;
        }
        // Add more specific checks if needed (e.g., Razorpay errors)
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
