// d:\CompanyWebsite\app\api\report-change\route.js
import { NextResponse } from 'next/server';
import { SendMailClient } from "zeptomail";

// --- ZeptoMail Configuration (Server-Side) ---
const ZEPTOMAIL_API_URL = "api.zeptomail.com/";
// IMPORTANT: Use the non-public environment variable here
const ZEPTOMAIL_TOKEN = process.env.ZEPTOMAIL_TOKEN;
const ZEPTO_FROM_EMAIL_ADDRESS = "orders@setindiabiz.com"; // Or your verified sender address
const ZEPTO_FROM_NAME = "SetIndiaBiz Feedback"; // Or a suitable sender name
const ZEPTO_TO_EMAIL_ADDRESS = "tanvi.bhasin@hatrotech.com"; // Target recipient
const ZEPTO_TO_NAME = "Tanvi Bhasin"; // Target recipient name

export async function POST(request) {
    // Basic validation for ZeptoMail config on the server
    if (!ZEPTOMAIL_TOKEN || !ZEPTO_FROM_EMAIL_ADDRESS) {
        console.error("SERVER ERROR: ZeptoMail Token or From Address not configured.");
        return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Destructure and validate required fields from the request body
        const {
            reporterName, // Renamed from from_name for clarity
            reporterEmail, // Renamed from from_email
            reportMessage, // Renamed from message
            companyName,
            companyCin
        } = body;

        if (!reporterName || !reporterEmail || !reportMessage || !companyName || !companyCin) {
            return NextResponse.json({ success: false, message: "Missing required fields for reporting change." }, { status: 400 });
        }

        // Construct Email Body (Plain text or HTML)
        const emailSubject = `Change Report for Company: ${companyName} (CIN: ${companyCin})`;
        const emailHtmlBody = `
            <div style="font-family: sans-serif; line-height: 1.5;">
                <h2>Company Change Report Received</h2>
                <p>A change has been reported for the following company:</p>
                <ul>
                    <li><strong>Company Name:</strong> ${companyName}</li>
                    <li><strong>CIN:</strong> ${companyCin}</li>
                </ul>
                <hr>
                <p><strong>Reported By:</strong></p>
                <ul>
                    <li><strong>Name:</strong> ${reporterName}</li>
                    <li><strong>Email:</strong> ${reporterEmail}</li>
                </ul>
                <p><strong>Message:</strong></p>
                <p style="background-color: #f0f0f0; padding: 10px; border-radius: 4px;">
                    ${reportMessage.replace(/\n/g, '<br>')}
                </p>
                <p><i>Please review this report.</i></p>
            </div>
        `;

        // Initialize ZeptoMail Client
        const client = new SendMailClient({ url: ZEPTOMAIL_API_URL, token: ZEPTOMAIL_TOKEN });

        // Send the email
        console.log(`API Route: Attempting to send change report email to ${ZEPTO_TO_EMAIL_ADDRESS}`);
        const response = await client.sendMail({
            "from": {
                "address": ZEPTO_FROM_EMAIL_ADDRESS,
                "name": ZEPTO_FROM_NAME
            },
            "to": [{
                "email_address": {
                    "address": ZEPTO_TO_EMAIL_ADDRESS,
                    "name": ZEPTO_TO_NAME
                }
            }],
            // Optionally CC or BCC the reporter if needed (check privacy implications)
            // "cc": [{ "email_address": { "address": reporterEmail, "name": reporterName } }],
            "reply_to": [{ // Set reply-to so replies go to the reporter
                "address": reporterEmail,
                "name": reporterName
            }],
            "subject": emailSubject,
            "htmlbody": emailHtmlBody,
        });

        console.log("ZeptoMail API Response:", response);

        // Check ZeptoMail response structure for success
        if (response && (response.message === "OK" || (response.data && response.data.length > 0))) {
             console.log(`API Route: Change report email sent successfully to: ${ZEPTO_TO_EMAIL_ADDRESS}`);
             return NextResponse.json({ success: true, message: "Report sent successfully." });
        } else {
             throw new Error(response?.message || "ZeptoMail failed to send email.");
        }

    } catch (error) {
        console.error("API Route Error (report-change):", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to send report.";
        const statusCode = error.response?.status || 500;
        return NextResponse.json({ success: false, message: errorMessage }, { status: statusCode });
    }
}
