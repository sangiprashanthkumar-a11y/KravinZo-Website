const Razorpay = require("razorpay");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { amount } = req.body || {};

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount"
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay environment variables are missing");

      return res.status(500).json({
        success: false,
        error: "Razorpay configuration is missing"
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: "KZ_" + Date.now()
    });

    return res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId
    });

  } catch (error) {
    console.error("RAZORPAY CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.error?.description ||
        error?.description ||
        error?.message ||
        "Failed to create Razorpay order"
    });
  }
};
