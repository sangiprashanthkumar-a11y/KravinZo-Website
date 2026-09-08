```javascript
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required"
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("SUPABASE ENV VARIABLES ARE MISSING");

      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    const url =
      `${supabaseUrl}/rest/v1/orders` +
      `?select=order_id,customer_name,total,status,created_at,delivery_latitude,delivery_longitude,delivery_location_updated_at` +
      `&order_id=eq.${encodeURIComponent(String(orderId))}` +
      `&limit=1`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("SUPABASE REST ERROR:", result);

      return res.status(response.status).json({
        success: false,
        error:
          result?.message ||
          result?.error ||
          "Failed to get order"
      });
    }

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order: result[0]
    });

  } catch (error) {
    console.error("GET ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get order status"
    });
  }
}
```
