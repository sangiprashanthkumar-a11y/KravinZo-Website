export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        error: "Order ID is required"
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
      `${supabaseUrl}/rest/v1/orders?order_id=eq.${encodeURIComponent(orderId)}&select=order_id,status,total,created_at`,
      {
        method: "GET",

        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        }
      }
    );

    const data = await response.json();

  if (!response.ok) {
  return res.status(response.status).json({
    error:
      data?.message ||
      data?.error?.message ||
      data?.error ||
      "Unable to track order"
  });
}

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    const order = data[0];

    return res.status(200).json({
      success: true,
      orderId: order.order_id,
      status: order.status,
      total: order.total,
      createdAt: order.created_at
    });

  } catch (error) {

    console.error(
      "TRACK ORDER ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to track order"
    });
  }
}
