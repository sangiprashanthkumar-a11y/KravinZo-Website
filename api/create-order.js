const Razorpay = require("razorpay");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { amount } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount"
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay keys are missing in Vercel Environment Variables");

      return res.status(500).json({
        error: "Razorpay configuration is missing"
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "KZ_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      ...order,
      key: keyId
    });

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
};
