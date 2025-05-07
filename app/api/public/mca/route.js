// app/api/public/mca/route.js
import { NextResponse } from 'next/server';
import axios from 'axios'; // Make sure axios is installed in your main package.json

// Get external API details from environment variables
const EXTERNAL_MCA_API_URL = process.env.MCA_API_URL;
const MCA_API_KEY = process.env.MCA_API_KEY;

if (!EXTERNAL_MCA_API_URL || !MCA_API_KEY) {
  console.error("FATAL ERROR: MCA_API_URL or MCA_API_KEY is not defined.");
  // Optionally, throw an error during build or handle gracefully
}

export async function GET(request) {
  if (!EXTERNAL_MCA_API_URL || !MCA_API_KEY) {
     return NextResponse.json({ success: false, message: "MCA API configuration missing on server." }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    // Get 'q', 'cin', 'name' from the incoming request to this API route
    const q = searchParams.get('q');
    const cin = searchParams.get('cin');
    const name = searchParams.get('name');

    let queryValue = '';
    let isCinSearch = false;

    // Determine search term (same logic as your server.js)
    if (q && q.trim() !== '') {
        queryValue = q.trim();
        isCinSearch = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i.test(queryValue);
    } else if (cin && cin.trim() !== '') {
        queryValue = cin.trim();
        isCinSearch = true;
    } else if (name && name.trim() !== '') {
        queryValue = name.trim();
        isCinSearch = false;
    } else {
        return NextResponse.json({ success: false, message: "Please provide a search query (q), CIN, or Company Name." }, { status: 400 });
    }

    // Prepare parameters for the external MCA API call
    let externalApiParams = {
        'api-key': MCA_API_KEY,
        format: 'json',
        size: isCinSearch ? 5 : 20 // Adjust size as needed
    };

    if (isCinSearch) {
        externalApiParams['filters[CIN]'] = queryValue.toUpperCase();
    } else {
        externalApiParams['filters[CompanyName]'] = queryValue.toUpperCase(); // Use external filter
    }

    console.log("API Route: Calling External MCA API with params:", externalApiParams);

    // Make the actual call to the external MCA API
    const response = await axios.get(EXTERNAL_MCA_API_URL, { params: externalApiParams });
    console.log("API Route: Received response from External MCA API");

    let finalRecords = [];
    if (response.data && Array.isArray(response.data.records)) {
        let fetchedRecords = response.data.records;
        // Apply local filtering for name search if needed (same logic as your server.js)
        if (!isCinSearch) {
            try {
                const searchTerms = queryValue.toLowerCase().split(/\s+/).filter(term => term.length > 0);
                if (searchTerms.length > 0) {
                    finalRecords = fetchedRecords.filter(record => {
                        if (!record.CompanyName) return false;
                        const companyNameLower = record.CompanyName.toLowerCase();
                        return searchTerms.every(term => companyNameLower.includes(term));
                    });
                } else {
                    finalRecords = [];
                }
                console.log(`API Route: Found ${finalRecords.length} records after local filter.`);
            } catch (filterError) {
                console.error("API Route: Error during local filtering:", filterError);
                finalRecords = [];
            }
        } else {
             // For CIN search, just filter for basic validity
             finalRecords = fetchedRecords.filter(rec => rec.CIN && rec.CompanyName);
        }
    }

    // --- Respond ---
    if (finalRecords.length > 0) {
        return NextResponse.json({ success: true, data: finalRecords });
    } else {
        console.log("API Route: No records found matching criteria.");
        return NextResponse.json({ success: false, message: 'No company found matching your search criteria.' }, { status: 404 });
    }

  } catch (error) {
    console.error('API Route Error (public/mca):', error.response?.status, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = status === 404
        ? 'No company found matching your search criteria (Source API error).'
        : 'Error fetching data from external API.';
    return NextResponse.json({ success: false, message: message }, { status: status });
  }
}
