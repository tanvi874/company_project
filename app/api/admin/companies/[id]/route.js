import dbConnect from 'lib/dbConnect';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import Company from 'lib/models/companyModel'; // Use @ alias or correct relative path

// --- Helper to check admin role (Implement Real Auth!) ---
async function isAdminUser(request) {
    // console.warn("API Authorization is using placeholder - Implement real auth check!");
    // Replace with your actual authentication/authorization logic
    return true;
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
        return NextResponse.json({ message: 'Invalid or missing Record ID' }, { status: 400 });
    }

    try {
        await dbConnect(); // Ensure DB connection
        // Fetch by MongoDB _id
        const companyRecord = await Company.findById(recordId).lean();

        if (!companyRecord) {
            return NextResponse.json({ message: 'Record not found' }, { status: 404 });
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

        return NextResponse.json(companyRecord); // Send the fetched record

    } catch (error) {
        console.error("API GET Error fetching company [id]:", error);
        // Handle potential CastError if findById fails with bad format despite validation
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ message: 'Invalid Company ID format during query' }, { status: 400 });
        }
        // Generic server error
        return NextResponse.json({ message: 'Internal Server Error fetching company data' }, { status: 500 });
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
    let updatedData;

    // --- Corrected ID Validation ---
    if (!recordId || !mongoose.Types.ObjectId.isValid(recordId)) { // Check if NOT valid
        return NextResponse.json({ message: 'Invalid or missing Record ID' }, { status: 400 });
    }

    try {
        // Get the update data from the request body
        updatedData = await request.json();
    } catch (error) {
        console.error("API PUT Error parsing JSON:", error);
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
     }

    try {
        await dbConnect(); // Ensure DB connection

        // Prepare update data (remove _id, convert types)
        delete updatedData._id; // Never update the _id

        // Add type conversions, checking for existence first
        if (updatedData.authorisedCapital != null) updatedData.authorisedCapital = parseFloat(updatedData.authorisedCapital);
        if (updatedData.paidUpCapital != null) updatedData.paidUpCapital = parseFloat(updatedData.paidUpCapital);
        if (updatedData.postalCode != null) updatedData.postalCode = parseInt(updatedData.postalCode, 10);
        if (updatedData.DirectorPermanentPincode != null) updatedData.DirectorPermanentPincode = parseInt(updatedData.DirectorPermanentPincode, 10);
        if (updatedData.DirectorPresentPincode != null) updatedData.DirectorPresentPincode = parseInt(updatedData.DirectorPresentPincode, 10);
        // Add conversion for DirectorDIN if necessary and if it's part of updatedData
        // if (updatedData.DirectorDIN != null) updatedData.DirectorDIN = Number(updatedData.DirectorDIN);

        // Update by MongoDB _id using findByIdAndUpdate
        const savedRecord = await Company.findByIdAndUpdate(
            recordId,
            { $set: updatedData }, // Use $set to update only provided fields
            { new: true, runValidators: true, lean: true } // Options: return updated doc, run schema validators, return plain object
        );

        if (!savedRecord) {
            return NextResponse.json({ message: 'Record not found for update' }, { status: 404 });
        }

        // Convert _id and DirectorDIN (if exists) back to string for the response
        if (savedRecord._id) {
            savedRecord._id = savedRecord._id.toString();
        }
        if (savedRecord.DirectorDIN != null) {
            savedRecord.DirectorDIN = savedRecord.DirectorDIN.toString();
        }

        return NextResponse.json(savedRecord); // Return the updated record

    } catch (error) {
        console.error("API PUT Error updating company [id]:", error);
        // Handle specific Mongoose errors
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ message: `Invalid data format: ${error.message}` }, { status: 400 });
        }
        if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ message: `Validation failed: ${error.message}` }, { status: 400 });
        }
        // Generic server error
        return NextResponse.json({ message: 'Internal Server Error saving company data' }, { status: 500 });
    }
}
