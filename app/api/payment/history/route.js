// app/api/payment/history/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Payment from '../../../../lib/models/Payment'; 

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // IMPORTANT: Securely get/validate userId!

    if (!userId) {
        return NextResponse.json({ success: false, message: 'User ID is required.' }, { status: 400 });
    }

    console.log("API Route: Fetching payment history for user:", userId);

    const history = await Payment.find({ userId: userId })
                                 .sort({ paymentDate: -1 }) // Use paymentDate or createdAt
                                 .lean(); // Use lean if full docs not needed

    console.log(`API Route: Found ${history.length} payment records for user ${userId}`);
    return NextResponse.json({ success: true, history: history });

  } catch (error) {
    console.error("API Route Error (payment/history):", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to retrieve payment history.' }, { status: 500 });
  }
}
