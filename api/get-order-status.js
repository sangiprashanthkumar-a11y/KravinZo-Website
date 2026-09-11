export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const orderId = req.query.orderId;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required"
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("SUPABASE ENVIRONMENT VARIABLES MISSING");

      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    const url =
      supabaseUrl +
      "/rest/v1/orders?order_id=eq." +
      encodeURIComponent(orderId) +
      "&select=*";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: "Bearer " + supabaseKey,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("SUPABASE REST ERROR:", data);

      return res.status(500).json({
        success: false,
        error:
          data?.message ||
          data?.error ||
          "Failed to get order"
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order: data[0]
    });

  } catch (error) {
    console.error("GET ORDER STATUS SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to get order status"
    });
  }
}
