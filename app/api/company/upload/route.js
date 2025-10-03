import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Company from "../../../../lib/models/companyModel";
import csvParser from 'csv-parser';
import { Readable } from 'stream';

// Helper function to format specific fields and ensure CIN exists/trimmed
const formatData = (row) => {
    // Add check for cin existence and type before trimming
    if (!row.cin || typeof row.cin !== 'string') {
        console.warn("Skipping row during parsing due to missing or invalid CIN:", row);
        return null; // Indicate row should be skipped during parsing
    }
    return {
        ...row,
        cin: row.cin.trim(),
        // Attempt number conversions, fallback to original value if NaN
        registrationNumber: isNaN(row.registrationNumber) ? row.registrationNumber : Number(row.registrationNumber),
        DirectorDIN: isNaN(row.DirectorDIN) ? row.DirectorDIN : Number(row.DirectorDIN),
        postalCode: isNaN(row.postalCode) ? row.postalCode : Number(row.postalCode),
        DirectorMobileNumber: isNaN(row.DirectorMobileNumber) ? row.DirectorMobileNumber : Number(row.DirectorMobileNumber),
        DirectorPermanentPincode: isNaN(row.DirectorPermanentPincode) ? row.DirectorPermanentPincode : Number(row.DirectorPermanentPincode),
        DirectorPresentPincode: isNaN(row.DirectorPresentPincode) ? row.DirectorPresentPincode : Number(row.DirectorPresentPincode),
        // Ensure capitals are numbers if present, otherwise null/original
        authorisedCapital: row.authorisedCapital && !isNaN(row.authorisedCapital) ? Number(row.authorisedCapital) : (row.authorisedCapital ?? null),
        paidUpCapital: row.paidUpCapital && !isNaN(row.paidUpCapital) ? Number(row.paidUpCapital) : (row.paidUpCapital ?? null),
    };
};

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  const headers = {
    'Access-Control-Allow-Origin': origin || '*', // Allow the origin of the request
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow POST and OPTIONS methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow Content-Type and Authorization headers
    'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
  };

  return new NextResponse(null, { headers });
}

export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const file = formData.get('file'); // Assuming input name is 'file'

    if (!file) {
        return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Optional: Server-side file type check
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        return NextResponse.json({ success: false, message: 'Invalid file type. Only CSV is allowed.' }, { status: 400 });
    }

    const sourceFileName = file.name; // Get the filename
    console.log(`Processing file: ${sourceFileName}`);

    // --- File Duplicate Check Logic (Based on Filename) ---
    const existingRecordWithFilename = await Company.findOne({ sourceFileName: sourceFileName }).lean(); // Check if any record has this filename
    if (existingRecordWithFilename) {
        console.log(`Filename already processed: ${sourceFileName}`);
        return NextResponse.json({ success: false, message: `A file named "${sourceFileName}" has already been processed.` }, { status: 409 }); // 409 Conflict
    }
    // --- End File Duplicate Check ---

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // Convert buffer to a readable stream for parsing
    const readableFileStream = new Readable();
    readableFileStream.push(fileBuffer);
    readableFileStream.push(null); // Signal end of stream

    const jsonData = [];
    await new Promise((resolve, reject) => {
        readableFileStream
            .pipe(csvParser())
             // Single 'data' handler
            .on('data', (row) => {
                const formattedRow = formatData(row);
                // Add sourceFileName to each valid row
                if (formattedRow) {
                    formattedRow.sourceFileName = sourceFileName;
                }
                if (formattedRow) { // Check if formatData returned a valid object
                    jsonData.push(formattedRow);
                }

            })
            .on('end', resolve)
             // Single 'error' handler
            .on('error', (error) => {
                console.error('CSV Parsing Error:', error);
                // Reject the promise with a specific error message
                reject(new Error('Error parsing CSV file. Check file format and content.'));
            });
    });


    if (jsonData.length === 0) {
        console.log(`No valid data found after parsing CSV: ${sourceFileName}. Check CIN column and file content.`);
        return NextResponse.json({ success: false, message: "CSV file is empty, invalid, or contains no valid rows with a CIN." }, { status: 400 });
    }


    // 4. Insert only the new data
    let insertedCount = 0;
    if (jsonData.length > 0) {
        console.log(`Attempting to insert all ${jsonData.length} parsed records from file ${sourceFileName}...`);
        try {
            // Use the 'Company' model to insert
            // ordered: false allows inserting non-duplicates even if some fail due to CIN index
            const insertResult = await Company.insertMany(jsonData, { ordered: false });
            insertedCount = insertResult.length; // Docs successfully inserted in this batch
            console.log(`Successfully inserted ${insertedCount} records from file ${sourceFileName}.`);
        } catch (insertError) {
            // Handle potential errors during insertMany, especially if CIN index catches duplicates missed by the pre-check
            console.error(`Error during insertMany for file ${sourceFileName}:`, insertError);
            // Handle potential errors during insertMany
            throw insertError; // Re-throw errors to be caught by the main catch block
        }
    }
  

    // Corrected success response
    return NextResponse.json({
      success: true,
      message: `CSV processed successfully. Attempted to insert ${jsonData.length} records. Successfully inserted ${insertedCount} records from file ${sourceFileName}.`,
      insertedCount: insertedCount,
    });

  } catch (error) {
    // Main catch block for parsing errors or unexpected insertion errors
    console.error("API Route Error (upload):", error);

    let errorMessage = "Failed to process CSV due to a server error.";
    let statusCode = 500;

    if (error.message.includes('parsing CSV')) {
        errorMessage = error.message; // Use the specific parsing error message
        statusCode = 400; // Bad request for parsing errors
    } else if (error.code === 11000) { // MongoDB duplicate key error (could be sourceFileName index or other unique indexes)
        errorMessage = `Database error during insertion: ${error.message}`;
        statusCode = 409; // Conflict status code
    }
    return NextResponse.json({ success: false, message: errorMessage, error: error.message }, { status: statusCode });
  }
}
