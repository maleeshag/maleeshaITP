const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUS = require('../constants/payment.constant');

const PaymentSchema = new Schema(
  {
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(STATUS),
    },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    price: { type: Number,
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: 'Price must be a positive value'
      },
      required: true, },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
