// app/api/company/getcompany/route.js
import { NextResponse } from 'next/server';
import dbConnect from 'lib/dbConnect'; // Use alias @ for root
import Company from '../../../../lib/models/companyModel';

// Handle CORS preflight requests
export async function OPTIONS(request) {
  // Define your allowed origins
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']; // Add your Webflow domain and any local dev domains
  const requestOrigin = request.headers.get('origin');

  const headers = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET and OPTIONS methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // IMPORTANT: Allow Authorization header
    'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
  };

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin;
  }

  return new NextResponse(null, { status: 204, headers }); // 204 No Content is typical for OPTIONS
}


export async function GET(request) {
  await dbConnect(); // Ensure DB connection

  try {
    const { searchParams } = new URL(request.url);
    const cin = searchParams.get('cin');
    const name = searchParams.get('name');

    if (cin) {
      // --- CIN Search Logic (from your controller) ---
      const filter = { cin: new RegExp('^' + cin + '$', 'i') };
      console.log("API Route: Searching company (CIN):", filter);
      const primaryCompanyData = await Company.findOne(filter).lean().exec();
      if (!primaryCompanyData) {
        return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
      }
      const allDirectorRecords = await Company.find({ cin: primaryCompanyData.cin }).lean().exec();
      return NextResponse.json({
        success: true,
        companyDetails: primaryCompanyData,
        directorRecords: allDirectorRecords,
      });

    } else if (name) {
      // --- Name Search Logic (from your controller - using aggregate) ---
      const filter = { company: new RegExp(name, 'i') };
      console.log("API Route: Searching companies (Name):", filter);
      const matchingCompanies = await Company.aggregate([
        { $match: filter },
        { $group: { _id: "$cin", companyName: { $first: "$company" } } },
        { $project: { _id: 0, CIN: "$_id", CompanyName: "$companyName" } },
        { $limit: 10 }
      ]).exec();
      if (!matchingCompanies || matchingCompanies.length === 0) {
         return NextResponse.json({ success: false, message: "Not found", data: [] }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: matchingCompanies });

    } else {
      return NextResponse.json({ success: false, message: "Missing search criteria" }, { status: 400 });
    }
  } catch (error) {
    console.error("API Route Error (getcompany):", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
