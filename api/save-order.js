import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
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
    const {
      order_id,
      customer_name,
      address,
      phone_number,
      item,
      payment_method,
      total,
      payment_id,
      status
    } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_id,
        customer_name,
        address,
        phone_number,
        item,
        payment_method,
        total: Number(total),
        payment_id: payment_id || null,
        status: status || "New"
      })
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order saved successfully",
      data
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
}
