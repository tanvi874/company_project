// app/api/sitemap/companies/route.js
import { NextResponse } from 'next/server';
import dbConnect from 'lib/dbConnect';
import Company from 'lib/models/companyModel';

export async function GET(request) {
  await dbConnect();
  try {
    console.log("API Route: Fetching company identifiers for sitemap...");

    // Aggregate logic is the same as your controller
    const companies = await Company.aggregate([
      // Match criteria might need adjustment based on your final Company model fields
      { $match: { cin: { $exists: true, $ne: null }, company: { $exists: true, $ne: null } } },
      { $group: { _id: "$cin", companyName: { $first: "$company" } } },
      { $project: { _id: 0, cin: "$_id", name: "$companyName" } }
      // Add $limit if needed, e.g., { $limit: 50000 } if there's a limit
    ]).exec();

    console.log(`API Route: Found ${companies.length} unique companies for sitemap.`);
    return NextResponse.json({ success: true, data: companies });

  } catch (error) {
    console.error("API Route Error (getCompanySitemapData):", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
