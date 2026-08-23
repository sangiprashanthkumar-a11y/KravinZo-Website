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
      order_id,
      customer_name,
      customer_phone,
      customer_address,
      items,
      total,
      payment_method,
      payment_id,
      status
    } = req.body;

    // Required fields
    if (
      !order_id ||
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !items ||
      total === undefined ||
      !payment_method
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required order details"
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_id: order_id,
          customer_name: customer_name,
          customer_phone: customer_phone,
          customer_address: customer_address,
          items: items,
          total: Number(total),
          payment_method: payment_method,
          payment_id: payment_id || null,
          status: status || "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

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
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
}
