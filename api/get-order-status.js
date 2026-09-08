```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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

    const { data, error } = await supabase
      .from("orders")
      .select(`
        order_id,
        customer_name,
        total,
        status,
        created_at,
        delivery_latitude,
        delivery_longitude,
        delivery_accuracy,
        delivery_location_updated_at
      `)
      .eq("order_id", orderId)
      .maybeSingle();

    if (error) {
      console.error("GET ORDER STATUS ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order: {
        order_id: data.order_id,
        customer_name: data.customer_name,
        total: data.total,
        status: data.status,
        created_at: data.created_at,
        delivery_latitude: data.delivery_latitude,
        delivery_longitude: data.delivery_longitude,
        delivery_accuracy: data.delivery_accuracy,
        delivery_location_updated_at:
          data.delivery_location_updated_at
      }
    });

  } catch (error) {

    console.error("ORDER STATUS API ERROR:", error);

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to get order status"
    });
  }
}
```
