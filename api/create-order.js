export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({
        error: "Razorpay environment variables are missing"
      });
    }

    const auth = Buffer.from(
      `${keyId}:${keySecret}`
    ).toString("base64");

    const response = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100),
          currency: "INR",
          receipt: `kravinzo_${Date.now()}`
        })
      }
    );

    const order = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: order.error || order
      });
    }

    return res.status(200).json(order);

  } catch (error) {
    console.error("PAYMENT SETUP ERROR:", error);

    return res.status(500).json({
      error: error?.message || "Payment setup failed"
    });
  }
}
