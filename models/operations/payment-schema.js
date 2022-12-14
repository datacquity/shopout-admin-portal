// const mongoose = require('mongoose');
// const { Schema, model } = mongoose;

// const paymentSchema = new Schema({
//   response: {
//     errorCode: { type: Schema.Types.String },
//     message: { type: Schema.Types.String },
//     responseCode: { type: Schema.Types.String },
//     result: {
//       "addedon": { type: Schema.Types.String },
//       "additionalCharges": { type: Schema.Types.String },
//       "additional_param": { type: Schema.Types.String },
//       "address1": { type: Schema.Types.String },
//       "address2": { type: Schema.Types.String },
//       "amount": { type: Schema.Types.String },
//       "amount_split": { type: Schema.Types.String },
//       "bank_ref_num": { type: Schema.Types.String },
//       "bankcode": { type: Schema.Types.String },
//       "baseUrl": { type: Schema.Types.String },
//       "calledStatus": { type: Schema.Types.String },
//       "cardToken": { type: Schema.Types.String },
//       "card_merchant_param": { type: Schema.Types.String },
//       "card_type": { type: Schema.Types.String },
//       "cardnum": { type: Schema.Types.String },
//       "city": { type: Schema.Types.String },
//       "country": { type: Schema.Types.String },
//       "createdOn": { type: Schema.Types.Date },
//       "discount": { type: Schema.Types.String },
//       "email": { type: Schema.Types.String },
//       "encryptedPaymentId": { type: Schema.Types.String },
//       "error": { type: Schema.Types.String },
//       "error_Message": { type: Schema.Types.String },
//       "fetchAPI": { type: Schema.Types.String },
//       "field1": { type: Schema.Types.String },
//       "field2": { type: Schema.Types.String },
//       "field3": { type: Schema.Types.String },
//       "field4": { type: Schema.Types.String },
//       "field5": { type: Schema.Types.String },
//       "field6": { type: Schema.Types.String },
//       "field7": { type: Schema.Types.String },
//       "field8": { type: Schema.Types.String },
//       "field9": { type: Schema.Types.String },
//       "firstname": { type: Schema.Types.String },
//       "furl": { type: Schema.Types.String },
//       "giftCardIssued": { type: Schema.Types.String },
//       "hash": { type: Schema.Types.String },
//       "id": { type: Schema.Types.String },
//       "isConsentPayment": { type: Schema.Types.Number },
//       "key": { type: Schema.Types.String },
//       "lastname": { type: Schema.Types.String },
//       "meCode": { type: Schema.Types.String },
//       "merchantid": { type: Schema.Types.String },
//       "mihpayid": { type: Schema.Types.String },
//       "mode": { type: Schema.Types.String },
//       "name_on_card": { type: Schema.Types.String },
//       "net_amount_debit": { type: Schema.Types.String },
//       "offer_availed": { type: Schema.Types.String },
//       "offer_failure_reason": { type: Schema.Types.String },
//       "offer_key": { type: Schema.Types.String },
//       "offer_type": { type: Schema.Types.String },
//       "paisa_mecode": { type: Schema.Types.String },
//       "paymentId": { type: Schema.Types.Number },
//       "payment_source": { type: Schema.Types.String },
//       "payuMoneyId": { type: Schema.Types.String },
//       "pg_TYPE": { type: Schema.Types.String },
//       "pg_ref_no": { type: Schema.Types.String },
//       "phone": { type: Schema.Types.String },
//       "postBackParamId": { type: Schema.Types.Number },
//       "postUrl": { type: Schema.Types.String },
//       "productinfo": { type: Schema.Types.String },
//       "retryCount": { type: Schema.Types.Number },
//       "s2SPbpFlag": { type: Schema.Types.Boolean },
//       "state": { type: Schema.Types.String },
//       "status": { type: Schema.Types.String },
//       "surl": { type: Schema.Types.String },
//       "txnid": { type: Schema.Types.String },
//       "udf1": { type: Schema.Types.String }, //udf-1 stores product_id
//       "udf10": { type: Schema.Types.String },
//       "udf2": { type: Schema.Types.String }, //udf-2 stores user_id
//       "udf3": { type: Schema.Types.String }, //udf-3 stores order_id
//       "udf4": { type: Schema.Types.String },
//       "udf5": { type: Schema.Types.String },
//       "udf6": { type: Schema.Types.String },
//       "udf7": { type: Schema.Types.String },
//       "udf8": { type: Schema.Types.String },
//       "udf9": { type: Schema.Types.String },
//       "unmappedstatus": { type: Schema.Types.String },
//       "version": { type: Schema.Types.String },
//       "zipcode": { type: Schema.Types.String }
//     },
//     status: { type: Schema.Types.String },
//   },
//   success: { type: Schema.Types.String },
// })

// module.exports = model('Payments', paymentSchema, 'payments');


const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  shopout_transaction_id: {
    type: String,
    required: true
  },
  razorpay_payment_id: {
    type: String,
    // required: true
  },
  razorpay_order_id: {
    type: String,
    // required: true
  },  
  razorpay_signature: {
    type: String,
    // required: true
  },
  payment_date: {
    type: Date,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event_id: {
    type: Schema.Types.ObjectId,
    ref: 'DemoBooking',
  },
  error_code: {
    type: Number,
  },
  error_description: {
    type: String,
  },
})

module.exports = model('Payments', paymentSchema, 'payments');
