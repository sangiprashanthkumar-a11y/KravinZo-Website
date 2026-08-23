import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    // Method check
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed"
      });
    }

    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");

      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    // Create Supabase client
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Request body
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
    } = req.body || {};

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

    // Prepare items for jsonb column
    let orderItems = items;

    if (typeof items === "string") {
      try {
        orderItems = JSON.parse(items);
      } catch {
        orderItems = items;
      }
    }

    // Save order
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_id: String(order_id),
          customer_name: String(customer_name),
          customer_phone: String(customer_phone),
          customer_address: String(customer_address),
          items: orderItems,
          total: Number(total),
          payment_method: String(payment_method),
          payment_id: payment_id ? String(payment_id) : null,
          status: status ? String(status) : "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message,
        details: error.details || null,
        hint: error.hint || null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order saved successfully",
      order: data
    });

  } catch (error) {
    console.error("SAVE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
}
