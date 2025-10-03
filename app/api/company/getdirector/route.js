// app/api/company/getdirector/route.js
import { NextResponse } from 'next/server';
import dbConnect from 'lib/dbConnect'; // Adjust path
import Company from '../../../../lib/models/companyModel'; // Adjust path

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const din = searchParams.get('din');
    const name = searchParams.get('name');

    let filter = {};
    let searchCriteriaProvided = false;

    // --- Build Filter Logic (same as your controller) ---
    if (din) {
        const dinAsNumber = Number(din);
        filter.$or = [{ DirectorDIN: din }];
        if (!isNaN(dinAsNumber)) {
            filter.$or.push({ DirectorDIN: dinAsNumber });
        }
        searchCriteriaProvided = true;
        console.log("API Route: Searching director (DIN):", JSON.stringify(filter));
    } else if (name) {
        const nameParts = name.split(' ').filter(part => part.length > 0);
        if (nameParts.length > 0) {
            if (nameParts.length === 1) {
                const searchTermPart = nameParts[0];
                const nameRegex = new RegExp('^' + searchTermPart, 'i');
                filter.DirectorFirstName = nameRegex;
                console.log("API Route: Searching director (Single Word):", JSON.stringify(filter));
            } else {
                const conditions = nameParts.map(part => {
                    const nameRegex = new RegExp(part, 'i');
                    return { $or: [{ DirectorFirstName: nameRegex }, { DirectorLastName: nameRegex }] };
                });
                filter.$and = conditions;
                console.log("API Route: Searching director (Multi Word):", JSON.stringify(filter));
            }
            searchCriteriaProvided = true;
        }
    }
    // --- End Filter Logic ---

    if (!searchCriteriaProvided) {
        return NextResponse.json({ success: false, message: "Missing search criteria." }, { status: 400 });
    }

    console.log("API Route: Final director filter:", JSON.stringify(filter));
    const directorRecords = await Company.find(filter).limit(15).lean().exec();

    if (!directorRecords || directorRecords.length === 0) {
        return NextResponse.json({
            success: false,
            message: "Director not found.",
            data: []
        }, { status: 404 });
    }

    // Return the array of director records
    return NextResponse.json({
        success: true,
        message: "Director records loaded.",
        data: directorRecords,
    });

  } catch (error) {
    console.error("API Route Error (getdirector):", error);
    return NextResponse.json({
        success: false,
        message: "Internal Server Error",
        error: error.message
    }, { status: 500 });
  }
}
