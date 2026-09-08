import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    } = req.body;

    if (!orderId || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        error: "Order ID, latitude and longitude are required"
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        delivery_latitude: Number(latitude),
        delivery_longitude: Number(longitude),
        delivery_location_updated_at: new Date().toISOString()
      })
      .eq("order_id", orderId)
      .select()
      .single();

    if (error) {
      console.error("GPS UPDATE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery location updated",
      order: data
    });

  } catch (error) {
    console.error("DELIVERY LOCATION API ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update location"
    });
  }
}
