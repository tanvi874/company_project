// d:\CompanyWebsite\app\api\send-unlock-email\route.js
import { NextResponse } from 'next/server';
import { SendMailClient } from "zeptomail";

// --- ZeptoMail Configuration (Server-Side) ---
const ZEPTOMAIL_API_URL = "api.zeptomail.com/";
// IMPORTANT: Use the non-public environment variable here
const ZEPTOMAIL_TOKEN = process.env.ZEPTOMAIL_TOKEN;
const ZEPTO_FROM_EMAIL_ADDRESS = "orders@setindiabiz.com"; // Or your verified sender address
const ZEPTO_FROM_NAME = "SetIndiaBiz Orders"; // Or your desired sender name

export async function POST(request) {
    // Basic validation for ZeptoMail config on the server
    if (!ZEPTOMAIL_TOKEN || !ZEPTO_FROM_EMAIL_ADDRESS) {
        console.error("SERVER ERROR: ZeptoMail Token or From Address not configured.");
        // Return a generic server error, don't expose config details
        return NextResponse.json({ success: false, message: "Email configuration error on server." }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Destructure and validate required fields from the request body
        const {
            payerName,
            payerEmail,
            directorFullName,
            dinToPay,
            rawMobile, // Expect raw data from frontend
            rawEmail,  // Expect raw data from frontend
            companyData
        } = body;

        if (!payerName || !payerEmail || !directorFullName || !dinToPay || !rawMobile || !rawEmail) {
            return NextResponse.json({ success: false, message: "Missing required details for sending email." }, { status: 400 });
        }

        // Construct HTML Body (using data received from frontend)
        const emailHtmlBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #0056b3; border-bottom: 1px solid #eee; padding-bottom: 10px;">Director Contact Unlocked</h2>
                    <p>Hello ${payerName},</p>
                    <p>Thank you for your payment. The contact details for the director you requested have been successfully unlocked:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
                        <h3 style="margin-top: 0; color: #333;">Director Details:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 8px;"><strong>Name:</strong> ${directorFullName}</li>
                            <li style="margin-bottom: 8px;"><strong>DIN:</strong> ${dinToPay}</li>
                            ${companyData?.company ? `<li style="margin-bottom: 8px;"><strong>Associated Company:</strong> ${companyData.company}</li>` : ''}
                            ${companyData?.cin ? `<li style="margin-bottom: 8px;"><strong>Company CIN:</strong> ${companyData.cin}</li>` : ''}
                            <li style="margin-bottom: 8px;">
                                <strong>Mobile:</strong>
                                <span style="color: #0056b3; font-weight: bold;">${rawMobile}</span>
                            </li>
                            <li style="margin-bottom: 8px;">
                                <strong>Email:</strong>
                                <span style="color: #0056b3; font-weight: bold;">${rawEmail}</span>
                            </li>
                        </ul>
                    </div>
                    <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
                        <strong>Important:</strong> Please copy these details for your records. Remember that circulation of this information is prohibited, and it should not be used for spamming purposes.
                    </p>
                    <p style="margin-top: 20px;">Thank you,<br/>The SetIndiaBiz Team</p>
                </div>
            </div>
        `;

        // Initialize ZeptoMail Client
        const client = new SendMailClient({ url: ZEPTOMAIL_API_URL, token: ZEPTOMAIL_TOKEN });

        // Send the email
        console.log(`API Route: Attempting to send unlock email to ${payerEmail}`);
        const response = await client.sendMail({
            "from": {
                "address": ZEPTO_FROM_EMAIL_ADDRESS,
                "name": ZEPTO_FROM_NAME
            },
            "to": [{
                "email_address": {
                    "address": payerEmail,
                    "name": payerName
                }
            }],
            "subject": `Unlocked Director Contact Details for DIN: ${dinToPay}`,
            "htmlbody": emailHtmlBody,
        });

        console.log("ZeptoMail API Response:", response); // Log Zepto's response

        // Check ZeptoMail response structure for success (adjust if needed based on actual response)
        // Assuming a successful response might have a 'data' array or similar
        if (response && (response.message === "OK" || (response.data && response.data.length > 0))) {
             console.log(`API Route: Unlock details email sent successfully via ZeptoMail to: ${payerEmail}`);
             return NextResponse.json({ success: true, message: "Email sent successfully." });
        } else {
             // Throw an error if ZeptoMail indicates failure
             throw new Error(response?.message || "ZeptoMail failed to send email.");
        }

    } catch (error) {
        console.error("API Route Error (send-unlock-email):", error);
        // Check for specific ZeptoMail error details if available
        const errorMessage = error.response?.data?.message || error.message || "Failed to send unlock email.";
        // Determine appropriate status code (e.g., 400 for bad input, 500 for server/Zepto error)
        const statusCode = error.response?.status || 500;
        return NextResponse.json({ success: false, message: errorMessage }, { status: statusCode });
    }
}
