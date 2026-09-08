export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const orderId = req.query?.orderId;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required"
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");

      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    const cleanOrderId = String(orderId).trim();

    const url =
      `${supabaseUrl}/rest/v1/orders` +
      `?select=order_id,customer_name,total,status,created_at,delivery_latitude,delivery_longitude,delivery_location_updated_at` +
      `&order_id=eq.${encodeURIComponent(cleanOrderId)}` +
      `&limit=1`;

    console.log("Getting order:", cleanOrderId);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: "application/json"
      }
    });

    const responseText = await response.text();

    console.log("Supabase status:", response.status);
    console.log("Supabase response:", responseText);

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Supabase returned non-JSON response");

      return res.status(500).json({
        success: false,
        error: "Invalid response from Supabase"
      });
    }

    if (!response.ok) {
      console.error("Supabase REST error:", result);

      return res.status(500).json({
        success: false,
        error:
          result?.message ||
          result?.error_description ||
          result?.error ||
          "Failed to get order from Supabase"
      });
    }

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    const order = result[0];

    return res.status(200).json({
      success: true,
      order: {
        order_id: order.order_id || cleanOrderId,
        customer_name: order.customer_name || "",
        total: order.total ?? 0,
        status: order.status || "New",
        created_at: order.created_at || null,
        delivery_latitude: order.delivery_latitude ?? null,
        delivery_longitude: order.delivery_longitude ?? null,
        delivery_location_updated_at:
          order.delivery_location_updated_at || null
      }
    });

  } catch (error) {
    console.error("GET ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to get order status"
    });
  }
}
