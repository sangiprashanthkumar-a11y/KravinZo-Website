import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

// Node.js 20 WebSocket fix
global.WebSocket = WebSocket;

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
      customer_phone,
      customer_address,
      phone_number,
      address,
      item,
      items,
      total,
      payment_method,
      payment_id,
      status
    } = req.body || {};

    const finalPhone = customer_phone || phone_number || "";
    const finalAddress = customer_address || address || "";
    const finalItems = items || item || "";

    const orderData = {
      order_id: order_id || `KZ_${Date.now()}`,
      customer_name: customer_name || "",
      customer_phone: finalPhone,
      customer_address: finalAddress,
      items: finalItems,
      total: Number(total) || 0,
      payment_method: payment_method || "COD",
      payment_id: payment_id || null,
      status: status || "pending"
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("Supabase save error:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order saved successfully",
      order: data
    });

  } catch (error) {
    console.error("Save order error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Order save failed"
    });
  }
}
