export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      total,
      paymentMethod,
      paymentId
    } = req.body;

    if (
      !orderId ||
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !items ||
      !total ||
      !paymentMethod
    ) {
      return res.status(400).json({
        error: "Missing order details"
      });
    }

    const supabaseUrl =
      process.env.SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Supabase environment variables are missing"
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=representation"
        },

        body: JSON.stringify({
          order_id: orderId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          items: items,
          total: total,
          payment_method: paymentMethod,
          payment_id: paymentId || null,
          status: "Order Received"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      order: data
    });

  } catch (error) {

    console.error(
      "SAVE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message ||
        "Failed to save order"
    });
  }
}
