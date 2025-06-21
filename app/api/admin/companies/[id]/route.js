import dbConnect from 'lib/dbConnect';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Company from 'lib/models/companyModel';

// --- CORS Headers ---
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://company-site-56dec1.webflow.io', // Your Webflow domain
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


// --- Helper to check admin role (Implement Real Auth!) ---
async function isAdminUser(request) {
    // console.warn("API Authorization is using placeholder - Implement real auth check!");
    // Replace with your actual authentication/authorization logic
    return true;
}

// --- OPTIONS Handler for Preflight Requests ---
export async function OPTIONS(request) {
    return new NextResponse(null, { headers: corsHeaders });
}

// --- GET Handler: Fetch specific record by _id ---
export async function GET(request, { params }) { // <-- Use { params } directly
    const isAdmin = await isAdminUser(request);
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    // }

    // --- Access id directly from params ---
    const recordId = params.id;

    // --- Corrected ID Validation ---
    if (!recordId || !mongoose.Types.ObjectId.isValid(recordId)) { // Check if NOT valid
        return NextResponse.json({ message: 'Invalid or missing Record ID' }, { status: 400, headers: corsHeaders });
    }

    try {
        await dbConnect(); // Ensure DB connection
        // Fetch by MongoDB _id
        const companyRecord = await Company.findById(recordId).lean();

        if (!companyRecord) {
            return NextResponse.json({ message: 'Record not found' }, { status: 404, headers: corsHeaders });
        }

        // Convert _id and DirectorDIN (if exists) to string before sending response
        // Mongoose lean() might return BSON ObjectId, ensure it's stringified
        if (companyRecord._id) {
            companyRecord._id = companyRecord._id.toString();
        }
        // Check for null/undefined before converting DirectorDIN
        if (companyRecord.DirectorDIN != null) {
            companyRecord.DirectorDIN = companyRecord.DirectorDIN.toString();
        }
        // Add similar checks for other ObjectId or non-string fields if needed

        return NextResponse.json({ success: true, company: companyRecord }, { headers: corsHeaders }); // Send the fetched record

    } catch (error) {
        console.error("API GET Error fetching company [id]:", error);
        // Handle potential CastError if findById fails with bad format despite validation
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ message: 'Invalid Company ID format during query' }, { status: 400, headers: corsHeaders  });
        }
        // Generic server error
        return NextResponse.json({ message: 'Internal Server Error fetching company data' }, { status: 500, headers: corsHeaders  });
        
    }
}

// --- PUT Handler: Update specific record by _id ---
export async function PUT(request, { params }) { // <-- Use { params } directly
    const isAdmin = await isAdminUser(request);
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    // }

    // --- Access id directly from params ---
    const recordId = params.id;
    let payload;

    // --- Corrected ID Validation ---
    if (!recordId || !mongoose.Types.ObjectId.isValid(recordId)) { // Check if NOT valid
        return NextResponse.json({ message: 'Invalid or missing Record ID' }, { status: 400, headers: corsHeaders });
    }
    
    try {
        // Get the update data from the request body
        payload = await request.json();
    } catch (error) {
        console.error("API PUT Error parsing JSON:", error);
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400, headers: corsHeaders });
     }

    const { companyUpdates, directorUpdates } = payload;

    if (!companyUpdates && !directorUpdates) {
        return NextResponse.json({ message: 'Request body must contain companyUpdates or directorUpdates' }, { status: 400, headers: corsHeaders });
    }

    try {
        await dbConnect(); // Ensure DB connection

        const updateOps = {};

        // Prepare company updates
        if (companyUpdates && Object.keys(companyUpdates).length > 0) {
            // Mongoose will handle casting, but we ensure numbers are numbers
            if (companyUpdates.authorisedCapital != null) companyUpdates.authorisedCapital = parseFloat(companyUpdates.authorisedCapital) || 0;
            if (companyUpdates.paidUpCapital != null) companyUpdates.paidUpCapital = parseFloat(companyUpdates.paidUpCapital) || 0;
            if (companyUpdates.postalCode != null) companyUpdates.postalCode = parseInt(companyUpdates.postalCode, 10) || 0;
            if (companyUpdates.mainDivision != null) companyUpdates.mainDivision = parseInt(companyUpdates.mainDivision, 10) || 0;
            
            delete companyUpdates._id;
            updateOps.$set = { ...companyUpdates };
        }

        // Prepare director updates (assuming 'directors' is the path in the Company schema)
        if (directorUpdates && Array.isArray(directorUpdates)) {
            if (!updateOps.$set) {
                updateOps.$set = {};
            }
            // Mongoose will cast the array of objects. The frontend script already handles number conversion.
            updateOps.$set.directors = directorUpdates;
        }

        // Update by MongoDB _id using findByIdAndUpdate
        const savedRecord = await Company.findByIdAndUpdate(
            recordId,
            updateOps,
            { new: true, runValidators: true, lean: true } // Options: return updated doc, run schema validators, return plain object
        );

        if (!savedRecord) {
            return NextResponse.json({ message: 'Record not found for update' }, { status: 404, headers: corsHeaders });
        }

        // Convert _id and DirectorDIN (if exists) back to string for the response
        if (savedRecord._id) {
            savedRecord._id = savedRecord._id.toString();
        }
        if (savedRecord.DirectorDIN != null) {
            savedRecord.DirectorDIN = savedRecord.DirectorDIN.toString();
        }

        return NextResponse.json({ success: true, message: 'Record updated successfully', company: savedRecord }, { headers: corsHeaders });

    } catch (error) {
        console.error("API PUT Error updating company [id]:", error);
        // Handle specific Mongoose errors
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ message: `Invalid data format: ${error.message}` }, { status: 400, headers: corsHeaders });
        }
        if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ message: `Validation failed: ${error.message}` }, { status: 400, headers: corsHeaders });
        }
        // Generic server error
        return NextResponse.json({ message: 'Internal Server Error saving company data' }, { status: 500, headers: corsHeaders });
    }
}
