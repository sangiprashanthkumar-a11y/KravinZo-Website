import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed"
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

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

    const {
      order_id,
      customer_name,
      customer_phone,
      customer_address,
      items,
      total,
      paymentmethod,
      payment_id,
      status
    } = req.body;

    if (!order_id || !customer_name || !customer_phone || !customer_address) {
      return res.status(400).json({
        success: false,
        error: "Required order details are missing"
      });
    }

    let parsedItems = items;

    if (typeof items === "string") {
      try {
        parsedItems = JSON.parse(items);
      } catch {
        parsedItems = items;
      }
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_id: order_id,
          customer_name: customer_name,
          customer_phone: customer_phone,
          customer_address: customer_address,
          items: parsedItems,
          total: Number(total),
          paymentmethod: paymentmethod,
          payment_id: payment_id || null,
          status: status || "New"
        }
      ])
      .select();

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
      data: data
    });

  } catch (error) {
    console.error("FUNCTION ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Unknown server error"
    });
  }
}
