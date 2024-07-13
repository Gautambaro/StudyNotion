
const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY, // Replace with your Razorpay key id
    key_secret: process.env.RAZORPAY_SECRET, // Replace with your Razorpay key secret
});

console.log("Razorpay instance created with key_id:", process.env.RAZORPAY_KEY);

module.exports = { instance };