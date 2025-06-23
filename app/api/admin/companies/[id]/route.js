import dbConnect from 'lib/dbConnect';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Company from 'lib/models/companyModel';

// --- CORS Headers ---
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://company-site-56dec1.webflow.io', // Your Webflow domain
    'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET and OPTIONS for search
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Crucially, allow Authorization header
};

// --- Helper to check admin role (Implement Real Auth!) ---
async function isAdminUser(request) {
    // In a real application, you would verify the token here.
    // For now, it always returns true as per your existing code.
    return true;
}

// --- OPTIONS Handler for Preflight Requests ---
export async function OPTIONS(request) {
    return new NextResponse(null, { headers: corsHeaders });
}

// --- GET Handler: Search companies by name or CIN ---
export async function GET(request) {
    const isAdmin = await isAdminUser(request);
    // if (!isAdmin) {
    //     return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const cin = searchParams.get('cin');
    const name = searchParams.get('name');

    if (!cin && !name) {
        return NextResponse.json({ success: false, message: 'Please provide a CIN or company name for search.' }, { status: 400, headers: corsHeaders });
    }

    try {
        await dbConnect();
        let query = {};
        let result;

        if (cin) {
            // Search by CIN (exact match)
            query = { cin: cin };
            result = await Company.findOne(query).lean();
            if (result) {
                // Ensure _id and DirectorDIN are strings for frontend
                result._id = result._id.toString();
                if (result.DirectorDIN != null) {
                    result.DirectorDIN = result.DirectorDIN.toString();
                }
                return NextResponse.json({ success: true, message: 'Company found', company: result }, { headers: corsHeaders });
            } else {
                return NextResponse.json({ success: false, message: 'Company not found for the given CIN.' }, { status: 404, headers: corsHeaders });
            }
        } else if (name) {
            // Search by name (case-insensitive partial match)
            query = { company: { $regex: name, $options: 'i' } };
            const companies = await Company.find(query).lean();
            // Ensure _id and DirectorDIN are strings for frontend for all results
            const formattedCompanies = companies.map(comp => {
                comp._id = comp._id.toString();
                if (comp.DirectorDIN != null) {
                    comp.DirectorDIN = comp.DirectorDIN.toString();
                }
                return comp;
            });
            return NextResponse.json({ success: true, message: 'Companies found', companies: formattedCompanies }, { headers: corsHeaders });
        }

    } catch (error) {
        console.error("API GET Error searching companies:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error during search' }, { status: 500, headers: corsHeaders });
    }
}
