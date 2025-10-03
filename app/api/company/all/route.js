// app/api/company/all/route.js (Example path)
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Company from '../../../../lib/models/companyModel';

export async function GET(request) {
  await dbConnect();
  try {
    // Note: req.body is not directly available in GET. If filtering was intended,
    // it should come from searchParams. Fetching ALL documents can be heavy.
    // Consider adding pagination or specific filters via searchParams if needed.
    // const { searchParams } = new URL(request.url);
    // const page = searchParams.get('page') || 1;
    // const limit = searchParams.get('limit') || 50; // Example pagination

    const totalcount = await Company.countDocuments().exec(); // Count all
    const companyData = await Company.find()
      // .limit(limit * 1) // Example pagination
      // .skip((page - 1) * limit) // Example pagination
      .lean() // Use lean for performance if full Mongoose docs aren't needed
      .exec();

    return NextResponse.json({
      success: true,
      message: "Data loaded",
      total: totalcount,
      data: companyData,
      // currentPage: page, // Example pagination
      // totalPages: Math.ceil(totalcount / limit) // Example pagination
    });

  } catch (error) {
    console.error("API Route Error (getall):", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
