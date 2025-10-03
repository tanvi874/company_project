import dbConnect from '../../../../../lib/dbConnect';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import Company from '../../../../../lib/models/companyModel';

// --- CORS Headers ---
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
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
export async function GET(request, { params }) {
    const isAdmin = await isAdminUser(request);
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    // }

    const recordId = params.id;

    if (!recordId || !mongoose.Types.ObjectId.isValid(recordId)) {
        return NextResponse.json({ message: 'Invalid or missing Record ID' }, { status: 400, headers: corsHeaders });
    }

    try {
        await dbConnect();
        const companyRecord = await Company.findById(recordId).lean();

        if (!companyRecord) {
            return NextResponse.json({ message: 'Record not found' }, { status: 404, headers: corsHeaders });
        }

        // The frontend expects a plain object with string IDs.
        // Mongoose's lean() returns a plain object, but ObjectIds need to be stringified.
        if (companyRecord._id) {
            companyRecord._id = companyRecord._id.toString();
        }
        // Director fields are now top-level, so no need to map a 'directors' array.
        // Just ensure DirectorDIN is a string if it exists.
        if (companyRecord.DirectorDIN != null) {
            companyRecord.DirectorDIN = companyRecord.DirectorDIN.toString();
        }

        // The frontend expects the company object directly, not nested under a 'company' key.
        return NextResponse.json(companyRecord, { headers: corsHeaders });

    } catch (error) {
        console.error("API GET Error fetching company [id]:", error);
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ message: 'Invalid Company ID format during query' }, { status: 400, headers: corsHeaders  });
        }
        return NextResponse.json({ message: 'Internal Server Error fetching company data' }, { status: 500, headers: corsHeaders  });
    }
}

// --- PUT Handler: Update specific record by _id ---
export async function PUT(request, { params }) {
    const isAdmin = await isAdminUser(request);
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    // }

    const recordId = params.id;
    let payload;

    if (!recordId || !mongoose.Types.ObjectId.isValid(recordId)) {
        return NextResponse.json({ message: 'Invalid or missing Record ID' }, { status: 400, headers: corsHeaders });
    }
    
    try {
        // Frontend now sends a single flat object with all company and director fields
        payload = await request.json();
    } catch (error) {
        console.error("API PUT Error parsing JSON:", error);
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400, headers: corsHeaders });
     }

    try {
        await dbConnect();

        // Sanitize payload to prevent updating immutable or protected fields.
        delete payload._id;
        delete payload.cin; // CIN should not be changed via this endpoint.
        delete payload.__v;

        // Ensure DirectorDIN is stored as a String if it exists and is a number.
        // Mongoose will handle type casting if the schema is defined correctly,
        // but explicit conversion here ensures consistency if it's coming as a number from frontend.
        if (payload.DirectorDIN != null) {
            payload.DirectorDIN = String(payload.DirectorDIN);
        }

        // Update by MongoDB _id using findByIdAndUpdate
        // Mongoose will automatically map top-level fields to the schema.
        const savedRecord = await Company.findByIdAndUpdate(
            recordId,
            { $set: payload }, // Use the flat payload from the form. Mongoose will ignore fields not in the schema.
            { new: true, runValidators: true, lean: true } // Options: return updated doc, run schema validators, return plain object
        );

        if (!savedRecord) {
            return NextResponse.json({ message: 'Record not found for update' }, { status: 404, headers: corsHeaders });
        }

        // Ensure _id and DirectorDIN are strings for the frontend response
        if (savedRecord._id) {
            savedRecord._id = savedRecord._id.toString();
        }
        if (savedRecord.DirectorDIN != null) {
            savedRecord.DirectorDIN = String(savedRecord.DirectorDIN);
        }

        // Return the updated record directly, matching the frontend's expectation.
        return NextResponse.json({ success: true, message: 'Company details updated successfully', company: savedRecord }, { headers: corsHeaders });

    } catch (error) {
        console.error("API PUT Error updating company [id]:", error);
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ message: `Invalid data format: ${error.message}` }, { status: 400, headers: corsHeaders });
        }
        if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ message: `Validation failed: ${error.message}` }, { status: 400, headers: corsHeaders });
        }
        return NextResponse.json({ message: 'Internal Server Error saving company data' }, { status: 500, headers: corsHeaders });
    }
}
