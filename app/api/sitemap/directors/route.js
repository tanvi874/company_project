// app/api/sitemap/directors/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Company from '../../../../lib/models/companyModel';

export async function GET(request) {
  await dbConnect();
  try {
    console.log("API Route: Fetching director identifiers for sitemap...");

    // Aggregate logic is the same as your controller
    const directors = await Company.aggregate([
      { 
        $match: {
          DirectorDIN: { $exists: true, $ne: null },
          DirectorFirstName: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: "$DirectorDIN",
          DirectorFirstName: { $first: "$DirectorFirstName" },
          DirectorLastName: { $first: "$DirectorLastName" }
        }
      },
      {
        $project: {
          _id: 0,
          din: "$_id",
          firstName: "$DirectorFirstName",
          lastName: "$DirectorLastName"
        }
      }
       // Add $limit if needed
    ]).exec();

    console.log(`API Route: Found ${directors.length} unique directors for sitemap.`);
    return NextResponse.json({ success: true, data: directors });

  } catch (error) {
    console.error("API Route Error (getDirectorSitemapData):", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
