const Razorpay = require("razorpay");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount"
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "KZ_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    console.error("Razorpay Create Order Error:", error);

    return res.status(500).json({
      error:
        error?.error?.description ||
        error?.description ||
        error?.message ||
        "Failed to create Razorpay order"
    });
  }
}
