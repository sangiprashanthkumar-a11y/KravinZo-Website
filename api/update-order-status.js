import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    realtime: {
      transport: WebSocket
    }
  }
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { orderId, status } = req.body || {};

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required"
      });
    }

    const allowedStatuses = [
      "pending",
      "Preparing Food",
      "Food Ready",
      "Handed to Delivery",
      "Delivered"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order status"
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("order_id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update status error:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: data
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update order status"
    });
  }
}
