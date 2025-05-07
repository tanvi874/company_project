// app/api/payment/create-order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// --- Environment Variable Access ---
// Read keys from environment variables
const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_SECRET_KEY;

const razorpayInstance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export async function POST(request) {
  try {
    const body = await request.json(); // Get data from request body
    const { amount, currency, receipt, notes } = body;

    if (!amount || !currency) {
      return NextResponse.json({ success: false, message: 'Amount and currency are required.' }, { status: 400 });
    }

    const options = {
      amount: Number(amount),
      currency: currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
      notes: notes || {}
    };

    console.log("API Route: Creating Razorpay order:", options);
    const order = await razorpayInstance.orders.create(options);
    console.log("API Route: Razorpay Order Created:", order);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Razorpay order creation failed.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("API Route Error (create-order):", error);
    return NextResponse.json({ success: false, message: error.message || 'Could not initiate payment.' }, { status: 500 });
  }
}
