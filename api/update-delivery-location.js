export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      orderId,
      latitude,
      longitude
    } = req.body || {};

    if (
      !orderId ||
      latitude == null ||
      longitude == null
    ) {
      return res.status(400).json({
        success: false,
        error: "Order ID, latitude and longitude are required"
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
      encodeURIComponent(orderId);

    const updateData = {
      delivery_latitude: Number(latitude),
      delivery_longitude: Number(longitude),
      delivery_location_updated_at:
        new Date().toISOString()
    };

    const response = await fetch(url, {
      method: "PATCH",

      headers: {
        apikey: supabaseKey,
        Authorization: "Bearer " + supabaseKey,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },

      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("SUPABASE GPS UPDATE ERROR:", data);

      return res.status(500).json({
        success: false,
        error:
          data?.message ||
          data?.hint ||
          data?.details ||
          "Failed to update GPS location"
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
      message: "Delivery location updated",
      order: data[0]
    });

  } catch (error) {
    console.error("DELIVERY LOCATION SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message ||
        "Failed to update delivery location"
    });
  }
}
