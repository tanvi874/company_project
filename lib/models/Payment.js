const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { // Link payment to the user who made it
        type: String, // Or mongoose.Schema.Types.ObjectId if linking to a User collection
        required: true,
        index: true // Index for faster querying
    },
    razorpay_payment_id: {
        type: String,
        required: true,
        unique: true // Ensure payment IDs are unique
    },
    razorpay_order_id: {
        type: String,
        required: true,
        index: true
    },
    razorpay_signature: { // Store signature for reference/audit
        type: String,
        required: true,
    },
    amount: { // Store amount in paise
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: { // Store the final status from Razorpay/verification
        type: String,
        required: true,
        default: 'captured' // Or 'created', 'failed', etc.
    },
    dinUnlocked: { // Store which DIN was unlocked
        type: String,
        required: false, // Make required if always applicable
    },
    directorName: { // Store director name for display
        type: String,
        required: false,
    },
    paymentDate: { // Timestamp of successful payment verification
        type: Date,
        default: Date.now,
    },
    // Add any other relevant fields from notes or user context
    payerName: String,
    payerEmail: String,
    payerPhone: String,

}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Check if the model already exists before defining it
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

module.exports = Payment;
