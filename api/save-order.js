import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
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

    if (
      !order_id ||
      !customer_name ||
      !address ||
      !phone_number ||
      !item ||
      !payment_method ||
      !total
    ) {
      return res.status(400).json({
        error: "Missing required order details"
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_id,
          customer_name,
          address,
          phone_number,
          item,
          payment_method,
          total: Number(total),
          payment_id: payment_id || null,
          status: status || "New"
        }
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
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
      error: "Internal server error"
    });
  }
}
