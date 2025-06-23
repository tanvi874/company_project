import { NextResponse } from 'next/server';
import dbConnect from 'lib/dbConnect';
import mongoose from 'mongoose';
import Company from 'lib/models/companyModel';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://company-site-56dec1.webflow.io',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/admin/companies/[id]
export async function GET(req, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400, headers: corsHeaders });
  }

  try {
    await dbConnect();
    const company = await Company.findById(id).lean();

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404, headers: corsHeaders });
    }

    // Convert _id and nested _ids to strings
    company._id = company._id.toString();
    if (Array.isArray(company.directors)) {
      company.directors = company.directors.map((d) => ({
        ...d,
        _id: d._id?.toString(),
        DirectorDIN: d.DirectorDIN?.toString(),
      }));
    }

    return NextResponse.json({ company }, { headers: corsHeaders });
  } catch (err) {
    console.error('[GET Company]', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500, headers: corsHeaders });
  }
}

// PUT /api/admin/companies/[id]
export async function PUT(req, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400, headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    delete payload._id;
    delete payload.__v;
    delete payload.cin; // Don't allow CIN updates

    await dbConnect();
    const updatedCompany = await Company.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      lean: true,
    });

    if (!updatedCompany) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404, headers: corsHeaders });
    }

    updatedCompany._id = updatedCompany._id.toString();
    if (Array.isArray(updatedCompany.directors)) {
      updatedCompany.directors = updatedCompany.directors.map((d) => ({
        ...d,
        _id: d._id?.toString(),
        DirectorDIN: d.DirectorDIN?.toString(),
      }));
    }

    return NextResponse.json({ company: updatedCompany, success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error('[PUT Company]', err);
    return NextResponse.json({ message: 'Update failed', error: err.message }, { status: 500, headers: corsHeaders });
  }
}
